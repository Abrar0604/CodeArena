import { NextResponse } from 'next/server';
import { executePiston } from '@/lib/piston';
import { getProblemBySlugOrId, getAllAvailableProblems } from '@/lib/problems/catalog';
import { calculateSubmissionScore, ScoreWeights } from '@/lib/scoring';
import { calculateElo } from '@/lib/elo';
import { createAdminClient } from '@/lib/supabase/server';
import { TestResult, LanguageKey } from '@/types';
import { assignVariant } from '@/lib/experiments/engine';
import { logExperimentEvent } from '@/lib/experiments/analytics';
import { ScoringFormulaConfig } from '@/lib/experiments/definitions';

export async function POST(req: Request) {
  try {
    const {
      battle_id,
      user_id,
      problem_id,
      source_code,
      language_id,
      language_name,
      elapsed_seconds = 60,
    } = await req.json();

    if (!source_code || (!language_id && !language_name) || !problem_id) {
      return NextResponse.json(
        { error: 'source_code, language/language_id, and problem_id are required' },
        { status: 400 }
      );
    }

    const problem = getProblemBySlugOrId(problem_id) || getAllAvailableProblems()[0];
    const allTestCases = [...problem.sample_test_cases, ...problem.hidden_test_cases];

    const testResults: TestResult[] = [];
    let passedCount = 0;
    let totalExecTimeMs = 0;
    let maxMemoryKb = 0;

    for (const tc of allTestCases) {
      const exec = await executePiston({
        source_code,
        language_id,
        language: language_name,
        stdin: tc.input,
        expected_output: tc.expected_output,
      });

      if (exec.passed) passedCount++;
      totalExecTimeMs += exec.time_ms;
      if (exec.memory_kb > maxMemoryKb) maxMemoryKb = exec.memory_kb;

      testResults.push({
        test_case_id: tc.id,
        passed: exec.passed ?? false,
        // Hide input/output for hidden test cases
        input: tc.is_hidden ? '[Hidden Test Case]' : tc.input,
        expected_output: tc.is_hidden ? '[Hidden Expected Output]' : tc.expected_output,
        actual_output: tc.is_hidden ? (exec.passed ? '[Correct Output]' : '[Wrong Output]') : (exec.stdout || undefined),
        error: exec.stderr || exec.compile_output || undefined,
        execution_time_ms: exec.time_ms,
        memory_used_kb: exec.memory_kb,
        status_description: exec.status.description,
      });
    }

    const avgExecTimeMs = Math.round(totalExecTimeMs / allTestCases.length);
    const langKey = (language_name?.toLowerCase().includes('python') ? 'python' :
      language_name?.toLowerCase().includes('java') ? 'java' :
      language_name?.toLowerCase().includes('c++') ? 'cpp' :
      language_name?.toLowerCase().includes('go') ? 'go' : 'javascript') as LanguageKey;

    const benchmarks = problem.optimal_benchmarks?.[langKey] || { optimal_time_ms: 30, optimal_memory_kb: 4096 };

    const scoringVariant = assignVariant<ScoringFormulaConfig>('scoring_formula_v1', user_id);
    const weights: ScoreWeights = {
      correctnessWeight: scoringVariant.config.correctnessWeight,
      speedWeight: scoringVariant.config.speedWeight,
      efficiencyWeight: scoringVariant.config.efficiencyWeight,
      minSpeedBonus: scoringVariant.config.minSpeedBonus,
    };

    const scoreBreakdown = calculateSubmissionScore({
      passedCount,
      totalCount: allTestCases.length,
      timeElapsedSeconds: elapsed_seconds,
      totalBattleSeconds: 900,
      executionTimeMs: avgExecTimeMs,
      memoryUsedKb: maxMemoryKb,
      optimalTimeMs: benchmarks.optimal_time_ms,
      optimalMemoryKb: benchmarks.optimal_memory_kb,
      weights,
    });

    if (scoreBreakdown.allPassed) {
      logExperimentEvent({
        experimentId: 'scoring_formula_v1',
        variantId: scoringVariant.id,
        userId: user_id,
        eventName: 'conversion',
        value: scoreBreakdown.total,
        metadata: { elapsed_seconds, avgExecTimeMs },
      });
    }

    const submissionRecord = {
      battle_id,
      user_id,
      problem_id,
      source_code,
      language_id,
      language_name,
      status: scoreBreakdown.allPassed ? 'accepted' : 'wrong_answer',
      passed_test_cases: passedCount,
      total_test_cases: allTestCases.length,
      execution_time_ms: avgExecTimeMs,
      memory_used_kb: maxMemoryKb,
      correctness_score: scoreBreakdown.correctness,
      speed_score: scoreBreakdown.speed,
      efficiency_score: scoreBreakdown.efficiency,
      total_score: scoreBreakdown.total,
      test_results: testResults,
      submitted_at: new Date().toISOString(),
    };

    // If connected to live Supabase, persist and handle battle state
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseLive = supabaseUrl && !supabaseUrl.includes('placeholder');

    if (isSupabaseLive) {
      try {
        const supabase = createAdminClient();
        await supabase.from('submissions').insert([submissionRecord]);

        // Check battle state if battle_id is a valid UUID
        if (battle_id && !battle_id.startsWith('mock-')) {
          const { data: battle } = await supabase
            .from('battles')
            .select('*')
            .eq('id', battle_id)
            .single();

          if (battle) {
            const isPlayer1 = battle.player1_id === user_id;
            const scoreField = isPlayer1 ? 'player1_score' : 'player2_score';

            // Update battle with new highest score
            const currentScore = isPlayer1 ? (battle.player1_score || 0) : (battle.player2_score || 0);
            if (scoreBreakdown.total > currentScore) {
              await supabase
                .from('battles')
                .update({ [scoreField]: scoreBreakdown.total })
                .eq('id', battle_id);
            }
          }
        }
      } catch (dbErr) {
        console.warn('Could not persist submission to database (running in local mode):', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      submission: submissionRecord,
      score: scoreBreakdown,
    });
  } catch (err: any) {
    console.error('Submit route error:', err);
    return NextResponse.json({ error: err.message || 'Submission failed' }, { status: 500 });
  }
}

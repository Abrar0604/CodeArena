import { NextResponse } from 'next/server';
import { executePiston } from '@/lib/piston';
import { SEED_PROBLEMS } from '@/lib/problems/data';
import { TestResult } from '@/types';

export async function POST(req: Request) {
  try {
    const { source_code, language_id, language, problem_id, custom_input } = await req.json();

    if (!source_code || (!language_id && !language)) {
      return NextResponse.json(
        { error: 'Source code and language or language_id are required.' },
        { status: 400 }
      );
    }

    // If custom stdin test
    if (custom_input !== undefined) {
      const result = await executePiston({
        source_code,
        language_id,
        language,
        stdin: custom_input,
      });

      return NextResponse.json({
        success: true,
        custom: true,
        result,
      });
    }

    // Run against sample test cases
    const problem = SEED_PROBLEMS.find((p) => p.id === problem_id) || SEED_PROBLEMS[0];
    const testCases = problem.sample_test_cases;

    const testResults: TestResult[] = [];
    let totalTimeMs = 0;
    let maxMemoryKb = 0;

    for (const tc of testCases) {
      const exec = await executePiston({
        source_code,
        language_id,
        language,
        stdin: tc.input,
        expected_output: tc.expected_output,
      });

      totalTimeMs += exec.time_ms;
      if (exec.memory_kb > maxMemoryKb) maxMemoryKb = exec.memory_kb;

      testResults.push({
        test_case_id: tc.id,
        passed: exec.passed ?? false,
        input: tc.input,
        expected_output: tc.expected_output,
        actual_output: exec.stdout || undefined,
        error: exec.stderr || exec.compile_output || undefined,
        execution_time_ms: exec.time_ms,
        memory_used_kb: exec.memory_kb,
        status_description: exec.status.description,
      });
    }

    const allPassed = testResults.every((r) => r.passed);

    return NextResponse.json({
      success: true,
      allPassed,
      testResults,
      avgTimeMs: Math.round(totalTimeMs / testCases.length),
      maxMemoryKb,
    });
  } catch (err: any) {
    console.error('Execute route error:', err);
    return NextResponse.json({ error: err.message || 'Execution failed' }, { status: 500 });
  }
}

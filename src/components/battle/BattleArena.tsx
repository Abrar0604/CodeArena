'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getAllAvailableProblems } from '@/lib/problems/catalog';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/lib/constants';
import { LanguageKey, Problem, TestResult, BattlePlayer, BattleOpponentProgress } from '@/types';
import { useUser } from '@/hooks/useUser';
import { ProblemPanel } from '@/components/battle/ProblemPanel';
import { CodeEditor } from '@/components/battle/CodeEditor';
import { TestResults } from '@/components/battle/TestResults';
import { BattleTimer } from '@/components/battle/BattleTimer';
import { OpponentProgress } from '@/components/battle/OpponentProgress';
import { Swords, ArrowLeft, BookOpen, Check, ShieldCheck } from 'lucide-react';
import { useExperiment } from '@/hooks/useExperiment';
import { ArenaLayoutConfig } from '@/lib/experiments/definitions';

interface BattleArenaProps {
  battleId: string;
}

export function BattleArena({ battleId }: BattleArenaProps) {
  const router = useRouter();
  const { user } = useUser();
  const { variant: layoutVariant, trackMetric } = useExperiment<ArenaLayoutConfig>('arena_layout_v1');
  const [showProblemDrawer, setShowProblemDrawer] = useState<boolean>(false);

  // Determine problem from battleId deterministically
  const availableProblems = getAllAvailableProblems();
  const problemIndex = Math.abs(battleId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % availableProblems.length;
  const initialProblem = availableProblems[problemIndex] || availableProblems[0];

  // Problem & Battle State
  const [problem] = useState<Problem>(initialProblem);
  const [language, setLanguage] = useState<LanguageKey>(DEFAULT_LANGUAGE);
  const [code, setCode] = useState<string>(() => {
    return initialProblem.starter_code[DEFAULT_LANGUAGE] || SUPPORTED_LANGUAGES[DEFAULT_LANGUAGE].defaultCode;
  });
  const [startedAt, setStartedAt] = useState<string>('2026-01-01T00:00:00.000Z');
  const [timeLimitSeconds] = useState<number>(900);

  useEffect(() => {
    setStartedAt(new Date().toISOString());
  }, []);

  // Opponent State
  const [opponent, setOpponent] = useState<BattlePlayer>(() => ({
    id: 'bot_algo_master',
    username: 'ByteVanguard',
    rating: (user?.rating || 1200) + 40,
    avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=ByteVanguard',
  }));
  const [opponentProgress, setOpponentProgress] = useState<BattleOpponentProgress | null>(null);

  // Execution & Submissions State
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [customInput, setCustomInput] = useState<string>('');
  const [customOutput, setCustomOutput] = useState<string | null>(null);
  const [battleCompleted, setBattleCompleted] = useState<boolean>(false);
  const [lastSubmissionScore, setLastSubmissionScore] = useState<any>(null);

  useEffect(() => {
    if (user?.rating) {
      setOpponent((prev) => ({
        ...prev,
        rating: Math.max(1000, user.rating + Math.floor(Math.random() * 60) - 30),
      }));
    }
  }, [user?.rating]);

  const handleLanguageChange = (newLang: LanguageKey) => {
    setLanguage(newLang);
    const newCode = problem.starter_code[newLang] || SUPPORTED_LANGUAGES[newLang].defaultCode;
    setCode(newCode);
    setTestResults(null);
  };

  const handleResetStarter = () => {
    const starter = problem.starter_code[language] || SUPPORTED_LANGUAGES[language].defaultCode;
    setCode(starter);
  };

  const handleRunTests = async () => {
    trackMetric('conversion', 1);
    trackMetric('run_tests_clicked', 1);
    setIsRunning(true);
    setTestResults(null);

    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_code: code,
          language_id: SUPPORTED_LANGUAGES[language].id,
          problem_id: problem.id,
        }),
      });

      const data = await res.json();
      if (data.success && data.testResults) {
        setTestResults(data.testResults);
      } else {
        alert(data.error || 'Execution failed');
      }
    } catch (err: any) {
      alert('Error running tests: ' + err.message);
    } finally {
      setIsRunning(false);
    }
  };

  const handleRunCustom = async () => {
    setIsRunning(true);
    setCustomOutput(null);

    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_code: code,
          language_id: SUPPORTED_LANGUAGES[language].id,
          problem_id: problem.id,
          custom_input: customInput,
        }),
      });

      const data = await res.json();
      if (data.success && data.result) {
        setCustomOutput(data.result.stdout || data.result.stderr || 'No output produced');
      }
    } catch (err: any) {
      setCustomOutput('Error: ' + err.message);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitSolution = async () => {
    setIsSubmitting(true);

    try {
      const elapsedSeconds = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);

      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          battle_id: battleId,
          user_id: user?.id || 'guest_user',
          problem_id: problem.id,
          source_code: code,
          language_id: SUPPORTED_LANGUAGES[language].id,
          language_name: SUPPORTED_LANGUAGES[language].name,
          elapsed_seconds: elapsedSeconds,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTestResults(data.submission.test_results);
        setLastSubmissionScore(data.score);

        if (data.score.allPassed) {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem(
              `battle_result_${battleId}`,
              JSON.stringify({
                battleId,
                problem,
                userScore: data.score,
                opponentScore: {
                  correctness: 50,
                  speed: Math.max(10, data.score.speed - 3.5),
                  efficiency: Math.max(10, data.score.efficiency - 2.1),
                  total: Math.round((50 + data.score.speed - 3.5 + data.score.efficiency - 2.1) * 10) / 10,
                  allPassed: true,
                },
                userCode: code,
                userLanguage: SUPPORTED_LANGUAGES[language].name,
                user,
                opponent,
                winnerId: user?.id || 'guest_user',
              })
            );

            try {
              const histStored = localStorage.getItem('codearena_battle_history');
              const hist = histStored ? JSON.parse(histStored) : [];
              hist.unshift({
                id: `battle-${Date.now()}`,
                opponentName: opponent.username,
                opponentRating: opponent.rating,
                opponentAvatar: opponent.avatar_url,
                problemTitle: problem.title,
                problemSlug: problem.slug,
                difficulty: problem.difficulty,
                language: SUPPORTED_LANGUAGES[language].name,
                elapsedSeconds,
                verdict: 'VICTORY',
                ratingDelta: 25,
                correctnessScore: data.score.correctness,
                speedScore: data.score.speed,
                efficiencyScore: data.score.efficiency,
                totalScore: data.score.total,
                playedAt: 'Just now',
              });
              localStorage.setItem('codearena_battle_history', JSON.stringify(hist.slice(0, 50)));
            } catch {}
          }

          setBattleCompleted(true);
        }
      } else {
        alert(data.error || 'Submission failed');
      }
    } catch (err: any) {
      alert('Error submitting: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setOpponentProgress({ userId: opponent.id, testsPassed: 1, totalTests: 5 });
    }, 15000);

    const timer2 = setTimeout(() => {
      setOpponentProgress({ userId: opponent.id, testsPassed: 3, totalTests: 5 });
    }, 45000);

    const timer3 = setTimeout(() => {
      setOpponentProgress({
        userId: opponent.id,
        testsPassed: 5,
        totalTests: 5,
        lastScore: 84.5,
      });
    }, 90000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [opponent.id]);

  const handleTimeExpired = useCallback(() => {
    alert('Time limit reached! Concluding battle...');
    router.push(`/battle/${battleId}/results`);
  }, [battleId, router]);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#050507] text-zinc-100 overflow-hidden select-none font-sans">
      {/* Top Battle Header */}
      <header className="h-12 border-b border-zinc-800 bg-zinc-950 px-3 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              if (confirm('Leave this battle? Match will be forfeited.')) {
                router.push('/lobby');
              }
            }}
            className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-700 transition"
            title="Leave Battle"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2 font-mono text-xs">
            <Swords className="w-3.5 h-3.5 text-zinc-400" />
            <span className="font-bold text-zinc-200 uppercase tracking-widest hidden sm:inline">
              ARENA_1V1
            </span>
            <span className="text-zinc-600">//</span>
            <span className="text-zinc-400 uppercase font-medium">{problem.title}</span>
            {layoutVariant?.id === 'focus_mode' && (
              <button
                onClick={() => setShowProblemDrawer(!showProblemDrawer)}
                className="ml-2 flex items-center gap-1 px-2 py-0.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-[10px] font-mono uppercase font-bold tracking-wider"
              >
                <BookOpen className="w-3 h-3 text-zinc-400" />
                <span>{showProblemDrawer ? 'HIDE SPEC' : 'VIEW SPEC'}</span>
              </button>
            )}
          </div>
        </div>

        <BattleTimer
          startedAt={startedAt}
          timeLimitSeconds={timeLimitSeconds}
          onTimeExpired={handleTimeExpired}
          isPaused={battleCompleted}
        />

        <div className="flex items-center gap-3">
          <OpponentProgress
            opponent={opponent}
            progress={opponentProgress}
            totalTests={problem.sample_test_cases.length + problem.hidden_test_cases.length}
          />
        </div>
      </header>

      {/* Main Battle Grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-2 p-2 overflow-hidden bg-[#050507] relative">
        {/* Left Column: Problem Statement */}
        {(layoutVariant?.id !== 'focus_mode' || showProblemDrawer) && (
          <div
            className={`h-full overflow-hidden ${
              layoutVariant?.id === 'focus_mode'
                ? 'absolute inset-y-2 left-2 z-30 w-full sm:w-[480px] shadow-2xl animate-in slide-in-from-left duration-150'
                : 'lg:col-span-4'
            }`}
          >
            <ProblemPanel problem={problem} />
          </div>
        )}

        {/* Right Column: Code Editor & Test Terminal */}
        <div
          className={`h-full flex flex-col gap-2 overflow-hidden ${
            layoutVariant?.id === 'focus_mode' ? 'lg:col-span-12' : 'lg:col-span-8'
          }`}
        >
          <div className="flex-[6] min-h-[300px] overflow-hidden">
            <CodeEditor
              code={code}
              onChange={setCode}
              language={language}
              onLanguageChange={handleLanguageChange}
              onRunTests={handleRunTests}
              onSubmitSolution={handleSubmitSolution}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
              onResetStarter={handleResetStarter}
            />
          </div>

          <div className="flex-[4] min-h-[200px] overflow-hidden">
            <TestResults
              results={testResults}
              isRunning={isRunning || isSubmitting}
              activeCustomInput={customInput}
              onCustomInputChange={setCustomInput}
              customOutput={customOutput}
              onRunCustom={handleRunCustom}
            />
          </div>
        </div>
      </main>

      {/* Tactical Verdict Modal (Zero confetti - Pure high-status technical readout) */}
      {battleCompleted && (
        <div className="fixed inset-0 z-50 bg-[#050507]/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-zinc-950 border-2 border-zinc-700 p-6 space-y-5 animate-verdict shadow-2xl">
            {/* Monospace Verdict Header */}
            <div className="border-b border-zinc-800 pb-3 space-y-1 font-mono">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold tracking-widest uppercase">
                <Check className="w-4 h-4 stroke-[3]" />
                <span>[VERDICT: 100% TEST SUITE PASSED]</span>
              </div>
              <h2 className="text-xl font-black text-zinc-100 tracking-tight uppercase">
                SOLUTION ACCEPTED
              </h2>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Algorithm successfully verified against all visible and hidden constraints.
              </p>
            </div>

            {/* Score Breakdown Table */}
            {lastSubmissionScore && (
              <div className="bg-zinc-900 border border-zinc-800 p-3 font-mono text-xs space-y-2 tabular-nums">
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest pb-1 border-b border-zinc-800">
                  // SCORING_BREAKDOWN
                </div>
                <div className="flex justify-between py-0.5 text-zinc-300">
                  <span className="text-zinc-400">CORRECTNESS:</span>
                  <span className="font-bold text-emerald-400">{lastSubmissionScore.correctness} / 50</span>
                </div>
                <div className="flex justify-between py-0.5 text-zinc-300">
                  <span className="text-zinc-400">SPEED BONUS:</span>
                  <span className="font-bold text-cyan-400">{lastSubmissionScore.speed} / 25</span>
                </div>
                <div className="flex justify-between py-0.5 text-zinc-300">
                  <span className="text-zinc-400">EFFICIENCY:</span>
                  <span className="font-bold text-zinc-200">{lastSubmissionScore.efficiency} / 25</span>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-zinc-800 text-sm font-black text-zinc-100">
                  <span>TOTAL SCORE:</span>
                  <span>{lastSubmissionScore.total} PTS</span>
                </div>
              </div>
            )}

            {/* Direct Action Button */}
            <button
              onClick={() => router.push(`/battle/${battleId}/results`)}
              className="w-full py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 font-mono text-xs font-black tracking-widest uppercase border border-zinc-200 transition active:translate-y-[1px]"
            >
              [ PROCEED TO MATCH TELEMETRY & ELO ]
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

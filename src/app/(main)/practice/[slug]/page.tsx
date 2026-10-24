'use client';

import React, { useState, useEffect, use, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Problem, LanguageKey, TestResult } from '@/types';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/lib/constants';
import { useUser } from '@/hooks/useUser';
import { ProblemPanel } from '@/components/battle/ProblemPanel';
import { CodeEditor } from '@/components/battle/CodeEditor';
import { TestResults } from '@/components/battle/TestResults';
import {
  Target,
  ArrowLeft,
  RotateCcw,
  Play,
  Send,
  Trophy,
  Check,
  Bot,
  Zap,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Lock,
  LogIn,
  UserPlus,
} from 'lucide-react';

interface PracticePageProps {
  params: Promise<{ slug: string }>;
}

function PracticeArenaContent({ params }: PracticePageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const router = useRouter();
  const { user, mounted, loading: userLoading, isAuthenticated } = useUser();

  // Enforce authentication barrier
  useEffect(() => {
    if (mounted && !userLoading && !isAuthenticated) {
      router.replace(`/login?redirectTo=/practice/${slug}`);
    }
  }, [mounted, userLoading, isAuthenticated, router, slug]);

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [language, setLanguage] = useState<LanguageKey>(DEFAULT_LANGUAGE);
  const [code, setCode] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [customInput, setCustomInput] = useState<string>('');
  const [customOutput, setCustomOutput] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [submissionScore, setSubmissionScore] = useState<any>(null);
  const [pacingBotEnabled, setPacingBotEnabled] = useState<boolean>(false);
  const [botProgress, setBotProgress] = useState<{ passed: number; total: number } | null>(null);

  // Fetch problem details
  useEffect(() => {
    async function fetchProblem() {
      try {
        const res = await fetch(`/api/problems?slug=${encodeURIComponent(slug)}`);
        const data = await res.json();
        if (data.problem) {
          setProblem(data.problem);
          const initialCode =
            data.problem.starter_code?.[DEFAULT_LANGUAGE] ||
            SUPPORTED_LANGUAGES[DEFAULT_LANGUAGE].defaultCode;
          setCode(initialCode);
        } else {
          router.push('/practice');
        }
      } catch (err) {
        console.error('Failed to load practice problem:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProblem();
  }, [slug, router]);

  // Practice chronometer timer
  useEffect(() => {
    if (isCompleted) return;
    const interval = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isCompleted]);

  // Simulated Pacing Bot (optional drill pressure)
  useEffect(() => {
    if (!pacingBotEnabled || isCompleted) {
      setBotProgress(null);
      return;
    }
    const t1 = setTimeout(() => setBotProgress({ passed: 1, total: 5 }), 20000);
    const t2 = setTimeout(() => setBotProgress({ passed: 3, total: 5 }), 45000);
    const t3 = setTimeout(() => setBotProgress({ passed: 5, total: 5 }), 85000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [pacingBotEnabled, isCompleted]);

  const handleLanguageChange = (newLang: LanguageKey) => {
    setLanguage(newLang);
    if (problem) {
      const newCode =
        problem.starter_code?.[newLang] || SUPPORTED_LANGUAGES[newLang].defaultCode;
      setCode(newCode);
    }
    setTestResults(null);
  };

  const handleResetStarter = () => {
    if (!problem) return;
    const starter =
      problem.starter_code?.[language] || SUPPORTED_LANGUAGES[language].defaultCode;
    setCode(starter);
  };

  // Run against sample test cases
  const handleRunTests = async () => {
    if (!problem) return;
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
      if (data.success && data.test_results) {
        setTestResults(data.test_results);
      } else {
        alert(data.error || 'Execution encountered an error');
      }
    } catch (err: any) {
      alert('Error running tests: ' + err.message);
    } finally {
      setIsRunning(false);
    }
  };

  // Run custom input
  const handleRunCustomInput = async (input: string) => {
    setCustomInput(input);
    setIsRunning(true);
    setCustomOutput(null);

    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_code: code,
          language_id: SUPPORTED_LANGUAGES[language].id,
          custom_input: input,
        }),
      });

      const data = await res.json();
      if (data.success && data.output !== undefined) {
        setCustomOutput(data.output);
      } else {
        setCustomOutput(`[EXECUTION_ERROR]: ${data.error || 'Failed'}`);
      }
    } catch (err: any) {
      setCustomOutput(`[NETWORK_ERROR]: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Submit against hidden test suite
  const handleSubmit = async () => {
    if (!problem) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          battle_id: `practice-${problem.slug}-${Date.now()}`,
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
        setSubmissionScore(data.score);

        if (data.score?.allPassed) {
          setIsCompleted(true);

          // Save to completed drills & practice logs
          try {
            const stored = localStorage.getItem('codearena_practice_completed');
            const list = stored ? JSON.parse(stored) : [];
            if (!list.includes(problem.slug)) {
              list.push(problem.slug);
              localStorage.setItem('codearena_practice_completed', JSON.stringify(list));
            }

            const logsStored = localStorage.getItem('codearena_practice_logs');
            const logs = logsStored ? JSON.parse(logsStored) : [];
            logs.unshift({
              id: `drill-${Date.now()}`,
              problemSlug: problem.slug,
              problemTitle: problem.title,
              difficulty: problem.difficulty,
              language: SUPPORTED_LANGUAGES[language].name,
              elapsedSeconds,
              correctnessScore: data.score.correctness,
              speedScore: data.score.speed,
              efficiencyScore: data.score.efficiency,
              totalScore: data.score.total,
              botPaceBeaten: pacingBotEnabled,
              completedAt: 'Just now',
            });
            localStorage.setItem('codearena_practice_logs', JSON.stringify(logs.slice(0, 50)));
          } catch {}
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

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
  };

  if (mounted && !userLoading && !isAuthenticated) {
    return (
      <div className="h-screen w-screen bg-[#050507] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-950 border border-zinc-800 p-8 space-y-6 text-center">
          <div className="w-12 h-12 bg-zinc-900 border border-zinc-700 mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6 text-zinc-300" />
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
              <span>AUTHENTICATION REQUIRED</span>
            </div>
            <h2 className="text-xl font-mono font-black uppercase text-white tracking-tight">
              SOLO ARENA ACCESS
            </h2>
            <p className="text-xs text-zinc-400 font-mono leading-relaxed">
              Sign in or create an account to run code, test edge cases, and submit algorithmic solutions.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 pt-2 font-mono text-xs">
            <Link
              href={`/login?redirectTo=/practice/${slug}`}
              className="w-full py-3 bg-white hover:bg-zinc-200 text-zinc-950 font-black uppercase tracking-wider text-center border border-white transition flex items-center justify-center gap-2 shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>[ SIGN IN TO ENTER ARENA ]</span>
            </Link>
            <Link
              href={`/register?redirectTo=/practice/${slug}`}
              className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-bold uppercase tracking-wider text-center transition flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>[ CREATE COMBATANT ACCOUNT ]</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !problem) {
    return (
      <div className="h-screen w-screen bg-[#050507] flex items-center justify-center font-mono text-xs text-zinc-500">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-zinc-700 border-t-white animate-spin" />
          <span className="uppercase tracking-widest">INITIALIZING PRACTICE CHAMBER...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-[#050507] text-zinc-100 overflow-hidden select-none font-sans">
      {/* Practice Header Bar */}
      <header className="h-12 border-b border-zinc-800 bg-zinc-950 px-3 flex items-center justify-between z-10 shrink-0">
        {/* Left: Back & Problem Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/practice')}
            className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-700 transition"
            title="Return to Catalog"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-2 py-0.5 bg-cyan-950/40 text-cyan-400 border border-cyan-800 text-[10px] font-bold uppercase tracking-wider">
              [SOLO DRILL]
            </span>
            <span className="font-bold text-white uppercase hidden sm:inline">
              {problem.title}
            </span>
            <span
              className={`px-1.5 py-0.2 border text-[10px] font-bold uppercase ${
                problem.difficulty === 'easy'
                  ? 'text-emerald-400 border-emerald-800'
                  : problem.difficulty === 'medium'
                  ? 'text-amber-400 border-amber-800'
                  : 'text-rose-400 border-rose-800'
              }`}
            >
              [{problem.difficulty.toUpperCase()}]
            </span>
          </div>
        </div>

        {/* Center: Practice Timer & Bot Status */}
        <div className="flex items-center gap-4 font-mono text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-zinc-800 text-zinc-200">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">SOLVE TIME:</span>
            <span className="font-bold tabular-nums text-white">{formatTimer(elapsedSeconds)}</span>
          </div>

          {/* Simulated Pacing Bot Toggle */}
          <button
            onClick={() => setPacingBotEnabled((p) => !p)}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 border text-[10px] uppercase font-bold transition ${
              pacingBotEnabled
                ? 'bg-amber-950/40 text-amber-300 border-amber-700'
                : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300'
            }`}
            title="Toggle simulated opponent pace"
          >
            <Bot className="w-3 h-3" />
            <span>PACING BOT: {pacingBotEnabled ? 'ACTIVE' : 'OFF'}</span>
          </button>

          {botProgress && (
            <div className="hidden lg:flex items-center gap-1.5 text-[10px] text-amber-400">
              <span className="w-1.5 h-1.5 bg-amber-400" />
              <span>BOT: [{botProgress.passed}/{botProgress.total} PASSED]</span>
            </div>
          )}
        </div>

        {/* Right: Reset & Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetStarter}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-mono uppercase flex items-center gap-1 transition"
            title="Reset Starter Code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[10px]">RESET STARTER</span>
          </button>
        </div>
      </header>

      {/* Main Split Interface */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Problem Statement Panel */}
        <div className="w-[420px] lg:w-[460px] border-r border-zinc-800 bg-[#050507] flex flex-col shrink-0 overflow-y-auto">
          <ProblemPanel problem={problem} />
        </div>

        {/* Right Side: Code Editor & Test Console */}
        <div className="flex-1 flex flex-col bg-zinc-950 overflow-hidden">
          {/* Top Half: Code Editor */}
          <div className="flex-1 flex flex-col overflow-hidden border-b border-zinc-800">
            <CodeEditor
              code={code}
              onChange={setCode}
              language={language}
              onLanguageChange={handleLanguageChange}
              onRunTests={handleRunTests}
              onSubmitSolution={handleSubmit}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
              onResetStarter={handleResetStarter}
            />
          </div>

          {/* Bottom Half: Test Runner Terminal */}
          <div className="h-64 lg:h-72 flex flex-col bg-zinc-950">
            <TestResults
              results={testResults}
              isRunning={isRunning}
              activeCustomInput={customInput}
              onCustomInputChange={setCustomInput}
              customOutput={customOutput}
              onRunCustom={() => handleRunCustomInput(customInput)}
            />
          </div>
        </div>
      </div>

      {/* Solo Drill Verdict Modal */}
      {isCompleted && submissionScore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="max-w-md w-full bg-zinc-950 border border-zinc-700 p-6 space-y-6 relative font-mono">
            {/* Corner Accents */}
            <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-cyan-400" />

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-zinc-900 border border-cyan-800 text-cyan-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-black uppercase text-white tracking-wider">
                SOLO DRILL ACCOMPLISHED // SUITE CLEARED
              </h2>
              <p className="text-xs text-zinc-400">
                All sample and anti-cheat hidden test cases successfully satisfied.
              </p>
            </div>

            {/* Scoreboard Metrics */}
            <div className="p-4 bg-zinc-900 border border-zinc-800 space-y-3">
              <div className="flex justify-between items-center text-xs border-b border-zinc-800 pb-2">
                <span className="text-zinc-400 uppercase">SOLVE VELOCITY</span>
                <span className="font-bold text-white tabular-nums">{formatTimer(elapsedSeconds)}</span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-zinc-800 pb-2">
                <span className="text-zinc-400 uppercase">CORRECTNESS SCORE</span>
                <span className="font-bold text-emerald-400 tabular-nums">
                  {submissionScore.correctness} / 50.0
                </span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-zinc-800 pb-2">
                <span className="text-zinc-400 uppercase">EXECUTION SPEED</span>
                <span className="font-bold text-cyan-400 tabular-nums">
                  {submissionScore.speed} / 25.0
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400 uppercase">SPACE-TIME EFFICIENCY</span>
                <span className="font-bold text-indigo-400 tabular-nums">
                  {submissionScore.efficiency} / 25.0
                </span>
              </div>
            </div>

            {/* Total Metric */}
            <div className="flex items-center justify-between p-3 bg-cyan-950/30 border border-cyan-800/80 text-xs">
              <span className="font-bold text-cyan-300 uppercase">TOTAL BENCHMARK SCORE</span>
              <span className="text-base font-black text-white tabular-nums">
                {submissionScore.total} / 100.0
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => router.push('/practice')}
                className="w-full py-2.5 bg-white hover:bg-zinc-200 text-black font-black text-xs uppercase tracking-widest border border-white transition"
              >
                [ RETURN TO DRILL CATALOG ]
              </button>
              <button
                onClick={() => router.push('/lobby')}
                className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold text-xs uppercase tracking-widest border border-zinc-700 transition"
              >
                [ ENTER LIVE 1V1 DUEL ARENA ]
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PracticeArenaPage({ params }: PracticePageProps) {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen bg-[#050507] flex items-center justify-center font-mono text-xs text-zinc-500">
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-zinc-700 border-t-white animate-spin" />
            <span className="uppercase tracking-widest">INITIALIZING PRACTICE CHAMBER...</span>
          </div>
        </div>
      }
    >
      <PracticeArenaContent params={params} />
    </Suspense>
  );
}

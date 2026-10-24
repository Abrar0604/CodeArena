'use client';

import React from 'react';
import { PracticeStats } from '@/lib/analytics/types';
import {
  Target,
  CheckCircle2,
  Clock,
  Cpu,
  Zap,
  BookOpen,
  Bot,
  ArrowRight,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import Link from 'next/link';

interface PracticeDashboardProps {
  stats: PracticeStats;
}

export function PracticeDashboard({ stats }: PracticeDashboardProps) {
  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 font-sans">
      {/* 4-Stat High-Contrast Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
        <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-500 text-[10px] uppercase">
            <span>CATALOG MASTERY</span>
            <Target className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white tabular-nums">
              {stats.catalogMasteryRate}%
            </span>
            <span className="text-[10px] text-zinc-500 uppercase">
              ({stats.totalSolved}/{stats.totalCatalogProblems})
            </span>
          </div>
          <p className="text-[10px] text-cyan-400 uppercase font-bold">SOLO DRILLS COMPLETED</p>
        </div>

        <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-500 text-[10px] uppercase">
            <span>AVERAGE DRILL TIME</span>
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white tabular-nums">
            {formatSeconds(stats.avgSolveTimeSecs)}
          </div>
          <p className="text-[10px] text-zinc-500 uppercase">ACROSS ALL COMPLETED DRILLS</p>
        </div>

        <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-500 text-[10px] uppercase">
            <span>FIRST-PASS ACCURACY</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-indigo-400 tabular-nums">
            {stats.firstTryPassRate}%
          </div>
          <p className="text-[10px] text-zinc-500 uppercase">SOLUTIONS ACCEPTED ON RUN #1</p>
        </div>

        <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-500 text-[10px] uppercase">
            <span>OPTIMAL BENCHMARK RATIO</span>
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 tabular-nums">
            {stats.benchmarkEfficiencyRatio}%
          </div>
          <p className="text-[10px] text-zinc-500 uppercase">COMPARED TO OPTIMAL O(N) SPEC</p>
        </div>
      </div>

      {/* Difficulty Breakdown & Topic Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Difficulty Calibration (5 Cols) */}
        <div className="lg:col-span-5 p-5 bg-zinc-950 border border-zinc-800 space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                [01 // DIFFICULTY TIER MASTERY]
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 uppercase">TIER PROGRESS</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Easy */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-emerald-400 font-bold uppercase text-[11px]">EASY TIER</span>
                <span className="text-zinc-300 tabular-nums font-bold">
                  {stats.easySolved} / {stats.easyTotal}{' '}
                  <span className="text-zinc-500 text-[10px]">
                    ({Math.round((stats.easySolved / (stats.easyTotal || 1)) * 100)}%)
                  </span>
                </span>
              </div>
              <div className="h-2 w-full bg-zinc-900 border border-zinc-800">
                <div
                  className="h-full bg-emerald-400"
                  style={{ width: `${(stats.easySolved / (stats.easyTotal || 1)) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-500">
                <span>EST. VELOCITY: ~02:30</span>
                <span>STATUS: ACCELERATED</span>
              </div>
            </div>

            {/* Medium */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-amber-400 font-bold uppercase text-[11px]">MEDIUM TIER</span>
                <span className="text-zinc-300 tabular-nums font-bold">
                  {stats.mediumSolved} / {stats.mediumTotal}{' '}
                  <span className="text-zinc-500 text-[10px]">
                    ({Math.round((stats.mediumSolved / (stats.mediumTotal || 1)) * 100)}%)
                  </span>
                </span>
              </div>
              <div className="h-2 w-full bg-zinc-900 border border-zinc-800">
                <div
                  className="h-full bg-amber-400"
                  style={{ width: `${(stats.mediumSolved / (stats.mediumTotal || 1)) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-500">
                <span>EST. VELOCITY: ~06:15</span>
                <span>STATUS: IN TRAINING</span>
              </div>
            </div>

            {/* Hard */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-rose-400 font-bold uppercase text-[11px]">HARD TIER</span>
                <span className="text-zinc-300 tabular-nums font-bold">
                  {stats.hardSolved} / {stats.hardTotal}{' '}
                  <span className="text-zinc-500 text-[10px]">
                    ({Math.round((stats.hardSolved / (stats.hardTotal || 1)) * 100)}%)
                  </span>
                </span>
              </div>
              <div className="h-2 w-full bg-zinc-900 border border-zinc-800">
                <div
                  className="h-full bg-rose-400"
                  style={{ width: `${(stats.hardSolved / (stats.hardTotal || 1)) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-500">
                <span>EST. VELOCITY: ~14:00</span>
                <span>STATUS: CALIBRATING</span>
              </div>
            </div>
          </div>
        </div>

        {/* Domain & Topic Distribution (7 Cols) */}
        <div className="lg:col-span-7 p-5 bg-zinc-950 border border-zinc-800 space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                [02 // ALGORITHMIC TOPIC MATRIX]
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 uppercase">COVERAGE DEPTH</span>
          </div>

          <div className="space-y-3">
            {stats.topicBreakdown.map((t) => {
              const pct = Math.round((t.solved / t.total) * 100);

              return (
                <div
                  key={t.topic}
                  className="p-2.5 bg-zinc-900/60 border border-zinc-800/80 space-y-1.5 text-xs"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-zinc-200">{t.topic}</span>
                    <span className="text-cyan-400 font-bold tabular-nums">
                      {t.solved}/{t.total} ({pct}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-950 border border-zinc-800">
                    <div className="h-full bg-cyan-400" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Solo Drill Log */}
      <div className="p-5 bg-zinc-950 border border-zinc-800 space-y-4 font-mono">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              [03 // COMPLETED PRACTICE CALIBRATION LOGS]
            </span>
          </div>
          <Link
            href="/practice"
            className="text-[10px] text-cyan-400 hover:text-cyan-300 uppercase underline underline-offset-4"
          >
            OPEN PRACTICE CHAMBER →
          </Link>
        </div>

        <div className="space-y-2">
          {stats.recentDrills.map((d) => (
            <div
              key={d.id}
              className="p-3 bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`px-1.5 py-0.2 border text-[10px] font-bold uppercase shrink-0 ${
                    d.difficulty === 'easy'
                      ? 'text-emerald-400 border-emerald-800 bg-emerald-950/20'
                      : d.difficulty === 'medium'
                      ? 'text-amber-400 border-amber-800 bg-amber-950/20'
                      : 'text-rose-400 border-rose-800 bg-rose-950/20'
                  }`}
                >
                  [{d.difficulty.toUpperCase()}]
                </span>

                <div className="space-y-0.5">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>{d.problemTitle}</span>
                    {d.botPaceBeaten && (
                      <span className="text-[10px] text-amber-400 flex items-center gap-1 font-mono">
                        <Bot className="w-3 h-3" />
                        <span>BOT BEATEN</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-sans">
                    <span className="font-mono text-zinc-300">{d.language}</span>
                    <span>•</span>
                    <span className="tabular-nums font-mono">{formatSeconds(d.elapsedSeconds)}</span>
                    <span>•</span>
                    <span>{d.completedAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                <div className="text-right text-[10px] text-zinc-500 font-mono">
                  <div className="text-emerald-400 font-bold tabular-nums">
                    SCORE: {d.totalScore}/100
                  </div>
                  <div>PASS VERIFIED</div>
                </div>

                <Link
                  href={`/practice/${d.problemSlug}`}
                  className="px-3 py-1 bg-zinc-900 hover:bg-white text-zinc-300 hover:text-black border border-zinc-700 hover:border-white font-mono text-[10px] font-bold uppercase tracking-wider transition flex items-center gap-1"
                >
                  <span>RE-DRILL</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

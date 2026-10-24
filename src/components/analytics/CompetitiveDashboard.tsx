'use client';

import React, { useState } from 'react';
import { CompetitiveStats } from '@/lib/analytics/types';
import { RatingBadge } from '@/components/RatingBadge';
import {
  Swords,
  Trophy,
  Zap,
  TrendingUp,
  Clock,
  Shield,
  Code2,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  History,
} from 'lucide-react';
import Link from 'next/link';

interface CompetitiveDashboardProps {
  stats: CompetitiveStats;
}

export function CompetitiveDashboard({ stats }: CompetitiveDashboardProps) {
  const [filterVerdict, setFilterVerdict] = useState<'ALL' | 'VICTORY' | 'DEFEAT'>('ALL');

  const filteredMatches = stats.recentMatches.filter((m) => {
    if (filterVerdict === 'ALL') return true;
    return m.verdict === filterVerdict;
  });

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // SVG Line Chart coordinates
  const history = stats.ratingHistory;
  const ratings = history.map((h) => h.rating);
  const minRating = Math.min(...ratings, 1100);
  const maxRating = Math.max(...ratings, 1400);
  const range = maxRating - minRating || 1;

  const width = 600;
  const height = 140;
  const padding = 20;

  const points = history.map((h, i) => {
    const x = padding + (i / (history.length - 1 || 1)) * (width - 2 * padding);
    const y = height - padding - ((h.rating - minRating) / range) * (height - 2 * padding);
    return `${x},${y}`;
  });

  const pointsString = points.join(' ');

  return (
    <div className="space-y-8 font-sans">
      {/* 4-Stat High-Contrast Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
        <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-1 relative">
          <div className="flex items-center justify-between text-zinc-500 text-[10px] uppercase">
            <span>COMBAT RATING</span>
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white tabular-nums">{stats.rating}</span>
            <span className="text-[10px] text-zinc-500 uppercase">PEAK: {stats.peakRating}</span>
          </div>
          <div className="pt-1">
            <RatingBadge rating={stats.rating} size="sm" />
          </div>
        </div>

        <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-500 text-[10px] uppercase">
            <span>WIN RATIO</span>
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400 tabular-nums">
              {stats.matchesPlayed > 0 ? `${stats.winRate}%` : '0%'}
            </span>
            <span className="text-[10px] text-zinc-500 uppercase">
              ({stats.matchesWon}W - {stats.matchesLost}L)
            </span>
          </div>
          <p className="text-[10px] text-zinc-500 uppercase">{stats.matchesPlayed} TOTAL ARENA DUELS</p>
        </div>

        <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-500 text-[10px] uppercase">
            <span>AVERAGE DUEL VELOCITY</span>
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white tabular-nums">
            {stats.avgSolveTimeSecs > 0 ? formatSeconds(stats.avgSolveTimeSecs) : '--:--'}
          </div>
          <p className="text-[10px] text-zinc-500 uppercase">
            {stats.avgSolveTimeSecs > 0 ? 'TIME TO FIRST ACCEPTED SOLVE' : 'NO DUELS COMPLETED YET'}
          </p>
        </div>

        <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-500 text-[10px] uppercase">
            <span>HOT STREAK</span>
            <Flame className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-400 tabular-nums">
              {stats.currentStreak > 0 ? `+${stats.currentStreak}` : '0'}
            </span>
            <span className="text-[10px] text-zinc-500 uppercase">CONSECUTIVE</span>
          </div>
          <p className="text-[10px] text-zinc-500 uppercase font-bold">
            {stats.currentStreak > 0 ? 'STATUS: MOMENTUM PRIMED' : 'STATUS: UNRANKED STANDBY'}
          </p>
        </div>
      </div>

      {/* ELO Trajectory & Triad Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Rating Trajectory Chart (7 Cols) */}
        <div className="lg:col-span-7 p-5 bg-zinc-950 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3 font-mono">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                [01 // ELO PROGRESSION TRAJECTORY]
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 uppercase tabular-nums">
              MIN: {minRating} | MAX: {maxRating}
            </span>
          </div>

          {/* SVG Sparkline */}
          <div className="relative pt-2">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-36 overflow-visible"
              preserveAspectRatio="none"
            >
              {/* Grid guide line at 1200 ELO baseline */}
              <line
                x1={padding}
                y1={height - padding - ((1200 - minRating) / range) * (height - 2 * padding)}
                x2={width - padding}
                y2={height - padding - ((1200 - minRating) / range) * (height - 2 * padding)}
                stroke="#27272a"
                strokeDasharray="4 4"
                strokeWidth="1"
              />

              {/* Sparkline path */}
              <polyline
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="miter"
                points={pointsString}
              />

              {/* Data point anchors */}
              {history.map((h, i) => {
                const x = padding + (i / (history.length - 1 || 1)) * (width - 2 * padding);
                const y = height - padding - ((h.rating - minRating) / range) * (height - 2 * padding);
                const isLast = i === history.length - 1;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={isLast ? 4 : 2.5}
                    className={isLast ? 'fill-cyan-300 stroke-zinc-950 stroke-2' : 'fill-cyan-500'}
                  />
                );
              })}
            </svg>

            <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 pt-2 border-t border-zinc-900">
              <span>MATCH #{history[0]?.match || 1}</span>
              <span className="text-zinc-600">BASELINE: 1200 ELO (SILVER)</span>
              <span>LATEST (CURRENT: {stats.rating})</span>
            </div>
          </div>
        </div>

        {/* Scoring Triad Index (5 Cols) */}
        <div className="lg:col-span-5 p-5 bg-zinc-950 border border-zinc-800 space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                [02 // TRIAD EVALUATION MATRIX]
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 uppercase">AVG / 100</span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Correctness */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-zinc-400 uppercase text-[11px]">CORRECTNESS (50%)</span>
                <span className="text-emerald-400 font-bold tabular-nums">
                  {stats.avgCorrectness.toFixed(1)} / 50.0
                </span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 border border-zinc-800">
                <div
                  className="h-full bg-emerald-400"
                  style={{ width: `${(stats.avgCorrectness / 50) * 100}%` }}
                />
              </div>
            </div>

            {/* Speed Velocity */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-zinc-400 uppercase text-[11px]">SPEED VELOCITY (25%)</span>
                <span className="text-cyan-400 font-bold tabular-nums">
                  {stats.avgSpeed.toFixed(1)} / 25.0
                </span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 border border-zinc-800">
                <div
                  className="h-full bg-cyan-400"
                  style={{ width: `${(stats.avgSpeed / 25) * 100}%` }}
                />
              </div>
            </div>

            {/* Space-Time Efficiency */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-zinc-400 uppercase text-[11px]">SPACE-TIME EFFICIENCY (25%)</span>
                <span className="text-indigo-400 font-bold tabular-nums">
                  {stats.avgEfficiency.toFixed(1)} / 25.0
                </span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 border border-zinc-800">
                <div
                  className="h-full bg-indigo-400"
                  style={{ width: `${(stats.avgEfficiency / 25) * 100}%` }}
                />
              </div>
            </div>

            {/* Overall Composite */}
            <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-zinc-300">
              <span className="uppercase text-[11px] font-bold">COMPOSITE DUEL SCORE</span>
              <span className="text-sm font-black text-white tabular-nums">
                {stats.avgTotalScore.toFixed(1)} / 100.0
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Language Breakdown & Battle Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Languages (4 Cols) */}
        <div className="lg:col-span-4 p-5 bg-zinc-950 border border-zinc-800 space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-zinc-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                [03 // COMBAT STACK]
              </span>
            </div>
            <span className="text-[10px] text-zinc-500 uppercase">WIN RATE</span>
          </div>

          <div className="space-y-3">
            {stats.languageDistribution.length === 0 ? (
              <div className="p-6 text-center text-xs text-zinc-500 uppercase">
                <p className="font-bold">[NO COMBAT STACK DATA]</p>
                <p className="text-[10px] text-zinc-600 mt-1 font-sans">
                  Play a 1v1 battle to log your runtime language performance.
                </p>
              </div>
            ) : (
              stats.languageDistribution.map((lang) => (
                <div
                  key={lang.language}
                  className="p-2.5 bg-zinc-900/60 border border-zinc-800/80 space-y-1.5 text-xs"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-zinc-200">{lang.language}</span>
                    <span className="text-emerald-400 font-bold tabular-nums">{lang.winRate}% WIN</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-zinc-500">
                    <span>{lang.matches} MATCHES RECORDED</span>
                    <span>PREFERENCE: {Math.round((lang.matches / Math.max(1, stats.matchesPlayed)) * 100)}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Combat Ledger / Head-to-Head History (8 Cols) */}
        <div className="lg:col-span-8 p-5 bg-zinc-950 border border-zinc-800 space-y-4 font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-zinc-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                [04 // HEAD-TO-HEAD COMBAT LEDGER]
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 text-[10px]">
              {(['ALL', 'VICTORY', 'DEFEAT'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFilterVerdict(filter)}
                  className={`px-2 py-0.5 uppercase font-bold border transition ${
                    filterVerdict === filter
                      ? 'bg-zinc-800 text-white border-zinc-700'
                      : 'text-zinc-500 border-zinc-900 hover:text-zinc-300'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Matches List */}
          <div className="space-y-2">
            {filteredMatches.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-500 uppercase space-y-3">
                <p className="font-bold">[NO COMBAT TELEMETRY LOGGED YET]</p>
                <p className="text-zinc-600 text-[11px] font-sans max-w-sm mx-auto">
                  Your combat record is fresh. Enter matchmaking in the lobby to play live 1v1 duels against other combatants.
                </p>
                <Link
                  href="/lobby"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-black font-bold uppercase tracking-wider text-xs border border-white hover:bg-zinc-200 transition"
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>[ ENTER ARENA LOBBY ]</span>
                </Link>
              </div>
            ) : (
              filteredMatches.map((m) => {
                const isWin = m.verdict === 'VICTORY';

                return (
                  <div
                    key={m.id}
                    className="p-3 bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold uppercase border shrink-0 ${
                          isWin
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                            : 'bg-rose-950/60 text-rose-400 border-rose-800'
                        }`}
                      >
                        [{m.verdict}]
                      </span>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">vs {m.opponentName}</span>
                          <span className="text-[10px] text-zinc-500">[{m.opponentRating}]</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-sans">
                          <span className="font-mono text-zinc-300">{m.problemTitle}</span>
                          <span>•</span>
                          <span>{m.language}</span>
                          <span>•</span>
                          <span className="tabular-nums">{formatSeconds(m.elapsedSeconds)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 text-right shrink-0">
                      <div className="text-[10px] text-zinc-500 hidden md:block">
                        <div>SCORE: {m.totalScore}/100</div>
                        <div>{m.playedAt}</div>
                      </div>

                      <div
                        className={`text-sm font-black font-mono flex items-center gap-0.5 tabular-nums ${
                          isWin ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {isWin ? (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        )}
                        <span>{m.ratingDelta > 0 ? `+${m.ratingDelta}` : m.ratingDelta} ELO</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

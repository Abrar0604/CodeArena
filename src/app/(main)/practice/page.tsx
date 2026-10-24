'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Target, Zap, Clock, Cpu, Search, Play, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
import { Problem } from '@/types';

export default function PracticeHubPage() {
  const router = useRouter();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [completedSlugs, setCompletedSlugs] = useState<string[]>([]);

  useEffect(() => {
    // Load solved problems from localStorage
    try {
      const stored = localStorage.getItem('codearena_practice_completed');
      if (stored) {
        setCompletedSlugs(JSON.parse(stored));
      }
    } catch {}

    // Fetch problem catalog
    async function loadCatalog() {
      try {
        const res = await fetch('/api/problems');
        const data = await res.json();
        if (data.problems) {
          setProblems(data.problems);
        }
      } catch (err) {
        console.error('Failed to load problems:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, []);

  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      const matchesDiff =
        selectedDifficulty === 'all' || p.difficulty.toLowerCase() === selectedDifficulty;
      const matchesSearch =
        searchQuery.trim() === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDiff && matchesSearch;
    });
  }, [problems, selectedDifficulty, searchQuery]);

  const handleStartRandomDrill = () => {
    const pool =
      selectedDifficulty === 'all'
        ? problems
        : problems.filter((p) => p.difficulty.toLowerCase() === selectedDifficulty);

    if (pool.length === 0) return;
    const randomIndex = Math.floor(Math.random() * pool.length);
    const chosen = pool[randomIndex];
    router.push(`/practice/${chosen.slug}`);
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'text-emerald-400 border-emerald-800 bg-emerald-950/20';
      case 'medium':
        return 'text-amber-400 border-amber-800 bg-amber-950/20';
      case 'hard':
        return 'text-rose-400 border-rose-800 bg-rose-950/20';
      default:
        return 'text-zinc-400 border-zinc-700 bg-zinc-900';
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] text-zinc-100 py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-800 pb-6 relative">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-zinc-950 border border-zinc-800 font-mono text-[10px] uppercase tracking-widest text-zinc-400">
              <span className="w-1.5 h-1.5 bg-cyan-400" />
              <span>DRILL CHAMBER // ZERO-ELO CALIBRATION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white uppercase flex items-center gap-3">
              <Target className="w-7 h-7 text-cyan-400" />
              <span>SOLO PRACTICE ARENA</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Sharpen algorithmic runtime velocity, test code against live hidden test suites, and benchmark against optimal time-space profiles without peer matchmaking.
            </p>
          </div>

          {/* Quick Drill Action */}
          <button
            onClick={handleStartRandomDrill}
            disabled={loading || problems.length === 0}
            className="px-6 py-3 bg-white hover:bg-zinc-200 text-black font-mono font-black text-xs uppercase tracking-widest border border-white transition flex items-center justify-center gap-2 active:translate-y-[1px] disabled:opacity-50 shrink-0"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>[ INSTANT RANDOM DRILL ]</span>
          </button>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-zinc-950 border border-zinc-800 space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500">AVAILABLE PROBLEMS</span>
            <p className="text-lg font-mono font-black text-white">{problems.length}</p>
          </div>
          <div className="p-3 bg-zinc-950 border border-zinc-800 space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500">SOLVED IN DRILLS</span>
            <p className="text-lg font-mono font-black text-cyan-400">{completedSlugs.length}</p>
          </div>
          <div className="p-3 bg-zinc-950 border border-zinc-800 space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500">SANDBOX ENGINE</span>
            <p className="text-xs font-mono font-bold text-zinc-300">PISTON V2 DOCKER</p>
          </div>
          <div className="p-3 bg-zinc-950 border border-zinc-800 space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500">BENCHMARK EVAL</span>
            <p className="text-xs font-mono font-bold text-emerald-400">LIVE SPACE-TIME</p>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 font-mono text-xs">
          {/* Difficulty Filter Tabs */}
          <div className="flex items-center border border-zinc-800 bg-zinc-950 p-1">
            {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1.5 uppercase font-bold text-[11px] transition ${
                  selectedDifficulty === diff
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {diff === 'all' ? `ALL (${problems.length})` : diff}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by title or concept..."
              className="w-full pl-8 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white transition"
            />
          </div>
        </div>

        {/* Problems List */}
        {loading ? (
          <div className="p-12 text-center border border-zinc-800 bg-zinc-950 font-mono text-xs text-zinc-500 space-y-3">
            <div className="w-6 h-6 border-2 border-zinc-700 border-t-white animate-spin mx-auto" />
            <p className="uppercase tracking-widest">LOADING DRILL CATALOG...</p>
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="p-12 text-center border border-zinc-800 bg-zinc-950 font-mono text-xs text-zinc-500 space-y-2">
            <p className="uppercase tracking-wider">[NO PROBLEMS FOUND MATCHING CRITERIA]</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDifficulty('all');
              }}
              className="text-zinc-300 underline underline-offset-4 hover:text-white"
            >
              RESET FILTERS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProblems.map((problem, index) => {
              const isSolved = completedSlugs.includes(problem.slug);

              return (
                <div
                  key={problem.slug || problem.id}
                  className="p-5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition flex flex-col justify-between space-y-4 relative group"
                >
                  {/* Solved ribbon */}
                  {isSolved && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2 py-0.5">
                      <ShieldCheck className="w-3 h-3" />
                      <span>SOLVED</span>
                    </div>
                  )}

                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="text-zinc-600 font-bold">
                        #{String(index + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={`px-1.5 py-0.2 border text-[10px] font-bold uppercase ${getDifficultyBadge(
                          problem.difficulty
                        )}`}
                      >
                        [{problem.difficulty.toUpperCase()}]
                      </span>
                    </div>

                    <h3 className="font-mono font-bold text-sm text-white group-hover:text-cyan-400 transition">
                      {problem.title}
                    </h3>

                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-sans">
                      {problem.description.replace(/###.*?\n/g, '').replace(/```[\s\S]*?```/g, '')}
                    </p>
                  </div>

                  {/* Footer Stats & CTA */}
                  <div className="pt-3 border-t border-zinc-900 flex items-center justify-between font-mono text-[11px]">
                    <div className="flex items-center gap-3 text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        <span>{problem.constraints?.time_limit_ms || 1000}ms</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Cpu className="w-3 h-3 text-zinc-500" />
                        <span>{Math.round((problem.constraints?.memory_limit_kb || 64000) / 1024)}MB</span>
                      </span>
                    </div>

                    <Link
                      href={`/practice/${problem.slug}`}
                      className="px-3 py-1.5 bg-zinc-900 hover:bg-white text-zinc-200 hover:text-black border border-zinc-700 hover:border-white font-bold uppercase tracking-wider transition flex items-center gap-1.5"
                    >
                      <span>ENTER DRILL</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

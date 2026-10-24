'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Swords, Target, BarChart3, ShieldCheck, Trophy, Sparkles } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { getCompetitiveStats, getPracticeStats } from '@/lib/analytics/data';
import { CompetitiveStats, PracticeStats } from '@/lib/analytics/types';
import { CompetitiveDashboard } from '@/components/analytics/CompetitiveDashboard';
import { PracticeDashboard } from '@/components/analytics/PracticeDashboard';
import { Problem } from '@/types';

function AnalyticsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState<'competitive' | 'practice'>(
    tabParam === 'practice' ? 'practice' : 'competitive'
  );

  const { user } = useUser();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [competitiveStats, setCompetitiveStats] = useState<CompetitiveStats | null>(null);
  const [practiceStats, setPracticeStats] = useState<PracticeStats | null>(null);

  // Sync tab with URL
  useEffect(() => {
    if (tabParam === 'practice' || tabParam === 'competitive') {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tab: 'competitive' | 'practice') => {
    setActiveTab(tab);
    router.replace(`/analytics?tab=${tab}`, { scroll: false });
  };

  // Load problem catalog and compile stats
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/problems');
        const data = await res.json();
        const loadedProblems: Problem[] = data.problems || [];
        setProblems(loadedProblems);

        setCompetitiveStats(getCompetitiveStats(user));
        setPracticeStats(getPracticeStats(loadedProblems));
      } catch {
        setCompetitiveStats(getCompetitiveStats(user));
        setPracticeStats(getPracticeStats([]));
      }
    }
    loadData();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#050507] text-zinc-100 py-10 px-4 sm:px-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-800 pb-6 relative">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-zinc-950 border border-zinc-800 font-mono text-[10px] uppercase tracking-widest text-zinc-400">
              <span className="w-1.5 h-1.5 bg-cyan-400" />
              <span>ARENA TELEMETRY // BENCHMARK ANALYTICS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white uppercase flex items-center gap-3">
              <BarChart3 className="w-7 h-7 text-cyan-400" />
              <span>PERFORMANCE TELEMETRY</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Comprehensive analytics across ranked 1v1 combat duels and solo calibration practice drills.
            </p>
          </div>

          {/* Sub-Category Switcher Tabs */}
          <div className="flex items-center border border-zinc-800 bg-zinc-950 p-1 font-mono text-xs shrink-0">
            <button
              onClick={() => handleTabChange('competitive')}
              className={`px-4 py-2 uppercase font-bold text-xs flex items-center gap-2 transition ${
                activeTab === 'competitive'
                  ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Swords className="w-3.5 h-3.5 text-amber-400" />
              <span>COMPETITIVE DASHBOARD</span>
            </button>

            <button
              onClick={() => handleTabChange('practice')}
              className={`px-4 py-2 uppercase font-bold text-xs flex items-center gap-2 transition ${
                activeTab === 'practice'
                  ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              <span>PRACTICE DASHBOARD</span>
            </button>
          </div>
        </div>

        {/* Active Dashboard Render */}
        {activeTab === 'competitive' && competitiveStats && (
          <div className="animate-in fade-in duration-150">
            <div className="mb-4 flex items-center justify-between text-xs font-mono text-zinc-500">
              <span className="uppercase">[LIVE COMBATANT TELEMETRY: 1V1 RANKED ARENA]</span>
              <span>SYNCHRONIZED WITH KERNEL</span>
            </div>
            <CompetitiveDashboard stats={competitiveStats} />
          </div>
        )}

        {activeTab === 'practice' && practiceStats && (
          <div className="animate-in fade-in duration-150">
            <div className="mb-4 flex items-center justify-between text-xs font-mono text-zinc-500">
              <span className="uppercase">[CALIBRATION TELEMETRY: SOLO DRILL CHAMBER]</span>
              <span>TEST SUITE BENCHMARKS ACTIVE</span>
            </div>
            <PracticeDashboard stats={practiceStats} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050507] flex items-center justify-center font-mono text-xs text-zinc-500">
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-zinc-700 border-t-white animate-spin" />
            <span className="uppercase tracking-widest">LOADING ANALYTICS TELEMETRY...</span>
          </div>
        </div>
      }
    >
      <AnalyticsContent />
    </Suspense>
  );
}

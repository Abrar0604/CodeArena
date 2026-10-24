'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FlaskConical,
  BarChart3,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Play,
  ArrowRight,
  ShieldCheck,
  Scale,
  Sparkles,
  Zap,
} from 'lucide-react';
import { EXPERIMENTS } from '@/lib/experiments/definitions';
import {
  getExperimentAnalyses,
  simulateParticipants,
  resetExperimentData,
} from '@/lib/experiments/analytics';
import { setManualOverride, getManualOverride } from '@/lib/experiments/engine';
import { ExperimentAnalysis } from '@/lib/experiments/types';

export default function ExperimentsAdminPage() {
  const [analyses, setAnalyses] = useState<ExperimentAnalysis[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  const refreshAnalyses = () => {
    setAnalyses(getExperimentAnalyses());
  };

  useEffect(() => {
    refreshAnalyses();
    const handleEventLogged = () => refreshAnalyses();
    window.addEventListener('ab_experiment_event_logged', handleEventLogged);
    return () => window.removeEventListener('ab_experiment_event_logged', handleEventLogged);
  }, []);

  const handleSimulate = (experimentId: string) => {
    setIsSimulating(true);
    simulateParticipants(experimentId, 30);
    setTimeout(() => {
      refreshAnalyses();
      setIsSimulating(false);
    }, 200);
  };

  const handleReset = () => {
    resetExperimentData();
    refreshAnalyses();
  };

  const totalParticipants = analyses.reduce((acc, a) => acc + a.totalParticipants, 0);
  const totalConversions = analyses.reduce(
    (acc, a) => acc + a.variants.reduce((vAcc, v) => vAcc + v.conversions, 0),
    0
  );
  const significantCount = analyses.filter((a) => a.isStatisticallySignificant).length;

  return (
    <div className="min-h-screen bg-[#050507] text-zinc-100 py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-zinc-900 border border-zinc-700 text-zinc-200 rounded-none">
                <FlaskConical className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white uppercase">
                A/B Testing & Experimentation Engine
              </h1>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-1 max-w-2xl">
              REALTIME STATISTICAL HYPOTHESIS TESTING // Z-SCORE // P-VALUE // DETERMINISTIC BUCKETING
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono text-xs uppercase tracking-wider rounded-none transition"
              title="Reset data to default baseline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET DATA</span>
            </button>
            <Link
              href="/lobby"
              className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs uppercase tracking-wider border border-white rounded-none transition"
            >
              <span>RETURN TO LOBBY</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-none space-y-1">
            <div className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
              ACTIVE EXPERIMENTS
            </div>
            <div className="text-2xl font-black text-white font-mono tabular-nums">{EXPERIMENTS.length}</div>
            <div className="text-[10px] text-zinc-400 font-mono">100% TRAFFIC ALLOCATED</div>
          </div>

          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-none space-y-1">
            <div className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
              TOTAL PARTICIPANTS
            </div>
            <div className="text-2xl font-black text-white font-mono tabular-nums">
              {totalParticipants.toLocaleString()}
            </div>
            <div className="text-[10px] text-zinc-400 font-mono">ACROSS ALL SUITES</div>
          </div>

          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-none space-y-1">
            <div className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
              TOTAL CONVERSIONS
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono tabular-nums">
              {totalConversions.toLocaleString()}
            </div>
            <div className="text-[10px] text-zinc-400 font-mono">GOAL COMPLETIONS</div>
          </div>

          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-none space-y-1">
            <div className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
              SIGNIFICANCE REACHED
            </div>
            <div className="text-2xl font-black text-zinc-100 font-mono tabular-nums">
              {significantCount} / {EXPERIMENTS.length}
            </div>
            <div className="text-[10px] text-emerald-400 font-mono">≥ 95% CONFIDENCE</div>
          </div>
        </div>

        {/* Experiment Deep-Dive Cards */}
        <div className="space-y-6">
          {analyses.map((analysis) => {
            const exp = EXPERIMENTS.find((e) => e.id === analysis.experimentId);
            if (!exp) return null;

            const control = analysis.variants[0];
            const treatment = analysis.variants[1];
            const isSignificant = analysis.isStatisticallySignificant;
            const uplift = treatment.upliftVsControl ?? 0;
            const currentOverride = getManualOverride(exp.id);

            return (
              <div
                key={analysis.experimentId}
                className="bg-zinc-950 border border-zinc-800 rounded-none space-y-6 p-6 relative"
              >
                {/* Experiment Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-zinc-800/80 pb-5">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-base font-bold font-mono tracking-tight text-white uppercase">{exp.name}</h2>
                      <span className="px-2 py-0.5 rounded-none text-[10px] font-mono font-bold uppercase tracking-wider bg-zinc-900 text-emerald-400 border border-emerald-800/80">
                        [{exp.status}]
                      </span>
                      <span className="text-xs font-mono text-zinc-500">[{exp.id}]</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans">{exp.description}</p>
                    <div className="text-xs text-zinc-300 font-mono flex items-center gap-1.5 pt-1">
                      <Sparkles className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span><strong>HYPOTHESIS:</strong> {exp.hypothesis}</span>
                    </div>
                  </div>

                  {/* Actions & Simulation */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleSimulate(exp.id)}
                      disabled={isSimulating}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-mono uppercase tracking-wider border border-zinc-700 rounded-none transition"
                      title="Generate 30 simulated participants to test statistical power"
                    >
                      <Play className="w-3 h-3 text-zinc-200 fill-zinc-200" />
                      <span>SIMULATE +30 USERS</span>
                    </button>
                  </div>
                </div>

                {/* Head to Head Comparison Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Control */}
                  <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-none space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold font-mono text-white flex items-center gap-2">
                          <span>{control.variantName}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded-none bg-zinc-800 text-zinc-400 border border-zinc-700 font-mono">
                            [CONTROL]
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-0.5 font-sans">
                          {exp.variants[0].description}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setManualOverride(exp.id, 'control');
                          refreshAnalyses();
                        }}
                        className={`text-[10px] px-2.5 py-1 rounded-none border font-mono uppercase tracking-wider font-semibold transition ${
                          currentOverride === 'control'
                            ? 'bg-white text-black border-white'
                            : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {currentOverride === 'control' ? '✓ OVERRIDDEN' : 'FORCE CONTROL'}
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-800 text-center font-mono">
                      <div>
                        <div className="text-[10px] text-zinc-500 uppercase">SAMPLE</div>
                        <div className="text-sm font-bold text-zinc-200 tabular-nums">{control.impressions}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-500 uppercase">CONVERSIONS</div>
                        <div className="text-sm font-bold text-zinc-200 tabular-nums">{control.conversions}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-500 uppercase">CR %</div>
                        <div className="text-sm font-bold text-zinc-200 tabular-nums">{control.conversionRate}%</div>
                      </div>
                    </div>
                  </div>

                  {/* Treatment (Variant B) */}
                  <div className="p-4 bg-zinc-900/60 border border-zinc-600 rounded-none space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold font-mono text-white flex items-center gap-2">
                          <span>{treatment.variantName}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded-none bg-zinc-800 text-emerald-400 border border-emerald-800 font-semibold font-mono">
                            [TREATMENT B]
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-0.5 font-sans">
                          {exp.variants[1].description}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setManualOverride(exp.id, treatment.variantId);
                          refreshAnalyses();
                        }}
                        className={`text-[10px] px-2.5 py-1 rounded-none border font-mono uppercase tracking-wider font-semibold transition ${
                          currentOverride === treatment.variantId
                            ? 'bg-white text-black border-white'
                            : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {currentOverride === treatment.variantId ? '✓ OVERRIDDEN' : 'FORCE VARIANT B'}
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-800 text-center font-mono">
                      <div>
                        <div className="text-[10px] text-zinc-500 uppercase">SAMPLE</div>
                        <div className="text-sm font-bold text-zinc-200 tabular-nums">{treatment.impressions}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-500 uppercase">CONVERSIONS</div>
                        <div className="text-sm font-bold text-zinc-200 tabular-nums">{treatment.conversions}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-500 uppercase">CR %</div>
                        <div className="text-sm font-bold text-emerald-400 flex items-center justify-center gap-1 tabular-nums">
                          <span>{treatment.conversionRate}%</span>
                          {uplift !== 0 && (
                            <span
                              className={`text-[10px] ${
                                uplift > 0 ? 'text-emerald-400' : 'text-rose-400'
                              }`}
                            >
                              ({uplift > 0 ? `+${uplift}%` : `${uplift}%`})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistical Significance Bar & Recommendation */}
                <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-none space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Scale className="w-4 h-4 text-zinc-300" />
                      <span className="text-xs font-bold font-mono text-white uppercase tracking-wider">STATISTICAL ENGINE</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-none font-mono font-bold uppercase tracking-wider ${
                          isSignificant
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700'
                            : 'bg-amber-950/80 text-amber-300 border border-amber-700'
                        }`}
                      >
                        {isSignificant ? '[SIGNIFICANT RESULT]' : '[COLLECTING SAMPLE]'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
                      <span>Z-SCORE: <strong className="text-zinc-200 tabular-nums">{analysis.zScore}</strong></span>
                      <span>P-VALUE: <strong className="text-zinc-200 tabular-nums">{analysis.pValue}</strong></span>
                      <span>CONFIDENCE: <strong className={isSignificant ? 'text-emerald-400 tabular-nums' : 'text-amber-400 tabular-nums'}>{analysis.confidencePercent}%</strong></span>
                    </div>
                  </div>

                  {/* Progress bar to 95% threshold */}
                  <div className="space-y-1">
                    <div className="h-2 w-full bg-zinc-900 rounded-none overflow-hidden border border-zinc-800 relative">
                      <div
                        className={`h-full rounded-none transition-all duration-300 ${
                          isSignificant ? 'bg-emerald-500' : 'bg-zinc-400'
                        }`}
                        style={{ width: `${Math.min(100, analysis.confidencePercent)}%` }}
                      />
                      {/* 95% marker line */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-10"
                        style={{ left: '95%' }}
                        title="95% Significance Threshold"
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                      <span>0%</span>
                      <span className="text-rose-400 font-semibold">95% THRESHOLD (p &lt; 0.05)</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* Recommendation banner */}
                  <div
                    className={`p-3 rounded-none flex items-center gap-2.5 text-xs font-mono ${
                      isSignificant
                        ? 'bg-emerald-950/30 border border-emerald-800/80 text-emerald-300'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-300'
                    }`}
                  >
                    {isSignificant ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                    <span><strong>DECISION RULE:</strong> {analysis.recommendedAction}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

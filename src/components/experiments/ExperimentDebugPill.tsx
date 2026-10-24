'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { EXPERIMENTS } from '@/lib/experiments/definitions';
import { getManualOverride, setManualOverride, assignVariant } from '@/lib/experiments/engine';
import { useUser } from '@/hooks/useUser';
import { FlaskConical, X, ChevronRight, Check, Sliders, BarChart3 } from 'lucide-react';

export function ExperimentDebugPill() {
  const { user } = useUser();
  const userId = user?.id || 'guest_user';

  const [isOpen, setIsOpen] = useState(false);
  const [activeVariants, setActiveVariants] = useState<Record<string, string>>({});

  const refreshVariants = () => {
    const current: Record<string, string> = {};
    for (const exp of EXPERIMENTS) {
      const assigned = assignVariant(exp.id, userId);
      current[exp.id] = assigned.id;
    }
    setActiveVariants(current);
  };

  useEffect(() => {
    refreshVariants();
    const handleOverride = () => refreshVariants();
    window.addEventListener('ab_experiment_override', handleOverride);
    return () => window.removeEventListener('ab_experiment_override', handleOverride);
  }, [userId]);

  const handleSelectVariant = (experimentId: string, variantId: string) => {
    setManualOverride(experimentId, variantId);
    setActiveVariants((prev) => ({ ...prev, [experimentId]: variantId }));
  };

  const handleResetExperiment = (experimentId: string) => {
    setManualOverride(experimentId, null);
    refreshVariants();
  };

  return (
    <>
      {/* Floating HUD Trigger */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-none bg-zinc-950 hover:bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-500 shadow-xl font-mono text-xs uppercase tracking-wider transition"
        >
          <FlaskConical className="w-3.5 h-3.5 text-zinc-400" />
          <span>[EXP_LAB // A/B]</span>
          <span className="w-1.5 h-1.5 bg-emerald-400" />
        </button>
      </div>

      {/* Slide-over / Modal Controls */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-end p-4">
          <div className="w-full sm:w-[420px] bg-zinc-950 border border-zinc-700 rounded-none shadow-2xl p-5 space-y-4 animate-in slide-in-from-bottom-4 sm:slide-in-from-right-4 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-zinc-300" />
                <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-white">
                  A/B EXPERIMENT CONTROL
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-none text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Switch active variants in real time to evaluate scoring heuristics, interface layouts, and onboarding flows.
            </p>

            {/* Experiment Variant Toggles */}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
              {EXPERIMENTS.map((exp) => {
                const currentVariantId = activeVariants[exp.id];
                const isOverridden = getManualOverride(exp.id) !== null;

                return (
                  <div
                    key={exp.id}
                    className="p-3 rounded-none bg-zinc-900/70 border border-zinc-800 space-y-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between font-mono">
                      <span className="font-bold text-zinc-200 uppercase tracking-tight">{exp.name.split(':')[0]}</span>
                      {isOverridden ? (
                        <button
                          onClick={() => handleResetExperiment(exp.id)}
                          className="text-[10px] text-amber-400 hover:underline uppercase"
                        >
                          [RESET HASH]
                        </button>
                      ) : (
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest">50/50 HASH</span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {exp.variants.map((v) => {
                        const isSelected = currentVariantId === v.id;
                        return (
                          <button
                            key={v.id}
                            onClick={() => handleSelectVariant(exp.id, v.id)}
                            className={`p-2.5 rounded-none border text-left transition flex flex-col justify-between ${
                              isSelected
                                ? 'bg-zinc-900 border-white text-white'
                                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full mb-1">
                              <span className="font-mono font-bold text-[11px] truncate uppercase">{v.name.split('(')[0]}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <span className="text-[10px] text-zinc-500 font-sans line-clamp-1">{v.description}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between font-mono">
              <Link
                href="/admin/experiments"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-1.5 text-xs font-bold text-zinc-300 hover:text-white uppercase tracking-wider"
              >
                <BarChart3 className="w-3.5 h-3.5 text-zinc-400" />
                <span>OPEN STATISTICAL TELEMETRY</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

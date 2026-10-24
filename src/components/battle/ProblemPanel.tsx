'use client';

import React from 'react';
import { Problem } from '@/types';
import { Terminal, Cpu, HardDrive } from 'lucide-react';

interface ProblemPanelProps {
  problem: Problem;
}

export function ProblemPanel({ problem }: ProblemPanelProps) {
  const difficultyStyles = {
    easy: 'text-emerald-400 border-emerald-800 bg-emerald-950/20',
    medium: 'text-amber-400 border-amber-800 bg-amber-950/20',
    hard: 'text-rose-400 border-rose-800 bg-rose-950/20',
  }[problem.difficulty];

  return (
    <div className="h-full flex flex-col bg-zinc-950 border border-zinc-800 rounded-none overflow-hidden font-sans">
      {/* Specification Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/60 font-mono text-xs">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-3.5 h-3.5 text-zinc-400" />
          <h2 className="font-bold text-zinc-100 tracking-wide uppercase">{problem.title}</h2>
          <span className={`text-[10px] px-1.5 py-0.5 border font-bold uppercase tracking-wider ${difficultyStyles}`}>
            [{problem.difficulty.toUpperCase()}]
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-mono">
          <div className="flex items-center gap-1" title="Time Constraint">
            <Cpu className="w-3 h-3 text-zinc-500" />
            <span>{problem.constraints.time_limit_ms}ms</span>
          </div>
          <span className="text-zinc-700">|</span>
          <div className="flex items-center gap-1" title="Memory Constraint">
            <HardDrive className="w-3 h-3 text-zinc-500" />
            <span>{Math.round(problem.constraints.memory_limit_kb / 1024)}MB</span>
          </div>
        </div>
      </div>

      {/* Specification Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs text-zinc-300 leading-relaxed custom-scrollbar">
        {/* Description formatted */}
        <div className="whitespace-pre-line text-zinc-200 font-normal border-l-2 border-zinc-700 pl-3">
          {problem.description}
        </div>

        {/* Sample Test Cases */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
            <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400">
              // SAMPLE_IO_CASES
            </h3>
            <span className="text-[10px] font-mono text-zinc-500">
              {problem.sample_test_cases.length} VISIBLE
            </span>
          </div>

          {problem.sample_test_cases.map((tc, idx) => (
            <div key={tc.id} className="bg-zinc-900 border border-zinc-800 p-2.5 space-y-2 font-mono">
              <div className="text-[10px] text-zinc-500 font-bold uppercase">
                CASE_{idx + 1}
              </div>
              <div className="space-y-1.5">
                <div>
                  <span className="text-[10px] uppercase text-zinc-500 block">STDIN:</span>
                  <pre className="p-1.5 bg-[#050507] border border-zinc-800 text-[11px] text-emerald-400 overflow-x-auto">
                    {tc.input}
                  </pre>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-zinc-500 block">EXPECTED_STDOUT:</span>
                  <pre className="p-1.5 bg-[#050507] border border-zinc-800 text-[11px] text-cyan-400 overflow-x-auto">
                    {tc.expected_output}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tactical Evaluation Protocol */}
        <div className="p-3 bg-zinc-900/80 border border-zinc-800 font-mono text-[11px] space-y-1">
          <div className="font-bold text-zinc-200 uppercase tracking-wider pb-1 border-b border-zinc-800">
            // SCORING_CRITERIA
          </div>
          <div className="flex justify-between py-0.5 text-zinc-400">
            <span>• CORRECTNESS [50 PTS]:</span>
            <span className="text-zinc-200">100% test pass required</span>
          </div>
          <div className="flex justify-between py-0.5 text-zinc-400">
            <span>• SPEED BONUS [25 PTS]:</span>
            <span className="text-zinc-200">Elapsed submission velocity</span>
          </div>
          <div className="flex justify-between py-0.5 text-zinc-400">
            <span>• EFFICIENCY [25 PTS]:</span>
            <span className="text-zinc-200">Runtime & memory vs optimal</span>
          </div>
        </div>
      </div>
    </div>
  );
}

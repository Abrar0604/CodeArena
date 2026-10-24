'use client';

import React from 'react';
import { BattlePlayer, BattleOpponentProgress } from '@/types';
import { Activity } from 'lucide-react';

interface OpponentProgressProps {
  opponent: BattlePlayer;
  progress: BattleOpponentProgress | null;
  totalTests: number;
}

export function OpponentProgress({
  opponent,
  progress,
  totalTests = 5,
}: OpponentProgressProps) {
  const passed = progress?.testsPassed || 0;
  const total = progress?.totalTests || totalTests || 5;

  return (
    <div className="flex items-center gap-3 px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-none text-xs font-mono">
      {/* Square Avatar & Identifier */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-none bg-zinc-900 border border-zinc-700 overflow-hidden shrink-0">
          <img
            src={opponent.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${opponent.id}`}
            alt={opponent.username}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-bold text-zinc-100">{opponent.username}</span>
            <span className="text-[10px] text-zinc-500 font-mono">[{opponent.rating}]</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-zinc-400 mt-1">
            <Activity className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
            <span className="uppercase tracking-wider">
              {progress?.lastScore !== undefined
                ? `SUBMITTED [${progress.lastScore} PTS]`
                : progress?.testsPassed
                ? 'TESTING...'
                : 'TYPING...'}
            </span>
          </div>
        </div>
      </div>

      {/* Discrete Segmented Progress Blocks */}
      <div className="flex flex-col gap-1 w-24 sm:w-28 pl-2 border-l border-zinc-800">
        <div className="flex justify-between text-[10px] text-zinc-400 uppercase tracking-widest tabular-nums">
          <span>TESTS</span>
          <span className="text-zinc-200 font-bold">{passed}/{total}</span>
        </div>
        <div className="flex gap-1 h-1.5 w-full">
          {Array.from({ length: total }).map((_, i) => {
            const isCompleted = i < passed;
            return (
              <div
                key={i}
                className={`flex-1 transition-colors duration-200 ${
                  isCompleted ? 'bg-emerald-500' : 'bg-zinc-800'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

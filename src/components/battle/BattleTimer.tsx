'use client';

import React, { useState, useEffect } from 'react';
import { Timer, AlertTriangle } from 'lucide-react';

interface BattleTimerProps {
  startedAt: string;
  timeLimitSeconds: number;
  onTimeExpired?: () => void;
  isPaused?: boolean;
}

export function BattleTimer({
  startedAt,
  timeLimitSeconds,
  onTimeExpired,
  isPaused = false,
}: BattleTimerProps) {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(timeLimitSeconds);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const startMs = new Date(startedAt).getTime();
      const nowMs = Date.now();
      const elapsedSec = Math.floor((nowMs - startMs) / 1000);
      const remaining = Math.max(0, timeLimitSeconds - elapsedSec);

      setSecondsRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        onTimeExpired?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startedAt, timeLimitSeconds, isPaused, onTimeExpired]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isUrgent = secondsRemaining <= 120; // < 2 mins
  const isWarning = secondsRemaining <= 300 && !isUrgent; // < 5 mins

  const timerStyle = isUrgent
    ? 'text-rose-400 bg-rose-950/30 border-rose-700 animate-pulse'
    : isWarning
    ? 'text-amber-400 bg-amber-950/20 border-amber-700'
    : 'text-zinc-200 bg-zinc-950 border-zinc-800';

  return (
    <div
      suppressHydrationWarning
      className={`flex items-center gap-2 px-3 py-1 border rounded-none font-mono text-xs tabular-nums transition-colors duration-150 ${timerStyle}`}
    >
      {isUrgent ? (
        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
      ) : (
        <Timer className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
      )}
      <div className="flex items-center gap-1.5 font-bold tracking-widest">
        <span className="text-[10px] text-zinc-500 uppercase">SYS_TIME</span>
        <span className="text-zinc-600">//</span>
        <span suppressHydrationWarning className="text-sm font-black">
          {timeFormatted}
        </span>
      </div>
    </div>
  );
}

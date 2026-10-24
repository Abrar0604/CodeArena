'use client';

import React from 'react';
import { getRatingTier } from '@/lib/constants';

interface RatingBadgeProps {
  rating: number;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function RatingBadge({ rating, size = 'md' }: RatingBadgeProps) {
  const tier = getRatingTier(rating);

  const tierColors: Record<string, { text: string; border: string }> = {
    Grandmaster: { text: 'text-rose-400', border: 'border-rose-800/80' },
    Master: { text: 'text-amber-400', border: 'border-amber-800/80' },
    Diamond: { text: 'text-cyan-400', border: 'border-cyan-800/80' },
    Platinum: { text: 'text-emerald-400', border: 'border-emerald-800/80' },
    Gold: { text: 'text-yellow-400', border: 'border-yellow-800/80' },
    Silver: { text: 'text-zinc-300', border: 'border-zinc-700' },
    Bronze: { text: 'text-amber-700', border: 'border-amber-900' },
  };

  const style = tierColors[tier.name] || { text: 'text-zinc-300', border: 'border-zinc-700' };

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 tracking-wider',
    md: 'text-xs px-2 py-0.5 tracking-wider',
    lg: 'text-xs px-2.5 py-1 tracking-widest font-bold',
  };

  const tierCode = tier.name.substring(0, 3).toUpperCase();

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono uppercase bg-zinc-950 border rounded-none tabular-nums ${style.border} ${style.text} ${sizeClasses[size]}`}
    >
      <span className="opacity-60">[</span>
      <span>{tierCode}</span>
      <span className="opacity-40">//</span>
      <span className="text-zinc-100">{rating}</span>
      <span className="opacity-60">]</span>
    </span>
  );
}

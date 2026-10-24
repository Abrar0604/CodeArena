'use client';

import React from 'react';
import Link from 'next/link';
import { Swords, User, Target, Trophy, ArrowRight, UserPlus } from 'lucide-react';
import { useUser } from '@/hooks/useUser';

export function HomeHeroActions() {
  const { user, mounted, isAuthenticated } = useUser();

  if (mounted && isAuthenticated && user) {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 font-mono text-xs">
        <Link
          href="/lobby"
          className="w-full sm:w-auto px-8 py-3.5 bg-zinc-100 hover:bg-white text-zinc-950 font-black tracking-widest uppercase border border-zinc-200 transition active:translate-y-[1px] flex items-center justify-center gap-2.5 shadow-md shadow-white/5"
        >
          <Swords className="w-4 h-4 stroke-[2.5]" />
          <span>[ ENTER BATTLE LOBBY ]</span>
        </Link>

        <Link
          href="/practice"
          className="w-full sm:w-auto px-7 py-3.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-white font-bold tracking-widest uppercase transition flex items-center justify-center gap-2"
        >
          <Target className="w-4 h-4 text-emerald-400" />
          <span>[ SOLO PRACTICE ]</span>
        </Link>

        <Link
          href="/leaderboard"
          className="w-full sm:w-auto px-6 py-3.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 font-bold tracking-widest uppercase transition flex items-center justify-center gap-2"
        >
          <Trophy className="w-4 h-4 text-zinc-400" />
          <span>[ RANKINGS ]</span>
        </Link>
      </div>
    );
  }

  // Default state for new visitors and SSR
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 font-mono text-xs">
      <Link
        href="/register"
        className="w-full sm:w-auto px-8 py-3.5 bg-zinc-100 hover:bg-white text-zinc-950 font-black tracking-widest uppercase border border-zinc-200 transition active:translate-y-[1px] flex items-center justify-center gap-2.5 shadow-md shadow-white/5"
      >
        <UserPlus className="w-4 h-4 stroke-[2.5]" />
        <span>[ CREATE ACCOUNT // GET STARTED ]</span>
      </Link>

      <Link
        href="/login"
        className="w-full sm:w-auto px-7 py-3.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-700 text-zinc-200 hover:text-white font-bold tracking-widest uppercase transition flex items-center justify-center gap-2"
      >
        <User className="w-4 h-4 text-zinc-400" />
        <span>[ SIGN IN ]</span>
      </Link>

      <Link
        href="/leaderboard"
        className="w-full sm:w-auto px-6 py-3.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 font-bold tracking-widest uppercase transition flex items-center justify-center gap-2"
      >
        <Trophy className="w-4 h-4 text-zinc-400" />
        <span>[ GLOBAL RANKINGS ]</span>
      </Link>
    </div>
  );
}

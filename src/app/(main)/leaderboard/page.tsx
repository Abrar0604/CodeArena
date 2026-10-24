'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Swords, Search, Lock, LogIn, UserPlus } from 'lucide-react';
import { RatingBadge } from '@/components/RatingBadge';
import { useUser } from '@/hooks/useUser';
import Link from 'next/link';

interface LeaderboardUser {
  rank: number;
  id: string;
  username: string;
  avatar_url: string;
  rating: number;
  matches_played: number;
  matches_won: number;
}

export default function LeaderboardPage() {
  const router = useRouter();
  const { user, mounted, loading: userLoading, isAuthenticated } = useUser();
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');

  // Enforce authentication barrier
  useEffect(() => {
    if (mounted && !userLoading && !isAuthenticated) {
      router.replace('/login?redirectTo=/leaderboard');
    }
  }, [mounted, userLoading, isAuthenticated, router]);

  // Fetch real registered gladiators from DB
  useEffect(() => {
    if (!isAuthenticated) return;
    async function fetchLeaderboard() {
      try {
        const res = await fetch('/api/leaderboard');
        const data = await res.json();
        if (data.leaderboard) {
          setUsers(data.leaderboard);
        }
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, [isAuthenticated]);

  if (mounted && !userLoading && !isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-center items-center px-4 py-12 bg-[#050507] text-zinc-100 font-sans">
        <div className="max-w-md w-full bg-zinc-950 border border-zinc-800 p-8 space-y-6 text-center">
          <div className="w-12 h-12 bg-zinc-900 border border-zinc-700 mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6 text-zinc-300" />
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
              <span>AUTHENTICATION REQUIRED</span>
            </div>
            <h2 className="text-xl font-mono font-black uppercase text-white tracking-tight">
              GLOBAL RANKINGS ACCESS
            </h2>
            <p className="text-xs text-zinc-400 font-mono leading-relaxed">
              Sign in or create an account to view global rankings, gladiator ELO standings, and win rates.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 pt-2 font-mono text-xs">
            <Link
              href="/login?redirectTo=/leaderboard"
              className="w-full py-3 bg-white hover:bg-zinc-200 text-zinc-950 font-black uppercase tracking-wider text-center border border-white transition flex items-center justify-center gap-2 shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>[ SIGN IN WITH CREDENTIALS ]</span>
            </Link>
            <Link
              href="/register?redirectTo=/leaderboard"
              className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-bold uppercase tracking-wider text-center transition flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>[ CREATE COMBATANT ACCOUNT ]</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filtered = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050507] text-zinc-100 py-10 px-4 sm:px-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono">
              <Trophy className="w-4 h-4 text-zinc-400" />
              <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                GLOBAL_RANKINGS // ELO_REGISTRY
              </h1>
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              VERIFIED GLADIATORS SORTED BY COMPETITIVE SKILL RATING
            </p>
          </div>

          <Link
            href="/lobby"
            className="self-start sm:self-auto px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-950 font-mono text-xs font-black uppercase tracking-wider border border-zinc-200 transition active:translate-y-[1px] flex items-center gap-2"
          >
            <Swords className="w-3.5 h-3.5 stroke-[2.5]" /> [BATTLE TO CLIMB]
          </Link>
        </div>

        {/* Search */}
        <div className="relative font-mono text-xs">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="FILTER BY GLADIATOR CODENAME..."
            className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 font-mono rounded-none uppercase"
          />
        </div>

        {/* Tactical Monolith Data Table */}
        <div className="bg-zinc-950 border border-zinc-800 font-mono text-xs">
          {loading ? (
            <div className="p-12 text-center text-zinc-500 space-y-3">
              <div className="w-6 h-6 border-2 border-zinc-700 border-t-white animate-spin mx-auto" />
              <div className="text-xs uppercase tracking-widest">LOADING LIVE GLADIATOR REGISTRY...</div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 space-y-2">
              <Trophy className="w-8 h-8 text-zinc-700 mx-auto stroke-1" />
              <div className="text-xs uppercase tracking-widest text-zinc-400">
                {search ? 'NO MATCHING COMBATANTS FOUND' : 'NO REGISTERED COMBATANTS YET'}
              </div>
              <p className="text-[11px] text-zinc-600 font-sans">
                {search ? 'Try a different callsign query.' : 'Be the first gladiator to register and claim Rank #1.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-zinc-900 border-b border-zinc-800 text-[10px] uppercase tracking-widest text-zinc-400">
                  <tr>
                    <th className="py-2.5 px-3 text-center w-16">RANK</th>
                    <th className="py-2.5 px-3">GLADIATOR</th>
                    <th className="py-2.5 px-3">TIER & RATING</th>
                    <th className="py-2.5 px-3 text-center">MATCHES</th>
                    <th className="py-2.5 px-3 text-right">WIN RATIO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80 tabular-nums">
                  {filtered.map((coder) => {
                    const isCurrent = user?.username === coder.username;
                    const winRate =
                      coder.matches_played > 0
                        ? Math.round((coder.matches_won / coder.matches_played) * 100)
                        : 0;

                    return (
                      <tr
                        key={coder.id}
                        className={`transition ${
                          isCurrent
                            ? 'bg-zinc-900/90 border-l-2 border-l-zinc-200'
                            : 'hover:bg-zinc-900/40'
                        }`}
                      >
                        {/* Rank */}
                        <td className="py-2.5 px-3 text-center font-bold">
                          <span
                            className={`inline-block px-1.5 py-0.2 border text-[11px] ${
                              coder.rank === 1
                                ? 'border-yellow-600 text-yellow-400 bg-yellow-950/20'
                                : coder.rank === 2
                                ? 'border-zinc-400 text-zinc-200 bg-zinc-800/40'
                                : coder.rank === 3
                                ? 'border-amber-700 text-amber-500 bg-amber-950/20'
                                : 'border-transparent text-zinc-500'
                            }`}
                          >
                            [{String(coder.rank).padStart(2, '0')}]
                          </span>
                        </td>

                        {/* User */}
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-5 h-5 bg-zinc-900 border border-zinc-800 shrink-0 overflow-hidden">
                              <img
                                src={coder.avatar_url}
                                alt={coder.username}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="font-bold text-zinc-100">{coder.username}</span>
                            {isCurrent && (
                              <span className="text-[9px] px-1 bg-zinc-800 border border-zinc-600 text-zinc-300 font-bold">
                                YOU
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Tier & Rating */}
                        <td className="py-2.5 px-3">
                          <RatingBadge rating={coder.rating} size="sm" />
                        </td>

                        {/* Matches */}
                        <td className="py-2.5 px-3 text-center text-zinc-300">
                          {coder.matches_played}
                        </td>

                        {/* Win Rate */}
                        <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">
                          {winRate}%
                          <span className="text-[10px] text-zinc-500 ml-1">
                            ({coder.matches_won}W)
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

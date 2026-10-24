'use client';

import React, { useState } from 'react';
import { Trophy, Swords, Search } from 'lucide-react';
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

const TOP_CODERS: LeaderboardUser[] = [
  { rank: 1, id: 'u1', username: 'Tourist_Alpha', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Tourist', rating: 2480, matches_played: 142, matches_won: 131 },
  { rank: 2, id: 'u2', username: 'ByteMaster_99', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Byte', rating: 2340, matches_played: 110, matches_won: 95 },
  { rank: 3, id: 'u3', username: 'AlgoGod', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=AlgoGod', rating: 2210, matches_played: 98, matches_won: 82 },
  { rank: 4, id: 'u4', username: 'CodeNinja_X', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Ninja', rating: 2050, matches_played: 85, matches_won: 68 },
  { rank: 5, id: 'u5', username: 'ZeroComplexity', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Zero', rating: 1980, matches_played: 76, matches_won: 58 },
  { rank: 6, id: 'u6', username: 'BitwiseHero', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Bitwise', rating: 1890, matches_played: 64, matches_won: 48 },
  { rank: 7, id: 'u7', username: 'StackOverflowed', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Stack', rating: 1780, matches_played: 59, matches_won: 41 },
  { rank: 8, id: 'u8', username: 'RecursionQueen', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Recursion', rating: 1650, matches_played: 45, matches_won: 30 },
  { rank: 9, id: 'u9', username: 'BinaryBeast', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Binary', rating: 1540, matches_played: 38, matches_won: 24 },
  { rank: 10, id: 'u10', username: 'QuickSortKing', avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Quick', rating: 1420, matches_played: 30, matches_won: 18 },
];

export default function LeaderboardPage() {
  const { user, mounted } = useUser();
  const [search, setSearch] = useState('');

  const allUsers = [...TOP_CODERS];
  if (mounted && user && !allUsers.some((u) => u.username === user.username)) {
    allUsers.push({
      rank: allUsers.length + 1,
      id: user.id,
      username: user.username,
      avatar_url: user.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.id}`,
      rating: user.rating,
      matches_played: user.matches_played,
      matches_won: user.matches_won,
    });
  }

  allUsers.sort((a, b) => b.rating - a.rating);
  allUsers.forEach((u, i) => (u.rank = i + 1));

  const filtered = allUsers.filter((u) =>
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
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Swords, Trophy, Check, AlertCircle } from 'lucide-react';
import { RatingBadge } from '@/components/RatingBadge';
import { useUser } from '@/hooks/useUser';

interface BattleResultsProps {
  battleId: string;
}

export function BattleResults({ battleId }: BattleResultsProps) {
  const { user, updateProfile } = useUser();

  const [battleData, setBattleData] = useState<any>(null);
  const [ratingChange] = useState<number>(+28);
  const hasUpdatedRef = useRef<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined' || hasUpdatedRef.current) return;

    const stored = sessionStorage.getItem(`battle_result_${battleId}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setBattleData(parsed);

        if (parsed.winnerId === (user?.id || 'guest_user')) {
          hasUpdatedRef.current = true;
          if (user) {
            updateProfile({
              rating: user.rating + 28,
              matches_played: user.matches_played + 1,
              matches_won: user.matches_won + 1,
            });
          }
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      setBattleData({
        battleId,
        problem: { title: 'Two Sum', difficulty: 'easy' },
        userScore: { correctness: 50, speed: 21.4, efficiency: 22.8, total: 94.2, allPassed: true },
        opponentScore: { correctness: 50, speed: 17.2, efficiency: 19.5, total: 86.7, allPassed: true },
        winnerId: user?.id || 'guest_user',
        opponent: {
          id: 'bot_algo_master',
          username: 'ByteVanguard',
          rating: 1240,
          avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=ByteVanguard',
        },
      });
    }
  }, [battleId, user, updateProfile]);

  if (!battleData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050507] text-zinc-500 font-mono text-xs">
        <span>FETCHING_TELEMETRY...</span>
      </div>
    );
  }

  const isWinner = battleData.winnerId === (user?.id || 'guest_user');
  const userScore = battleData.userScore;
  const oppScore = battleData.opponentScore;

  return (
    <div className="min-h-screen bg-[#050507] text-zinc-100 py-10 px-4 sm:px-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between font-mono text-xs border-b border-zinc-800 pb-3">
          <Link
            href="/lobby"
            className="flex items-center gap-1.5 font-bold uppercase text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> [RETURN TO LOBBY]
          </Link>
          <div className="flex items-center gap-2 text-zinc-400">
            <span>SPEC:</span>
            <span className="text-zinc-100 font-bold uppercase">{battleData.problem?.title}</span>
          </div>
        </div>

        {/* Tactical Verdict Header Monolith */}
        <div
          className={`p-6 border-2 font-mono text-left space-y-3 ${
            isWinner
              ? 'bg-zinc-950 border-emerald-800/80 text-emerald-400'
              : 'bg-zinc-950 border-rose-800/80 text-rose-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-widest uppercase">
              // MATCH_RESULT_RECORDED
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">
              ID: #{battleId.substring(0, 10)}
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase font-sans">
              {isWinner ? 'TACTICAL VICTORY' : 'MATCH DEFEAT'}
            </h1>
            <p className="text-xs text-zinc-400 font-sans">
              {isWinner
                ? 'Optimal execution velocity achieved. Solution scored higher across correctness, runtime latency, and memory allocation.'
                : 'Opponent submitted earlier with superior space-time benchmarks. Review diagnostics below.'}
            </p>
          </div>

          {/* Rating Delta Stamp */}
          <div className="inline-flex items-center gap-2 pt-2 text-xs font-mono tabular-nums">
            <span className="text-zinc-400">RATING_DELTA:</span>
            <span
              className={`font-black ${
                isWinner ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isWinner ? `+${ratingChange} ELO` : `-16 ELO`}
            </span>
            <span className="text-zinc-700">|</span>
            <span className="text-zinc-300">
              CURRENT_RATING: [{user?.rating || 1200}]
            </span>
          </div>
        </div>

        {/* Side by Side Telemetry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
          {/* Player (You) */}
          <div className="p-4 bg-zinc-950 border-2 border-zinc-700 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-zinc-900 border border-zinc-600 overflow-hidden shrink-0">
                  <img
                    src={user?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.id || 'you'}`}
                    alt="You"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-zinc-100">
                    <span>{user?.username || 'You'}</span>
                    <span className="text-[10px] px-1 py-0.2 bg-zinc-800 border border-zinc-600 text-zinc-300 font-mono">
                      YOU
                    </span>
                  </div>
                  <RatingBadge rating={user?.rating || 1200} size="sm" />
                </div>
              </div>

              <div className="text-right tabular-nums">
                <div className="text-2xl font-black text-zinc-100">{userScore.total}</div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">TOTAL SCORE</div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs tabular-nums">
              <div className="flex justify-between py-1 border-b border-zinc-900 text-zinc-400">
                <span>CORRECTNESS [MAX 50]:</span>
                <span className="font-bold text-emerald-400">{userScore.correctness} PTS</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-900 text-zinc-400">
                <span>SPEED BONUS [MAX 25]:</span>
                <span className="font-bold text-cyan-400">{userScore.speed} PTS</span>
              </div>
              <div className="flex justify-between py-1 text-zinc-400">
                <span>EFFICIENCY [MAX 25]:</span>
                <span className="font-bold text-zinc-200">{userScore.efficiency} PTS</span>
              </div>
            </div>
          </div>

          {/* Opponent */}
          <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-zinc-900 border border-zinc-800 overflow-hidden shrink-0">
                  <img
                    src={battleData.opponent?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=opp`}
                    alt="Opponent"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-bold text-sm text-zinc-100">
                    {battleData.opponent?.username || 'Opponent'}
                  </div>
                  <RatingBadge rating={battleData.opponent?.rating || 1220} size="sm" />
                </div>
              </div>

              <div className="text-right tabular-nums">
                <div className="text-2xl font-black text-zinc-400">{oppScore.total}</div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">TOTAL SCORE</div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs tabular-nums">
              <div className="flex justify-between py-1 border-b border-zinc-900 text-zinc-400">
                <span>CORRECTNESS [MAX 50]:</span>
                <span className="font-bold text-zinc-300">{oppScore.correctness} PTS</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-900 text-zinc-400">
                <span>SPEED BONUS [MAX 25]:</span>
                <span className="font-bold text-zinc-300">{oppScore.speed} PTS</span>
              </div>
              <div className="flex justify-between py-1 text-zinc-400">
                <span>EFFICIENCY [MAX 25]:</span>
                <span className="font-bold text-zinc-300">{oppScore.efficiency} PTS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 font-mono text-xs">
          <Link
            href="/lobby"
            className="w-full sm:w-auto px-6 py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 font-black tracking-widest uppercase border border-zinc-200 transition active:translate-y-[1px] flex items-center justify-center gap-2"
          >
            <Swords className="w-4 h-4" /> [ENGAGE NEXT BATTLE]
          </Link>

          <Link
            href="/leaderboard"
            className="w-full sm:w-auto px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold tracking-widest uppercase border border-zinc-800 transition flex items-center justify-center gap-2"
          >
            <Trophy className="w-4 h-4 text-zinc-400" /> [VIEW LEADERBOARD]
          </Link>
        </div>
      </div>
    </div>
  );
}

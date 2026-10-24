'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { RatingBadge } from '@/components/RatingBadge';
import { Trophy, Swords, Shield, Zap, Edit2, Check, ArrowRight, ArrowUpRight, ArrowDownRight, Lock, LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const { user, mounted, loading, isAuthenticated, updateProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [usernameInput, setUsernameInput] = useState(user?.username || '');
  const [recentBattles, setRecentBattles] = useState<any[]>([]);

  // Enforce authentication barrier
  useEffect(() => {
    if (mounted && !loading && (!isAuthenticated || !user)) {
      router.replace('/login?redirectTo=/profile');
    }
  }, [mounted, loading, isAuthenticated, user, router]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('codearena_battle_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentBattles(parsed);
        }
      }
    } catch {}
  }, []);

  if (mounted && !loading && (!isAuthenticated || !user)) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4 bg-[#050507] text-zinc-100 font-sans">
        <div className="max-w-md w-full bg-zinc-950 border border-zinc-800 p-8 space-y-6 text-center">
          <div className="w-12 h-12 bg-zinc-900 border border-zinc-700 mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6 text-zinc-300" />
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
              <span>AUTHENTICATION REQUIRED</span>
            </div>
            <h2 className="text-xl font-mono font-black uppercase text-white tracking-tight">
              COMBATANT DOSSIER ACCESS
            </h2>
            <p className="text-xs text-zinc-400 font-mono leading-relaxed">
              Sign in to view your verified combat history, ELO rating trajectory, and win/loss records.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 pt-2 font-mono text-xs">
            <Link
              href="/login"
              className="w-full py-3 bg-white hover:bg-zinc-200 text-zinc-950 font-black uppercase tracking-wider text-center border border-white transition flex items-center justify-center gap-2 shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>[ SIGN IN TO ACCESS DOSSIER ]</span>
            </Link>
            <Link
              href="/register"
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050507] text-zinc-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-zinc-700 border-t-white animate-spin" />
          <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase">SYS_INITIALIZE...</span>
        </div>
      </div>
    );
  }

  const handleSaveUsername = () => {
    if (usernameInput.trim()) {
      updateProfile({ username: usernameInput.trim() });
      setIsEditing(false);
    }
  };

  const winRate =
    user.matches_played > 0
      ? Math.round((user.matches_won / user.matches_played) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-[#050507] text-zinc-100 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Card */}
        <div className="p-6 sm:p-8 bg-zinc-950 border border-zinc-800 rounded-none relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <img
                src={user.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.id}`}
                alt={user.username}
                className="w-24 h-24 rounded-none bg-zinc-900 border border-zinc-700 object-cover"
              />
              <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-zinc-400" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-zinc-400" />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      className="px-3 py-1 bg-zinc-900 border border-zinc-700 text-white font-mono text-lg rounded-none focus:outline-none focus:border-white"
                    />
                    <button
                      onClick={handleSaveUsername}
                      className="px-2.5 py-1.5 bg-white text-black font-mono font-bold text-xs uppercase tracking-wider rounded-none hover:bg-zinc-200 transition"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-2xl font-black tracking-tight text-white font-mono uppercase">{user.username}</h1>
                    <button
                      onClick={() => {
                        setUsernameInput(user.username);
                        setIsEditing(true);
                      }}
                      className="text-zinc-500 hover:text-zinc-300 transition"
                      title="Edit username"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <RatingBadge rating={user.rating} size="md" />
              </div>

              <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider">
                UID: {user.id.substring(0, 16)} // COMBATANT STATUS: ACTIVE
              </p>
            </div>

            <Link
              href="/lobby"
              className="px-5 py-2.5 bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-none flex items-center gap-2 border border-white transition"
            >
              <Swords className="w-4 h-4" />
              <span>ENTER ARENA</span>
            </Link>
          </div>
        </div>

        {/* Career Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-none text-center space-y-1">
            <Trophy className="w-4 h-4 text-amber-400 mx-auto" />
            <div className="text-2xl font-black text-white font-mono tabular-nums">{user.rating}</div>
            <div className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">ELO RATING</div>
          </div>

          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-none text-center space-y-1">
            <Swords className="w-4 h-4 text-zinc-300 mx-auto" />
            <div className="text-2xl font-black text-white font-mono tabular-nums">{user.matches_played}</div>
            <div className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">MATCHES</div>
          </div>

          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-none text-center space-y-1">
            <Shield className="w-4 h-4 text-emerald-400 mx-auto" />
            <div className="text-2xl font-black text-emerald-400 font-mono tabular-nums">{user.matches_won}</div>
            <div className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">VICTORIES</div>
          </div>

          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-none text-center space-y-1">
            <Zap className="w-4 h-4 text-cyan-400 mx-auto" />
            <div className="text-2xl font-black text-white font-mono tabular-nums">{winRate}%</div>
            <div className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">WIN RATIO</div>
          </div>
        </div>

        {/* Recent Battle History Preview */}
        <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-none space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h2 className="text-xs font-mono font-bold tracking-wider text-zinc-200 uppercase flex items-center gap-2">
              <Swords className="w-4 h-4 text-zinc-400" />
              <span>[02 // HISTORICAL COMBAT TELEMETRY]</span>
            </h2>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">REALTIME SYNCED</span>
          </div>

          <div className="space-y-2">
            {recentBattles.length === 0 ? (
              <div className="p-8 text-center bg-zinc-900/30 border border-zinc-800 text-xs font-mono space-y-3">
                <p className="text-zinc-500 uppercase tracking-widest font-bold">
                  [NO HISTORICAL COMBAT TELEMETRY]
                </p>
                <p className="text-zinc-400 font-sans text-xs max-w-sm mx-auto">
                  You have not played any 1v1 battles yet. Enter the queue in the lobby to commence combat telemetry and earn ELO.
                </p>
                <Link
                  href="/lobby"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-zinc-200 text-black font-bold uppercase tracking-wider text-xs border border-white transition"
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>FIND FIRST MATCH</span>
                </Link>
              </div>
            ) : (
              recentBattles.map((b) => {
                const isWin = b.verdict === 'VICTORY';
                return (
                  <div
                    key={b.id}
                    className="flex items-center justify-between p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-none text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-0.5 rounded-none font-mono font-bold uppercase text-[10px] tracking-wider border ${
                          isWin
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                            : 'bg-rose-950/60 text-rose-400 border-rose-800'
                        }`}
                      >
                        [{b.verdict}]
                      </span>
                      <div>
                        <span className="font-mono font-bold text-zinc-200">
                          vs {b.opponentName} [{b.opponentRating}]
                        </span>
                        <p className="text-[10px] text-zinc-500 font-mono">
                          SPEC: {b.problemTitle} // RUNTIME: {b.language}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`text-right font-mono font-bold tabular-nums flex items-center gap-0.5 ${
                        isWin ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isWin ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      <span>{b.ratingDelta > 0 ? `+${b.ratingDelta}` : b.ratingDelta} ELO</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

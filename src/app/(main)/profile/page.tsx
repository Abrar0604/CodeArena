'use client';

import React, { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { RatingBadge } from '@/components/RatingBadge';
import { Trophy, Swords, Shield, Zap, Edit2, Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, updateProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [usernameInput, setUsernameInput] = useState(user?.username || '');

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
            <div className="flex items-center justify-between p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-none text-xs">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded-none font-mono font-bold uppercase text-[10px] tracking-wider bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                  [VICTORY]
                </span>
                <div>
                  <span className="font-mono font-bold text-zinc-200">vs ByteVanguard [1240]</span>
                  <p className="text-[10px] text-zinc-500 font-mono">SPEC: Two Sum // RUNTIME: Python 3</p>
                </div>
              </div>
              <div className="text-right font-mono font-bold text-emerald-400 tabular-nums">
                +28 ELO
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-none text-xs">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded-none font-mono font-bold uppercase text-[10px] tracking-wider bg-rose-950/60 text-rose-400 border border-rose-800">
                  [DEFEAT]
                </span>
                <div>
                  <span className="font-mono font-bold text-zinc-200">vs AlgoGod [1410]</span>
                  <p className="text-[10px] text-zinc-500 font-mono">SPEC: Valid Parentheses // RUNTIME: JavaScript</p>
                </div>
              </div>
              <div className="text-right font-mono font-bold text-rose-400 tabular-nums">
                -16 ELO
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

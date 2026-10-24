'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Swords, Clock, Zap, Trophy, X, Crosshair } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { RatingBadge } from '@/components/RatingBadge';
import { useExperiment } from '@/hooks/useExperiment';
import { LobbyCTAConfig } from '@/lib/experiments/definitions';

export default function LobbyPage() {
  const router = useRouter();
  const { user, mounted } = useUser();
  const { variant, config: ctaConfig, trackMetric } = useExperiment<LobbyCTAConfig>('lobby_cta_v1');

  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchTime, setSearchTime] = useState<number>(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'any' | 'easy' | 'medium'>('any');

  useEffect(() => {
    let interval: any;
    if (isSearching) {
      interval = setInterval(() => {
        setSearchTime((t) => t + 1);
      }, 1000);
    } else {
      setSearchTime(0);
    }
    return () => clearInterval(interval);
  }, [isSearching]);

  const handleStartMatchmaking = async () => {
    trackMetric('conversion', 1);
    trackMetric('battle_started', 1);
    setIsSearching(true);

    try {
      const res = await fetch('/api/matchmaking/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id || 'guest_user',
          rating: user?.rating || 1200,
          difficulty: selectedDifficulty,
        }),
      });

      const data = await res.json();

      if (data.matched && data.battle_id) {
        setTimeout(() => {
          router.push(`/battle/${data.battle_id}`);
        }, 800);
      }
    } catch (err: any) {
      console.error(err);
      setIsSearching(false);
      alert('Error entering matchmaking queue: ' + err.message);
    }
  };

  const handleCancelMatchmaking = async () => {
    setIsSearching(false);
    try {
      await fetch('/api/matchmaking/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user?.id || 'guest_user' }),
      });
    } catch {}
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col justify-center items-center px-4 py-12 bg-[#050507] text-zinc-100 font-sans">
      <div className="max-w-xl w-full text-center space-y-8 z-10">
        {/* User Gladiator Status Bar */}
        {mounted && user && (
          <div className="inline-flex items-center gap-3 px-3.5 py-1.5 bg-zinc-950 border border-zinc-800 text-xs font-mono">
            <div className="w-5 h-5 bg-zinc-900 border border-zinc-700 overflow-hidden shrink-0">
              <img
                src={user.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.id}`}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-200 uppercase">{user.username}</span>
              <RatingBadge rating={user.rating} size="sm" />
            </div>
            <span className="text-zinc-700">|</span>
            <span className="text-zinc-500 tabular-nums">
              {user.matches_played} MATCHES ({user.matches_won}W)
            </span>
          </div>
        )}

        {/* Searching: Tactical Radar Crosshairs */}
        {isSearching ? (
          <div className="space-y-6 font-mono">
            {/* Geometric Radar Display */}
            <div className="relative w-48 h-48 mx-auto bg-zinc-950 border border-zinc-800 flex items-center justify-center overflow-hidden">
              {/* Grid Lines */}
              <div className="absolute inset-x-0 top-1/2 h-px bg-zinc-800" />
              <div className="absolute inset-y-0 left-1/2 w-px bg-zinc-800" />

              {/* Concentric rings */}
              <div className="absolute w-36 h-36 border border-zinc-800/80 rounded-none" />
              <div className="absolute w-24 h-24 border border-zinc-700/60 rounded-none" />
              <div className="absolute w-12 h-12 border border-zinc-600/40 rounded-none" />

              {/* Rotating radar sweep needle */}
              <div className="absolute inset-0 animate-radar-sweep pointer-events-none">
                <div className="w-1/2 h-px bg-emerald-400/80 absolute top-1/2 left-0 origin-right shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
              </div>

              {/* Center Crosshair Marker */}
              <Crosshair className="w-6 h-6 text-emerald-400 z-10 animate-pulse" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-lg font-black tracking-widest text-zinc-100 uppercase">
                ACQUIRING COMPETITOR...
              </h2>
              <p className="text-xs text-zinc-400 font-mono tabular-nums">
                RANGE: ±250 ELO // ELAPSED: {String(Math.floor(searchTime / 60)).padStart(2, '0')}:{String(searchTime % 60).padStart(2, '0')}
              </p>
            </div>

            <button
              onClick={handleCancelMatchmaking}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-rose-400 border border-zinc-800 hover:border-rose-800 font-mono text-xs font-bold uppercase tracking-wider transition active:translate-y-[1px]"
            >
              <X className="w-3.5 h-3.5" /> [ABORT SEARCH]
            </button>
          </div>
        ) : (
          /* Idle Lobby Screen */
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-zinc-300 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-emerald-400" />
                <span>{ctaConfig?.badgeText || 'RANKED 1V1 PROTOCOL'}</span>
                {mounted && variant && (
                  <span className="text-[10px] text-zinc-500 border-l border-zinc-800 pl-1.5">
                    {variant.id.toUpperCase()}
                  </span>
                )}
              </div>

              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white uppercase">
                READY FOR COMBAT
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
                Ranked 1v1 matchmaking. Race against real competitors to write optimal algorithmic solutions evaluated in a sandboxed micro-runtime.
              </p>
            </div>

            {/* Difficulty Segmented Switch */}
            <div className="flex items-center justify-center gap-1 font-mono text-xs">
              <span className="text-zinc-500 text-[11px] uppercase mr-2 tracking-wider">DIFFICULTY:</span>
              {(['any', 'easy', 'medium'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider border transition ${
                    selectedDifficulty === diff
                      ? 'bg-zinc-100 text-zinc-950 border-zinc-200'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  [{diff.toUpperCase()}]
                </button>
              ))}
            </div>

            {/* Solid High-Contrast CTA Button */}
            <div>
              <button
                onClick={handleStartMatchmaking}
                className={`w-full sm:w-auto px-10 py-3.5 font-mono text-sm font-black tracking-widest uppercase border transition active:translate-y-[1px] ${
                  variant?.id === 'urgency_speedrun'
                    ? 'bg-amber-400 hover:bg-amber-300 text-zinc-950 border-amber-300'
                    : 'bg-zinc-100 hover:bg-white text-zinc-950 border-zinc-200'
                }`}
              >
                <div className="flex items-center justify-center gap-2.5">
                  <Swords className="w-4 h-4 stroke-[2.5]" />
                  <span>
                    {ctaConfig?.buttonText
                      ? `[ ${ctaConfig.buttonText.replace(/[⚡🔥]/g, '').trim()} ]`
                      : '[ ENGAGE 1V1 DUEL ]'}
                  </span>
                </div>
              </button>
            </div>

            {/* Spec Highlights Grid */}
            <div className="grid grid-cols-3 gap-2 pt-6 max-w-md mx-auto text-center font-mono">
              <div className="p-3 bg-zinc-950 border border-zinc-800">
                <Clock className="w-3.5 h-3.5 text-zinc-400 mx-auto mb-1" />
                <div className="text-xs font-bold text-zinc-100 uppercase tracking-wider">15 MIN</div>
                <div className="text-[10px] text-zinc-500 uppercase">TIME LIMIT</div>
              </div>
              <div className="p-3 bg-zinc-950 border border-zinc-800">
                <Zap className="w-3.5 h-3.5 text-cyan-400 mx-auto mb-1" />
                <div className="text-xs font-bold text-zinc-100 uppercase tracking-wider">PISTON</div>
                <div className="text-[10px] text-zinc-500 uppercase">SANDBOX ENGINE</div>
              </div>
              <div className="p-3 bg-zinc-950 border border-zinc-800">
                <Trophy className="w-3.5 h-3.5 text-zinc-400 mx-auto mb-1" />
                <div className="text-xs font-bold text-zinc-100 uppercase tracking-wider">ELO RANKED</div>
                <div className="text-[10px] text-zinc-500 uppercase">LIVE DELTAS</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

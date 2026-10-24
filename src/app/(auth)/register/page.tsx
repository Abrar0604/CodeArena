'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Swords, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
          },
        },
      });

      if (error) throw error;

      router.push('/lobby');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#050507] text-zinc-100">
      <div className="max-w-md w-full bg-zinc-950 border border-zinc-800 rounded-none p-8 space-y-6 relative">
        {/* Corner Accents */}
        <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-zinc-500" />
        <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-zinc-500" />
        <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-zinc-500" />
        <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-zinc-500" />

        <div className="text-center space-y-2">
          <div className="w-10 h-10 bg-zinc-900 border border-zinc-700 mx-auto flex items-center justify-center rounded-none text-white">
            <Swords className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-black font-mono tracking-tight text-white uppercase">COMMISSION COMBATANT</h1>
            <p className="text-xs text-zinc-400 font-mono">INITIAL RATING: 1200 SILVER // PEER SEED</p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-none bg-rose-950/40 border border-rose-800 text-rose-400 text-xs font-mono text-center">
            [ERR: {errorMsg}]
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">CALLSIGN (USERNAME)</label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="AlgoKnight"
                className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-none text-xs text-zinc-200 font-mono placeholder:text-zinc-600 focus:outline-none focus:border-white transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">EMAIL ADDRESS</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@codearena.dev"
                className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-none text-xs text-zinc-200 font-mono placeholder:text-zinc-600 focus:outline-none focus:border-white transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">SECRET KEY (6+ CHARS)</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-none text-xs text-zinc-200 font-mono placeholder:text-zinc-600 focus:outline-none focus:border-white transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs uppercase tracking-wider rounded-none border border-white transition disabled:opacity-50"
          >
            {loading ? 'COMMISSIONING COMBATANT...' : 'INITIALIZE COMBATANT ACCOUNT'}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-500 font-mono">
          ALREADY REGISTERED?{' '}
          <Link href="/login" className="text-zinc-300 hover:text-white underline underline-offset-4">
            SIGN IN TO ARENA
          </Link>
        </p>
      </div>
    </div>
  );
}

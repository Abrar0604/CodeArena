'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Swords, Mail, Lock, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      router.push('/lobby');
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestPlay = () => {
    router.push('/lobby');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#050507] text-zinc-100">
      <div className="max-w-md w-full bg-zinc-950 border border-zinc-800 rounded-none p-8 space-y-6 relative">
        {/* Corner Accents */}
        <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-zinc-500" />
        <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-zinc-500" />
        <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-zinc-500" />
        <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-zinc-500" />

        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 bg-zinc-900 border border-zinc-700 mx-auto flex items-center justify-center rounded-none text-white">
            <Swords className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-black font-mono tracking-tight text-white uppercase">AUTHENTICATE COMBATANT</h1>
            <p className="text-xs text-zinc-400 font-mono">CODEARENA // KERNEL ACCESS</p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-none bg-rose-950/40 border border-rose-800 text-rose-400 text-xs font-mono text-center">
            [ERR: {errorMsg}]
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
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
            <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">SECRET KEY (PASSWORD)</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
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
            {loading ? 'VERIFYING CREDENTIALS...' : 'SIGN IN // AUTHORIZE'}
          </button>
        </form>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-zinc-800 w-full" />
          <span className="bg-zinc-950 px-2 text-[10px] uppercase font-mono text-zinc-500 absolute">
            OR
          </span>
        </div>

        {/* Guest Play */}
        <button
          onClick={handleGuestPlay}
          className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-mono font-bold text-xs uppercase tracking-wider rounded-none flex items-center justify-center gap-2 transition"
        >
          <span>CONTINUE AS GUEST GLADIATOR</span>
          <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
        </button>

        {/* Register link */}
        <p className="text-center text-xs text-zinc-500 font-mono">
          NO CREDENTIALS FOUND?{' '}
          <Link href="/register" className="text-zinc-300 hover:text-white underline underline-offset-4">
            CREATE COMBATANT ID
          </Link>
        </p>
      </div>
    </div>
  );
}

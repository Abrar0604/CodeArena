'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShieldAlert, KeyRound, Swords } from 'lucide-react';

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin/problems';

  const [secretKey, setSecretKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAuthorize = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret_key: secretKey }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Access denied');
      }

      // Successful authorization, redirect to target admin page
      router.push(from);
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid master credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-zinc-950 border border-zinc-800 p-8 space-y-6 relative">
      {/* Corner Accents */}
      <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-zinc-500" />
      <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-zinc-500" />
      <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-zinc-500" />
      <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-zinc-500" />

      {/* Security Header */}
      <div className="text-center space-y-2">
        <div className="w-10 h-10 bg-zinc-900 border border-zinc-700 mx-auto flex items-center justify-center text-rose-400">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h1 className="text-lg font-black tracking-tight text-white uppercase">
            RESTRICTED MASTER CONSOLE
          </h1>
          <p className="text-[10px] text-zinc-400 uppercase tracking-wider">
            AUTHORIZATION REQUIRED // LEVEL-0 ROOT
          </p>
        </div>
      </div>

      {/* Security Warning Notice */}
      <div className="p-3 bg-rose-950/20 border border-rose-900/60 text-rose-400 text-[11px] leading-relaxed">
        <span className="font-bold">[SECURITY NOTICE]:</span> This console manages the arena problem catalog and experimentation telemetry. Modifying URL paths does not grant access.
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs text-center font-bold">
          [{errorMsg.toUpperCase()}]
        </div>
      )}

      {/* Master Key Input Form */}
      <form onSubmit={handleAuthorize} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] text-zinc-400 uppercase tracking-wider">
            MASTER ACCESS KEY (ADMIN_SECRET_KEY)
          </label>
          <div className="relative">
            <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Enter root master key..."
              className="w-full pl-9 pr-3 py-2.5 bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-white hover:bg-zinc-200 text-black font-black text-xs uppercase tracking-widest border border-white transition disabled:opacity-50"
        >
          {loading ? 'VERIFYING MASTER KEY...' : 'AUTHORIZE ACCESS // UNLOCK'}
        </button>
      </form>

      <div className="pt-2 border-t border-zinc-800/80 text-center">
        <Link
          href="/lobby"
          className="text-xs text-zinc-400 hover:text-white uppercase flex items-center justify-center gap-1.5 transition"
        >
          <Swords className="w-3.5 h-3.5" />
          <span>RETURN TO ARENA LOBBY</span>
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#050507] text-zinc-100 font-mono">
      <Suspense
        fallback={
          <div className="p-8 text-center text-xs text-zinc-500 font-mono">
            [INITIALIZING SECURITY BARRIER...]
          </div>
        }
      >
        <AdminLoginContent />
      </Suspense>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Swords, Trophy, User, Plus, Target, BarChart3, LogOut } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { RatingBadge } from './RatingBadge';

export function Navbar() {
  const pathname = usePathname();
  const { user, mounted, isAuthenticated, logout } = useUser();

  const navLinks = [
    { href: '/lobby', label: 'LOBBY', icon: Swords, requiresAuth: true },
    { href: '/practice', label: 'PRACTICE', icon: Target, requiresAuth: true },
    { href: '/analytics', label: 'ANALYTICS', icon: BarChart3, requiresAuth: true },
    { href: '/leaderboard', label: 'LEADERBOARD', icon: Trophy, requiresAuth: true },
    { href: '/profile', label: 'PROFILE', icon: User, requiresAuth: true },
  ];

  const isArenaView =
    (pathname.startsWith('/battle/') && !pathname.endsWith('/results')) ||
    (pathname.startsWith('/practice/') && pathname !== '/practice');

  if (isArenaView) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-[#050507]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Brand Mark */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-zinc-900 border border-zinc-700 flex items-center justify-center transition group-hover:border-zinc-400">
            <Swords className="w-4 h-4 text-zinc-100" />
          </div>
          <div className="flex items-center gap-2 font-mono">
            <span className="font-black text-sm tracking-widest text-zinc-100 uppercase">
              CODEARENA
            </span>
            <span className="text-[10px] px-1 py-0.2 bg-zinc-900 border border-zinc-700 text-zinc-400 font-bold uppercase tracking-widest">
              1V1
            </span>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 h-full">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const targetHref =
              mounted && !isAuthenticated && link.requiresAuth
                ? `/login?redirectTo=${encodeURIComponent(link.href)}`
                : link.href;
            const isActive =
              pathname === link.href ||
              (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={targetHref}
                className={`relative flex items-center gap-1.5 px-3 h-14 text-xs font-mono font-bold tracking-wider transition ${
                  isActive
                    ? 'text-zinc-50 border-b-2 border-zinc-100 bg-zinc-900/30'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/20'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Status & Action CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          {mounted ? (
            isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <RatingBadge rating={user.rating} size="sm" />
                <Link
                  href="/profile"
                  className="flex items-center gap-2 p-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition"
                  title="View Gladiator Profile"
                >
                  <div className="w-5 h-5 bg-zinc-800 border border-zinc-700 overflow-hidden shrink-0">
                    <img
                      src={user.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.id}`}
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs font-mono font-medium text-zinc-300 max-w-[85px] truncate hidden md:inline pr-1">
                    {user.username}
                  </span>
                </Link>

                <button
                  onClick={() => logout()}
                  title="Sign Out"
                  className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>

                <Link
                  href="/lobby"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-white text-zinc-950 font-mono text-xs font-black tracking-wider uppercase border border-zinc-200 transition active:translate-y-[1px]"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span className="hidden sm:inline">FIND MATCH</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2 font-mono">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-xs font-bold tracking-wider uppercase text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 transition"
                >
                  SIGN IN
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-1.5 text-xs font-black tracking-wider uppercase text-zinc-950 bg-white hover:bg-zinc-200 border border-white transition active:translate-y-[1px] shadow-sm"
                >
                  SIGN UP
                </Link>
              </div>
            )
          ) : (
            <div className="h-8 w-24 bg-zinc-900/40 border border-zinc-800/40" />
          )}
        </div>
      </div>
    </header>
  );
}

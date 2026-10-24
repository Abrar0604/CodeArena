'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Swords, Trophy, User, Plus } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { RatingBadge } from './RatingBadge';

export function Navbar() {
  const pathname = usePathname();
  const { user, mounted } = useUser();

  const navLinks = [
    { href: '/lobby', label: 'LOBBY', icon: Swords },
    { href: '/leaderboard', label: 'LEADERBOARD', icon: Trophy },
    { href: '/profile', label: 'PROFILE', icon: User },
  ];

  const isBattlePage = pathname.startsWith('/battle/') && !pathname.endsWith('/results');

  if (isBattlePage) {
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
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
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
        <div className="flex items-center gap-3">
          {mounted && user && (
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
            </div>
          )}

          <Link
            href="/lobby"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-100 hover:bg-white text-zinc-950 font-mono text-xs font-black tracking-wider uppercase border border-zinc-200 transition active:translate-y-[1px]"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>FIND MATCH</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

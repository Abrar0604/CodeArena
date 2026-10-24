'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/types';

// Helper to get local guest profile
function getLocalGuestProfile(): Profile {
  if (typeof window === 'undefined') {
    return {
      id: 'guest_default',
      username: 'Coder_1001',
      avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=guest_default',
      rating: 1200,
      matches_played: 0,
      matches_won: 0,
      created_at: '2026-01-01T00:00:00.000Z',
    };
  }

  try {
    const stored = localStorage.getItem('codearena_guest_user');
    if (stored) return JSON.parse(stored);

    const guestId = 'guest_' + Math.random().toString(36).substring(2, 9);
    const guestNum = Math.floor(1000 + Math.random() * 9000);
    const newGuest: Profile = {
      id: guestId,
      username: `Coder_${guestNum}`,
      avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${guestId}`,
      rating: 1200,
      matches_played: 0,
      matches_won: 0,
      created_at: new Date().toISOString(),
    };
    localStorage.setItem('codearena_guest_user', JSON.stringify(newGuest));
    return newGuest;
  } catch {
    return {
      id: 'guest_fallback',
      username: 'Gladiator',
      rating: 1200,
      matches_played: 0,
      matches_won: 0,
      created_at: '2026-01-01T00:00:00.000Z',
    };
  }
}

export function useUser() {
  // Start identical on both server and client to guarantee 100% hydration consistency
  const [user, setUser] = useState<Profile | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setMounted(true);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isLive = supabaseUrl && !supabaseUrl.includes('placeholder');

    if (isLive) {
      async function checkAuth() {
        try {
          const supabase = createClient();
          const { data: { user: authUser } } = await supabase.auth.getUser();

          if (authUser) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', authUser.id)
              .maybeSingle();

            if (profile) {
              setUser(profile);
              setLoading(false);
              return;
            }
          }
        } catch {}

        setUser(getLocalGuestProfile());
        setLoading(false);
      }
      checkAuth();
    } else {
      setUser(getLocalGuestProfile());
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback((updates: Partial<Profile>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('codearena_guest_user', JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });
  }, []);

  return { user, loading, mounted, updateProfile };
}

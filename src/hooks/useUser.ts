'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/types';

export function useUser() {
  const [user, setUser] = useState<Profile | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isLive = supabaseUrl && !supabaseUrl.includes('placeholder');

    if (!isLive) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    const supabase = createClient();

    async function fetchProfile(userId: string, authUserEmail?: string, authUserMeta?: any) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (profile) {
          setUser(profile);
          setIsAuthenticated(true);
        } else {
          // If profile row doesn't exist yet, insert a default gladiator profile
          const defaultUsername =
            authUserMeta?.username ||
            (authUserEmail ? authUserEmail.split('@')[0] : 'Gladiator');

          const newProfile: Profile = {
            id: userId,
            username: defaultUsername,
            avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${userId}`,
            rating: 1200,
            matches_played: 0,
            matches_won: 0,
            created_at: new Date().toISOString(),
          };

          try {
            await supabase.from('profiles').insert([newProfile]);
          } catch {}

          setUser(newProfile);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }

    // Initial check
    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      if (authUser) {
        fetchProfile(authUser.id, authUser.email, authUser.user_metadata);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
      }
    });

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          fetchProfile(session.user.id, session.user.email, session.user.user_metadata);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = useCallback(async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, ...updates };
    });

    try {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        await supabase
          .from('profiles')
          .update(updates)
          .eq('id', authUser.id);
      }
    } catch (err) {
      console.error('Failed to sync profile update:', err);
    }
  }, []);

  return { user, loading, mounted, isAuthenticated, logout, updateProfile };
}

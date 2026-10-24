import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey || supabaseUrl.includes('placeholder')) {
      return NextResponse.json({ leaderboard: [] });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const { data: profiles, error } = await supabaseAdmin
      .from('profiles')
      .select('id, username, avatar_url, rating, matches_played, matches_won')
      .order('rating', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Leaderboard query error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const leaderboard = (profiles || []).map((p, index) => ({
      rank: index + 1,
      id: p.id,
      username: p.username || 'Combatant',
      avatar_url: p.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${p.id}`,
      rating: p.rating ?? 1200,
      matches_played: p.matches_played ?? 0,
      matches_won: p.matches_won ?? 0,
    }));

    return NextResponse.json({ leaderboard });
  } catch (err: any) {
    console.error('Leaderboard API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

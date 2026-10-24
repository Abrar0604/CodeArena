import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { SEED_PROBLEMS } from '@/lib/problems/data';

// In-memory queue and active battles for local development & multi-tab pairing
interface LocalQueueEntry {
  user_id: string;
  rating: number;
  joinedAt: number;
}

interface LocalBattle {
  id: string;
  player1_id: string;
  player2_id: string;
  problem_id: string;
  started_at: string;
}

const localQueue: LocalQueueEntry[] = [];
const localBattles: LocalBattle[] = [];

export async function POST(req: Request) {
  try {
    const { user_id, rating = 1200, allow_bot = true } = await req.json();

    if (!user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }

    const randomProblem = SEED_PROBLEMS[Math.floor(Math.random() * SEED_PROBLEMS.length)];
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseLive = supabaseUrl && !supabaseUrl.includes('placeholder');

    if (isSupabaseLive) {
      try {
        const supabase = createAdminClient();

        // Check if user is already in a battle
        const { data: activeBattle } = await supabase
          .from('battles')
          .select('*')
          .or(`player1_id.eq.${user_id},player2_id.eq.${user_id}`)
          .eq('status', 'in_progress')
          .maybeSingle();

        if (activeBattle) {
          return NextResponse.json({
            matched: true,
            battle_id: activeBattle.id,
            reconnected: true,
          });
        }

        // Look for a waiting player
        const { data: opponent } = await supabase
          .from('matchmaking_queue')
          .select('*')
          .eq('status', 'searching')
          .neq('user_id', user_id)
          .order('created_at', { ascending: true })
          .limit(1)
          .maybeSingle();

        if (opponent) {
          const { data: newBattle, error: battleErr } = await supabase
            .from('battles')
            .insert({
              player1_id: opponent.user_id,
              player2_id: user_id,
              problem_id: randomProblem.id,
              status: 'in_progress',
              started_at: new Date().toISOString(),
              time_limit_seconds: 900,
            })
            .select()
            .single();

          if (battleErr) throw battleErr;

          await supabase
            .from('matchmaking_queue')
            .update({ status: 'matched' })
            .in('user_id', [opponent.user_id, user_id]);

          return NextResponse.json({
            matched: true,
            battle_id: newBattle.id,
            opponent_id: opponent.user_id,
          });
        }

        await supabase.from('matchmaking_queue').upsert({
          user_id,
          status: 'searching',
          rating,
          created_at: new Date().toISOString(),
        });

        return NextResponse.json({
          matched: false,
          status: 'searching',
        });
      } catch (dbErr) {
        console.warn('Supabase matchmaking error, falling back to local queue:', dbErr);
      }
    }

    // High performance local memory queue (supports multi-tab testing & demo mode)
    // Clean old entries (> 60s)
    const now = Date.now();
    for (let i = localQueue.length - 1; i >= 0; i--) {
      if (now - localQueue[i].joinedAt > 60000) localQueue.splice(i, 1);
    }

    // Check if user is already in a local battle
    const existingBattle = localBattles.find(
      (b) => b.player1_id === user_id || b.player2_id === user_id
    );
    if (existingBattle) {
      return NextResponse.json({
        matched: true,
        battle_id: existingBattle.id,
        reconnected: true,
      });
    }

    // Check if another waiting player is in local queue
    const oppIdx = localQueue.findIndex((entry) => entry.user_id !== user_id);
    if (oppIdx !== -1) {
      const opp = localQueue.splice(oppIdx, 1)[0];
      const battleId = 'battle_' + Math.random().toString(36).substring(2, 10);
      const newBattle: LocalBattle = {
        id: battleId,
        player1_id: opp.user_id,
        player2_id: user_id,
        problem_id: randomProblem.id,
        started_at: new Date().toISOString(),
      };
      localBattles.push(newBattle);

      return NextResponse.json({
        matched: true,
        battle_id: battleId,
        opponent: {
          id: opp.user_id,
          username: `Gladiator_${opp.user_id.substring(0, 6)}`,
          rating: opp.rating,
        },
      });
    }

    // Otherwise, add to queue or generate instant match if allow_bot
    if (allow_bot) {
      const battleId = 'battle_' + Math.random().toString(36).substring(2, 10);
      return NextResponse.json({
        matched: true,
        battle_id: battleId,
        mock: true,
        problem_id: randomProblem.id,
        opponent: {
          id: 'bot_algo_master',
          username: 'CodeTitan',
          rating: rating + Math.floor(Math.random() * 60) - 30,
          avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=CodeTitan',
        },
      });
    }

    localQueue.push({ user_id, rating, joinedAt: now });
    return NextResponse.json({
      matched: false,
      status: 'searching',
    });
  } catch (err: any) {
    console.error('Matchmaking error:', err);
    return NextResponse.json({ error: err.message || 'Matchmaking failed' }, { status: 500 });
  }
}

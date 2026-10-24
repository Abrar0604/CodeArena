-- ========================================================
-- CodeArena Database Schema
-- Migration: 001_schema.sql
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  rating INT NOT NULL DEFAULT 1200,
  matches_played INT NOT NULL DEFAULT 0,
  matches_won INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. PROBLEMS TABLE
CREATE TABLE IF NOT EXISTS public.problems (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  description TEXT NOT NULL,
  constraints JSONB NOT NULL DEFAULT '{"time_limit_ms": 2000, "memory_limit_kb": 128000}'::jsonb,
  sample_test_cases JSONB NOT NULL DEFAULT '[]'::jsonb,
  hidden_test_cases JSONB NOT NULL DEFAULT '[]'::jsonb,
  optimal_benchmarks JSONB NOT NULL DEFAULT '{}'::jsonb,
  starter_code JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. MATCHMAKING QUEUE TABLE
CREATE TABLE IF NOT EXISTS public.matchmaking_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'searching' CHECK (status IN ('searching', 'matched', 'cancelled')),
  rating INT NOT NULL DEFAULT 1200,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. BATTLES TABLE
CREATE TABLE IF NOT EXISTS public.battles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player1_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  player2_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  problem_id UUID REFERENCES public.problems(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('waiting', 'in_progress', 'completed', 'abandoned')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  time_limit_seconds INT NOT NULL DEFAULT 900,
  winner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_draw BOOLEAN NOT NULL DEFAULT false,
  player1_score NUMERIC(5, 2) DEFAULT 0,
  player2_score NUMERIC(5, 2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  battle_id UUID REFERENCES public.battles(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  problem_id UUID REFERENCES public.problems(id) ON DELETE CASCADE NOT NULL,
  source_code TEXT NOT NULL,
  language_id INT NOT NULL,
  language_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  passed_test_cases INT NOT NULL DEFAULT 0,
  total_test_cases INT NOT NULL DEFAULT 0,
  execution_time_ms NUMERIC(10, 2) NOT NULL DEFAULT 0,
  memory_used_kb NUMERIC(10, 2) NOT NULL DEFAULT 0,
  correctness_score NUMERIC(5, 2) NOT NULL DEFAULT 0,
  speed_score NUMERIC(5, 2) NOT NULL DEFAULT 0,
  efficiency_score NUMERIC(5, 2) NOT NULL DEFAULT 0,
  total_score NUMERIC(5, 2) NOT NULL DEFAULT 0,
  test_results JSONB NOT NULL DEFAULT '[]'::jsonb,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. RATING HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.rating_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  battle_id UUID REFERENCES public.battles(id) ON DELETE CASCADE NOT NULL,
  old_rating INT NOT NULL,
  new_rating INT NOT NULL,
  change INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================================
-- INDEXES FOR PERFORMANCE
-- ========================================================
CREATE INDEX IF NOT EXISTS idx_matchmaking_queue_status ON public.matchmaking_queue(status, created_at);
CREATE INDEX IF NOT EXISTS idx_matchmaking_queue_user ON public.matchmaking_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_battles_players ON public.battles(player1_id, player2_id);
CREATE INDEX IF NOT EXISTS idx_battles_status ON public.battles(status);
CREATE INDEX IF NOT EXISTS idx_submissions_battle ON public.submissions(battle_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON public.submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_rating ON public.profiles(rating DESC);

-- ========================================================
-- REALTIME SUBSCRIPTIONS
-- ========================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.matchmaking_queue;
ALTER PUBLICATION supabase_realtime ADD TABLE public.battles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.submissions;

-- ========================================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matchmaking_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rating_history ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can view, user can update their own
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Problems: Readable by authenticated users
CREATE POLICY "Problems are viewable by everyone" ON public.problems FOR SELECT USING (true);

-- Matchmaking: User can manage their queue entries, read searching players
CREATE POLICY "Queue viewable by authenticated users" ON public.matchmaking_queue FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert into queue" ON public.matchmaking_queue FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their queue entry" ON public.matchmaking_queue FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their queue entry" ON public.matchmaking_queue FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Battles: Viewable if you are a participant or spectator
CREATE POLICY "Battles are viewable by everyone" ON public.battles FOR SELECT USING (true);
CREATE POLICY "Battles can be inserted" ON public.battles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Battles can be updated" ON public.battles FOR UPDATE TO authenticated USING (true);

-- Submissions: Viewable by battle participants
CREATE POLICY "Submissions viewable by everyone" ON public.submissions FOR SELECT USING (true);
CREATE POLICY "Users can insert their own submissions" ON public.submissions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Rating history: Viewable by everyone
CREATE POLICY "Rating history is viewable by everyone" ON public.rating_history FOR SELECT USING (true);

-- ========================================================
-- AUTOMATIC PROFILE CREATION TRIGGER
-- ========================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url, rating)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/bottts/svg?seed=' || NEW.id),
    1200
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================================================
-- MATCHMAKING TRIGGER FUNCTION
-- ========================================================
CREATE OR REPLACE FUNCTION public.match_players()
RETURNS TRIGGER AS $$
DECLARE
  v_opponent RECORD;
  v_new_battle_id UUID;
  v_problem_id UUID;
BEGIN
  -- Only trigger if this is a newly inserted 'searching' entry
  IF NEW.status != 'searching' THEN
    RETURN NEW;
  END IF;

  -- Search for an existing waiting opponent (not the same user)
  SELECT * INTO v_opponent
  FROM public.matchmaking_queue
  WHERE status = 'searching'
    AND user_id != NEW.user_id
    AND ABS(rating - NEW.rating) <= 300
  ORDER BY created_at ASC
  LIMIT 1
  FOR UPDATE SKIP LOCKED;

  IF FOUND THEN
    -- Pick a random problem
    SELECT id INTO v_problem_id
    FROM public.problems
    ORDER BY random()
    LIMIT 1;

    IF v_problem_id IS NOT NULL THEN
      -- Create the battle
      INSERT INTO public.battles (
        player1_id,
        player2_id,
        problem_id,
        status,
        started_at,
        time_limit_seconds
      ) VALUES (
        v_opponent.user_id,
        NEW.user_id,
        v_problem_id,
        'in_progress',
        NOW(),
        900
      ) RETURNING id INTO v_new_battle_id;

      -- Mark both queue entries as matched
      UPDATE public.matchmaking_queue
      SET status = 'matched'
      WHERE id IN (NEW.id, v_opponent.id);
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_player_join_queue
  AFTER INSERT ON public.matchmaking_queue
  FOR EACH ROW
  EXECUTE FUNCTION public.match_players();

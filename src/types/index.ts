export type LanguageKey = 'python' | 'javascript' | 'cpp' | 'java' | 'go';

export interface LanguageConfig {
  id: number;
  name: string;
  monacoLang: string;
  extension: string;
  defaultCode: string;
}

export type BattleStatus = 'waiting' | 'in_progress' | 'completed' | 'abandoned';

export type SubmissionStatus =
  | 'pending'
  | 'running'
  | 'accepted'
  | 'wrong_answer'
  | 'time_limit_exceeded'
  | 'memory_limit_exceeded'
  | 'runtime_error'
  | 'compilation_error';

export interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  rating: number;
  matches_played: number;
  matches_won: number;
  created_at: string;
}

export interface TestCase {
  id: number;
  input: string;
  expected_output: string;
  is_hidden?: boolean;
}

export interface ProblemBenchmarks {
  optimal_time_ms: number;
  optimal_memory_kb: number;
}

export interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  constraints: {
    time_limit_ms: number;
    memory_limit_kb: number;
  };
  sample_test_cases: TestCase[];
  hidden_test_cases: TestCase[];
  optimal_benchmarks: Record<LanguageKey, ProblemBenchmarks>;
  starter_code: Record<LanguageKey, string>;
}

export interface BattlePlayer {
  id: string;
  username: string;
  avatar_url?: string;
  rating: number;
}

export interface Battle {
  id: string;
  player1_id: string;
  player2_id: string;
  player1?: BattlePlayer;
  player2?: BattlePlayer;
  problem_id: string;
  problem?: Problem;
  status: BattleStatus;
  started_at: string;
  ended_at?: string;
  time_limit_seconds: number;
  winner_id?: string | null;
  is_draw: boolean;
  player1_score?: number;
  player2_score?: number;
}

export interface TestResult {
  test_case_id: number;
  passed: boolean;
  input: string;
  expected_output: string;
  actual_output?: string;
  error?: string;
  execution_time_ms?: number;
  memory_used_kb?: number;
  status_description: string;
}

export interface Submission {
  id: string;
  battle_id: string;
  user_id: string;
  problem_id: string;
  source_code: string;
  language_id: number;
  language_name: string;
  status: SubmissionStatus;
  passed_test_cases: number;
  total_test_cases: number;
  execution_time_ms: number;
  memory_used_kb: number;
  correctness_score: number;
  speed_score: number;
  efficiency_score: number;
  total_score: number;
  test_results: TestResult[];
  submitted_at: string;
}

export interface MatchmakingQueueEntry {
  id: string;
  user_id: string;
  status: 'searching' | 'matched' | 'cancelled';
  rating: number;
  created_at: string;
}

export interface RatingHistoryEntry {
  id: string;
  user_id: string;
  battle_id: string;
  old_rating: number;
  new_rating: number;
  change: number;
  created_at: string;
}

export interface BattleOpponentProgress {
  userId: string;
  testsPassed: number;
  totalTests: number;
  lastScore?: number;
  submittedAt?: string;
}

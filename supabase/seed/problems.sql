-- ========================================================
-- CodeArena Seed Problems
-- ========================================================

INSERT INTO public.problems (id, title, slug, difficulty, description, constraints, sample_test_cases, hidden_test_cases, optimal_benchmarks, starter_code)
VALUES
(
  'p1111111-1111-1111-1111-111111111111',
  'Two Sum',
  'two-sum',
  'easy',
  'Given an array of integers `nums` and an integer `target`, return the **indices** of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.\n\nOutput the two indices separated by a space in ascending order.',
  '{"time_limit_ms": 1000, "memory_limit_kb": 64000}'::jsonb,
  '[{"id": 1, "input": "4\\n2 7 11 15\\n9", "expected_output": "0 1", "is_hidden": false}, {"id": 2, "input": "3\\n3 2 4\\n6", "expected_output": "1 2", "is_hidden": false}]'::jsonb,
  '[{"id": 3, "input": "2\\n3 3\\n6", "expected_output": "0 1", "is_hidden": true}, {"id": 4, "input": "5\\n1 5 3 7 9\\n12", "expected_output": "1 3", "is_hidden": true}]'::jsonb,
  '{"python": {"optimal_time_ms": 25, "optimal_memory_kb": 4500}, "javascript": {"optimal_time_ms": 30, "optimal_memory_kb": 5500}, "cpp": {"optimal_time_ms": 2, "optimal_memory_kb": 1200}}'::jsonb,
  '{"python": "import sys\\n\\ndef solve():\\n    # Your solution\\n    pass\\n\\nsolve()\\n"}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.problems (id, title, slug, difficulty, description, constraints, sample_test_cases, hidden_test_cases, optimal_benchmarks, starter_code)
VALUES
(
  'p2222222-2222-2222-2222-222222222222',
  'Valid Parentheses',
  'valid-parentheses',
  'easy',
  'Given a string `s` containing just the characters `''(''`, `'')''`, `''{''`, `''}''`, `''[''` and `'']''`, determine if the input string is valid.\n\nPrint `true` if valid, otherwise `false`.',
  '{"time_limit_ms": 1000, "memory_limit_kb": 64000}'::jsonb,
  '[{"id": 1, "input": "()[]{}", "expected_output": "true", "is_hidden": false}, {"id": 2, "input": "(]", "expected_output": "false", "is_hidden": false}]'::jsonb,
  '[{"id": 3, "input": "([{}])", "expected_output": "true", "is_hidden": true}]'::jsonb,
  '{"python": {"optimal_time_ms": 20, "optimal_memory_kb": 4200}, "javascript": {"optimal_time_ms": 25, "optimal_memory_kb": 5000}, "cpp": {"optimal_time_ms": 2, "optimal_memory_kb": 1000}}'::jsonb,
  '{"python": "import sys\\n\\ndef solve():\\n    # Your solution\\n    pass\\n\\nsolve()\\n"}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

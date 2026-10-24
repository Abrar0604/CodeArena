'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Code2,
  Plus,
  Play,
  CheckCircle2,
  XCircle,
  Trash2,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Layers,
  Terminal,
} from 'lucide-react';
import { Problem, TestCase } from '@/types';

// Pre-built problem templates for instant 1-click commissioning
const PROBLEM_TEMPLATES = {
  array_two_pointer: {
    title: 'Container With Most Water',
    slug: 'container-with-most-water',
    difficulty: 'medium' as const,
    description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i\`-th line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.

### Input Format
- First line contains integer \`N\`, the number of lines.
- Second line contains \`N\` space-separated integers representing \`height\`.

### Output Format
- Single integer representing maximum water capacity.`,
    sample_test_cases: [
      { id: 1, input: '9\n1 8 6 2 5 4 8 3 7', expected_output: '49' },
      { id: 2, input: '2\n1 1', expected_output: '1' },
    ],
    hidden_test_cases: [
      { id: 101, input: '4\n4 3 2 1 4', expected_output: '16' },
      { id: 102, input: '5\n1 2 4 3', expected_output: '4' },
      { id: 103, input: '6\n2 3 4 5 18 17 6', expected_output: '17' },
    ],
    reference_code: `import sys

def solve():
    lines = sys.stdin.read().splitlines()
    if not lines:
        return
    n = int(lines[0])
    h = list(map(int, lines[1].split()))
    left, right = 0, n - 1
    max_area = 0
    while left < right:
        width = right - left
        area = min(h[left], h[right]) * width
        if area > max_area:
            max_area = area
        if h[left] < h[right]:
            left += 1
        else:
            right -= 1
    print(max_area)

if __name__ == '__main__':
    solve()`,
  },
  binary_search: {
    title: 'Search in Rotated Sorted Array',
    slug: 'search-in-rotated-sorted-array',
    difficulty: 'medium' as const,
    description: `Given an integer array \`nums\` sorted in ascending order (with distinct values) that is possibly rotated at an unknown pivot index, and a \`target\` value, return the index of \`target\` if it is in \`nums\`, or \`-1\` if it is not in \`nums\`.

You must write an algorithm with **O(log n)** runtime complexity.

### Input Format
- First line contains integer \`N\`.
- Second line contains \`N\` space-separated integers representing the rotated array.
- Third line contains integer \`target\`.

### Output Format
- Print the 0-indexed position, or -1 if not found.`,
    sample_test_cases: [
      { id: 1, input: '7\n4 5 6 7 0 1 2\n0', expected_output: '4' },
      { id: 2, input: '7\n4 5 6 7 0 1 2\n3', expected_output: '-1' },
    ],
    hidden_test_cases: [
      { id: 101, input: '1\n1\n0', expected_output: '-1' },
      { id: 102, input: '3\n5 1 3\n5', expected_output: '0' },
      { id: 103, input: '4\n3 5 1 2\n1', expected_output: '2' },
    ],
    reference_code: `import sys

def solve():
    lines = sys.stdin.read().splitlines()
    if not lines:
        return
    n = int(lines[0])
    nums = list(map(int, lines[1].split()))
    target = int(lines[2])
    low, high = 0, n - 1
    ans = -1
    while low <= high:
        mid = (low + high) // 2
        if nums[mid] == target:
            ans = mid
            break
        if nums[low] <= nums[mid]:
            if nums[low] <= target < nums[mid]:
                high = mid - 1
            else:
                low = mid + 1
        else:
            if nums[mid] < target <= nums[high]:
                low = mid + 1
            else:
                high = mid - 1
    print(ans)

if __name__ == '__main__':
    solve()`,
  },
  dynamic_programming: {
    title: 'Coin Change Minimum Coins',
    slug: 'coin-change-minimum-coins',
    difficulty: 'hard' as const,
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

### Input Format
- First line contains integer \`N\`, number of coin types.
- Second line contains \`N\` space-separated integers.
- Third line contains integer \`amount\`.

### Output Format
- Minimum number of coins or -1.`,
    sample_test_cases: [
      { id: 1, input: '3\n1 2 5\n11', expected_output: '3' },
      { id: 2, input: '1\n2\n3', expected_output: '-1' },
    ],
    hidden_test_cases: [
      { id: 101, input: '1\n1\n0', expected_output: '0' },
      { id: 102, input: '2\n2 5\n10', expected_output: '2' },
      { id: 103, input: '3\n186 419 83\n6249', expected_output: '20' },
    ],
    reference_code: `import sys

def solve():
    lines = sys.stdin.read().splitlines()
    if not lines:
        return
    n = int(lines[0])
    coins = list(map(int, lines[1].split()))
    amount = int(lines[2])
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for x in range(coin, amount + 1):
            dp[x] = min(dp[x], dp[x - coin] + 1)
    ans = dp[amount] if dp[amount] != float('inf') else -1
    print(ans)

if __name__ == '__main__':
    solve()`,
  },
};

export default function MasterProblemsPage() {
  // Master authorization guard
  const [isUnlocked, setIsUnlocked] = useState<boolean>(true);
  const [passcodeInput, setPasscodeInput] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Tabs: 'create' | 'catalog'
  const [activeTab, setActiveTab] = useState<'create' | 'catalog'>('create');

  // Existing problems catalog
  const [catalog, setCatalog] = useState<Problem[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState<boolean>(false);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [description, setDescription] = useState('');
  const [timeLimitMs, setTimeLimitMs] = useState(1000);
  const [memoryLimitKb, setMemoryLimitKb] = useState(64000);

  // Test cases
  const [sampleCases, setSampleCases] = useState<{ id: number; input: string; expected_output: string }[]>([
    { id: 1, input: '', expected_output: '' },
    { id: 2, input: '', expected_output: '' },
  ]);
  const [hiddenCases, setHiddenCases] = useState<{ id: number; input: string; expected_output: string }[]>([
    { id: 101, input: '', expected_output: '' },
    { id: 102, input: '', expected_output: '' },
  ]);

  // Verification & Sandbox runner
  const [refCode, setRefCode] = useState<string>(`import sys\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    # Your solution logic\n    pass\n\nif __name__ == '__main__':\n    solve()\n`);
  const [refLang, setRefLang] = useState<string>('python');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);

  // Save status
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchCatalog = async () => {
    setLoadingCatalog(true);
    try {
      const res = await fetch('/api/admin/problems');
      const data = await res.json();
      if (data.success && data.problems) {
        setCatalog(data.problems);
      }
    } catch (err) {
      console.error('Failed to load problems:', err);
    } finally {
      setLoadingCatalog(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(val.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'));
  };

  const handleApplyTemplate = (key: keyof typeof PROBLEM_TEMPLATES) => {
    const tmpl = PROBLEM_TEMPLATES[key];
    setTitle(tmpl.title);
    setSlug(tmpl.slug);
    setDifficulty(tmpl.difficulty);
    setDescription(tmpl.description);
    setSampleCases(tmpl.sample_test_cases);
    setHiddenCases(tmpl.hidden_test_cases);
    setRefCode(tmpl.reference_code);
    setRefLang('python');
    setVerificationResult(null);
    setSaveMessage(null);
  };

  const handleVerifySuite = async () => {
    setIsVerifying(true);
    setVerificationResult(null);
    setSaveMessage(null);

    const allCases = [
      ...sampleCases.map((tc) => ({ ...tc, is_hidden: false })),
      ...hiddenCases.map((tc) => ({ ...tc, is_hidden: true })),
    ].filter((tc) => tc.input.trim() !== '');

    if (allCases.length === 0) {
      setSaveMessage({ type: 'error', text: 'Please add at least one test case to verify.' });
      setIsVerifying(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/problems/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_code: refCode,
          language: refLang,
          test_cases: allCases,
        }),
      });

      const data = await res.json();
      setVerificationResult(data);
    } catch (err: any) {
      setSaveMessage({ type: 'error', text: err.message || 'Verification failed.' });
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePublishProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);

    const validSample = sampleCases.filter((tc) => tc.input.trim() !== '');
    const validHidden = hiddenCases.filter((tc) => tc.input.trim() !== '');

    if (!title.trim() || !description.trim()) {
      setSaveMessage({ type: 'error', text: 'Title and description are required.' });
      setIsSaving(false);
      return;
    }

    if (validSample.length === 0) {
      setSaveMessage({ type: 'error', text: 'Please define at least 1 sample test case.' });
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/problems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          difficulty,
          description,
          constraints: {
            time_limit_ms: Number(timeLimitMs),
            memory_limit_kb: Number(memoryLimitKb),
          },
          sample_test_cases: validSample,
          hidden_test_cases: validHidden,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to publish problem');
      }

      setSaveMessage({
        type: 'success',
        text: `✓ Problem "${title}" successfully commissioned into live arena catalog!`,
      });
      fetchCatalog();
    } catch (err: any) {
      setSaveMessage({ type: 'error', text: err.message || 'Failed to publish problem.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProblem = async (slugToDelete: string) => {
    if (!confirm(`Are you sure you want to delete problem [${slugToDelete}]?`)) return;

    try {
      const res = await fetch(`/api/admin/problems?slug=${slugToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        setCatalog((prev) => prev.filter((p) => p.slug !== slugToDelete));
      }
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] text-zinc-100 py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header HUD */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-zinc-900 border border-zinc-700 text-white rounded-none">
                <Code2 className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white uppercase">
                MASTER PROBLEM STUDIO
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-zinc-900 text-emerald-400 border border-emerald-800">
                [MASTER_AUTH // ROOT]
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              SPECIFICATION AUTHORING // PISTON VERIFICATION // REALTIME PROBLEM COMMISSIONING
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-3 py-2 border font-bold uppercase tracking-wider transition ${
                activeTab === 'create'
                  ? 'bg-white text-black border-white'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> COMMISSION PROBLEM
              </span>
            </button>
            <button
              onClick={() => {
                setActiveTab('catalog');
                fetchCatalog();
              }}
              className={`px-3 py-2 border font-bold uppercase tracking-wider transition ${
                activeTab === 'catalog'
                  ? 'bg-white text-black border-white'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> CATALOG ({catalog.length})
              </span>
            </button>
          </div>
        </div>

        {/* Tab 1: Create / Commission Form */}
        {activeTab === 'create' && (
          <div className="space-y-8">
            {/* Quick Templates Bar */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-300 uppercase">
                <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                <span>QUICK GENERATE VIA VERIFIED TEMPLATES:</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('array_two_pointer')}
                  className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white text-[11px] uppercase transition"
                >
                  [TEMPLATE: TWO POINTERS / WATER CONTAINER]
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('binary_search')}
                  className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white text-[11px] uppercase transition"
                >
                  [TEMPLATE: ROTATED BINARY SEARCH]
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('dynamic_programming')}
                  className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white text-[11px] uppercase transition"
                >
                  [TEMPLATE: DP COIN CHANGE]
                </button>
              </div>
            </div>

            {/* Notification message */}
            {saveMessage && (
              <div
                className={`p-3.5 border font-mono text-xs ${
                  saveMessage.type === 'success'
                    ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-800 text-rose-400'
                }`}
              >
                {saveMessage.text}
              </div>
            )}

            <form onSubmit={handlePublishProblem} className="space-y-8">
              {/* Problem Metadata Card */}
              <div className="p-6 bg-zinc-950 border border-zinc-800 space-y-5">
                <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
                  <h2 className="text-xs font-mono font-bold tracking-wider text-zinc-200 uppercase flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-zinc-400" />
                    <span>[01 // PROBLEM METADATA & CONSTRAINTS]</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[10px] text-zinc-400 uppercase tracking-wider">PROBLEM TITLE</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. Trapping Rain Water"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 text-white text-xs font-mono focus:outline-none focus:border-white transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 uppercase tracking-wider">DIFFICULTY</label>
                    <div className="grid grid-cols-3 gap-1">
                      {(['easy', 'medium', 'hard'] as const).map((diff) => (
                        <button
                          key={diff}
                          type="button"
                          onClick={() => setDifficulty(diff)}
                          className={`py-2 text-[10px] font-bold uppercase tracking-wider border transition ${
                            difficulty === diff
                              ? diff === 'easy'
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                                : diff === 'medium'
                                ? 'bg-amber-950 text-amber-300 border-amber-600'
                                : 'bg-rose-950 text-rose-300 border-rose-600'
                              : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                          }`}
                        >
                          {diff}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[10px] text-zinc-400 uppercase tracking-wider">URL SLUG</label>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="trapping-rain-water"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-mono focus:outline-none focus:border-white transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-400 uppercase tracking-wider">TIME (MS)</label>
                      <input
                        type="number"
                        value={timeLimitMs}
                        onChange={(e) => setTimeLimitMs(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 text-white text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-400 uppercase tracking-wider">MEMORY (KB)</label>
                      <input
                        type="number"
                        value={memoryLimitKb}
                        onChange={(e) => setMemoryLimitKb(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1 font-mono">
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider">
                    SPECIFICATION / STATEMENT (MARKDOWN FORMAT WITH INPUT & OUTPUT SPEC)
                  </label>
                  <textarea
                    rows={8}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide complete problem formulation, stdin format, and stdout format..."
                    className="w-full p-3 bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs font-mono leading-relaxed focus:outline-none focus:border-white transition"
                  />
                </div>
              </div>

              {/* Test Cases Studio */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sample Test Cases (Public) */}
                <div className="p-6 bg-zinc-950 border border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3 font-mono">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      [02 // SAMPLE TEST CASES (VISIBLE TO PLAYERS)]
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setSampleCases((prev) => [
                          ...prev,
                          { id: prev.length + 1, input: '', expected_output: '' },
                        ])
                      }
                      className="text-[10px] text-zinc-300 hover:text-white uppercase flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> ADD SAMPLE
                    </button>
                  </div>

                  <div className="space-y-4">
                    {sampleCases.map((tc, idx) => (
                      <div key={tc.id} className="p-3 bg-zinc-900/80 border border-zinc-800 space-y-2 font-mono text-xs">
                        <div className="flex items-center justify-between text-[10px] text-zinc-400">
                          <span>SAMPLE #{idx + 1}</span>
                          {sampleCases.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setSampleCases((prev) => prev.filter((_, i) => i !== idx))}
                              className="text-rose-400 hover:text-rose-300"
                            >
                              [REMOVE]
                            </button>
                          )}
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-zinc-500 uppercase">STDIN INPUT</label>
                          <textarea
                            rows={2}
                            value={tc.input}
                            onChange={(e) => {
                              const val = e.target.value;
                              setSampleCases((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, input: val } : item))
                              );
                            }}
                            placeholder="e.g. 4\n2 7 11 15\n9"
                            className="w-full p-2 bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-zinc-500 uppercase">EXPECTED STDOUT</label>
                          <input
                            type="text"
                            value={tc.expected_output}
                            onChange={(e) => {
                              const val = e.target.value;
                              setSampleCases((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, expected_output: val } : item))
                              );
                            }}
                            placeholder="e.g. 0 1"
                            className="w-full p-2 bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-mono"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hidden Test Cases (Anti-cheat & Scoring) */}
                <div className="p-6 bg-zinc-950 border border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3 font-mono">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      [03 // HIDDEN TEST CASES (ANTI-CHEAT EVALUATION)]
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setHiddenCases((prev) => [
                          ...prev,
                          { id: prev.length + 101, input: '', expected_output: '' },
                        ])
                      }
                      className="text-[10px] text-zinc-300 hover:text-white uppercase flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> ADD HIDDEN
                    </button>
                  </div>

                  <div className="space-y-4">
                    {hiddenCases.map((tc, idx) => (
                      <div key={tc.id} className="p-3 bg-zinc-900/80 border border-zinc-800 space-y-2 font-mono text-xs">
                        <div className="flex items-center justify-between text-[10px] text-zinc-400">
                          <span>HIDDEN #{idx + 1}</span>
                          {hiddenCases.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setHiddenCases((prev) => prev.filter((_, i) => i !== idx))}
                              className="text-rose-400 hover:text-rose-300"
                            >
                              [REMOVE]
                            </button>
                          )}
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-zinc-500 uppercase">STDIN INPUT</label>
                          <textarea
                            rows={2}
                            value={tc.input}
                            onChange={(e) => {
                              const val = e.target.value;
                              setHiddenCases((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, input: val } : item))
                              );
                            }}
                            placeholder="e.g. edge-case stdin"
                            className="w-full p-2 bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-zinc-500 uppercase">EXPECTED STDOUT</label>
                          <input
                            type="text"
                            value={tc.expected_output}
                            onChange={(e) => {
                              const val = e.target.value;
                              setHiddenCases((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, expected_output: val } : item))
                              );
                            }}
                            placeholder="e.g. expected answer"
                            className="w-full p-2 bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-mono"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Verification Console (Piston Pre-Flight Test) */}
              <div className="p-6 bg-zinc-950 border border-zinc-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3 font-mono">
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      [04 // REFERENCE SOLUTION & PISTON VERIFICATION]
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={refLang}
                      onChange={(e) => setRefLang(e.target.value)}
                      className="px-2 py-1 bg-zinc-900 border border-zinc-700 text-xs text-white font-mono"
                    >
                      <option value="python">Python 3</option>
                      <option value="javascript">JavaScript</option>
                    </select>

                    <button
                      type="button"
                      disabled={isVerifying}
                      onClick={handleVerifySuite}
                      className="px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-600 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition disabled:opacity-50"
                    >
                      <Play className="w-3 h-3 fill-emerald-400" />
                      <span>{isVerifying ? 'VERIFYING...' : 'RUN VERIFICATION'}</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1 font-mono">
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider">
                    REFERENCE IMPLEMENTATION (WILL BE TESTED AGAINST ALL SAMPLE & HIDDEN TEST CASES)
                  </label>
                  <textarea
                    rows={8}
                    value={refCode}
                    onChange={(e) => setRefCode(e.target.value)}
                    className="w-full p-3 bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs font-mono leading-relaxed"
                  />
                </div>

                {/* Verification Results Matrix */}
                {verificationResult && (
                  <div className="p-4 bg-zinc-900/60 border border-zinc-800 space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {verificationResult.allPassed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400" />
                        )}
                        <span className="font-bold text-white uppercase">
                          SUITE STATUS: {verificationResult.allPassed ? 'ALL TEST CASES PASSED' : 'SOME TEST CASES FAILED'}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          ({verificationResult.passedCount} / {verificationResult.totalCount})
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                      {verificationResult.results?.map((r: any) => (
                        <div
                          key={r.index}
                          className={`p-2 border text-[11px] flex items-center justify-between ${
                            r.passed
                              ? 'bg-emerald-950/20 border-emerald-800/60 text-emerald-300'
                              : 'bg-rose-950/20 border-rose-800/60 text-rose-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold">[{r.type} #{r.index}]</span>
                            <span>{r.status}</span>
                            {!r.passed && (
                              <span className="text-[10px] text-zinc-400">
                                Expected: &quot;{r.expected_output}&quot; | Received: &quot;{r.actual_output || r.error}&quot;
                              </span>
                            )}
                          </div>
                          <div className="text-right text-[10px] text-zinc-400 tabular-nums">
                            {r.time_ms}ms // {r.memory_kb}KB
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Publish CTA Button */}
              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3.5 bg-white hover:bg-zinc-200 text-black font-mono font-black text-xs uppercase tracking-widest border border-white transition disabled:opacity-50"
              >
                {isSaving ? 'COMMISSIONING PROBLEM TO ARENA...' : 'PUBLISH PROBLEM TO LIVE ARENA'}
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Catalog Inventory */}
        {activeTab === 'catalog' && (
          <div className="space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                LIVE ARENA CATALOG ({catalog.length} PROBLEMS REGISTERED)
              </span>
              <button
                onClick={fetchCatalog}
                className="text-[10px] text-zinc-400 hover:text-white uppercase flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> REFRESH
              </button>
            </div>

            {loadingCatalog ? (
              <div className="py-12 text-center text-xs text-zinc-500">
                LOADING ARENA PROBLEM INVENTORY...
              </div>
            ) : catalog.length === 0 ? (
              <div className="py-12 text-center text-xs text-zinc-500">
                NO PROBLEMS FOUND IN CATALOG.
              </div>
            ) : (
              <div className="space-y-2">
                {catalog.map((p) => (
                  <div
                    key={p.slug}
                    className="p-4 bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:border-zinc-700"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white uppercase">{p.title}</span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                            p.difficulty === 'easy'
                              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                              : p.difficulty === 'medium'
                              ? 'bg-amber-950/60 text-amber-400 border-amber-800'
                              : 'bg-rose-950/60 text-rose-400 border-rose-800'
                          }`}
                        >
                          [{p.difficulty}]
                        </span>
                        <span className="text-xs text-zinc-500">[{p.slug}]</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 line-clamp-1 font-sans">
                        {p.description.replace(/[#*`]/g, '')}
                      </p>
                      <div className="text-[10px] text-zinc-500 flex items-center gap-3 pt-1">
                        <span>TEST CASES: {p.sample_test_cases?.length || 0} Sample / {p.hidden_test_cases?.length || 0} Hidden</span>
                        <span>LIMIT: {p.constraints?.time_limit_ms || 1000}ms</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleDeleteProblem(p.slug)}
                        className="px-2.5 py-1.5 bg-zinc-900 hover:bg-rose-950/60 border border-zinc-800 hover:border-rose-800 text-zinc-400 hover:text-rose-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>DELETE</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

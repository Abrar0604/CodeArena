import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { SEED_PROBLEMS } from '@/lib/problems/data';
import { Problem } from '@/types';
import fs from 'fs';
import path from 'path';

const CUSTOM_PROBLEMS_FILE = path.join(process.cwd(), 'src/lib/problems/custom_problems.json');

function getCustomProblems(): Problem[] {
  try {
    if (fs.existsSync(CUSTOM_PROBLEMS_FILE)) {
      const data = fs.readFileSync(CUSTOM_PROBLEMS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading custom problems file:', err);
  }
  return [];
}

function saveCustomProblems(problems: Problem[]) {
  try {
    const dir = path.dirname(CUSTOM_PROBLEMS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CUSTOM_PROBLEMS_FILE, JSON.stringify(problems, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing custom problems file:', err);
  }
}

function normalizeProblem(item: any): Problem {
  const title = (item.title || 'Untitled Problem').trim();
  const slug = item.slug?.trim()
    ? item.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
    : title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return {
    id: item.id || `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title,
    slug,
    difficulty: (['easy', 'medium', 'hard'].includes(item.difficulty?.toLowerCase())
      ? item.difficulty.toLowerCase()
      : 'medium') as 'easy' | 'medium' | 'hard',
    description: item.description || 'No description provided.',
    constraints: item.constraints || {
      time_limit_ms: 1000,
      memory_limit_kb: 64000,
    },
    sample_test_cases: (item.sample_test_cases || []).map((tc: any, idx: number) => ({
      id: tc.id || idx + 1,
      input: String(tc.input ?? ''),
      expected_output: String(tc.expected_output ?? '').trim(),
      is_hidden: false,
    })),
    hidden_test_cases: (item.hidden_test_cases || []).map((tc: any, idx: number) => ({
      id: tc.id || idx + 101,
      input: String(tc.input ?? ''),
      expected_output: String(tc.expected_output ?? '').trim(),
      is_hidden: true,
    })),
    starter_code: item.starter_code || {
      python: `import sys\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    # Solution for ${title}\n    pass\n\nif __name__ == '__main__':\n    solve()\n`,
      javascript: `const fs = require('fs');\n\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim();\n    // Solution for ${title}\n}\n\nsolve();\n`,
      cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Solution for ${title}\n    return 0;\n}\n`,
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Solution for ${title}\n    }\n}\n`,
      go: `package main\nimport "fmt"\n\nfunc main() {\n    // Solution for ${title}\n}\n`,
    },
    optimal_benchmarks: item.optimal_benchmarks || {
      python: { optimal_time_ms: 40, optimal_memory_kb: 4096 },
      javascript: { optimal_time_ms: 30, optimal_memory_kb: 4096 },
      cpp: { optimal_time_ms: 10, optimal_memory_kb: 2048 },
      java: { optimal_time_ms: 50, optimal_memory_kb: 8192 },
      go: { optimal_time_ms: 20, optimal_memory_kb: 3072 },
    },
  };
}

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isLive = supabaseUrl && !supabaseUrl.includes('placeholder');

    if (isLive) {
      try {
        const supabase = createAdminClient();
        const { data: dbProblems, error } = await supabase
          .from('problems')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && dbProblems && dbProblems.length > 0) {
          return NextResponse.json({
            success: true,
            source: 'supabase',
            problems: dbProblems,
          });
        }
      } catch (dbErr) {
        console.warn('Supabase fetch failed, falling back to local files:', dbErr);
      }
    }

    // Local / fallback mode
    const custom = getCustomProblems();
    const all = [...custom, ...SEED_PROBLEMS];

    return NextResponse.json({
      success: true,
      source: 'local',
      problems: all,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch problems' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Check if input is an array (bulk import) or a single problem object
    let incomingList: any[] = [];
    if (Array.isArray(body)) {
      incomingList = body;
    } else if (body && Array.isArray(body.problems)) {
      incomingList = body.problems;
    } else if (body && typeof body === 'object') {
      incomingList = [body];
    }

    if (incomingList.length === 0) {
      return NextResponse.json({ error: 'No problem data provided.' }, { status: 400 });
    }

    const normalizedProblems: Problem[] = incomingList.map(normalizeProblem);

    // 1. Save to Supabase if live
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isLive = supabaseUrl && !supabaseUrl.includes('placeholder');
    let savedToDatabase = false;

    if (isLive) {
      try {
        const supabase = createAdminClient();
        const recordsToInsert = normalizedProblems.map((p) => ({
          title: p.title,
          slug: p.slug,
          difficulty: p.difficulty,
          description: p.description,
          constraints: p.constraints,
          sample_test_cases: p.sample_test_cases,
          hidden_test_cases: p.hidden_test_cases,
          optimal_benchmarks: p.optimal_benchmarks,
          starter_code: p.starter_code,
        }));

        const { error } = await supabase.from('problems').upsert(recordsToInsert, { onConflict: 'slug' });
        if (!error) savedToDatabase = true;
      } catch (dbErr) {
        console.warn('Could not persist to Supabase:', dbErr);
      }
    }

    // 2. Save to local custom_problems.json
    const existing = getCustomProblems();
    const newSlugs = new Set(normalizedProblems.map((p) => p.slug));
    const merged = [...normalizedProblems, ...existing.filter((p) => !newSlugs.has(p.slug))];
    saveCustomProblems(merged);

    return NextResponse.json({
      success: true,
      count: normalizedProblems.length,
      problems: normalizedProblems,
      savedToDatabase,
      savedToLocal: true,
    });
  } catch (err: any) {
    console.error('Error creating problem:', err);
    return NextResponse.json({ error: err.message || 'Creation failed' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter is required.' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isLive = supabaseUrl && !supabaseUrl.includes('placeholder');
    if (isLive) {
      try {
        const supabase = createAdminClient();
        await supabase.from('problems').delete().eq('slug', slug);
      } catch {}
    }

    const existing = getCustomProblems();
    const filtered = existing.filter((p) => p.slug !== slug);
    saveCustomProblems(filtered);

    return NextResponse.json({ success: true, deletedSlug: slug });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Deletion failed' }, { status: 500 });
  }
}

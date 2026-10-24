import { NextResponse, type NextRequest } from 'next/server';
import { getAllAvailableProblems, getProblemBySlugOrId } from '@/lib/problems/catalog';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const difficulty = searchParams.get('difficulty');

    // 1. If specific problem requested by slug/id
    if (slug) {
      // First check local catalog
      let problem = getProblemBySlugOrId(slug);

      // If not found and Supabase is configured, check database
      if (!problem) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder')) {
          const supabase = createClient(supabaseUrl, supabaseKey);
          const { data } = await supabase
            .from('problems')
            .select('*')
            .or(`slug.eq.${slug},id.eq.${slug}`)
            .maybeSingle();

          if (data) {
            problem = data;
          }
        }
      }

      if (!problem) {
        return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
      }

      return NextResponse.json({ problem });
    }

    // 2. Return full catalog list
    let problems = getAllAvailableProblems();

    // Check if Supabase has additional problems
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder')) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data: dbProblems } = await supabase
          .from('problems')
          .select('id, title, slug, difficulty, description, constraints, optimal_benchmarks, created_at')
          .order('created_at', { ascending: false });

        if (dbProblems && dbProblems.length > 0) {
          const existingSlugs = new Set(problems.map((p) => p.slug));
          const newFromDb = dbProblems.filter((p: any) => !existingSlugs.has(p.slug));
          problems = [...problems, ...newFromDb as any];
        }
      } catch {}
    }

    // Filter by difficulty if provided
    if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty.toLowerCase())) {
      problems = problems.filter((p) => p.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    return NextResponse.json({
      count: problems.length,
      problems: problems.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        difficulty: p.difficulty,
        description: p.description,
        constraints: p.constraints,
        optimal_benchmarks: p.optimal_benchmarks,
      })),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch problems' }, { status: 500 });
  }
}

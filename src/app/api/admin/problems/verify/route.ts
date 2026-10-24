import { NextResponse } from 'next/server';
import { executePiston } from '@/lib/piston';

export async function POST(req: Request) {
  try {
    const { source_code, language = 'python', test_cases = [] } = await req.json();

    if (!source_code) {
      return NextResponse.json({ error: 'Source code is required for verification.' }, { status: 400 });
    }

    if (!Array.isArray(test_cases) || test_cases.length === 0) {
      return NextResponse.json({ error: 'At least one testcase is required.' }, { status: 400 });
    }

    const results = [];
    let allPassed = true;

    for (let i = 0; i < test_cases.length; i++) {
      const tc = test_cases[i];
      const exec = await executePiston({
        source_code,
        language,
        stdin: tc.input || '',
        expected_output: tc.expected_output || '',
      });

      const passed = exec.passed ?? false;
      if (!passed) allPassed = false;

      results.push({
        index: i + 1,
        type: tc.is_hidden ? 'HIDDEN' : 'SAMPLE',
        input: tc.input,
        expected_output: tc.expected_output,
        actual_output: exec.stdout,
        error: exec.stderr || exec.compile_output,
        status: exec.status.description,
        time_ms: exec.time_ms,
        memory_kb: exec.memory_kb,
        passed,
      });
    }

    return NextResponse.json({
      success: true,
      allPassed,
      totalCount: test_cases.length,
      passedCount: results.filter((r) => r.passed).length,
      results,
    });
  } catch (err: any) {
    console.error('Problem verification error:', err);
    return NextResponse.json({ error: err.message || 'Verification failed' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getExperimentAnalyses } from '@/lib/experiments/analytics';
import { EXPERIMENTS } from '@/lib/experiments/definitions';

export async function GET() {
  try {
    const analyses = getExperimentAnalyses();
    return NextResponse.json({
      success: true,
      experiments: EXPERIMENTS,
      analyses,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

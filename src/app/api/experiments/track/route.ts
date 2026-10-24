import { NextResponse } from 'next/server';
import { logExperimentEvent } from '@/lib/experiments/analytics';

export async function POST(req: Request) {
  try {
    const { experimentId, variantId, userId, eventName, value, metadata } = await req.json();

    if (!experimentId || !variantId || !eventName) {
      return NextResponse.json({ error: 'Missing required event fields' }, { status: 400 });
    }

    logExperimentEvent({
      experimentId,
      variantId,
      userId: userId || 'anonymous',
      eventName,
      value,
      metadata,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

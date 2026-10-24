import { NextResponse, type NextRequest } from 'next/server';
import { getAdminSecret, generateAdminToken, isAuthorizedAdmin } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  const isAuth = await isAuthorizedAdmin(request);
  return NextResponse.json({ authenticated: isAuth });
}

export async function POST(request: NextRequest) {
  try {
    const { secret_key } = await request.json();

    if (!secret_key || typeof secret_key !== 'string') {
      return NextResponse.json({ error: 'Secret key is required.' }, { status: 400 });
    }

    const expectedSecret = getAdminSecret();
    if (secret_key.trim() !== expectedSecret) {
      // Intentional delay to prevent brute-force timing attacks
      await new Promise((r) => setTimeout(r, 400));
      return NextResponse.json({ error: 'Invalid master credentials.' }, { status: 401 });
    }

    const token = await generateAdminToken(expectedSecret);
    const response = NextResponse.json({
      success: true,
      message: 'Master authentication authorized.',
    });

    // Set secure httpOnly cookie (valid for 24 hours)
    response.cookies.set({
      name: 'codearena_admin_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Authentication failed' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Admin session terminated.' });
  response.cookies.delete('codearena_admin_session');
  return response;
}

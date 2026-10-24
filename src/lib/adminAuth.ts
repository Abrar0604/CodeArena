import { NextRequest } from 'next/server';

export const DEFAULT_ADMIN_SECRET = 'codearena-master-secret-2026';

export function getAdminSecret(): string {
  return process.env.ADMIN_SECRET_KEY || DEFAULT_ADMIN_SECRET;
}

export async function generateAdminToken(secret: string = getAdminSecret()): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${secret}:codearena-admin-salt-v1`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Validates whether the incoming HTTP request has master admin privileges.
 * Checks:
 * 1. Secure httpOnly cookie: 'codearena_admin_session'
 * 2. Header: 'x-admin-secret' matching ADMIN_SECRET_KEY
 * 3. Header: 'Authorization' matching Bearer <admin_secret> or <admin_token>
 * 4. Supabase authenticated user email against ADMIN_EMAILS
 */
export async function isAuthorizedAdmin(request: NextRequest): Promise<boolean> {
  const adminSecret = getAdminSecret();
  const validToken = await generateAdminToken(adminSecret);

  // 1. Check x-admin-secret header
  const headerSecret = request.headers.get('x-admin-secret');
  if (headerSecret && headerSecret === adminSecret) {
    return true;
  }

  // 2. Check Authorization Bearer header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const bearer = authHeader.substring(7).trim();
    if (bearer === adminSecret || bearer === validToken) {
      return true;
    }
  }

  // 3. Check secure cookie
  const sessionCookie = request.cookies.get('codearena_admin_session')?.value;
  if (sessionCookie && sessionCookie === validToken) {
    return true;
  }

  // 4. Check Supabase authenticated user email
  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (adminEmails.length > 0) {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder')) {
        const { createServerClient } = await import('@supabase/ssr');
        const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll() {},
          },
        });
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email && adminEmails.includes(user.email.toLowerCase())) {
          return true;
        }
      }
    } catch {}
  }

  return false;
}

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isAuthorizedAdmin } from '@/lib/adminAuth';

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ========================================================
  // 1. MASTER ADMIN SECURITY BARRIER (ROBUST RBAC)
  // Ensures normal users cannot access admin pages or APIs by editing URLs
  // ========================================================
  const isAdminApi = pathname.startsWith('/api/admin');
  const isAdminPage = pathname.startsWith('/admin');

  if (isAdminApi && pathname !== '/api/admin/auth') {
    const isAuthorized = await isAuthorizedAdmin(request);
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Access Denied: Master Admin privileges required.' },
        { status: 403 }
      );
    }
  }

  if (isAdminPage && pathname !== '/admin/login') {
    const isAuthorized = await isAuthorizedAdmin(request);
    if (!isAuthorized) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If already authorized admin visiting /admin/login, send straight to /admin/problems
  if (pathname === '/admin/login') {
    const isAuthorized = await isAuthorizedAdmin(request);
    if (isAuthorized) {
      const targetUrl = request.nextUrl.clone();
      targetUrl.pathname = '/admin/problems';
      targetUrl.searchParams.delete('from');
      return NextResponse.redirect(targetUrl);
    }
  }

  // ========================================================
  // 2. SUPABASE AUTHENTICATION & USER SESSION PROTECTION
  // ========================================================
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If live Supabase is not configured yet, allow non-admin requests to proceed gracefully
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthPage =
    pathname.startsWith('/login') ||
    pathname.startsWith('/register');

  // If user is already signed in and visits login/register, redirect to lobby
  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/lobby';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intl = createMiddleware(routing);

// The /admin HR dashboard exposes contact PII, so it must never be public.
// Protected with HTTP Basic Auth via ADMIN_USER / ADMIN_PASSWORD env vars.
// If no password is configured, /admin is hidden (404) — safe by default.
function isAdminPath(pathname: string): boolean {
  return pathname === '/admin' || pathname.startsWith('/admin/') || /^\/(ar|en)\/admin(\/|$)/.test(pathname);
}

export default function middleware(req: NextRequest) {
  if (isAdminPath(req.nextUrl.pathname)) {
    const user = process.env.ADMIN_USER || 'admin';
    const pass = process.env.ADMIN_PASSWORD;
    if (!pass) return new NextResponse('Not found', { status: 404 });

    const header = req.headers.get('authorization');
    if (header?.startsWith('Basic ')) {
      const [u, p] = atob(header.slice(6)).split(':');
      if (u === user && p === pass) return intl(req);
    }
    return new NextResponse('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Masaar Admin"' },
    });
  }
  return intl(req);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};

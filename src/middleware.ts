import { getSessionCookie } from 'better-auth/cookies';
import { type NextRequest, NextResponse } from 'next/server';
import { ROUTES } from './lib/routes';

// Optimistic check on the session cookie only. Layouts and API handlers do the real authorization.
export function middleware(request: NextRequest) {
  if (getSessionCookie(request)) return NextResponse.next();

  const url = new URL(ROUTES.LOGIN, request.url);
  url.searchParams.set('redirect', request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/shop/:path*', '/admin/:path*'],
};

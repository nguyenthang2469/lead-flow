import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/login'];
const COOKIE_NAME = '__lf-access-token';
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const hasToken = req.cookies.has(COOKIE_NAME);
  if (!isPublic && !hasToken) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  if (isPublic && hasToken) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};

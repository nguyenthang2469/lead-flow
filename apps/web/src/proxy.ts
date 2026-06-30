import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/login'];
const COOKIE_NAME = '__lf-access-token';
export function proxy(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const hasToken = req.cookies.has(COOKIE_NAME);

  if (!isPublic && !hasToken) {
    const loginUrl = new URL('/login', req.url);
    if (pathname !== '/') {
      const search = searchParams.toString();
      const callbackUrl = search ? `${pathname}?${search}` : pathname;
      loginUrl.searchParams.set('callbackUrl', callbackUrl);
    }
    return NextResponse.redirect(loginUrl);
  }

  if (isPublic && hasToken) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};

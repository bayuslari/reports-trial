import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PATHS = ['/reports'];
const VALID_ROLES = ['admin', 'viewer'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
  if (!isProtected) return NextResponse.next();

  const role = request.cookies.get('role')?.value;
  if (!role || !VALID_ROLES.includes(role)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/reports/:path*'],
};

import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authConfig } from '@/lib/auth.config';
import { DEMO_MODE } from '@/lib/demo-mode';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};

const authMiddleware = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET || 'bhukkad-demo-secret',
}).auth((req) => {
  const isLoggedIn = Boolean(req.auth);
  const isLoginPage = req.nextUrl.pathname === '/login';

  if (isLoginPage && isLoggedIn) {
    const nextPath = req.nextUrl.searchParams.get('next');
    const redirectUrl = new URL(nextPath || '/dashboard', req.nextUrl.origin);
    return NextResponse.redirect(redirectUrl);
  }

  if (!isLoggedIn) {
    const loginUrl = new URL('/login', req.nextUrl.origin);
    const requestPath = `${req.nextUrl.pathname}${req.nextUrl.search}`;

    if (requestPath && requestPath !== '/login') {
      loginUrl.searchParams.set('next', requestPath);
    }

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

const demoMiddleware = () => {
  if (DEMO_MODE) {
    return NextResponse.next();
  }

  return NextResponse.next();
};

export default DEMO_MODE ? demoMiddleware : authMiddleware;

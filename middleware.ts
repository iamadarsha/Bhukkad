import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authConfig } from '@/lib/auth.config';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)'],
};

export default NextAuth(authConfig).auth((req) => {
  // Authentication disabled as per user request
  return null;
});

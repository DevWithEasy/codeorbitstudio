import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const protectedAdminRoutes = [
  '/admin/dashboard',
  '/admin/create',
  '/admin/edit'
];

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  const isProtectedAdminRoute = protectedAdminRoutes.some(route => path.startsWith(route));

  // Allow login page to be accessed without redirection
  if (path === '/admin/login') {
    return NextResponse.next();
  }

  if (isProtectedAdminRoute) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    if (!token) {
      const loginUrl = new URL('/admin/login', request.nextUrl.origin);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/dashboard',
    '/admin/create',
    '/admin/edit/:path*',
    '/admin/login'
  ]
};
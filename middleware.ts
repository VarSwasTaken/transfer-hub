import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  const adminToken = process.env.ADMIN_TOKEN;

  // Protect /admin routes except /admin/login
  if (request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin/login') {
    if (!token || token !== adminToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // If trying to access /admin/login while already logged in
  if (request.nextUrl.pathname === '/admin/login') {
    if (token && token === adminToken) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

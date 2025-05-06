import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Kimlik doğrulama gerektirmeyen genel yollar
  const isPublicPath = path === '/login' || path.startsWith('/api/auth/');
  
  // Cookie'den token'ı al
  const token = request.cookies.get('authToken')?.value;
  
  // Korunmalı yol ve token yoksa, login'e yönlendir
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Login sayfasındaysanız ve zaten token varsa ana sayfaya
  if (isPublicPath && path === '/login' && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Devam et
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)'],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
];

// Define role-based route access
const roleAccess = {
  admin: ['/admin', '/api/admin'],
  vet: ['/dashboard', '/queue', '/consultation', '/cases', '/patients', '/api/cases', '/api/patients'],
  vet_tech: ['/dashboard', '/queue', '/intake', '/patients', '/api/cases', '/api/patients'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Set security headers
  const response = NextResponse.next();
  
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(self), microphone=(self), geolocation=(), payment=()'
  );

  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https: blob:; " +
    "font-src 'self' data:; " +
    "connect-src 'self' https://*.supabase.co https://api.stripe.com wss://*.supabase.co; " +
    "media-src 'self' blob:; " +
    "object-src 'none'; " +
    "frame-src 'self' https://js.stripe.com; " +
    "frame-ancestors 'none';"
  );

  // HSTS (only in production)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // Check if route is public
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return response;
  }

  // Get auth token from cookie
  const token = request.cookies.get('auth-token');

  if (!token) {
    // Redirect to login if no token
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // In production, validate JWT and extract user info
  // For now, we'll use a mock validation
  try {
    // const user = validateJWT(token.value);
    // Check role-based access here
    
    return response;
  } catch (error) {
    // Invalid token, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
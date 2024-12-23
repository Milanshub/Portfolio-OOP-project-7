import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create a new ratelimiter that allows 10 requests per 10 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
});

// Paths that require authentication
const protectedPaths = ['/dashboard'];
// Paths that are only accessible to non-authenticated users
const authPaths = ['/login', '/register', '/reset-password'];
// Paths that are public
const publicPaths = ['/', '/about', '/projects', '/contact'];

// Security headers following OWASP recommendations
const securityHeaders = {
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; font-src 'self' data:; connect-src 'self' https:;",
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy':
    'camera=(), microphone=(), geolocation=(), interest-cohort=()',
};

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Apply rate limiting for auth routes
  if (authPaths.some(path => pathname === path)) {
    const ip = request.ip ?? '127.0.0.1';
    const { success } = await ratelimit.limit(`ratelimit_${ip}`);
    
    if (!success) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': '10',
        },
      });
    }
  }

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  // Check if the path is an auth path
  const isAuthPath = authPaths.some(path => pathname === path);
  // Check if the path is public
  const isPublicPath = publicPaths.some(path => pathname === path);

  // If the path is protected and there's no token, redirect to login
  if (isProtectedPath && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // If the path is an auth path and there's a token, redirect to dashboard
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Add CSRF protection
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const csrfToken = request.headers.get('X-CSRF-Token');
    const expectedToken = request.cookies.get('csrf-token')?.value;

    if (!csrfToken || csrfToken !== expectedToken) {
      return new NextResponse('Invalid CSRF token', { status: 403 });
    }
  }

  return response;
}

export const config = {
  // Matcher ignoring _next/static, _next/image, favicon.ico, api routes
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 
import { NextRequest, NextResponse } from 'next/server';
import { i18nRouter } from 'next-i18n-router';
import i18nConfig from './i18nConfig';

const PUBLIC_FILE = /\.(.*)$/;

export function proxy(request: NextRequest): NextResponse | undefined {
  const { pathname } = request.nextUrl;

  // Skip internal/asset routes
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/_next') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return;
  }

  // First apply i18n routing
  const i18nResponse = i18nRouter(request, i18nConfig);
  if (i18nResponse) {
    // If i18nRouter produced a redirect or any response, return it directly.
    // (Redirects will have a 'location' header.)
    return i18nResponse;
  }

  // Avoid redirect loops
  if (pathname.startsWith('/auth/login') || pathname.startsWith('/dashboard')) {
    return;
  }

  // Determine if this is root or locale root (e.g., "/", "/en", "/zh")
  const isLocaleRoot = (() => {
    const trimmed = pathname.replace(/\/+$/, ''); // strip trailing slash
    if (trimmed === '') return true; // "/"
    return i18nConfig.locales.some((loc: string) => trimmed === `/${loc}`);
  })();

  if (isLocaleRoot) {
    const url = request.nextUrl.clone();
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      url.pathname = '/auth/login';
      return NextResponse.redirect(url);
    } else {
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  // Otherwise, allow the request to proceed normally
}

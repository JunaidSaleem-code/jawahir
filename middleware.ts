import { NextResponse } from 'next/server';

export function middleware(request: Request) {
  const url = new URL(request.url);
  if (!url.pathname.startsWith('/admin')) return NextResponse.next();

  const adminUser = process.env.ADMIN_USER;
  const adminPass = process.env.ADMIN_PASS;

  // If credentials are not set, allow access (dev fallback)
  if (!adminUser || !adminPass) return NextResponse.next();

  const auth = request.headers.get('authorization');
  if (auth && auth.startsWith('Basic ')) {
    const base64 = auth.split(' ')[1] || '';
    try {
      const decoded = atob(base64);
      const [user, pass] = decoded.split(':');
      if (user === adminUser && pass === adminPass) return NextResponse.next();
    } catch {}
  }

  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Admin"' },
  });
}

export const config = {
  matcher: ['/admin/:path*'],
};



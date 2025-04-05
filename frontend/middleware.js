import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl
  const isAuthPage = pathname === '/auth'
  const isProtectedRoute = pathname.startsWith('/dashboard') || 
                          pathname.startsWith('/sell') || 
                          pathname.startsWith('/chat') ||
                          pathname.startsWith('/profile')

  // Get the user data from cookies
  const userData = request.cookies.get('user')?.value

  // If user is not authenticated and trying to access protected routes
  if (!userData && isProtectedRoute) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // If user is authenticated and trying to access auth page
  if (userData && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/auth',
    '/dashboard/:path*',
    '/sell/:path*',
    '/chat/:path*',
    '/profile/:path*'
  ]
} 
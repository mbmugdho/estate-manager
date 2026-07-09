import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseMiddleware } from '@/lib/supabaseMiddleware'

export async function proxy(request: NextRequest) {
  const { supabase, response } = createSupabaseMiddleware(request)
  const { data: { session } } = await supabase.auth.getSession()

  const path = request.nextUrl.pathname

  const isAdminRoute = path.startsWith('/admin') && !path.startsWith('/admin/login')
  const isLoginPage = path === '/admin/login'

  // not logged in → redirect to login
  if (isAdminRoute && !session) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // already logged in → skip login page
  if (isLoginPage && session) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
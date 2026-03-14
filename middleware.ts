// middleware.ts
// CR AudioViz AI - Javari Scrapbook
// Authentication middleware using @supabase/ssr (modern pattern)
// Updated: 2026-03-14

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({ request: { headers: req.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return req.cookies.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: req.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: req.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  if (req.nextUrl.pathname.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  if (req.nextUrl.pathname.startsWith('/creator') && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  if ((req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/signup')) && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/creator/:path*', '/login', '/signup'],
}

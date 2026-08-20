// @auth-reviewed: this is a legitimate use of the cookie-based client.
// exchangeCodeForSession is the operation that WRITES the session, and it needs
// cookie set/remove access to do it. Every OTHER use of a cookie client on this
// platform was READING a session that nothing writes - sessions live in
// localStorage - which is why 32 core routes and 11 more across the fleet
// answered 401 to everyone until 2026-08-19.
//
// Do not "fix" this one to requireUser(): there is no bearer token yet at this
// point in the flow. This route is what creates it.
// app/auth/callback/route.ts
// CR AudioViz AI - Javari Scrapbook Auth Callback
// Updated: 2026-03-14 — replaced createServerComponentClient with @supabase/ssr

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const cookieStore = cookies()

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookieStore.get(name)?.value },
          set(name: string, value: string, options: CookieOptions) {
            try { cookieStore.set({ name, value, ...options }) } catch {}
          },
          remove(name: string, options: CookieOptions) {
            try { cookieStore.set({ name, value: '', ...options }) } catch {}
          },
        },
      }
    )
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
}

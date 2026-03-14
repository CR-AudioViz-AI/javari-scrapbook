// app/api/creator/[username]/route.ts
// CR AudioViz AI - Javari Scrapbook Creator Profile API
// Created: 2026-03-14

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(
  _request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const cookieStore = cookies()
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

    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('id, username, display_name, bio, avatar_url, website, created_at')
      .or(`username.eq.${params.username},display_name.ilike.${params.username}`)
      .single()

    if (profileErr || !profile) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 })
    }

    const { data: scrapbooks } = await supabase
      .from('scrapbooks')
      .select('id, title, description, cover_image, view_count, like_count, created_at')
      .eq('user_id', profile.id)
      .eq('is_public', true)
      .order('updated_at', { ascending: false })
      .limit(24)

    const stats = {
      total_scrapbooks: scrapbooks?.length || 0,
      total_views: scrapbooks?.reduce((s, b) => s + (b.view_count || 0), 0) || 0,
      total_likes: scrapbooks?.reduce((s, b) => s + (b.like_count || 0), 0) || 0,
    }

    return NextResponse.json({ profile, scrapbooks: scrapbooks || [], stats })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const cookieStore = cookies()
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

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { display_name, bio, website } = body

    const { data: updated, error } = await supabase
      .from('profiles')
      .update({ display_name, bio, website, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, profile: updated })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

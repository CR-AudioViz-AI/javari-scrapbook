// app/api/creator/[username]/route.ts
// CR AudioViz AI - Javari Scrapbook Creator Profile API
// Created: 2026-03-14


import { requireUser } from "@/lib/api/require-user";
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Service-role client. Identity comes from requireUser above; this only
// reads and writes data.
import { createClient as _mkClient } from '@supabase/supabase-js';
function createSupabaseServiceClient() {
  return _mkClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false },
      global: { fetch: (u: RequestInfo | URL, o?: RequestInit) => fetch(u, { ...o, cache: 'no-store' }) } },
  );
}


export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(
  _request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const cookieStore = cookies()
    const supabase = createSupabaseServiceClient()

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
    const supabase = createSupabaseServiceClient()

        // 2026-08-19: read the session from COOKIES via @supabase/auth-helpers or
    // @supabase/ssr. Sessions live in localStorage on this platform and nothing
    // writes a Supabase auth cookie, so this found no user and answered 401 to
    // EVERYONE - signed in or not. It never errored; it took the unauthenticated
    // path and looked like it worked. Same bug that broke 32 core routes.
    const _auth = await requireUser(_request);
    if (!_auth.ok) return _auth.res;
    const user = { id: _auth.userId, email: _auth.email };if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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

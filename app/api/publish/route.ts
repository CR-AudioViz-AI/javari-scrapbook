// app/api/publish/route.ts
// CR AudioViz AI - Javari Scrapbook Content Publishing API
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

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createSupabaseServiceClient()

        // 2026-08-19: read the session from COOKIES via @supabase/auth-helpers or
    // @supabase/ssr. Sessions live in localStorage on this platform and nothing
    // writes a Supabase auth cookie, so this found no user and answered 401 to
    // EVERYONE - signed in or not. It never errored; it took the unauthenticated
    // path and looked like it worked. Same bug that broke 32 core routes.
    const _auth = await requireUser(request);
    if (!_auth.ok) return _auth.res;
    const user = { id: _auth.userId, email: _auth.email };if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { scrapbookId, isPublic, title, description, tags } = await request.json()

    if (!scrapbookId) return NextResponse.json({ error: 'scrapbookId required' }, { status: 400 })

    // Verify ownership
    const { data: existing, error: fetchErr } = await supabase
      .from('scrapbooks')
      .select('id, user_id')
      .eq('id', scrapbookId)
      .eq('user_id', user.id)
      .single()

    if (fetchErr || !existing) {
      return NextResponse.json({ error: 'Scrapbook not found or access denied' }, { status: 404 })
    }

    // Publish / unpublish
    const updates: Record<string, unknown> = {
      is_public: isPublic,
      updated_at: new Date().toISOString(),
    }
    if (title !== undefined) updates.title = title
    if (description !== undefined) updates.description = description
    if (tags !== undefined) updates.tags = tags
    if (isPublic) updates.published_at = new Date().toISOString()

    const { data: updated, error: updateErr } = await supabase
      .from('scrapbooks')
      .update(updates)
      .eq('id', scrapbookId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateErr) throw updateErr

    // Telemetry
    await supabase.from('activity_log').insert({
      user_id: user.id,
      action: isPublic ? 'scrapbook_published' : 'scrapbook_unpublished',
      resource_type: 'scrapbook',
      resource_id: scrapbookId,
      metadata: { title: updated.title },
    }).then(() => {}).catch(() => {})

    return NextResponse.json({
      success: true,
      scrapbook: updated,
      message: isPublic ? 'Scrapbook published successfully' : 'Scrapbook unpublished',
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

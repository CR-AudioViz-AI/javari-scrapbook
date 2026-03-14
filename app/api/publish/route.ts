// app/api/publish/route.ts
// CR AudioViz AI - Javari Scrapbook Content Publishing API
// Created: 2026-03-14

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request) {
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

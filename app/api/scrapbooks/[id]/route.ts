import { readBody } from '@/lib/api/body';
// app/api/scrapbooks/[id]/route.ts
// Single scrapbook CRUD operations


import { requireUser, optionalUser } from "@/lib/api/require-user";
import { serviceClient } from "@/lib/api/service-client";
import { scrapbookAccess, isUuid } from "@/lib/api/scrapbook-access";
import { toDetail, type PageRow, type ScrapbookRow } from "@/lib/api/scrapbook-dto";
import { NextResponse } from 'next/server';

// Service-role client. Identity comes from requireUser above; this only
// reads and writes data.
import { createClient as _mkClient } from '@supabase/supabase-js';
import { secretKey, supabaseUrl } from "@craudioviz/platform-sdk";
function createSupabaseServiceClient() {
  return _mkClient(
    supabaseUrl(),
    secretKey(),
    { auth: { persistSession: false },
      global: { fetch: (u: RequestInfo | URL, o?: RequestInit) => fetch(u, { ...o, cache: 'no-store' }) } },
  );
}


export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// createSupabaseSSRClient collapsed 2026-08-19: it fetched cookies() and
// then ignored them - a leftover from the cookie client it used to build.
const createSupabaseSSRClient = createSupabaseServiceClient;


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // 2026-09-10: identity is OPTIONAL here. This called requireUser() before it
  // looked at is_public, so every shared /view link answered 401 to anonymous
  // visitors. Not-found and not-allowed answer the same 404 so ids cannot be
  // probed.
  if (!isUuid(params.id)) {
    return NextResponse.json({ error: 'Scrapbook not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
  }
  try {
    const db = serviceClient();
    const viewer = await optionalUser(request);
    const access = await scrapbookAccess(db, params.id, viewer?.userId ?? null);
    if (!access.exists || !access.canView) {
      return NextResponse.json({ error: 'Scrapbook not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    }

    const { data, error } = await db
      .from('scrapbooks')
      .select('*, pages:scrapbook_pages(*, elements:scrapbook_elements(*))')
      .eq('id', params.id)
      .single();
    if (error) throw error;
    const row = data as ScrapbookRow & { pages: PageRow[] };

    const { data: collaborators, error: cErr } = await db
      .from('scrapbook_collaborators')
      .select('id, user_id, role, created_at')
      .eq('scrapbook_id', params.id);
    if (cErr) throw cErr;

    if (!access.isOwner) {
      const { error: vErr } = await db.rpc('increment_view_count', { scrapbook_uuid: params.id });
      if (vErr) console.error(JSON.stringify({ level: 'ERROR', event: 'VIEW_COUNT_FAILED', id: params.id, message: vErr.message }));
    }

    let hasLiked = false;
    if (viewer) {
      const { data: like } = await db
        .from('scrapbook_likes')
        .select('id')
        .eq('scrapbook_id', params.id)
        .eq('user_id', viewer.userId)
        .maybeSingle();
      hasLiked = !!like;
    }

    return NextResponse.json({
      ...toDetail(row, row.pages ?? []),
      collaborators: collaborators ?? [],
      isOwner: access.isOwner,
      isCollaborator: access.isCollaborator,
      canEdit: access.canEdit,
      hasLiked,
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error: unknown) {
    console.error(JSON.stringify({ level: 'ERROR', event: 'SCRAPBOOK_FETCH_FAILED', id: params.id, message: error instanceof Error ? error.message : String(error) }));
    return NextResponse.json({ error: 'The request could not be completed.', code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseSSRClient();
        // 2026-08-19: read the session from COOKIES via @supabase/auth-helpers or
    // @supabase/ssr. Sessions live in localStorage on this platform and nothing
    // writes a Supabase auth cookie, so this found no user and answered 401 to
    // EVERYONE - signed in or not. It never errored; it took the unauthenticated
    // path and looked like it worked. Same bug that broke 32 core routes.
    const _auth = await requireUser(request);
    if (!_auth.ok) return _auth.res;
    const user = { id: _auth.userId, email: _auth.email };
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parsed = await readBody<Record<string, unknown>>(request);
    if (!parsed.ok) return parsed.response;
    const body = parsed.body as any;
    const updateData: any = {};
    
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.isPublic !== undefined) updateData.is_public = body.isPublic;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.coverImage !== undefined) updateData.cover_image = body.coverImage;
    
    updateData.updated_at = new Date().toISOString();

    const { data: scrapbook, error } = await supabase
      .from('scrapbooks')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ scrapbook });
  } catch (error: any) {
    return NextResponse.json({ error: 'The request could not be completed.', code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseSSRClient();
        // 2026-08-19: read the session from COOKIES via @supabase/auth-helpers or
    // @supabase/ssr. Sessions live in localStorage on this platform and nothing
    // writes a Supabase auth cookie, so this found no user and answered 401 to
    // EVERYONE - signed in or not. It never errored; it took the unauthenticated
    // path and looked like it worked. Same bug that broke 32 core routes.
    const _auth = await requireUser(request);
    if (!_auth.ok) return _auth.res;
    const user = { id: _auth.userId, email: _auth.email };
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('scrapbooks')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'The request could not be completed.', code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}

// app/api/scrapbooks/[id]/route.ts
// Single scrapbook CRUD operations


import { requireUser } from "@/lib/api/require-user";
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

    // Fetch scrapbook with pages and elements
    const { data: scrapbook, error } = await supabase
      .from('scrapbooks')
      .select(`
        *,
        pages:scrapbook_pages(
          *,
          elements:scrapbook_elements(*)
        )
      `)
      .eq('id', params.id)
      .order('page_order', { foreignTable: 'scrapbook_pages', ascending: true })
      .order('z_index', { foreignTable: 'scrapbook_pages.scrapbook_elements', ascending: true })
      .single();

    if (error) throw error;
    if (!scrapbook) {
      return NextResponse.json({ error: 'Scrapbook not found' }, { status: 404 });
    }

    // Type assertion for scrapbook data
    const scrapbookData = scrapbook as any;

    // Check access
    const isOwner = user?.id === scrapbookData.user_id;
    const isPublic = scrapbookData.is_public;

    // Fetch collaborators separately
    const { data: collaborators } = await supabase
      .from('scrapbook_collaborators')
      .select('*')
      .eq('scrapbook_id', params.id);

    const isCollaborator = collaborators?.some((c: any) => c.user_id === user?.id);
    const canEdit = isOwner || collaborators?.some((c: any) => c.user_id === user?.id && c.role === 'editor');

    if (!isOwner && !isCollaborator && !isPublic) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Increment view count for non-owners
    if (!isOwner && user) {
      await supabase.rpc('increment_view_count', { scrapbook_uuid: params.id });
    }

    // Check if user has liked
    let hasLiked = false;
    if (user) {
      const { data: like } = await supabase
        .from('scrapbook_likes')
        .select('id')
        .eq('scrapbook_id', params.id)
        .eq('user_id', user.id)
        .single();
      hasLiked = !!like;
    }

    return NextResponse.json({
      ...scrapbookData,
      collaborators: collaborators || [],
      isOwner,
      isCollaborator,
      hasLiked,
      canEdit
    });
  } catch (error: any) {
    console.error('Scrapbook fetch error:', error);
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

    const body = await request.json();
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

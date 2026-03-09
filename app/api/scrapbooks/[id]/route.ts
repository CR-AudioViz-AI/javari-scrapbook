// app/api/scrapbooks/[id]/route.ts
// Single scrapbook CRUD operations

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

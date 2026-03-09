// app/api/scrapbooks/[id]/comments/route.ts
// Comments and Annotations

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
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId');

    let query = supabase
      .from('scrapbook_comments')
      .select(`
        *,
        user:auth.users(email, raw_user_meta_data)
      `)
      .eq('scrapbook_id', params.id)
      .order('created_at', { ascending: false });

    if (pageId) {
      query = query.eq('page_id', pageId);
    }

    const { data: comments, error } = await query;
    if (error) throw error;

    return NextResponse.json({ comments });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
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
    const { pageId, content, position } = body;

    const { data: comment, error } = await supabase
      .from('scrapbook_comments')
      .insert({
        scrapbook_id: params.id,
        page_id: pageId,
        user_id: user.id,
        content,
        position
      })
      .select(`
        *,
        user:auth.users(email, raw_user_meta_data)
      `)
      .single();

    if (error) throw error;

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error: any) {
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
    const { commentId, content, resolved } = body;

    const { data: comment, error } = await supabase
      .from('scrapbook_comments')
      .update({ content, resolved })
      .eq('id', commentId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ comment });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

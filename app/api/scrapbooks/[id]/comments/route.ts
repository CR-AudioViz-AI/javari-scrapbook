// app/api/scrapbooks/[id]/comments/route.ts
// Comments and Annotations

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function createSupabaseSSRClient() {
  const cookieStore = cookies()
  return createServerClient(
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
}


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseSSRClient();
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
    const supabase = createSupabaseSSRClient();
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
    const supabase = createSupabaseSSRClient();
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

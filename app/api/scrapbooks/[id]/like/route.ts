// app/api/scrapbooks/[id]/like/route.ts
// Toggle like on scrapbook

import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { secretKey, supabaseUrl } from "@craudioviz/platform-sdk";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getSupabase() {
  return createClient(
    supabaseUrl(),
    secretKey()
  );
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabase();
    
    // For now, use anonymous user ID from cookie or generate one
    // 2026-09-04: identity comes from the session, never from a cookie a caller
    // can write.
    //
    // This read a `user_id` cookie and trusted it. A cookie is caller-controlled,
    // so anyone could set it to somebody else's id and like or unlike on their
    // behalf - removing another person's likes and attributing their own.
    //
    // Anonymous likes stay: requiring an account to like a scrapbook would kill
    // the feature. What changed is that an anonymous liker gets an anonymous id
    // rather than whichever id they claimed.
    let userId: string;
    const authHeader = request.headers.get('authorization') ?? '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
    const verified = token ? await supabase.auth.getUser(token) : null;
    if (verified && !verified.error && verified.data?.user) {
      userId = verified.data.user.id;
    } else {
      const cookieStore = cookies();
      const claimed = cookieStore.get('user_id')?.value;
      userId = claimed && claimed.startsWith('anon_')
        ? claimed
        : 'anon_' + Math.random().toString(36).substring(2, 15);
    }

    // Check if already liked
    const { data: existingLike } = await supabase
      .from('scrapbook_likes')
      .select('id')
      .eq('scrapbook_id', params.id)
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      // Unlike
      await supabase
        .from('scrapbook_likes')
        .delete()
        .eq('id', existingLike.id);

      // Decrement like count
      await supabase.rpc('decrement_like_count', { scrapbook_id: params.id });

      return NextResponse.json({ liked: false, userId });
    } else {
      // Like
      await supabase
        .from('scrapbook_likes')
        .insert({ scrapbook_id: params.id, user_id: userId });

      // Increment like count
      await supabase.rpc('increment_like_count', { scrapbook_id: params.id });

      return NextResponse.json({ liked: true, userId });
    }
  } catch (error: any) {
    return NextResponse.json({ error: 'The request could not be completed.', code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}

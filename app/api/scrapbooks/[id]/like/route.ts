// app/api/scrapbooks/[id]/like/route.ts
// Toggle like on scrapbook

import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabase();
    
    // For now, use anonymous user ID from cookie or generate one
    const cookieStore = cookies();
    let userId = cookieStore.get('user_id')?.value;
    
    if (!userId) {
      // Generate anonymous user ID
      userId = 'anon_' + Math.random().toString(36).substring(2, 15);
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

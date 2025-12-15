// app/api/scrapbooks/[id]/like/route.ts
// Toggle like on scrapbook

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

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

    // Check if already liked
    const { data: existingLike } = await supabase
      .from('scrapbook_likes')
      .select('id')
      .eq('scrapbook_id', params.id)
      .eq('user_id', user.id)
      .single();

    if (existingLike) {
      // Unlike
      await supabase
        .from('scrapbook_likes')
        .delete()
        .eq('id', existingLike.id);

      await supabase
        .from('scrapbooks')
        .update({ like_count: supabase.rpc('decrement_like_count') })
        .eq('id', params.id);

      return NextResponse.json({ liked: false });
    } else {
      // Like
      await supabase
        .from('scrapbook_likes')
        .insert({ scrapbook_id: params.id, user_id: user.id });

      await supabase
        .from('scrapbooks')
        .update({ like_count: supabase.rpc('increment_like_count') })
        .eq('id', params.id);

      return NextResponse.json({ liked: true });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

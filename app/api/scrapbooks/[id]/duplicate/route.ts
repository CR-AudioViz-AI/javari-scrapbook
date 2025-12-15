// app/api/scrapbooks/[id]/duplicate/route.ts
// Duplicate a scrapbook

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

    // Fetch original scrapbook
    const { data: original, error: fetchError } = await supabase
      .from('scrapbooks')
      .select(`
        *,
        pages:scrapbook_pages(
          *,
          elements:scrapbook_elements(*)
        )
      `)
      .eq('id', params.id)
      .single();

    if (fetchError || !original) {
      return NextResponse.json({ error: 'Scrapbook not found' }, { status: 404 });
    }

    // Create duplicate scrapbook
    const { data: newScrapbook, error: createError } = await supabase
      .from('scrapbooks')
      .insert({
        user_id: user.id,
        title: `${original.title} (Copy)`,
        description: original.description,
        page_width: original.page_width,
        page_height: original.page_height,
        page_size_name: original.page_size_name,
        is_public: false,
        tags: original.tags
      })
      .select()
      .single();

    if (createError) throw createError;

    // Duplicate pages and elements
    for (const page of (original as any).pages || []) {
      const { data: newPage } = await supabase
        .from('scrapbook_pages')
        .insert({
          scrapbook_id: newScrapbook.id,
          name: page.name,
          page_order: page.page_order,
          background: page.background,
          width: page.width,
          height: page.height
        })
        .select()
        .single();

      if (newPage) {
        for (const element of page.elements || []) {
          await supabase.from('scrapbook_elements').insert({
            page_id: newPage.id,
            element_type: element.element_type,
            name: element.name,
            position: element.position,
            size: element.size,
            transform: element.transform,
            opacity: element.opacity,
            z_index: element.z_index,
            locked: element.locked,
            visible: element.visible,
            shadow: element.shadow,
            border: element.border,
            properties: element.properties
          });
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      scrapbook: newScrapbook 
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

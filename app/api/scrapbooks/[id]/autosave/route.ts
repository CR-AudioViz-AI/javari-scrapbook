// app/api/scrapbooks/[id]/autosave/route.ts
// Autosave endpoint for editor

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

    const body = await request.json();
    const { pages, elements, metadata } = body;

    // Update scrapbook metadata if provided
    if (metadata) {
      await supabase
        .from('scrapbooks')
        .update({
          title: metadata.title,
          description: metadata.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', params.id);
    }

    // Update pages
    if (pages && Array.isArray(pages)) {
      for (const page of pages) {
        if (page.id) {
          await supabase
            .from('scrapbook_pages')
            .upsert({
              id: page.id,
              scrapbook_id: params.id,
              name: page.name,
              page_order: page.order,
              background: page.background,
              width: page.width,
              height: page.height,
              updated_at: new Date().toISOString()
            });
        }
      }
    }

    // Update elements
    if (elements && Array.isArray(elements)) {
      for (const element of elements) {
        if (element.id && element.pageId) {
          await supabase
            .from('scrapbook_elements')
            .upsert({
              id: element.id,
              page_id: element.pageId,
              element_type: element.type,
              name: element.name,
              position: element.position,
              size: element.size,
              transform: element.transform,
              opacity: element.opacity,
              z_index: element.zIndex,
              locked: element.locked,
              visible: element.visible,
              shadow: element.shadow,
              border: element.border,
              properties: element,
              updated_at: new Date().toISOString()
            });
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      savedAt: new Date().toISOString() 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

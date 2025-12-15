// app/api/scrapbooks/[id]/autosave/route.ts
// Autosave endpoint for editor

import { createClient } from '@supabase/supabase-js';
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

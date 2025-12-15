// app/api/scrapbooks/route.ts
// Complete CRUD API for Scrapbooks

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'updated_at';
    const order = searchParams.get('order') || 'desc';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('scrapbooks')
      .select(`
        *,
        pages:scrapbook_pages(count),
        collaborators:scrapbook_collaborators(count)
      `)
      .eq('user_id', user.id);

    // Apply filters
    if (filter === 'favorites') {
      query = query.contains('tags', ['favorite']);
    } else if (filter === 'shared') {
      query = supabase
        .from('scrapbook_collaborators')
        .select('scrapbooks(*)')
        .eq('user_id', user.id);
    } else if (filter === 'public') {
      query = query.eq('is_public', true);
    }

    // Apply search
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply sorting
    query = query.order(sort, { ascending: order === 'asc' });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      scrapbooks: data,
      total: count,
      limit,
      offset
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, pageWidth, pageHeight, pageSizeName, templateId } = body;

    // Create scrapbook
    const { data: scrapbook, error: scrapbookError } = await supabase
      .from('scrapbooks')
      .insert({
        user_id: user.id,
        title: title || 'Untitled Scrapbook',
        description: description || '',
        page_width: pageWidth || 1200,
        page_height: pageHeight || 1600,
        page_size_name: pageSizeName || '8x10'
      })
      .select()
      .single();

    if (scrapbookError) throw scrapbookError;

    // If using a template, copy template pages
    if (templateId) {
      const { data: template } = await supabase
        .from('templates')
        .select('template_data')
        .eq('id', templateId)
        .single();

      if (template?.template_data?.pages) {
        for (const page of template.template_data.pages) {
          const { data: newPage } = await supabase
            .from('scrapbook_pages')
            .insert({
              scrapbook_id: scrapbook.id,
              name: page.name,
              page_order: page.order,
              background: page.background,
              width: pageWidth || 1200,
              height: pageHeight || 1600
            })
            .select()
            .single();

          if (newPage && page.elements) {
            for (const element of page.elements) {
              await supabase.from('scrapbook_elements').insert({
                page_id: newPage.id,
                element_type: element.type,
                name: element.name,
                position: element.position,
                size: element.size,
                transform: element.transform,
                opacity: element.opacity,
                z_index: element.zIndex,
                shadow: element.shadow,
                border: element.border,
                properties: element
              });
            }
          }
        }
        
        // Increment template use count
        await supabase.rpc('increment_template_use', { template_id: templateId });
      }
    } else {
      // Create default first page
      await supabase.from('scrapbook_pages').insert({
        scrapbook_id: scrapbook.id,
        name: 'Page 1',
        page_order: 0,
        width: pageWidth || 1200,
        height: pageHeight || 1600
      });
    }

    // Log activity
    await supabase.from('activity_log').insert({
      scrapbook_id: scrapbook.id,
      user_id: user.id,
      action: 'created',
      details: { title: scrapbook.title }
    });

    return NextResponse.json({ scrapbook }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

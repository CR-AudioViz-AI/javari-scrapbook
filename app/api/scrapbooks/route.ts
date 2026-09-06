// app/api/scrapbooks/route.ts
// Complete CRUD API for Scrapbooks


import { requireUser } from "@/lib/api/require-user";
import { NextResponse } from 'next/server';

// Service-role client. Identity comes from requireUser above; this only
// reads and writes data.
import { createClient as _mkClient } from '@supabase/supabase-js';
import { secretKey, supabaseUrl } from "@craudioviz/platform-sdk";
function createSupabaseServiceClient() {
  return _mkClient(
    supabaseUrl(),
    secretKey(),
    { auth: { persistSession: false },
      global: { fetch: (u: RequestInfo | URL, o?: RequestInit) => fetch(u, { ...o, cache: 'no-store' }) } },
  );
}


export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// createSupabaseSSRClient collapsed 2026-08-19: it fetched cookies() and
// then ignored them - a leftover from the cookie client it used to build.
const createSupabaseSSRClient = createSupabaseServiceClient;


export async function GET(request: Request) {
  try {
    const supabase = createSupabaseSSRClient();
        // 2026-08-19: read the session from COOKIES via @supabase/auth-helpers or
    // @supabase/ssr. Sessions live in localStorage on this platform and nothing
    // writes a Supabase auth cookie, so this found no user and answered 401 to
    // EVERYONE - signed in or not. It never errored; it took the unauthenticated
    // path and looked like it worked. Same bug that broke 32 core routes.
    const _auth = await requireUser(request);
    if (!_auth.ok) return _auth.res;
    const user = { id: _auth.userId, email: _auth.email };
    
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
    const supabase = createSupabaseSSRClient();
        // 2026-08-19: read the session from COOKIES via @supabase/auth-helpers or
    // @supabase/ssr. Sessions live in localStorage on this platform and nothing
    // writes a Supabase auth cookie, so this found no user and answered 401 to
    // EVERYONE - signed in or not. It never errored; it took the unauthenticated
    // path and looked like it worked. Same bug that broke 32 core routes.
    const _auth = await requireUser(request);
    if (!_auth.ok) return _auth.res;
    const user = { id: _auth.userId, email: _auth.email };
    
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
    await supabase.from('javari_activity_log').insert({
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

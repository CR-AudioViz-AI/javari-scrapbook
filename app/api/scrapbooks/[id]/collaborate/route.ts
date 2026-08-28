// app/api/scrapbooks/[id]/collaborate/route.ts
// Real-time Collaboration Features


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


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseSSRClient();
    
    const { data: collaborators, error } = await supabase
      .from('scrapbook_collaborators')
      .select(`
        *,
        user:auth.users(email, raw_user_meta_data)
      `)
      .eq('scrapbook_id', params.id);

    if (error) throw error;

    return NextResponse.json({ collaborators });
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
    const { email, role = 'viewer' } = body;

    // Find user by email
    const { data: invitee } = await supabase
      .from('auth.users')
      .select('id')
      .eq('email', email)
      .single();

    if (!invitee) {
      // Send invitation email (they can sign up)
      return NextResponse.json({
        success: true,
        pending: true,
        message: 'Invitation sent. User will get access when they sign up.'
      });
    }

    // Add collaborator
    const { data: collaborator, error } = await supabase
      .from('scrapbook_collaborators')
      .insert({
        scrapbook_id: params.id,
        user_id: invitee.id,
        role,
        invited_by: user.id
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'User is already a collaborator' }, { status: 400 });
      }
      throw error;
    }

    // Log activity
    await supabase.from('activity_log').insert({
      scrapbook_id: params.id,
      user_id: user.id,
      action: 'collaborator_added',
      details: { email, role }
    });

    return NextResponse.json({ collaborator }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    const collaboratorId = searchParams.get('collaboratorId');

    const { error } = await supabase
      .from('scrapbook_collaborators')
      .delete()
      .eq('id', collaboratorId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

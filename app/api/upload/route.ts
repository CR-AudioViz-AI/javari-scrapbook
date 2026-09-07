// app/api/upload/route.ts
// File Upload with Processing


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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string || 'image';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large (max 50MB)' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Generate unique filename
    const ext = file.name.split('.').pop();
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const filename = `${user.id}/${timestamp}-${randomStr}.${ext}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('scrapbook-uploads')
      .upload(filename, file, {
        cacheControl: '31536000',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('scrapbook-uploads')
      .getPublicUrl(filename);

    // Create thumbnail for images
    let thumbnailUrl = publicUrl;
    if (file.type.startsWith('image/') && !file.type.includes('svg')) {
      // Supabase can generate thumbnails via transforms
      thumbnailUrl = `${publicUrl}?width=200&height=200&resize=contain`;
    }

    // Save to database
    const { data: upload, error: dbError } = await supabase
      .from('user_uploads')
      .insert({
        user_id: user.id,
        file_name: file.name,
        file_url: publicUrl,
        file_type: file.type,
        file_size: file.size,
        thumbnail_url: thumbnailUrl,
        metadata: {
          originalName: file.name,
          uploadedAt: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json({
      success: true,
      upload: {
        id: upload.id,
        url: publicUrl,
        thumbnailUrl,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      }
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'The request could not be completed.', code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}

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
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const { data: uploads, error, count } = await supabase
      .from('user_uploads')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({
      uploads,
      total: count,
      limit,
      offset
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'The request could not be completed.', code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
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
    const uploadId = searchParams.get('id');

    // Get upload info
    const { data: upload } = await supabase
      .from('user_uploads')
      .select('file_url')
      .eq('id', uploadId)
      .eq('user_id', user.id)
      .single();

    if (upload) {
      // Delete from storage
      const path = upload.file_url.split('/').slice(-2).join('/');
      await supabase.storage.from('scrapbook-uploads').remove([path]);
    }

    // Delete from database
    const { error } = await supabase
      .from('user_uploads')
      .delete()
      .eq('id', uploadId)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'The request could not be completed.', code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}

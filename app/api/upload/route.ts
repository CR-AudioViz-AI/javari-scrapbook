// app/api/upload/route.ts
// File Upload with Processing

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// app/api/unsplash/download/route.ts
// Unsplash Download Tracking API (Required by Unsplash API Guidelines)
// Timestamp: Tuesday, December 24, 2025 – 1:44 PM Eastern Time

import { NextRequest, NextResponse } from 'next/server';

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const downloadUrl = searchParams.get('url');

  if (!downloadUrl) {
    return NextResponse.json(
      { error: 'Download URL required' },
      { status: 400 }
    );
  }

  if (!UNSPLASH_ACCESS_KEY) {
    return NextResponse.json(
      { error: 'Unsplash API not configured' },
      { status: 500 }
    );
  }

  try {
    // Track the download as required by Unsplash API guidelines
    const response = await fetch(downloadUrl, {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        'Accept-Version': 'v1',
      },
    });

    if (!response.ok) {
      throw new Error(`Unsplash download tracking error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ success: true, url: data.url });
  } catch (error) {
    console.error('Unsplash download tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track download' },
      { status: 500 }
    );
  }
}

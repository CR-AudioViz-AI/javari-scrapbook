// app/api/unsplash/search/route.ts
// Unsplash Photo Search API
// Timestamp: Tuesday, December 24, 2025 – 1:42 PM Eastern Time

import { NextRequest, NextResponse } from 'next/server';

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') || '';
  const page = searchParams.get('page') || '1';
  const perPage = searchParams.get('per_page') || '30';

  if (!UNSPLASH_ACCESS_KEY) {
    return NextResponse.json(
      { error: 'Unsplash API not configured' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&orientation=squarish`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          'Accept-Version': 'v1',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Unsplash search error:', error);
    return NextResponse.json(
      { error: 'Failed to search photos' },
      { status: 500 }
    );
  }
}

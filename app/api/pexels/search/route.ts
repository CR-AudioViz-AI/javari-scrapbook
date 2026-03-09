// app/api/pexels/search/route.ts
// Pexels Search API for photos and videos
// Timestamp: Tuesday, December 24, 2025 – 2:02 PM Eastern Time

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') || '';
  const page = searchParams.get('page') || '1';
  const perPage = searchParams.get('per_page') || '15';
  const type = searchParams.get('type') || 'photos';

  if (!PEXELS_API_KEY) {
    return NextResponse.json(
      { error: 'Pexels API not configured' },
      { status: 500 }
    );
  }

  try {
    const endpoint = type === 'videos'
      ? `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`
      : `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;

    const response = await fetch(endpoint, {
      headers: {
        'Authorization': PEXELS_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Pexels search error:', error);
    return NextResponse.json(
      { error: 'Failed to search media' },
      { status: 500 }
    );
  }
}

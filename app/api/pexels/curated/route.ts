// app/api/pexels/curated/route.ts
// Pexels Curated/Popular API for photos and videos
// Timestamp: Tuesday, December 24, 2025 – 2:03 PM Eastern Time

import { NextRequest, NextResponse } from 'next/server';

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
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
      ? `https://api.pexels.com/videos/popular?page=${page}&per_page=${perPage}`
      : `https://api.pexels.com/v1/curated?page=${page}&per_page=${perPage}`;

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
    console.error('Pexels curated error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch curated media' },
      { status: 500 }
    );
  }
}

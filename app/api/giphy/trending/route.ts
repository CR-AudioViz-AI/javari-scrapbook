// app/api/giphy/trending/route.ts
// GIPHY Trending API for GIFs and Stickers
// Timestamp: Tuesday, December 24, 2025 – 2:33 PM Eastern Time

import { NextRequest, NextResponse } from 'next/server';

const GIPHY_API_KEY = process.env.GIPHY_API_KEY;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const offset = searchParams.get('offset') || '0';
  const limit = searchParams.get('limit') || '25';
  const type = searchParams.get('type') || 'stickers'; // stickers or gifs
  const rating = 'g'; // Keep it family-friendly

  if (!GIPHY_API_KEY) {
    return NextResponse.json(
      { error: 'GIPHY API not configured' },
      { status: 500 }
    );
  }

  try {
    const endpoint = type === 'stickers' 
      ? 'https://api.giphy.com/v1/stickers/trending'
      : 'https://api.giphy.com/v1/gifs/trending';

    const params = new URLSearchParams({
      api_key: GIPHY_API_KEY,
      limit,
      offset,
      rating,
    });

    const response = await fetch(`${endpoint}?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`GIPHY API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('GIPHY trending error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending' },
      { status: 500 }
    );
  }
}

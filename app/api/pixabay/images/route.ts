// app/api/pixabay/images/route.ts
// Pixabay Images API - Photos, Illustrations, Vectors
// Timestamp: Tuesday, December 24, 2025 – 2:25 PM Eastern Time

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';
  const page = searchParams.get('page') || '1';
  const perPage = searchParams.get('per_page') || '20';
  const imageType = searchParams.get('type') || 'all'; // all, photo, illustration, vector
  const category = searchParams.get('category') || '';
  const colors = searchParams.get('colors') || '';
  const orientation = searchParams.get('orientation') || 'all';
  const safeSearch = 'true';

  if (!PIXABAY_API_KEY) {
    return NextResponse.json(
      { error: 'Pixabay API not configured' },
      { status: 500 }
    );
  }

  try {
    const params = new URLSearchParams({
      key: PIXABAY_API_KEY,
      page,
      per_page: perPage,
      image_type: imageType,
      safesearch: safeSearch,
    });

    if (query) params.append('q', query);
    if (category) params.append('category', category);
    if (colors) params.append('colors', colors);
    if (orientation !== 'all') params.append('orientation', orientation);

    const response = await fetch(
      `https://pixabay.com/api/?${params.toString()}`,
      { next: { revalidate: 300 } } // Cache for 5 minutes
    );

    if (!response.ok) {
      throw new Error(`Pixabay API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Pixabay images error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

// app/api/pixabay/videos/route.ts
// Pixabay Videos API
// Timestamp: Tuesday, December 24, 2025 – 2:26 PM Eastern Time

import { NextRequest, NextResponse } from 'next/server';

const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';
  const page = searchParams.get('page') || '1';
  const perPage = searchParams.get('per_page') || '20';
  const category = searchParams.get('category') || '';
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
      safesearch: safeSearch,
    });

    if (query) params.append('q', query);
    if (category) params.append('category', category);

    const response = await fetch(
      `https://pixabay.com/api/videos/?${params.toString()}`,
      { next: { revalidate: 300 } }
    );

    if (!response.ok) {
      throw new Error(`Pixabay Videos API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Pixabay videos error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}

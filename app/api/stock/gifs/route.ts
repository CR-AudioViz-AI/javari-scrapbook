// app/api/stock/gifs/route.ts
// Giphy and Tenor GIF/Sticker Search

import { NextResponse } from 'next/server';

const GIPHY_KEY = process.env.GIPHY_API_KEY || 'demo';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || 'celebration';
  const type = searchParams.get('type') || 'stickers'; // gifs or stickers
  const limit = parseInt(searchParams.get('limit') || '25');
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    const endpoint = type === 'stickers' 
      ? 'https://api.giphy.com/v1/stickers/search'
      : 'https://api.giphy.com/v1/gifs/search';

    const params = new URLSearchParams({
      api_key: GIPHY_KEY,
      q: query,
      limit: limit.toString(),
      offset: offset.toString(),
      rating: 'g',
      lang: 'en'
    });

    const response = await fetch(`${endpoint}?${params}`);
    const data = await response.json();

    const items = (data.data || []).map((item: any) => ({
      id: `giphy-${item.id}`,
      source: 'giphy',
      type: item.type,
      url: item.images.fixed_height.url,
      thumbUrl: item.images.fixed_height_small.url,
      fullUrl: item.images.original.url,
      webpUrl: item.images.fixed_height.webp,
      width: parseInt(item.images.fixed_height.width),
      height: parseInt(item.images.fixed_height.height),
      title: item.title,
      slug: item.slug
    }));

    return NextResponse.json({
      items,
      total: data.pagination?.total_count || items.length,
      offset,
      limit
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Trending endpoint
export async function POST(request: Request) {
  const body = await request.json();
  const { type = 'stickers', limit = 25 } = body;

  try {
    const endpoint = type === 'stickers'
      ? 'https://api.giphy.com/v1/stickers/trending'
      : 'https://api.giphy.com/v1/gifs/trending';

    const params = new URLSearchParams({
      api_key: GIPHY_KEY,
      limit: limit.toString(),
      rating: 'g'
    });

    const response = await fetch(`${endpoint}?${params}`);
    const data = await response.json();

    const items = (data.data || []).map((item: any) => ({
      id: `giphy-${item.id}`,
      source: 'giphy',
      type: item.type,
      url: item.images.fixed_height.url,
      thumbUrl: item.images.fixed_height_small.url,
      fullUrl: item.images.original.url,
      width: parseInt(item.images.fixed_height.width),
      height: parseInt(item.images.fixed_height.height),
      title: item.title
    }));

    return NextResponse.json({ items, trending: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

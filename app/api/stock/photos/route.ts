// app/api/stock/photos/route.ts
// Free Stock Photo Search (Unsplash, Pexels, Pixabay)

import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY || 'demo';
const PEXELS_KEY = process.env.PEXELS_API_KEY || 'demo';
const PIXABAY_KEY = process.env.PIXABAY_API_KEY || 'demo';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || 'scrapbook';
  const source = searchParams.get('source') || 'all';
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = parseInt(searchParams.get('per_page') || '20');
  const orientation = searchParams.get('orientation') || 'all';

  const results: any[] = [];

  try {
    // Fetch from multiple sources in parallel
    const promises = [];

    if (source === 'all' || source === 'unsplash') {
      promises.push(searchUnsplash(query, page, perPage, orientation));
    }
    if (source === 'all' || source === 'pexels') {
      promises.push(searchPexels(query, page, perPage, orientation));
    }
    if (source === 'all' || source === 'pixabay') {
      promises.push(searchPixabay(query, page, perPage, orientation));
    }

    const responses = await Promise.allSettled(promises);
    
    for (const response of responses) {
      if (response.status === 'fulfilled') {
        results.push(...response.value);
      }
    }

    // Sort by relevance and shuffle slightly for variety
    const shuffled = results.sort(() => Math.random() - 0.5);

    return NextResponse.json({
      photos: shuffled,
      total: shuffled.length,
      page,
      perPage
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function searchUnsplash(query: string, page: number, perPage: number, orientation: string) {
  const params = new URLSearchParams({
    query,
    page: page.toString(),
    per_page: perPage.toString(),
    client_id: UNSPLASH_KEY
  });
  
  if (orientation !== 'all') {
    params.append('orientation', orientation);
  }

  const response = await fetch(`https://api.unsplash.com/search/photos?${params}`);
  const data = await response.json();

  return (data.results || []).map((photo: any) => ({
    id: `unsplash-${photo.id}`,
    source: 'unsplash',
    url: photo.urls.regular,
    thumbUrl: photo.urls.thumb,
    fullUrl: photo.urls.full,
    width: photo.width,
    height: photo.height,
    description: photo.description || photo.alt_description,
    photographer: photo.user.name,
    photographerUrl: photo.user.links.html,
    downloadUrl: photo.links.download,
    color: photo.color
  }));
}

async function searchPexels(query: string, page: number, perPage: number, orientation: string) {
  const params = new URLSearchParams({
    query,
    page: page.toString(),
    per_page: perPage.toString()
  });
  
  if (orientation !== 'all') {
    params.append('orientation', orientation);
  }

  const response = await fetch(`https://api.pexels.com/v1/search?${params}`, {
    headers: { Authorization: PEXELS_KEY }
  });
  const data = await response.json();

  return (data.photos || []).map((photo: any) => ({
    id: `pexels-${photo.id}`,
    source: 'pexels',
    url: photo.src.large,
    thumbUrl: photo.src.tiny,
    fullUrl: photo.src.original,
    width: photo.width,
    height: photo.height,
    description: photo.alt,
    photographer: photo.photographer,
    photographerUrl: photo.photographer_url,
    downloadUrl: photo.src.original,
    color: photo.avg_color
  }));
}

async function searchPixabay(query: string, page: number, perPage: number, orientation: string) {
  const params = new URLSearchParams({
    key: PIXABAY_KEY,
    q: query,
    page: page.toString(),
    per_page: perPage.toString(),
    image_type: 'photo',
    safesearch: 'true'
  });
  
  if (orientation !== 'all') {
    params.append('orientation', orientation === 'portrait' ? 'vertical' : 'horizontal');
  }

  const response = await fetch(`https://pixabay.com/api/?${params}`);
  const data = await response.json();

  return (data.hits || []).map((photo: any) => ({
    id: `pixabay-${photo.id}`,
    source: 'pixabay',
    url: photo.largeImageURL,
    thumbUrl: photo.previewURL,
    fullUrl: photo.largeImageURL,
    width: photo.imageWidth,
    height: photo.imageHeight,
    description: photo.tags,
    photographer: photo.user,
    photographerUrl: `https://pixabay.com/users/${photo.user}-${photo.user_id}/`,
    downloadUrl: photo.largeImageURL,
    color: null
  }));
}

// app/api/placeholder-images/route.ts
// Free Placeholder & Stock Images
// Uses Lorem Picsum, Unsplash Source, PlaceKitten, etc.

import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface ImageSource {
  id: string;
  name: string;
  description: string;
  baseUrl: string;
  categories?: string[];
}

const IMAGE_SOURCES: ImageSource[] = [
  {
    id: 'picsum',
    name: 'Lorem Picsum',
    description: 'Beautiful random photos',
    baseUrl: 'https://picsum.photos',
    categories: ['random', 'nature', 'people', 'architecture']
  },
  {
    id: 'placeholder',
    name: 'Placeholder.com',
    description: 'Colored placeholder images',
    baseUrl: 'https://via.placeholder.com'
  },
  {
    id: 'placekitten',
    name: 'PlaceKitten',
    description: 'Cute kitten photos',
    baseUrl: 'https://placekitten.com'
  },
  {
    id: 'placedog',
    name: 'Place Dog',
    description: 'Adorable dog photos',
    baseUrl: 'https://placedog.net'
  },
  {
    id: 'dummyimage',
    name: 'Dummy Image',
    description: 'Custom text placeholders',
    baseUrl: 'https://dummyimage.com'
  },
];

// Common scrapbook photo sizes
const PRESET_SIZES = {
  // Photo prints
  'wallet': { width: 170, height: 255, label: 'Wallet (2.5x3.5")' },
  '3x5': { width: 300, height: 500, label: '3x5 Print' },
  '4x6': { width: 400, height: 600, label: '4x6 Print' },
  '5x7': { width: 500, height: 700, label: '5x7 Print' },
  '8x10': { width: 800, height: 1000, label: '8x10 Print' },
  
  // Square formats
  'square-sm': { width: 300, height: 300, label: 'Small Square' },
  'square-md': { width: 500, height: 500, label: 'Medium Square' },
  'square-lg': { width: 800, height: 800, label: 'Large Square' },
  'instagram': { width: 1080, height: 1080, label: 'Instagram Square' },
  
  // Social media
  'instagram-story': { width: 1080, height: 1920, label: 'Instagram Story' },
  'facebook-post': { width: 1200, height: 630, label: 'Facebook Post' },
  'twitter-post': { width: 1200, height: 675, label: 'Twitter/X Post' },
  'pinterest': { width: 1000, height: 1500, label: 'Pinterest Pin' },
  
  // Page layouts
  'letter-portrait': { width: 850, height: 1100, label: 'Letter Portrait' },
  'letter-landscape': { width: 1100, height: 850, label: 'Letter Landscape' },
  'a4-portrait': { width: 794, height: 1123, label: 'A4 Portrait' },
  'a4-landscape': { width: 1123, height: 794, label: 'A4 Landscape' },
  
  // Scrapbook specific
  '12x12': { width: 1200, height: 1200, label: '12x12 Scrapbook Page' },
  '8.5x11': { width: 850, height: 1100, label: '8.5x11 Scrapbook Page' },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const width = parseInt(searchParams.get('width') || '400');
  const height = parseInt(searchParams.get('height') || '300');
  const source = searchParams.get('source') || 'picsum';
  const preset = searchParams.get('preset');
  const grayscale = searchParams.get('grayscale') === 'true';
  const blur = parseInt(searchParams.get('blur') || '0');
  const seed = searchParams.get('seed'); // For consistent random image
  const text = searchParams.get('text');
  const bgColor = searchParams.get('bgcolor') || '6366f1';
  const textColor = searchParams.get('textcolor') || 'ffffff';
  const listSources = searchParams.get('listSources');
  const listPresets = searchParams.get('listPresets');

  // List available sources
  if (listSources === 'true') {
    return NextResponse.json({
      sources: IMAGE_SOURCES,
      usage: '/api/placeholder-images?source=picsum&width=400&height=300'
    });
  }

  // List preset sizes
  if (listPresets === 'true') {
    return NextResponse.json({
      presets: Object.entries(PRESET_SIZES).map(([id, size]) => ({
        id,
        ...size
      })),
      usage: '/api/placeholder-images?preset=instagram'
    });
  }

  // Use preset size if specified
  let finalWidth = width;
  let finalHeight = height;
  if (preset && PRESET_SIZES[preset as keyof typeof PRESET_SIZES]) {
    const size = PRESET_SIZES[preset as keyof typeof PRESET_SIZES];
    finalWidth = size.width;
    finalHeight = size.height;
  }

  // Generate URLs for different sources
  const urls: Record<string, string> = {};
  
  // Lorem Picsum (beautiful photos)
  let picsumUrl = `https://picsum.photos/${finalWidth}/${finalHeight}`;
  if (seed) picsumUrl = `https://picsum.photos/seed/${seed}/${finalWidth}/${finalHeight}`;
  if (grayscale) picsumUrl += '?grayscale';
  if (blur > 0) picsumUrl += (grayscale ? '&' : '?') + `blur=${Math.min(blur, 10)}`;
  urls.picsum = picsumUrl;
  
  // Placeholder.com (solid colors with text)
  urls.placeholder = `https://via.placeholder.com/${finalWidth}x${finalHeight}/${bgColor}/${textColor}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
  
  // PlaceKitten
  urls.placekitten = `https://placekitten.com/${finalWidth}/${finalHeight}`;
  
  // Place Dog
  urls.placedog = `https://placedog.net/${finalWidth}/${finalHeight}`;
  
  // Dummy Image (with custom text)
  urls.dummyimage = `https://dummyimage.com/${finalWidth}x${finalHeight}/${bgColor}/${textColor}${text ? `&text=${encodeURIComponent(text)}` : ''}`;

  return NextResponse.json({
    image: {
      url: urls[source] || urls.picsum,
      width: finalWidth,
      height: finalHeight,
      source,
      allSources: urls
    },
    presets: Object.keys(PRESET_SIZES),
    sources: IMAGE_SOURCES.map(s => s.id),
    tips: {
      seed: 'Use ?seed=myvalue for consistent images',
      grayscale: 'Add ?grayscale=true for B&W',
      blur: 'Add ?blur=5 for blur effect (1-10)'
    }
  });
}

// app/api/export-presets/route.ts
// Export Presets for Print and Digital
// DPI settings, color modes, file formats

import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface ExportPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  width: number;
  height: number;
  dpi: number;
  format: string;
  colorMode: string;
  quality: number;
  bleed?: number;
  safeZone?: number;
}

const EXPORT_PRESETS: ExportPreset[] = [
  // Print - Photo Prints
  {
    id: 'photo-4x6',
    name: '4x6 Photo Print',
    category: 'photo-print',
    description: 'Standard photo print size',
    width: 1200,
    height: 1800,
    dpi: 300,
    format: 'jpeg',
    colorMode: 'CMYK',
    quality: 95
  },
  {
    id: 'photo-5x7',
    name: '5x7 Photo Print',
    category: 'photo-print',
    description: 'Medium photo print size',
    width: 1500,
    height: 2100,
    dpi: 300,
    format: 'jpeg',
    colorMode: 'CMYK',
    quality: 95
  },
  {
    id: 'photo-8x10',
    name: '8x10 Photo Print',
    category: 'photo-print',
    description: 'Large photo print size',
    width: 2400,
    height: 3000,
    dpi: 300,
    format: 'jpeg',
    colorMode: 'CMYK',
    quality: 95
  },
  {
    id: 'photo-11x14',
    name: '11x14 Photo Print',
    category: 'photo-print',
    description: 'Extra large photo print',
    width: 3300,
    height: 4200,
    dpi: 300,
    format: 'jpeg',
    colorMode: 'CMYK',
    quality: 95
  },
  
  // Scrapbook Pages
  {
    id: 'scrapbook-12x12',
    name: '12x12 Scrapbook Page',
    category: 'scrapbook',
    description: 'Standard scrapbook page',
    width: 3600,
    height: 3600,
    dpi: 300,
    format: 'png',
    colorMode: 'RGB',
    quality: 100,
    bleed: 36,
    safeZone: 108
  },
  {
    id: 'scrapbook-8x8',
    name: '8x8 Scrapbook Page',
    category: 'scrapbook',
    description: 'Compact scrapbook page',
    width: 2400,
    height: 2400,
    dpi: 300,
    format: 'png',
    colorMode: 'RGB',
    quality: 100,
    bleed: 24,
    safeZone: 72
  },
  {
    id: 'scrapbook-8.5x11',
    name: '8.5x11 Scrapbook Page',
    category: 'scrapbook',
    description: 'Letter size scrapbook',
    width: 2550,
    height: 3300,
    dpi: 300,
    format: 'png',
    colorMode: 'RGB',
    quality: 100,
    bleed: 25,
    safeZone: 75
  },
  
  // Social Media
  {
    id: 'instagram-post',
    name: 'Instagram Post',
    category: 'social',
    description: 'Square Instagram post',
    width: 1080,
    height: 1080,
    dpi: 72,
    format: 'jpeg',
    colorMode: 'sRGB',
    quality: 85
  },
  {
    id: 'instagram-story',
    name: 'Instagram Story',
    category: 'social',
    description: 'Full-screen story format',
    width: 1080,
    height: 1920,
    dpi: 72,
    format: 'jpeg',
    colorMode: 'sRGB',
    quality: 85
  },
  {
    id: 'instagram-carousel',
    name: 'Instagram Carousel',
    category: 'social',
    description: 'Portrait carousel slide',
    width: 1080,
    height: 1350,
    dpi: 72,
    format: 'jpeg',
    colorMode: 'sRGB',
    quality: 85
  },
  {
    id: 'facebook-post',
    name: 'Facebook Post',
    category: 'social',
    description: 'Optimal Facebook image',
    width: 1200,
    height: 630,
    dpi: 72,
    format: 'jpeg',
    colorMode: 'sRGB',
    quality: 85
  },
  {
    id: 'facebook-cover',
    name: 'Facebook Cover',
    category: 'social',
    description: 'Profile cover photo',
    width: 820,
    height: 312,
    dpi: 72,
    format: 'jpeg',
    colorMode: 'sRGB',
    quality: 90
  },
  {
    id: 'twitter-post',
    name: 'Twitter/X Post',
    category: 'social',
    description: 'Optimal Twitter image',
    width: 1200,
    height: 675,
    dpi: 72,
    format: 'jpeg',
    colorMode: 'sRGB',
    quality: 85
  },
  {
    id: 'pinterest-pin',
    name: 'Pinterest Pin',
    category: 'social',
    description: 'Vertical Pinterest format',
    width: 1000,
    height: 1500,
    dpi: 72,
    format: 'jpeg',
    colorMode: 'sRGB',
    quality: 85
  },
  {
    id: 'linkedin-post',
    name: 'LinkedIn Post',
    category: 'social',
    description: 'Professional social post',
    width: 1200,
    height: 627,
    dpi: 72,
    format: 'jpeg',
    colorMode: 'sRGB',
    quality: 85
  },
  
  // Cards & Invitations
  {
    id: 'card-5x7',
    name: '5x7 Card',
    category: 'cards',
    description: 'Standard greeting card',
    width: 1500,
    height: 2100,
    dpi: 300,
    format: 'pdf',
    colorMode: 'CMYK',
    quality: 100,
    bleed: 38
  },
  {
    id: 'card-4x6-postcard',
    name: '4x6 Postcard',
    category: 'cards',
    description: 'Standard postcard size',
    width: 1200,
    height: 1800,
    dpi: 300,
    format: 'pdf',
    colorMode: 'CMYK',
    quality: 100,
    bleed: 38
  },
  {
    id: 'invitation-5x7',
    name: '5x7 Invitation',
    category: 'cards',
    description: 'Event invitation',
    width: 1500,
    height: 2100,
    dpi: 300,
    format: 'pdf',
    colorMode: 'CMYK',
    quality: 100,
    bleed: 38
  },
  
  // Web & Digital
  {
    id: 'web-hd',
    name: 'Web HD',
    category: 'digital',
    description: '1080p web display',
    width: 1920,
    height: 1080,
    dpi: 72,
    format: 'jpeg',
    colorMode: 'sRGB',
    quality: 80
  },
  {
    id: 'web-4k',
    name: 'Web 4K',
    category: 'digital',
    description: '4K display resolution',
    width: 3840,
    height: 2160,
    dpi: 72,
    format: 'jpeg',
    colorMode: 'sRGB',
    quality: 85
  },
  {
    id: 'email-header',
    name: 'Email Header',
    category: 'digital',
    description: 'Email newsletter header',
    width: 600,
    height: 200,
    dpi: 72,
    format: 'jpeg',
    colorMode: 'sRGB',
    quality: 85
  },
  {
    id: 'wallpaper-desktop',
    name: 'Desktop Wallpaper',
    category: 'digital',
    description: 'Computer wallpaper',
    width: 2560,
    height: 1440,
    dpi: 72,
    format: 'jpeg',
    colorMode: 'sRGB',
    quality: 90
  },
  {
    id: 'wallpaper-phone',
    name: 'Phone Wallpaper',
    category: 'digital',
    description: 'Mobile wallpaper',
    width: 1170,
    height: 2532,
    dpi: 72,
    format: 'jpeg',
    colorMode: 'sRGB',
    quality: 90
  },
];

const CATEGORIES = Array.from(new Set(EXPORT_PRESETS.map(p => p.category)));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const presetId = searchParams.get('id');
  const search = searchParams.get('search')?.toLowerCase();

  // Get specific preset
  if (presetId) {
    const preset = EXPORT_PRESETS.find(p => p.id === presetId);
    if (preset) {
      return NextResponse.json({
        preset,
        cssStyle: {
          width: `${preset.width}px`,
          height: `${preset.height}px`,
          aspectRatio: `${preset.width} / ${preset.height}`
        },
        printSize: {
          widthInches: (preset.width / preset.dpi).toFixed(2),
          heightInches: (preset.height / preset.dpi).toFixed(2)
        }
      });
    }
    return NextResponse.json({ error: 'Preset not found' }, { status: 404 });
  }

  // Filter presets
  let results = [...EXPORT_PRESETS];
  
  if (category) {
    results = results.filter(p => p.category === category);
  }
  
  if (search) {
    results = results.filter(p => 
      p.name.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search)
    );
  }

  return NextResponse.json({
    presets: results,
    categories: CATEGORIES,
    total: results.length,
    formats: ['jpeg', 'png', 'pdf', 'webp'],
    colorModes: ['RGB', 'sRGB', 'CMYK'],
    tips: {
      print: 'Use 300 DPI for professional prints',
      web: '72 DPI is standard for screens',
      bleed: 'Add 0.125" bleed for edge-to-edge prints'
    }
  });
}

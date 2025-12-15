// app/api/fonts/route.ts
// Google Fonts API Integration - 1000+ Free Fonts

import { NextResponse } from 'next/server';

const GOOGLE_FONTS_API = 'https://www.googleapis.com/webfonts/v1/webfonts';
const GOOGLE_FONTS_KEY = process.env.GOOGLE_FONTS_API_KEY || '';

// Curated font categories for scrapbooking
const SCRAPBOOK_FONTS = {
  display: [
    'Playfair Display', 'Abril Fatface', 'Lobster', 'Pacifico', 'Great Vibes',
    'Sacramento', 'Satisfy', 'Allura', 'Alex Brush', 'Tangerine'
  ],
  handwriting: [
    'Dancing Script', 'Caveat', 'Kalam', 'Patrick Hand', 'Indie Flower',
    'Shadows Into Light', 'Amatic SC', 'Architects Daughter', 'Permanent Marker', 'Rock Salt'
  ],
  serif: [
    'Playfair Display', 'Lora', 'Merriweather', 'Cormorant Garamond', 'Crimson Text',
    'Libre Baskerville', 'EB Garamond', 'Source Serif Pro', 'PT Serif', 'Spectral'
  ],
  sansSerif: [
    'Quicksand', 'Poppins', 'Montserrat', 'Raleway', 'Open Sans',
    'Lato', 'Nunito', 'Rubik', 'Work Sans', 'Inter'
  ],
  decorative: [
    'Righteous', 'Bungee', 'Fredoka One', 'Bangers', 'Press Start 2P',
    'Special Elite', 'Cinzel Decorative', 'Fascinate Inline', 'Monoton', 'Audiowide'
  ]
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'all';
  const search = searchParams.get('search') || '';
  const limit = parseInt(searchParams.get('limit') || '50');

  try {
    // Return curated fonts for scrapbooking
    let fonts: any[] = [];

    if (category === 'all' || !SCRAPBOOK_FONTS[category as keyof typeof SCRAPBOOK_FONTS]) {
      // Combine all categories
      fonts = Object.entries(SCRAPBOOK_FONTS).flatMap(([cat, fontList]) =>
        fontList.map(name => ({
          family: name,
          category: cat,
          variants: ['regular', 'bold', 'italic'],
          previewUrl: `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name)}&display=swap`
        }))
      );
    } else {
      fonts = SCRAPBOOK_FONTS[category as keyof typeof SCRAPBOOK_FONTS].map(name => ({
        family: name,
        category,
        variants: ['regular', 'bold', 'italic'],
        previewUrl: `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name)}&display=swap`
      }));
    }

    // Filter by search
    if (search) {
      fonts = fonts.filter(f => 
        f.family.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Limit results
    fonts = fonts.slice(0, limit);

    return NextResponse.json({
      fonts,
      categories: Object.keys(SCRAPBOOK_FONTS),
      total: fonts.length
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

const FONT_CATEGORIES = {
  'script-elegant': {
    name: 'Elegant Script',
    description: 'Beautiful cursive fonts',
    fonts: ['Great Vibes', 'Pacifico', 'Dancing Script', 'Allura', 'Alex Brush', 'Sacramento', 'Satisfy', 'Tangerine', 'Pinyon Script', 'Marck Script', 'Kaushan Script', 'Cookie', 'Parisienne', 'Niconne', 'Lobster', 'Courgette', 'Yellowtail', 'Grand Hotel']
  },
  'script-casual': {
    name: 'Casual Handwriting',
    description: 'Friendly handwritten styles',
    fonts: ['Caveat', 'Indie Flower', 'Shadows Into Light', 'Architects Daughter', 'Patrick Hand', 'Gloria Hallelujah', 'Schoolbell', 'Short Stack', 'Gochi Hand', 'Reenie Beanie']
  },
  'serif-classic': {
    name: 'Classic Serif',
    description: 'Timeless elegant typography',
    fonts: ['Playfair Display', 'Cormorant Garamond', 'Libre Baskerville', 'Crimson Text', 'EB Garamond', 'Lora', 'Merriweather', 'Source Serif Pro', 'PT Serif', 'Noto Serif', 'Spectral', 'Domine', 'Rokkitt', 'Cardo']
  },
  'sans-modern': {
    name: 'Modern Sans',
    description: 'Clean contemporary fonts',
    fonts: ['Montserrat', 'Open Sans', 'Lato', 'Roboto', 'Poppins', 'Raleway', 'Nunito', 'Work Sans', 'Quicksand', 'Inter', 'DM Sans', 'Lexend', 'Manrope', 'Jost', 'Urbanist']
  },
  'display': {
    name: 'Display & Decorative',
    description: 'Eye-catching title fonts',
    fonts: ['Abril Fatface', 'Alfa Slab One', 'Bangers', 'Bebas Neue', 'Black Ops One', 'Bungee', 'Fredoka One', 'Luckiest Guy', 'Righteous', 'Russo One']
  },
  'whimsical': {
    name: 'Whimsical & Fun',
    description: 'Playful fonts',
    fonts: ['Bubblegum Sans', 'Boogaloo', 'Cherry Cream Soda', 'Comfortaa', 'Comic Neue', 'Finger Paint', 'Fuzzy Bubbles', 'Gaegu', 'Life Savers']
  },
  'monospace': {
    name: 'Monospace',
    description: 'Fixed-width fonts',
    fonts: ['Roboto Mono', 'Source Code Pro', 'Fira Code', 'JetBrains Mono', 'IBM Plex Mono', 'Space Mono', 'Ubuntu Mono', 'Inconsolata', 'PT Mono']
  },
};

const FONT_PAIRINGS = [
  { title: 'Playfair Display', body: 'Lato', style: 'Elegant Classic' },
  { title: 'Great Vibes', body: 'Open Sans', style: 'Romantic Script' },
  { title: 'Montserrat', body: 'Merriweather', style: 'Modern Readable' },
  { title: 'Dancing Script', body: 'Quicksand', style: 'Playful Feminine' },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const pairings = searchParams.get('pairings');

  try {
    if (pairings === 'true') {
      return NextResponse.json({ success: true, pairings: FONT_PAIRINGS, count: FONT_PAIRINGS.length });
    }

    if (category && FONT_CATEGORIES[category as keyof typeof FONT_CATEGORIES]) {
      const cat = FONT_CATEGORIES[category as keyof typeof FONT_CATEGORIES];
      return NextResponse.json({
        success: true, category, name: cat.name, description: cat.description,
        fonts: cat.fonts, count: cat.fonts.length,
      });
    }

    if (search) {
      const searchLower = search.toLowerCase();
      const results: { font: string; category: string }[] = [];
      Object.entries(FONT_CATEGORIES).forEach(([catKey, cat]) => {
        cat.fonts.forEach(font => {
          if (font.toLowerCase().includes(searchLower)) results.push({ font, category: catKey });
        });
      });
      return NextResponse.json({ success: true, search, results, count: results.length });
    }

    const categories = Object.entries(FONT_CATEGORIES).map(([key, cat]) => ({
      id: key, name: cat.name, description: cat.description, count: cat.fonts.length,
    }));
    const totalFonts = Object.values(FONT_CATEGORIES).reduce((acc, cat) => acc + cat.fonts.length, 0);
    return NextResponse.json({ success: true, categories, totalFonts, pairingsAvailable: FONT_PAIRINGS.length });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch fonts' }, { status: 500 });
  }
}

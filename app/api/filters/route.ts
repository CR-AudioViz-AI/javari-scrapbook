// app/api/filters/route.ts
// Photo Filter Presets - Instagram-style filters
// All implemented as CSS/SVG filters for real-time preview

import { NextResponse } from 'next/server';

interface Filter {
  id: string;
  name: string;
  category: string;
  css: string;
  description: string;
}

const FILTERS: Filter[] = [
  // Classic Adjustments
  { id: 'none', name: 'Original', category: 'basic', css: 'none', description: 'No filter applied' },
  { id: 'grayscale', name: 'Grayscale', category: 'basic', css: 'grayscale(100%)', description: 'Black and white' },
  { id: 'sepia', name: 'Sepia', category: 'basic', css: 'sepia(100%)', description: 'Warm vintage brown' },
  { id: 'saturate', name: 'Vibrant', category: 'basic', css: 'saturate(150%)', description: 'Enhanced colors' },
  { id: 'desaturate', name: 'Muted', category: 'basic', css: 'saturate(50%)', description: 'Subdued colors' },
  { id: 'contrast-high', name: 'High Contrast', category: 'basic', css: 'contrast(130%)', description: 'Bold contrast' },
  { id: 'contrast-low', name: 'Low Contrast', category: 'basic', css: 'contrast(80%)', description: 'Soft contrast' },
  { id: 'brightness-high', name: 'Brighten', category: 'basic', css: 'brightness(120%)', description: 'Lighter image' },
  { id: 'brightness-low', name: 'Darken', category: 'basic', css: 'brightness(80%)', description: 'Darker image' },
  
  // Instagram-Style Filters
  { id: 'clarendon', name: 'Clarendon', category: 'instagram', css: 'contrast(120%) saturate(125%)', description: 'Intensifies shadows and brightens highlights' },
  { id: 'gingham', name: 'Gingham', category: 'instagram', css: 'brightness(105%) hue-rotate(-10deg)', description: 'Vintage faded look' },
  { id: 'moon', name: 'Moon', category: 'instagram', css: 'grayscale(100%) contrast(110%) brightness(110%)', description: 'Black and white with bright shadows' },
  { id: 'lark', name: 'Lark', category: 'instagram', css: 'contrast(90%) saturate(90%) brightness(115%)', description: 'Desaturated greens and blues' },
  { id: 'reyes', name: 'Reyes', category: 'instagram', css: 'sepia(22%) brightness(110%) contrast(85%) saturate(75%)', description: 'Dusty vintage filter' },
  { id: 'juno', name: 'Juno', category: 'instagram', css: 'contrast(110%) brightness(110%) saturate(140%) sepia(5%)', description: 'Warm tones with punchy colors' },
  { id: 'slumber', name: 'Slumber', category: 'instagram', css: 'saturate(66%) brightness(105%) sepia(15%)', description: 'Desaturates and adds haze' },
  { id: 'crema', name: 'Crema', category: 'instagram', css: 'contrast(90%) brightness(110%) saturate(80%) sepia(10%)', description: 'Creamy, vintage look' },
  { id: 'ludwig', name: 'Ludwig', category: 'instagram', css: 'contrast(105%) saturate(105%) sepia(8%)', description: 'Subtle enhancement' },
  { id: 'aden', name: 'Aden', category: 'instagram', css: 'hue-rotate(-20deg) contrast(90%) saturate(85%) brightness(120%)', description: 'Pastel, soft colors' },
  { id: 'perpetua', name: 'Perpetua', category: 'instagram', css: 'contrast(110%) brightness(105%) saturate(110%)', description: 'Soft pastel tones' },
  
  // Vintage/Retro
  { id: 'vintage-warm', name: 'Warm Vintage', category: 'vintage', css: 'sepia(40%) contrast(90%) brightness(105%) saturate(80%)', description: 'Warm nostalgic feel' },
  { id: 'vintage-cool', name: 'Cool Vintage', category: 'vintage', css: 'sepia(20%) hue-rotate(180deg) saturate(60%) contrast(90%)', description: 'Cool faded look' },
  { id: 'polaroid', name: 'Polaroid', category: 'vintage', css: 'sepia(30%) contrast(85%) brightness(110%) saturate(75%)', description: 'Instant film look' },
  { id: 'faded', name: 'Faded', category: 'vintage', css: 'contrast(80%) brightness(110%) saturate(70%)', description: 'Washed out colors' },
  { id: 'film-grain', name: 'Film Noir', category: 'vintage', css: 'grayscale(100%) contrast(130%) brightness(90%)', description: 'Classic film look' },
  { id: 'kodachrome', name: 'Kodachrome', category: 'vintage', css: 'contrast(110%) saturate(130%) sepia(10%)', description: 'Vivid color film' },
  { id: '1977', name: '1977', category: 'vintage', css: 'contrast(110%) brightness(110%) saturate(130%) sepia(15%)', description: 'Warm 70s aesthetic' },
  
  // Artistic
  { id: 'dramatic', name: 'Dramatic', category: 'artistic', css: 'contrast(150%) saturate(80%) brightness(90%)', description: 'Bold and moody' },
  { id: 'dreamy', name: 'Dreamy', category: 'artistic', css: 'contrast(80%) brightness(115%) saturate(85%) blur(0.5px)', description: 'Soft ethereal glow' },
  { id: 'vivid', name: 'Vivid', category: 'artistic', css: 'contrast(120%) saturate(180%)', description: 'Ultra vibrant colors' },
  { id: 'noir', name: 'Noir', category: 'artistic', css: 'grayscale(100%) contrast(140%)', description: 'High contrast B&W' },
  { id: 'silvertone', name: 'Silvertone', category: 'artistic', css: 'grayscale(100%) brightness(110%) contrast(90%)', description: 'Soft silver B&W' },
  { id: 'copper', name: 'Copper', category: 'artistic', css: 'sepia(50%) hue-rotate(-10deg) saturate(110%)', description: 'Warm copper tones' },
  { id: 'cyanotype', name: 'Cyanotype', category: 'artistic', css: 'grayscale(100%) brightness(110%) sepia(50%) hue-rotate(180deg)', description: 'Blue print look' },
  
  // Color Effects
  { id: 'warm', name: 'Warm', category: 'color', css: 'sepia(20%) saturate(110%)', description: 'Warm golden tones' },
  { id: 'cool', name: 'Cool', category: 'color', css: 'hue-rotate(15deg) saturate(90%)', description: 'Cool blue tones' },
  { id: 'sunset', name: 'Sunset', category: 'color', css: 'sepia(30%) hue-rotate(-15deg) saturate(140%)', description: 'Golden hour warmth' },
  { id: 'teal-orange', name: 'Teal & Orange', category: 'color', css: 'contrast(110%) saturate(120%) hue-rotate(-5deg)', description: 'Hollywood color grade' },
  { id: 'pink-tint', name: 'Pink Tint', category: 'color', css: 'hue-rotate(-30deg) saturate(110%)', description: 'Soft pink overlay' },
  { id: 'blue-tint', name: 'Blue Tint', category: 'color', css: 'hue-rotate(30deg) saturate(90%)', description: 'Cool blue overlay' },
  { id: 'green-tint', name: 'Green Tint', category: 'color', css: 'hue-rotate(90deg) saturate(80%)', description: 'Earthy green tones' },
];

const CATEGORIES = Array.from(new Set(FILTERS.map(f => f.category)));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const filterId = searchParams.get('id');
  const search = searchParams.get('search')?.toLowerCase();

  // Return specific filter
  if (filterId) {
    const filter = FILTERS.find(f => f.id === filterId);
    if (filter) {
      return NextResponse.json({
        filter: {
          ...filter,
          cssProperty: 'filter',
          usage: `style={{ filter: '${filter.css}' }}`
        }
      });
    }
    return NextResponse.json({ error: 'Filter not found' }, { status: 404 });
  }

  // Filter by category or search
  let results = [...FILTERS];
  
  if (category) {
    results = results.filter(f => f.category === category);
  }
  
  if (search) {
    results = results.filter(f => 
      f.name.toLowerCase().includes(search) ||
      f.description.toLowerCase().includes(search)
    );
  }

  return NextResponse.json({
    filters: results.map(f => ({
      id: f.id,
      name: f.name,
      category: f.category,
      css: f.css,
      description: f.description
    })),
    categories: CATEGORIES,
    total: results.length,
    usage: {
      react: "style={{ filter: 'sepia(100%)' }}",
      css: "filter: sepia(100%);",
      tip: 'Filters can be combined: "sepia(50%) contrast(120%)"'
    }
  });
}

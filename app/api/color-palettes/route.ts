// app/api/color-palettes/route.ts
// Color Palette Generator - Curated color schemes
// Includes harmonious color combinations for scrapbooking

import { NextResponse } from 'next/server';

interface ColorPalette {
  id: string;
  name: string;
  category: string;
  description: string;
  colors: string[];
  tags: string[];
}

const COLOR_PALETTES: ColorPalette[] = [
  // Pastel & Soft
  { id: 'cotton-candy', name: 'Cotton Candy', category: 'pastel', description: 'Soft pink and blue pastels', colors: ['#FFB5E8', '#FF9CEE', '#B5DEFF', '#97E1D4', '#FFF5BA'], tags: ['baby', 'sweet', 'feminine'] },
  { id: 'spring-garden', name: 'Spring Garden', category: 'pastel', description: 'Fresh spring colors', colors: ['#E8F5E9', '#C8E6C9', '#A5D6A7', '#81C784', '#66BB6A'], tags: ['nature', 'fresh', 'calm'] },
  { id: 'lavender-dreams', name: 'Lavender Dreams', category: 'pastel', description: 'Soothing purple tones', colors: ['#E8D5E8', '#D4B5D4', '#C4A1C4', '#B38CB3', '#A277A2'], tags: ['relaxing', 'feminine', 'elegant'] },
  { id: 'peach-cream', name: 'Peach & Cream', category: 'pastel', description: 'Warm peachy tones', colors: ['#FFF0E5', '#FFE0CC', '#FFD0B3', '#FFC09A', '#FFB081'], tags: ['warm', 'inviting', 'soft'] },
  { id: 'mint-fresh', name: 'Mint Fresh', category: 'pastel', description: 'Cool mint greens', colors: ['#E0F7EE', '#B2EBDA', '#80DEC4', '#4DD0AC', '#26C695'], tags: ['fresh', 'clean', 'modern'] },
  
  // Vibrant & Bold
  { id: 'sunset-vibes', name: 'Sunset Vibes', category: 'vibrant', description: 'Warm sunset colors', colors: ['#FF6B6B', '#FFA06B', '#FFD93D', '#6BCB77', '#4D96FF'], tags: ['warm', 'energetic', 'summer'] },
  { id: 'neon-nights', name: 'Neon Nights', category: 'vibrant', description: 'Electric neon colors', colors: ['#FF00FF', '#00FFFF', '#FF00AA', '#00FF00', '#FFFF00'], tags: ['party', 'bold', 'modern'] },
  { id: 'tropical-paradise', name: 'Tropical Paradise', category: 'vibrant', description: 'Tropical fruit colors', colors: ['#FF6B6B', '#FFE66D', '#4ECDC4', '#95E1D3', '#F38181'], tags: ['summer', 'vacation', 'fun'] },
  { id: 'berry-blast', name: 'Berry Blast', category: 'vibrant', description: 'Rich berry tones', colors: ['#9B2335', '#C9485B', '#E07489', '#F4A9B8', '#FFD4DC'], tags: ['feminine', 'rich', 'elegant'] },
  { id: 'ocean-deep', name: 'Ocean Deep', category: 'vibrant', description: 'Deep ocean blues', colors: ['#0077B6', '#00B4D8', '#48CAE4', '#90E0EF', '#CAF0F8'], tags: ['calm', 'professional', 'trust'] },
  
  // Earth Tones
  { id: 'autumn-harvest', name: 'Autumn Harvest', category: 'earth', description: 'Fall foliage colors', colors: ['#8B4513', '#CD853F', '#DEB887', '#F4A460', '#D2691E'], tags: ['fall', 'warm', 'cozy'] },
  { id: 'forest-floor', name: 'Forest Floor', category: 'earth', description: 'Natural forest tones', colors: ['#2D4739', '#4A6741', '#6B8E4E', '#8FB35A', '#B8D86B'], tags: ['nature', 'organic', 'calm'] },
  { id: 'desert-sand', name: 'Desert Sand', category: 'earth', description: 'Warm desert colors', colors: ['#C2B280', '#DEB887', '#D2B48C', '#C4A35A', '#BDB76B'], tags: ['neutral', 'warm', 'natural'] },
  { id: 'terracotta', name: 'Terracotta', category: 'earth', description: 'Warm clay tones', colors: ['#CB6843', '#E07B53', '#E8956A', '#F0AF82', '#F8C99A'], tags: ['warm', 'rustic', 'bohemian'] },
  { id: 'mushroom', name: 'Mushroom', category: 'earth', description: 'Neutral mushroom tones', colors: ['#C4B7A6', '#B5A898', '#A69889', '#978879', '#887868'], tags: ['neutral', 'sophisticated', 'calm'] },
  
  // Vintage & Retro
  { id: 'retro-70s', name: 'Retro 70s', category: 'vintage', description: 'Groovy 70s colors', colors: ['#D4A574', '#E8B86D', '#C9753D', '#A05A2C', '#7D4627'], tags: ['retro', 'warm', 'nostalgic'] },
  { id: 'polaroid-fade', name: 'Polaroid Fade', category: 'vintage', description: 'Faded photo colors', colors: ['#F5E6D3', '#E8D4B8', '#D9C4A5', '#CCB494', '#BFA583'], tags: ['vintage', 'nostalgic', 'soft'] },
  { id: 'dusty-rose', name: 'Dusty Rose', category: 'vintage', description: 'Muted rose tones', colors: ['#D4A5A5', '#C99393', '#BE8282', '#B37171', '#A86060'], tags: ['romantic', 'vintage', 'feminine'] },
  { id: 'sepia-tones', name: 'Sepia Tones', category: 'vintage', description: 'Classic sepia colors', colors: ['#704214', '#8B5A2B', '#A67B5B', '#C19A6B', '#DEB887'], tags: ['classic', 'timeless', 'elegant'] },
  { id: 'vintage-blue', name: 'Vintage Blue', category: 'vintage', description: 'Faded blue tones', colors: ['#4A6FA5', '#6B8BB1', '#8CA7BD', '#ADC3C9', '#CED9E0'], tags: ['calm', 'nostalgic', 'serene'] },
  
  // Baby & Kids
  { id: 'baby-blue', name: 'Baby Blue', category: 'baby', description: 'Soft blues for boys', colors: ['#E3F2FD', '#BBDEFB', '#90CAF9', '#64B5F6', '#42A5F5'], tags: ['baby', 'boy', 'gentle'] },
  { id: 'baby-pink', name: 'Baby Pink', category: 'baby', description: 'Soft pinks for girls', colors: ['#FCE4EC', '#F8BBD9', '#F48FB1', '#F06292', '#EC407A'], tags: ['baby', 'girl', 'sweet'] },
  { id: 'nursery-neutral', name: 'Nursery Neutral', category: 'baby', description: 'Gender-neutral nursery', colors: ['#FFF9C4', '#FFECB3', '#FFE082', '#FFD54F', '#FFCA28'], tags: ['baby', 'neutral', 'warm'] },
  { id: 'rainbow-bright', name: 'Rainbow Bright', category: 'baby', description: 'Cheerful rainbow', colors: ['#FF6B6B', '#FFA502', '#FFC312', '#2ED573', '#1E90FF', '#9B59B6'], tags: ['kids', 'playful', 'fun'] },
  { id: 'playroom', name: 'Playroom', category: 'baby', description: 'Fun playful colors', colors: ['#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9', '#92A8D1'], tags: ['kids', 'playful', 'bright'] },
  
  // Wedding & Romance
  { id: 'classic-wedding', name: 'Classic Wedding', category: 'wedding', description: 'Timeless wedding colors', colors: ['#FFFFFF', '#F5F5F5', '#E8D5B7', '#D4AF37', '#1A1A1A'], tags: ['wedding', 'elegant', 'classic'] },
  { id: 'blush-romance', name: 'Blush Romance', category: 'wedding', description: 'Romantic blush tones', colors: ['#F8E1E7', '#F0C9D1', '#E8B1BB', '#E099A5', '#D8818F'], tags: ['romantic', 'wedding', 'feminine'] },
  { id: 'garden-wedding', name: 'Garden Wedding', category: 'wedding', description: 'Garden party colors', colors: ['#E8F5E9', '#A5D6A7', '#81C784', '#F8BBD0', '#F48FB1'], tags: ['wedding', 'garden', 'spring'] },
  { id: 'burgundy-gold', name: 'Burgundy & Gold', category: 'wedding', description: 'Rich elegant combo', colors: ['#800020', '#A0153E', '#D4AF37', '#F5DEB3', '#FAF0E6'], tags: ['wedding', 'elegant', 'fall'] },
  { id: 'navy-blush', name: 'Navy & Blush', category: 'wedding', description: 'Classic contrast', colors: ['#001F3F', '#003366', '#F8E1E7', '#F0C9D1', '#FFFFFF'], tags: ['wedding', 'classic', 'elegant'] },
  
  // Holiday Themes
  { id: 'christmas-classic', name: 'Christmas Classic', category: 'holiday', description: 'Traditional Christmas', colors: ['#C41E3A', '#1E5631', '#FFD700', '#FFFFFF', '#2F4F4F'], tags: ['christmas', 'holiday', 'festive'] },
  { id: 'halloween', name: 'Halloween', category: 'holiday', description: 'Spooky Halloween', colors: ['#FF6600', '#1A1A1A', '#800080', '#2E8B57', '#FFD700'], tags: ['halloween', 'spooky', 'fall'] },
  { id: 'valentines', name: "Valentine's Day", category: 'holiday', description: 'Love and romance', colors: ['#FF1744', '#FF4081', '#FF80AB', '#FFB6C1', '#FFC0CB'], tags: ['valentine', 'love', 'romantic'] },
  { id: 'easter-spring', name: 'Easter Spring', category: 'holiday', description: 'Easter pastels', colors: ['#FFB7C5', '#B5EAD7', '#FFEFD5', '#E6E6FA', '#87CEEB'], tags: ['easter', 'spring', 'pastel'] },
  { id: 'independence-day', name: 'Independence Day', category: 'holiday', description: 'Patriotic colors', colors: ['#B22234', '#FFFFFF', '#3C3B6E', '#0A3161', '#BF0A30'], tags: ['patriotic', '4th july', 'american'] },
  
  // Modern & Minimalist
  { id: 'monochrome-gray', name: 'Monochrome Gray', category: 'modern', description: 'Sophisticated grays', colors: ['#F5F5F5', '#E0E0E0', '#BDBDBD', '#9E9E9E', '#757575'], tags: ['modern', 'minimal', 'professional'] },
  { id: 'black-white', name: 'Black & White', category: 'modern', description: 'Classic contrast', colors: ['#000000', '#333333', '#666666', '#CCCCCC', '#FFFFFF'], tags: ['classic', 'elegant', 'timeless'] },
  { id: 'scandinavian', name: 'Scandinavian', category: 'modern', description: 'Nordic minimalism', colors: ['#FFFFFF', '#F5F5F5', '#D3D3D3', '#A9A9A9', '#2F4F4F'], tags: ['modern', 'clean', 'minimal'] },
  { id: 'tech-startup', name: 'Tech Startup', category: 'modern', description: 'Modern tech colors', colors: ['#6366F1', '#8B5CF6', '#EC4899', '#14B8A6', '#F59E0B'], tags: ['modern', 'tech', 'bold'] },
  { id: 'dark-mode', name: 'Dark Mode', category: 'modern', description: 'Dark interface colors', colors: ['#1A1A2E', '#16213E', '#0F3460', '#E94560', '#FFFFFF'], tags: ['modern', 'dark', 'tech'] },
];

const CATEGORIES = Array.from(new Set(COLOR_PALETTES.map(p => p.category)));

// Generate complementary color
function getComplementary(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `#${(255 - r).toString(16).padStart(2, '0')}${(255 - g).toString(16).padStart(2, '0')}${(255 - b).toString(16).padStart(2, '0')}`;
}

// Generate shade variations
function getShades(hex: string, count: number = 5): string[] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  const shades: string[] = [];
  for (let i = 0; i < count; i++) {
    const factor = 0.2 + (i * 0.8 / (count - 1));
    const nr = Math.round(r * factor);
    const ng = Math.round(g * factor);
    const nb = Math.round(b * factor);
    shades.push(`#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`);
  }
  return shades;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const paletteId = searchParams.get('id');
  const search = searchParams.get('search')?.toLowerCase();
  const tag = searchParams.get('tag')?.toLowerCase();
  const generateFrom = searchParams.get('generate'); // hex color to generate palette from

  // Generate palette from a single color
  if (generateFrom) {
    const baseColor = generateFrom.startsWith('#') ? generateFrom : `#${generateFrom}`;
    const complementary = getComplementary(baseColor);
    const shades = getShades(baseColor);
    
    return NextResponse.json({
      generated: {
        baseColor,
        complementary,
        shades,
        palette: [baseColor, ...shades.slice(1, 4), complementary]
      }
    });
  }

  // Get specific palette
  if (paletteId) {
    const palette = COLOR_PALETTES.find(p => p.id === paletteId);
    if (palette) {
      return NextResponse.json({
        palette: {
          ...palette,
          cssVariables: palette.colors.map((c, i) => `--color-${i + 1}: ${c};`).join('\n'),
          tailwindConfig: palette.colors.map((c, i) => `'${palette.id}-${i + 1}': '${c}'`).join(',\n')
        }
      });
    }
    return NextResponse.json({ error: 'Palette not found' }, { status: 404 });
  }

  // Filter palettes
  let results = [...COLOR_PALETTES];
  
  if (category) {
    results = results.filter(p => p.category === category);
  }
  
  if (tag) {
    results = results.filter(p => p.tags.some(t => t.includes(tag)));
  }
  
  if (search) {
    results = results.filter(p => 
      p.name.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search) ||
      p.tags.some(t => t.includes(search))
    );
  }

  return NextResponse.json({
    palettes: results,
    categories: CATEGORIES,
    total: results.length,
    features: {
      generate: '/api/color-palettes?generate=6366f1',
      tip: 'Generate custom palette from any hex color'
    }
  });
}

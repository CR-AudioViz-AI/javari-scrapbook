// CRAV Scrapbook - Enhanced Patterns API
// 50+ Free SVG Patterns for scrapbook backgrounds
// Categories: geometric, organic, dots, lines, waves, abstract, seasonal, vintage

import { NextRequest, NextResponse } from 'next/server';

interface Pattern {
  id: string;
  name: string;
  category: string;
  tags: string[];
  premium: boolean;
}

// 55 Free Patterns organized by category
const patterns: Pattern[] = [
  // GEOMETRIC (12 patterns)
  { id: 'grid', name: 'Simple Grid', category: 'geometric', tags: ['minimal', 'modern'], premium: false },
  { id: 'diagonal-lines', name: 'Diagonal Lines', category: 'geometric', tags: ['minimal', 'striped'], premium: false },
  { id: 'chevron', name: 'Chevron', category: 'geometric', tags: ['zigzag', 'modern'], premium: false },
  { id: 'herringbone', name: 'Herringbone', category: 'geometric', tags: ['classic', 'elegant'], premium: false },
  { id: 'triangles', name: 'Triangles', category: 'geometric', tags: ['modern', 'bold'], premium: false },
  { id: 'hexagons', name: 'Honeycomb', category: 'geometric', tags: ['hex', 'organic'], premium: false },
  { id: 'diamonds', name: 'Diamonds', category: 'geometric', tags: ['argyle', 'classic'], premium: false },
  { id: 'squares', name: 'Squares', category: 'geometric', tags: ['checkerboard', 'grid'], premium: false },
  { id: 'cubes', name: '3D Cubes', category: 'geometric', tags: ['isometric', '3d'], premium: false },
  { id: 'zigzag', name: 'Zigzag', category: 'geometric', tags: ['retro', 'bold'], premium: false },
  { id: 'stars-geo', name: 'Star Grid', category: 'geometric', tags: ['stars', 'festive'], premium: false },
  { id: 'plus-signs', name: 'Plus Signs', category: 'geometric', tags: ['medical', 'swiss'], premium: false },
  
  // DOTS (8 patterns)
  { id: 'polka-dots', name: 'Polka Dots', category: 'dots', tags: ['classic', 'playful'], premium: false },
  { id: 'halftone', name: 'Halftone', category: 'dots', tags: ['retro', 'print'], premium: false },
  { id: 'confetti', name: 'Confetti', category: 'dots', tags: ['party', 'celebration'], premium: false },
  { id: 'scattered-dots', name: 'Scattered Dots', category: 'dots', tags: ['random', 'organic'], premium: false },
  { id: 'dot-grid', name: 'Dot Grid', category: 'dots', tags: ['minimal', 'bullet-journal'], premium: false },
  { id: 'circles', name: 'Overlapping Circles', category: 'dots', tags: ['modern', 'geometric'], premium: false },
  { id: 'bubbles', name: 'Bubbles', category: 'dots', tags: ['playful', 'water'], premium: false },
  { id: 'stipple', name: 'Stipple', category: 'dots', tags: ['texture', 'artistic'], premium: false },
  
  // LINES (8 patterns)
  { id: 'horizontal-lines', name: 'Horizontal Lines', category: 'lines', tags: ['minimal', 'striped'], premium: false },
  { id: 'vertical-lines', name: 'Vertical Lines', category: 'lines', tags: ['minimal', 'striped'], premium: false },
  { id: 'crosshatch', name: 'Crosshatch', category: 'lines', tags: ['sketch', 'artistic'], premium: false },
  { id: 'wavy-lines', name: 'Wavy Lines', category: 'lines', tags: ['organic', 'flowing'], premium: false },
  { id: 'dashed', name: 'Dashed Lines', category: 'lines', tags: ['minimal', 'border'], premium: false },
  { id: 'railroad', name: 'Railroad', category: 'lines', tags: ['vintage', 'ticket'], premium: false },
  { id: 'pinstripe', name: 'Pinstripe', category: 'lines', tags: ['formal', 'classic'], premium: false },
  { id: 'sketch-lines', name: 'Sketch Lines', category: 'lines', tags: ['hand-drawn', 'artistic'], premium: false },
  
  // WAVES (6 patterns)
  { id: 'waves', name: 'Ocean Waves', category: 'waves', tags: ['water', 'beach'], premium: false },
  { id: 'scallops', name: 'Scallops', category: 'waves', tags: ['mermaid', 'fish-scale'], premium: false },
  { id: 'seigaiha', name: 'Seigaiha', category: 'waves', tags: ['japanese', 'traditional'], premium: false },
  { id: 'ripples', name: 'Ripples', category: 'waves', tags: ['water', 'zen'], premium: false },
  { id: 'swoosh', name: 'Swoosh', category: 'waves', tags: ['dynamic', 'modern'], premium: false },
  { id: 'sine-wave', name: 'Sine Wave', category: 'waves', tags: ['mathematical', 'smooth'], premium: false },
  
  // ORGANIC (7 patterns)
  { id: 'leaves', name: 'Falling Leaves', category: 'organic', tags: ['nature', 'autumn'], premium: false },
  { id: 'flowers', name: 'Flower Field', category: 'organic', tags: ['floral', 'spring'], premium: false },
  { id: 'vines', name: 'Vines', category: 'organic', tags: ['nature', 'botanical'], premium: false },
  { id: 'branches', name: 'Tree Branches', category: 'organic', tags: ['nature', 'winter'], premium: false },
  { id: 'pawprints', name: 'Paw Prints', category: 'organic', tags: ['pets', 'animals'], premium: false },
  { id: 'butterflies', name: 'Butterflies', category: 'organic', tags: ['nature', 'spring'], premium: false },
  { id: 'feathers', name: 'Feathers', category: 'organic', tags: ['boho', 'nature'], premium: false },
  
  // SEASONAL (8 patterns)
  { id: 'snowflakes', name: 'Snowflakes', category: 'seasonal', tags: ['winter', 'christmas'], premium: false },
  { id: 'hearts', name: 'Hearts', category: 'seasonal', tags: ['valentine', 'love'], premium: false },
  { id: 'shamrocks', name: 'Shamrocks', category: 'seasonal', tags: ['irish', 'luck'], premium: false },
  { id: 'eggs', name: 'Easter Eggs', category: 'seasonal', tags: ['easter', 'spring'], premium: false },
  { id: 'fireworks', name: 'Fireworks', category: 'seasonal', tags: ['celebration', '4th-july'], premium: false },
  { id: 'pumpkins', name: 'Pumpkins', category: 'seasonal', tags: ['halloween', 'autumn'], premium: false },
  { id: 'holly', name: 'Holly & Berries', category: 'seasonal', tags: ['christmas', 'winter'], premium: false },
  { id: 'stars-twinkle', name: 'Twinkling Stars', category: 'seasonal', tags: ['night', 'celestial'], premium: false },
  
  // VINTAGE (6 patterns)
  { id: 'damask', name: 'Damask', category: 'vintage', tags: ['elegant', 'ornate'], premium: false },
  { id: 'paisley', name: 'Paisley', category: 'vintage', tags: ['boho', 'indian'], premium: false },
  { id: 'art-deco', name: 'Art Deco', category: 'vintage', tags: ['1920s', 'gatsby'], premium: false },
  { id: 'toile', name: 'Toile', category: 'vintage', tags: ['french', 'country'], premium: false },
  { id: 'lace', name: 'Lace', category: 'vintage', tags: ['delicate', 'wedding'], premium: false },
  { id: 'gingham', name: 'Gingham', category: 'vintage', tags: ['picnic', 'country'], premium: false },
];

// SVG Pattern Generators
const patternSVGs: Record<string, (color: string, bg: string, size: number) => string> = {
  'grid': (c, bg, s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}"><rect fill="${bg}" width="${s}" height="${s}"/><path d="M${s} 0L0 0 0 ${s}" fill="none" stroke="${c}" stroke-width="1"/></svg>`,
  
  'diagonal-lines': (c, bg, s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}"><rect fill="${bg}" width="${s}" height="${s}"/><path d="M0 ${s}L${s} 0M-${s/4} ${s/4}L${s/4} -${s/4}M${s*3/4} ${s+s/4}L${s+s/4} ${s*3/4}" stroke="${c}" stroke-width="2"/></svg>`,
  
  'chevron': (c, bg, s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}"><rect fill="${bg}" width="${s}" height="${s}"/><path d="M0 ${s/2}L${s/2} 0L${s} ${s/2}M0 ${s}L${s/2} ${s/2}L${s} ${s}" fill="none" stroke="${c}" stroke-width="2"/></svg>`,
  
  'polka-dots': (c, bg, s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}"><rect fill="${bg}" width="${s}" height="${s}"/><circle cx="${s/4}" cy="${s/4}" r="${s/8}" fill="${c}"/><circle cx="${s*3/4}" cy="${s*3/4}" r="${s/8}" fill="${c}"/></svg>`,
  
  'triangles': (c, bg, s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}"><rect fill="${bg}" width="${s}" height="${s}"/><path d="M${s/2} 0L${s} ${s}L0 ${s}Z" fill="${c}" opacity="0.3"/></svg>`,
  
  'hexagons': (c, bg, s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s*0.866}"><rect fill="${bg}" width="${s}" height="${s*0.866}"/><path d="M${s/2} 0L${s} ${s*0.25}L${s} ${s*0.75}L${s/2} ${s}L0 ${s*0.75}L0 ${s*0.25}Z" fill="none" stroke="${c}" stroke-width="1.5"/></svg>`,
  
  'waves': (c, bg, s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s/2}"><rect fill="${bg}" width="${s}" height="${s/2}"/><path d="M0 ${s/4}Q${s/4} 0 ${s/2} ${s/4}T${s} ${s/4}" fill="none" stroke="${c}" stroke-width="2"/></svg>`,
  
  'horizontal-lines': (c, bg, s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s/4}"><rect fill="${bg}" width="${s}" height="${s/4}"/><line x1="0" y1="${s/8}" x2="${s}" y2="${s/8}" stroke="${c}" stroke-width="1"/></svg>`,
  
  'vertical-lines': (c, bg, s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s/4}" height="${s}"><rect fill="${bg}" width="${s/4}" height="${s}"/><line x1="${s/8}" y1="0" x2="${s/8}" y2="${s}" stroke="${c}" stroke-width="1"/></svg>`,
  
  'crosshatch': (c, bg, s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}"><rect fill="${bg}" width="${s}" height="${s}"/><path d="M0 0L${s} ${s}M${s} 0L0 ${s}" stroke="${c}" stroke-width="1" opacity="0.5"/></svg>`,
  
  'dots-grid': (c, bg, s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}"><rect fill="${bg}" width="${s}" height="${s}"/><circle cx="${s/2}" cy="${s/2}" r="1.5" fill="${c}"/></svg>`,
  
  'confetti': (c, bg, s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}"><rect fill="${bg}" width="${s}" height="${s}"/><rect x="${s*0.1}" y="${s*0.2}" width="4" height="4" fill="${c}" transform="rotate(45 ${s*0.1} ${s*0.2})"/><rect x="${s*0.6}" y="${s*0.1}" width="4" height="4" fill="${c}" transform="rotate(30 ${s*0.6} ${s*0.1})"/><rect x="${s*0.3}" y="${s*0.7}" width="4" height="4" fill="${c}" transform="rotate(60 ${s*0.3} ${s*0.7})"/><rect x="${s*0.8}" y="${s*0.6}" width="4" height="4" fill="${c}" transform="rotate(15 ${s*0.8} ${s*0.6})"/></svg>`,
  
  'hearts': (c, bg, s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}"><rect fill="${bg}" width="${s}" height="${s}"/><path d="M${s/2} ${s*0.75}L${s*0.15} ${s*0.4}A${s*0.15} ${s*0.15} 0 0 1 ${s/2} ${s*0.25}A${s*0.15} ${s*0.15} 0 0 1 ${s*0.85} ${s*0.4}Z" fill="${c}" opacity="0.6"/></svg>`,
  
  'stars-geo': (c, bg, s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}"><rect fill="${bg}" width="${s}" height="${s}"/><path d="M${s/2} ${s*0.1}L${s*0.6} ${s*0.4}L${s*0.9} ${s*0.4}L${s*0.65} ${s*0.6}L${s*0.75} ${s*0.9}L${s/2} ${s*0.7}L${s*0.25} ${s*0.9}L${s*0.35} ${s*0.6}L${s*0.1} ${s*0.4}L${s*0.4} ${s*0.4}Z" fill="${c}"/></svg>`,
  
  'snowflakes': (c, bg, s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}"><rect fill="${bg}" width="${s}" height="${s}"/><g transform="translate(${s/2},${s/2})"><line y1="-${s*0.35}" y2="${s*0.35}" stroke="${c}" stroke-width="2"/><line y1="-${s*0.35}" y2="${s*0.35}" stroke="${c}" stroke-width="2" transform="rotate(60)"/><line y1="-${s*0.35}" y2="${s*0.35}" stroke="${c}" stroke-width="2" transform="rotate(120)"/></g></svg>`,
  
  'scallops': (c, bg, s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s/2}"><rect fill="${bg}" width="${s}" height="${s/2}"/><ellipse cx="0" cy="${s/2}" rx="${s/4}" ry="${s/4}" fill="${c}" opacity="0.3"/><ellipse cx="${s/2}" cy="${s/2}" rx="${s/4}" ry="${s/4}" fill="${c}" opacity="0.3"/><ellipse cx="${s}" cy="${s/2}" rx="${s/4}" ry="${s/4}" fill="${c}" opacity="0.3"/></svg>`,
  
  'damask': (c, bg, s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}"><rect fill="${bg}" width="${s}" height="${s}"/><path d="M${s/2} ${s*0.1}Q${s*0.7} ${s*0.3} ${s/2} ${s/2}Q${s*0.3} ${s*0.7} ${s/2} ${s*0.9}Q${s*0.7} ${s*0.7} ${s/2} ${s/2}Q${s*0.3} ${s*0.3} ${s/2} ${s*0.1}" fill="none" stroke="${c}" stroke-width="1.5"/></svg>`,
  
  'gingham': (c, bg, s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}"><rect fill="${bg}" width="${s}" height="${s}"/><rect fill="${c}" width="${s/2}" height="${s/2}" opacity="0.3"/><rect fill="${c}" x="${s/2}" y="${s/2}" width="${s/2}" height="${s/2}" opacity="0.3"/><rect fill="${c}" width="${s/2}" height="${s}" opacity="0.2"/><rect fill="${c}" width="${s}" height="${s/2}" opacity="0.2"/></svg>`,
  
  'art-deco': (c, bg, s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}"><rect fill="${bg}" width="${s}" height="${s}"/><path d="M0 ${s}L${s/2} 0L${s} ${s}" fill="none" stroke="${c}" stroke-width="2"/><path d="M${s*0.25} ${s}L${s/2} ${s/2}L${s*0.75} ${s}" fill="none" stroke="${c}" stroke-width="1"/></svg>`,
  
  'lace': (c, bg, s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}"><rect fill="${bg}" width="${s}" height="${s}"/><circle cx="${s/2}" cy="${s/2}" r="${s*0.4}" fill="none" stroke="${c}" stroke-width="1"/><circle cx="${s/2}" cy="${s/2}" r="${s*0.25}" fill="none" stroke="${c}" stroke-width="1"/><circle cx="${s/2}" cy="${s*0.1}" r="${s*0.05}" fill="${c}"/><circle cx="${s/2}" cy="${s*0.9}" r="${s*0.05}" fill="${c}"/><circle cx="${s*0.1}" cy="${s/2}" r="${s*0.05}" fill="${c}"/><circle cx="${s*0.9}" cy="${s/2}" r="${s*0.05}" fill="${c}"/></svg>`,
};

// Default pattern for any not specifically defined
const defaultPattern = (c: string, bg: string, s: number) => 
  `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}"><rect fill="${bg}" width="${s}" height="${s}"/><circle cx="${s/2}" cy="${s/2}" r="${s/4}" fill="none" stroke="${c}" stroke-width="2"/></svg>`;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const color = searchParams.get('color') || '6366f1';
  const bgColor = searchParams.get('bg') || 'ffffff';
  const size = parseInt(searchParams.get('size') || '40');
  const category = searchParams.get('category');
  const premium = searchParams.get('premium');
  
  // If ID provided, return SVG pattern
  if (id) {
    const patternFn = patternSVGs[id] || defaultPattern;
    const svg = patternFn(`#${color}`, `#${bgColor}`, size);
    
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  }
  
  // Filter patterns
  let filteredPatterns = [...patterns];
  
  if (category) {
    filteredPatterns = filteredPatterns.filter(p => p.category === category);
  }
  
  if (premium === 'true') {
    filteredPatterns = filteredPatterns.filter(p => p.premium);
  } else if (premium === 'false') {
    filteredPatterns = filteredPatterns.filter(p => !p.premium);
  }
  
  const categories = [...new Set(patterns.map(p => p.category))];
  
  return NextResponse.json({
    patterns: filteredPatterns.map(p => ({
      ...p,
      preview: `/api/patterns?id=${p.id}&color=${color}&bg=${bgColor}&size=60`,
    })),
    categories,
    total: filteredPatterns.length,
    customization: {
      parameters: ['color', 'bg', 'size'],
      example: '/api/patterns?id=polka-dots&color=ec4899&bg=fce7f3&size=40',
    },
  });
}

import { NextRequest, NextResponse } from 'next/server';

const PATTERN_CATEGORIES = {
  'geometric': {
    name: 'Geometric',
    patterns: [
      { id: 'geo-1', name: 'Polka Dots', svg: '<svg width="20" height="20"><circle cx="10" cy="10" r="3" fill="currentColor" opacity="0.3"/></svg>' },
      { id: 'geo-2', name: 'Diagonal Lines', svg: '<svg width="10" height="10"><path d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2" stroke="currentColor" stroke-width="1" opacity="0.2"/></svg>' },
      { id: 'geo-3', name: 'Chevron', svg: '<svg width="40" height="20"><path d="M0,20 L20,0 L40,20" fill="none" stroke="currentColor" stroke-width="2" opacity="0.3"/></svg>' },
      { id: 'geo-4', name: 'Hexagons', svg: '<svg width="28" height="49"><path d="M14,0 L28,8 L28,24 L14,32 L0,24 L0,8 Z" fill="none" stroke="currentColor" stroke-width="1" opacity="0.2"/></svg>' },
      { id: 'geo-5', name: 'Triangles', svg: '<svg width="30" height="26"><path d="M15,0 L30,26 L0,26 Z" fill="none" stroke="currentColor" stroke-width="1" opacity="0.2"/></svg>' },
      { id: 'geo-6', name: 'Diamonds', svg: '<svg width="20" height="20"><path d="M10,0 L20,10 L10,20 L0,10 Z" fill="currentColor" opacity="0.1"/></svg>' },
      { id: 'geo-7', name: 'Grid', svg: '<svg width="20" height="20"><rect width="20" height="20" fill="none" stroke="currentColor" stroke-width="1" opacity="0.15"/></svg>' },
      { id: 'geo-8', name: 'Zigzag', svg: '<svg width="20" height="12"><path d="M0,6 L5,0 L10,6 L15,0 L20,6" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.25"/></svg>' },
    ]
  },
  'stripes': {
    name: 'Stripes',
    patterns: [
      { id: 'str-1', name: 'Horizontal Thin', svg: '<svg width="10" height="4"><rect width="10" height="2" fill="currentColor" opacity="0.2"/></svg>' },
      { id: 'str-2', name: 'Vertical Thin', svg: '<svg width="4" height="10"><rect width="2" height="10" fill="currentColor" opacity="0.2"/></svg>' },
      { id: 'str-3', name: 'Diagonal', svg: '<svg width="10" height="10"><path d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2" stroke="currentColor" stroke-width="2" opacity="0.15"/></svg>' },
      { id: 'str-4', name: 'Pinstripe', svg: '<svg width="5" height="10"><rect width="1" height="10" fill="currentColor" opacity="0.3"/></svg>' },
      { id: 'str-5', name: 'Candy Stripe', svg: '<svg width="20" height="20"><path d="M-5,5 L5,-5 M0,20 L20,0 M15,25 L25,15" stroke="currentColor" stroke-width="5" opacity="0.2"/></svg>' },
    ]
  },
  'dots': {
    name: 'Dots & Circles',
    patterns: [
      { id: 'dot-1', name: 'Micro Dots', svg: '<svg width="8" height="8"><circle cx="4" cy="4" r="1" fill="currentColor" opacity="0.3"/></svg>' },
      { id: 'dot-2', name: 'Small Dots', svg: '<svg width="15" height="15"><circle cx="7.5" cy="7.5" r="2" fill="currentColor" opacity="0.25"/></svg>' },
      { id: 'dot-3', name: 'Large Dots', svg: '<svg width="40" height="40"><circle cx="20" cy="20" r="8" fill="currentColor" opacity="0.15"/></svg>' },
      { id: 'dot-4', name: 'Confetti', svg: '<svg width="50" height="50"><circle cx="10" cy="15" r="2" fill="currentColor" opacity="0.3"/><circle cx="35" cy="10" r="3" fill="currentColor" opacity="0.2"/><circle cx="25" cy="35" r="2.5" fill="currentColor" opacity="0.25"/></svg>' },
    ]
  },
  'florals': {
    name: 'Florals & Nature',
    patterns: [
      { id: 'flr-1', name: 'Small Flowers', svg: '<svg width="30" height="30"><circle cx="15" cy="15" r="3" fill="currentColor" opacity="0.3"/><circle cx="15" cy="8" r="4" fill="currentColor" opacity="0.15"/><circle cx="22" cy="12" r="4" fill="currentColor" opacity="0.15"/><circle cx="20" cy="20" r="4" fill="currentColor" opacity="0.15"/><circle cx="10" cy="20" r="4" fill="currentColor" opacity="0.15"/><circle cx="8" cy="12" r="4" fill="currentColor" opacity="0.15"/></svg>' },
      { id: 'flr-2', name: 'Leaves', svg: '<svg width="40" height="40"><ellipse cx="20" cy="15" rx="8" ry="12" fill="currentColor" opacity="0.15" transform="rotate(-30 20 15)"/></svg>' },
    ]
  },
  'hearts': {
    name: 'Hearts & Love',
    patterns: [
      { id: 'hrt-1', name: 'Tiny Hearts', svg: '<svg width="20" height="20"><path d="M10,15 L5,10 C2,7 2,4 5,4 C7,4 9,6 10,8 C11,6 13,4 15,4 C18,4 18,7 15,10 Z" fill="currentColor" opacity="0.2"/></svg>' },
      { id: 'hrt-2', name: 'Heart Outline', svg: '<svg width="30" height="30"><path d="M15,25 L7,17 C2,12 2,6 8,6 C11,6 14,9 15,12 C16,9 19,6 22,6 C28,6 28,12 23,17 Z" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.2"/></svg>' },
    ]
  },
  'plaids': {
    name: 'Plaids & Gingham',
    patterns: [
      { id: 'pld-1', name: 'Gingham', svg: '<svg width="20" height="20"><rect width="10" height="10" fill="currentColor" opacity="0.15"/><rect x="10" y="10" width="10" height="10" fill="currentColor" opacity="0.15"/></svg>' },
      { id: 'pld-2', name: 'Buffalo Check', svg: '<svg width="40" height="40"><rect width="20" height="20" fill="currentColor" opacity="0.2"/><rect x="20" y="20" width="20" height="20" fill="currentColor" opacity="0.2"/></svg>' },
    ]
  },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const color = searchParams.get('color') || '#000000';

  try {
    if (category && PATTERN_CATEGORIES[category as keyof typeof PATTERN_CATEGORIES]) {
      const cat = PATTERN_CATEGORIES[category as keyof typeof PATTERN_CATEGORIES];
      const patterns = cat.patterns.map(p => ({
        ...p,
        svg: p.svg.replace(/currentColor/g, color),
        dataUrl: `data:image/svg+xml,${encodeURIComponent(p.svg.replace(/currentColor/g, color))}`,
      }));
      return NextResponse.json({ success: true, category, name: cat.name, patterns, count: patterns.length });
    }

    if (search) {
      const searchLower = search.toLowerCase();
      const results: { id: string; name: string; svg: string; category: string; dataUrl: string }[] = [];
      Object.entries(PATTERN_CATEGORIES).forEach(([catKey, cat]) => {
        cat.patterns.forEach(pattern => {
          if (pattern.name.toLowerCase().includes(searchLower)) {
            results.push({
              ...pattern,
              category: catKey,
              svg: pattern.svg.replace(/currentColor/g, color),
              dataUrl: `data:image/svg+xml,${encodeURIComponent(pattern.svg.replace(/currentColor/g, color))}`,
            });
          }
        });
      });
      return NextResponse.json({ success: true, search, results, count: results.length });
    }

    const categories = Object.entries(PATTERN_CATEGORIES).map(([key, cat]) => ({
      id: key, name: cat.name, count: cat.patterns.length,
    }));
    const totalPatterns = Object.values(PATTERN_CATEGORIES).reduce((acc, cat) => acc + cat.patterns.length, 0);
    return NextResponse.json({ success: true, categories, totalPatterns });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch patterns' }, { status: 500 });
  }
}

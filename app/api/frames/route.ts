// app/api/frames/route.ts
// Decorative Frames & Borders for Photo Enhancement
// All SVG-based for perfect scaling at any size

import { NextResponse } from 'next/server';

interface Frame {
  id: string;
  name: string;
  category: string;
  description: string;
  svg: (width: number, height: number, color: string, accent?: string) => string;
}

const FRAMES: Frame[] = [
  // Classic Frames
  {
    id: 'classic-simple',
    name: 'Classic Simple',
    category: 'classic',
    description: 'Clean double-line border',
    svg: (w, h, c) => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="${w-4}" height="${h-4}" fill="none" stroke="${c}" stroke-width="4"/>
      <rect x="10" y="10" width="${w-20}" height="${h-20}" fill="none" stroke="${c}" stroke-width="1"/>
    </svg>`
  },
  {
    id: 'classic-ornate',
    name: 'Classic Ornate',
    category: 'classic',
    description: 'Victorian-style decorative corners',
    svg: (w, h, c) => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="15" width="${w-30}" height="${h-30}" fill="none" stroke="${c}" stroke-width="2"/>
      <path d="M0,0 Q15,0 15,15 M${w},0 Q${w-15},0 ${w-15},15 M0,${h} Q15,${h} 15,${h-15} M${w},${h} Q${w-15},${h} ${w-15},${h-15}" fill="none" stroke="${c}" stroke-width="3"/>
      <circle cx="7" cy="7" r="4" fill="${c}"/>
      <circle cx="${w-7}" cy="7" r="4" fill="${c}"/>
      <circle cx="7" cy="${h-7}" r="4" fill="${c}"/>
      <circle cx="${w-7}" cy="${h-7}" r="4" fill="${c}"/>
    </svg>`
  },
  {
    id: 'classic-gold',
    name: 'Classic Gold',
    category: 'classic',
    description: 'Elegant gold-style frame',
    svg: (w, h, c, a = '#D4AF37') => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="${w-10}" height="${h-10}" fill="none" stroke="${a}" stroke-width="8"/>
      <rect x="12" y="12" width="${w-24}" height="${h-24}" fill="none" stroke="${c}" stroke-width="2"/>
      <rect x="2" y="2" width="${w-4}" height="${h-4}" fill="none" stroke="${a}" stroke-width="2"/>
    </svg>`
  },
  
  // Modern Frames
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    category: 'modern',
    description: 'Ultra-thin clean border',
    svg: (w, h, c) => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="${w-16}" height="${h-16}" fill="none" stroke="${c}" stroke-width="1"/>
    </svg>`
  },
  {
    id: 'modern-shadow',
    name: 'Modern Shadow',
    category: 'modern',
    description: 'Floating frame with shadow effect',
    svg: (w, h, c) => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <defs><filter id="shadow"><feDropShadow dx="3" dy="3" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
      <rect x="10" y="10" width="${w-25}" height="${h-25}" fill="white" filter="url(#shadow)" stroke="${c}" stroke-width="2"/>
    </svg>`
  },
  {
    id: 'modern-gradient',
    name: 'Modern Gradient',
    category: 'modern',
    description: 'Gradient border effect',
    svg: (w, h, c, a = '#ec4899') => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${c};stop-opacity:1"/>
          <stop offset="100%" style="stop-color:${a};stop-opacity:1"/>
        </linearGradient>
      </defs>
      <rect x="5" y="5" width="${w-10}" height="${h-10}" fill="none" stroke="url(#grad)" stroke-width="6"/>
    </svg>`
  },
  
  // Vintage Frames
  {
    id: 'vintage-distressed',
    name: 'Vintage Distressed',
    category: 'vintage',
    description: 'Weathered antique look',
    svg: (w, h, c) => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="${w-16}" height="${h-16}" fill="none" stroke="${c}" stroke-width="6" stroke-dasharray="20,3,3,3"/>
      <rect x="15" y="15" width="${w-30}" height="${h-30}" fill="none" stroke="${c}" stroke-width="1" opacity="0.5"/>
    </svg>`
  },
  {
    id: 'vintage-oval',
    name: 'Vintage Oval',
    category: 'vintage',
    description: 'Classic oval portrait frame',
    svg: (w, h, c) => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="${w/2}" cy="${h/2}" rx="${w/2-10}" ry="${h/2-10}" fill="none" stroke="${c}" stroke-width="6"/>
      <ellipse cx="${w/2}" cy="${h/2}" rx="${w/2-18}" ry="${h/2-18}" fill="none" stroke="${c}" stroke-width="2"/>
    </svg>`
  },
  
  // Decorative Frames
  {
    id: 'decorative-scallop',
    name: 'Scalloped Edge',
    category: 'decorative',
    description: 'Wavy scalloped border',
    svg: (w, h, c) => {
      const scallops = 12;
      const sw = w / scallops;
      let path = `M ${sw/2} 0`;
      for (let i = 0; i < scallops; i++) {
        path += ` Q ${sw*i + sw} 8, ${sw*i + sw*1.5} 0`;
      }
      return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="8" width="${w-16}" height="${h-16}" fill="none" stroke="${c}" stroke-width="2"/>
        <path d="${path}" fill="none" stroke="${c}" stroke-width="2"/>
      </svg>`;
    }
  },
  {
    id: 'decorative-hearts',
    name: 'Heart Corners',
    category: 'decorative',
    description: 'Hearts at each corner',
    svg: (w, h, c) => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="15" width="${w-30}" height="${h-30}" fill="none" stroke="${c}" stroke-width="2"/>
      <path d="M15,8 C12,2 5,2 5,8 C5,14 15,20 15,20 C15,20 25,14 25,8 C25,2 18,2 15,8" fill="${c}"/>
      <path d="M${w-15},8 C${w-18},2 ${w-25},2 ${w-25},8 C${w-25},14 ${w-15},20 ${w-15},20 C${w-15},20 ${w-5},14 ${w-5},8 C${w-5},2 ${w-12},2 ${w-15},8" fill="${c}"/>
      <path d="M15,${h-8} C12,${h-14} 5,${h-14} 5,${h-8} C5,${h-2} 15,${h+4} 15,${h+4} C15,${h+4} 25,${h-2} 25,${h-8} C25,${h-14} 18,${h-14} 15,${h-8}" fill="${c}" transform="rotate(180 15 ${h-8})"/>
      <path d="M${w-15},${h-8} C${w-18},${h-14} ${w-25},${h-14} ${w-25},${h-8} C${w-25},${h-2} ${w-15},${h+4} ${w-15},${h+4} C${w-15},${h+4} ${w-5},${h-2} ${w-5},${h-8} C${w-5},${h-14} ${w-12},${h-14} ${w-15},${h-8}" fill="${c}" transform="rotate(180 ${w-15} ${h-8})"/>
    </svg>`
  },
  {
    id: 'decorative-stars',
    name: 'Star Corners',
    category: 'decorative',
    description: 'Stars decorating corners',
    svg: (w, h, c) => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <rect x="18" y="18" width="${w-36}" height="${h-36}" fill="none" stroke="${c}" stroke-width="2"/>
      <polygon points="15,2 17,10 25,10 19,15 21,23 15,18 9,23 11,15 5,10 13,10" fill="${c}"/>
      <polygon points="${w-15},2 ${w-13},10 ${w-5},10 ${w-11},15 ${w-9},23 ${w-15},18 ${w-21},23 ${w-19},15 ${w-25},10 ${w-17},10" fill="${c}"/>
      <polygon points="15,${h-2} 17,${h-10} 25,${h-10} 19,${h-15} 21,${h-23} 15,${h-18} 9,${h-23} 11,${h-15} 5,${h-10} 13,${h-10}" fill="${c}"/>
      <polygon points="${w-15},${h-2} ${w-13},${h-10} ${w-5},${h-10} ${w-11},${h-15} ${w-9},${h-23} ${w-15},${h-18} ${w-21},${h-23} ${w-19},${h-15} ${w-25},${h-10} ${w-17},${h-10}" fill="${c}"/>
    </svg>`
  },
  
  // Polaroid Styles
  {
    id: 'polaroid-classic',
    name: 'Polaroid Classic',
    category: 'polaroid',
    description: 'Classic instant photo style',
    svg: (w, h, c) => `<svg viewBox="0 0 ${w} ${h+40}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${w}" height="${h+40}" fill="white" stroke="${c}" stroke-width="1"/>
      <rect x="10" y="10" width="${w-20}" height="${h-20}" fill="#f0f0f0"/>
    </svg>`
  },
  {
    id: 'polaroid-tilted',
    name: 'Polaroid Tilted',
    category: 'polaroid',
    description: 'Slightly rotated instant photo',
    svg: (w, h, c) => `<svg viewBox="0 0 ${w+20} ${h+50}" xmlns="http://www.w3.org/2000/svg">
      <g transform="rotate(-3 ${w/2} ${h/2})">
        <rect x="10" y="5" width="${w}" height="${h+40}" fill="white" stroke="${c}" stroke-width="1"/>
        <rect x="20" y="15" width="${w-20}" height="${h-20}" fill="#f0f0f0"/>
      </g>
    </svg>`
  },
  
  // Fun Frames
  {
    id: 'fun-dashed',
    name: 'Dashed Border',
    category: 'fun',
    description: 'Playful dashed line border',
    svg: (w, h, c) => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="${w-20}" height="${h-20}" fill="none" stroke="${c}" stroke-width="4" stroke-dasharray="15,10" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: 'fun-dots',
    name: 'Dotted Border',
    category: 'fun',
    description: 'Dotted line border',
    svg: (w, h, c) => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="${w-20}" height="${h-20}" fill="none" stroke="${c}" stroke-width="4" stroke-dasharray="2,8" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: 'fun-rainbow',
    name: 'Rainbow Border',
    category: 'fun',
    description: 'Multi-colored rainbow effect',
    svg: (w, h) => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="${w-6}" height="${h-6}" fill="none" stroke="#ff0000" stroke-width="3"/>
      <rect x="6" y="6" width="${w-12}" height="${h-12}" fill="none" stroke="#ff7f00" stroke-width="3"/>
      <rect x="9" y="9" width="${w-18}" height="${h-18}" fill="none" stroke="#ffff00" stroke-width="3"/>
      <rect x="12" y="12" width="${w-24}" height="${h-24}" fill="none" stroke="#00ff00" stroke-width="3"/>
      <rect x="15" y="15" width="${w-30}" height="${h-30}" fill="none" stroke="#0000ff" stroke-width="3"/>
      <rect x="18" y="18" width="${w-36}" height="${h-36}" fill="none" stroke="#8b00ff" stroke-width="3"/>
    </svg>`
  },
];

const CATEGORIES = [...new Set(FRAMES.map(f => f.category))];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const frameId = searchParams.get('id');
  const width = parseInt(searchParams.get('width') || '400');
  const height = parseInt(searchParams.get('height') || '300');
  const color = searchParams.get('color') || '6366f1';
  const accent = searchParams.get('accent') || 'ec4899';

  // Return specific frame as SVG
  if (frameId) {
    const frame = FRAMES.find(f => f.id === frameId);
    if (frame) {
      const svg = frame.svg(width, height, `#${color}`, `#${accent}`);
      const base64 = Buffer.from(svg).toString('base64');
      return NextResponse.json({
        frame: {
          id: frame.id,
          name: frame.name,
          category: frame.category,
          description: frame.description,
          svg,
          dataUrl: `data:image/svg+xml;base64,${base64}`,
          width,
          height,
          color: `#${color}`,
          accent: `#${accent}`
        }
      });
    }
    return NextResponse.json({ error: 'Frame not found' }, { status: 404 });
  }

  // Filter frames
  let results = [...FRAMES];
  if (category) {
    results = results.filter(f => f.category === category);
  }

  return NextResponse.json({
    frames: results.map(f => ({
      id: f.id,
      name: f.name,
      category: f.category,
      description: f.description,
      preview: `/api/frames?id=${f.id}&width=${width}&height=${height}&color=${color}`
    })),
    categories: CATEGORIES,
    total: results.length,
    customization: {
      parameters: ['width', 'height', 'color', 'accent'],
      example: '/api/frames?id=classic-gold&width=400&height=300&color=8B4513&accent=D4AF37'
    }
  });
}

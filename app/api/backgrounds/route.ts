// app/api/backgrounds/route.ts
// Background Textures and Gradients
// CSS gradients + texture patterns for page backgrounds

import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface Background {
  id: string;
  name: string;
  category: string;
  css: string;
  description: string;
}

const BACKGROUNDS: Background[] = [
  // Solid Colors (with subtle texture)
  {
    id: 'solid-white',
    name: 'Pure White',
    category: 'solid',
    css: 'background: #ffffff;',
    description: 'Clean white background'
  },
  {
    id: 'solid-cream',
    name: 'Cream',
    category: 'solid',
    css: 'background: #fffef0;',
    description: 'Warm off-white'
  },
  {
    id: 'solid-paper',
    name: 'Paper White',
    category: 'solid',
    css: 'background: #faf9f6;',
    description: 'Natural paper color'
  },
  {
    id: 'solid-black',
    name: 'Rich Black',
    category: 'solid',
    css: 'background: #1a1a1a;',
    description: 'Deep black'
  },
  
  // Gradients - Soft
  {
    id: 'gradient-sunrise',
    name: 'Sunrise',
    category: 'gradients',
    css: 'background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);',
    description: 'Pink to coral gradient'
  },
  {
    id: 'gradient-ocean',
    name: 'Ocean Breeze',
    category: 'gradients',
    css: 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);',
    description: 'Purple to indigo gradient'
  },
  {
    id: 'gradient-forest',
    name: 'Forest',
    category: 'gradients',
    css: 'background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);',
    description: 'Teal to green gradient'
  },
  {
    id: 'gradient-sunset',
    name: 'Sunset',
    category: 'gradients',
    css: 'background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);',
    description: 'Pink to yellow gradient'
  },
  {
    id: 'gradient-sky',
    name: 'Clear Sky',
    category: 'gradients',
    css: 'background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);',
    description: 'Soft teal to pink'
  },
  {
    id: 'gradient-lavender',
    name: 'Lavender Dream',
    category: 'gradients',
    css: 'background: linear-gradient(135deg, #c3cfe2 0%, #c3cfe2 100%);',
    description: 'Soft lavender'
  },
  {
    id: 'gradient-peach',
    name: 'Peach Blush',
    category: 'gradients',
    css: 'background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);',
    description: 'Warm peach gradient'
  },
  {
    id: 'gradient-mint',
    name: 'Fresh Mint',
    category: 'gradients',
    css: 'background: linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%);',
    description: 'Fresh green gradient'
  },
  {
    id: 'gradient-rose',
    name: 'Rose Gold',
    category: 'gradients',
    css: 'background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);',
    description: 'Gold to pink gradient'
  },
  {
    id: 'gradient-night',
    name: 'Night Sky',
    category: 'gradients',
    css: 'background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);',
    description: 'Dark blue night'
  },
  
  // Pastel gradients
  {
    id: 'pastel-pink',
    name: 'Cotton Candy',
    category: 'pastels',
    css: 'background: linear-gradient(135deg, #ffeef8 0%, #fff5f8 100%);',
    description: 'Soft pink pastel'
  },
  {
    id: 'pastel-blue',
    name: 'Baby Blue',
    category: 'pastels',
    css: 'background: linear-gradient(135deg, #e8f4f8 0%, #f0f8ff 100%);',
    description: 'Soft blue pastel'
  },
  {
    id: 'pastel-green',
    name: 'Mint Fresh',
    category: 'pastels',
    css: 'background: linear-gradient(135deg, #e8f8f0 0%, #f0fff4 100%);',
    description: 'Soft green pastel'
  },
  {
    id: 'pastel-yellow',
    name: 'Butter',
    category: 'pastels',
    css: 'background: linear-gradient(135deg, #fffef0 0%, #fffff5 100%);',
    description: 'Soft yellow pastel'
  },
  {
    id: 'pastel-purple',
    name: 'Lilac',
    category: 'pastels',
    css: 'background: linear-gradient(135deg, #f8f0ff 0%, #faf5ff 100%);',
    description: 'Soft purple pastel'
  },
  
  // Textures (CSS patterns)
  {
    id: 'texture-paper',
    name: 'Paper Texture',
    category: 'textures',
    css: 'background: #faf9f6; background-image: url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'4\' height=\'4\' viewBox=\'0 0 4 4\'%3E%3Cpath fill=\'%23d0cfc9\' fill-opacity=\'0.4\' d=\'M1 3h1v1H1V3zm2-2h1v1H3V1z\'%3E%3C/path%3E%3C/svg%3E");',
    description: 'Subtle paper grain'
  },
  {
    id: 'texture-linen',
    name: 'Linen',
    category: 'textures',
    css: 'background: #faf8f5; background-image: url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'8\' height=\'8\'%3E%3Crect fill=\'%23e8e4df\' fill-opacity=\'0.4\' width=\'1\' height=\'1\'/%3E%3C/svg%3E");',
    description: 'Fabric linen texture'
  },
  {
    id: 'texture-canvas',
    name: 'Canvas',
    category: 'textures',
    css: 'background: #f5f0e6; background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px);',
    description: 'Artist canvas texture'
  },
  {
    id: 'texture-cardboard',
    name: 'Cardboard',
    category: 'textures',
    css: 'background: #d2b48c; background-image: url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'4\' height=\'4\' viewBox=\'0 0 4 4\'%3E%3Cpath fill=\'%23c4a574\' fill-opacity=\'0.4\' d=\'M1 3h1v1H1V3zm2-2h1v1H3V1z\'%3E%3C/path%3E%3C/svg%3E");',
    description: 'Kraft paper look'
  },
  {
    id: 'texture-wood',
    name: 'Light Wood',
    category: 'textures',
    css: 'background: linear-gradient(90deg, #e8dcc4 0%, #f0e6d2 50%, #e8dcc4 100%);',
    description: 'Light wood grain'
  },
  {
    id: 'texture-chalkboard',
    name: 'Chalkboard',
    category: 'textures',
    css: 'background: #2c3e50; background-image: url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'4\' height=\'4\' viewBox=\'0 0 4 4\'%3E%3Cpath fill=\'%23ffffff\' fill-opacity=\'0.05\' d=\'M1 3h1v1H1V3zm2-2h1v1H3V1z\'%3E%3C/path%3E%3C/svg%3E");',
    description: 'Dark chalkboard surface'
  },
  
  // Special
  {
    id: 'special-bokeh',
    name: 'Bokeh Lights',
    category: 'special',
    css: 'background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); background-image: radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 10%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.08) 0%, transparent 15%), radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 20%);',
    description: 'Soft light bokeh effect'
  },
  {
    id: 'special-stars',
    name: 'Starry Night',
    category: 'special',
    css: 'background: #0c0c0c; background-image: radial-gradient(white 1px, transparent 1px); background-size: 50px 50px;',
    description: 'Night sky with stars'
  },
  {
    id: 'special-confetti',
    name: 'Confetti',
    category: 'special',
    css: 'background: #fff; background-image: radial-gradient(#ff6b6b 2px, transparent 2px), radial-gradient(#4ecdc4 2px, transparent 2px), radial-gradient(#ffe66d 2px, transparent 2px); background-size: 50px 50px, 30px 30px, 40px 40px; background-position: 0 0, 15px 15px, 25px 5px;',
    description: 'Festive confetti pattern'
  },
];

const CATEGORIES = Array.from(new Set(BACKGROUNDS.map(b => b.category)));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const bgId = searchParams.get('id');
  const search = searchParams.get('search')?.toLowerCase();

  // Get specific background
  if (bgId) {
    const bg = BACKGROUNDS.find(b => b.id === bgId);
    if (bg) {
      return NextResponse.json({
        background: {
          ...bg,
          usage: `style={{ ${bg.css} }}`
        }
      });
    }
    return NextResponse.json({ error: 'Background not found' }, { status: 404 });
  }

  // Filter backgrounds
  let results = [...BACKGROUNDS];
  
  if (category) {
    results = results.filter(b => b.category === category);
  }
  
  if (search) {
    results = results.filter(b => 
      b.name.toLowerCase().includes(search) ||
      b.description.toLowerCase().includes(search)
    );
  }

  return NextResponse.json({
    backgrounds: results,
    categories: CATEGORIES,
    total: results.length,
    usage: {
      tip: 'Apply CSS directly to container element style',
      example: '/api/backgrounds?category=gradients'
    }
  });
}

// app/api/text-effects/route.ts
// Text Effect Presets for Scrapbook Text Elements
// CSS-based effects for real-time preview

import { NextResponse } from 'next/server';

interface TextEffect {
  id: string;
  name: string;
  category: string;
  description: string;
  css: Record<string, string>;
}

const TEXT_EFFECTS: TextEffect[] = [
  // Shadows
  {
    id: 'shadow-soft',
    name: 'Soft Shadow',
    category: 'shadows',
    description: 'Subtle drop shadow',
    css: { textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }
  },
  {
    id: 'shadow-hard',
    name: 'Hard Shadow',
    category: 'shadows',
    description: 'Sharp drop shadow',
    css: { textShadow: '3px 3px 0px rgba(0,0,0,0.3)' }
  },
  {
    id: 'shadow-glow',
    name: 'Glow Effect',
    category: 'shadows',
    description: 'Soft glowing effect',
    css: { textShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.6)' }
  },
  {
    id: 'shadow-neon',
    name: 'Neon Glow',
    category: 'shadows',
    description: 'Bright neon effect',
    css: { textShadow: '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #0ff, 0 0 20px #0ff, 0 0 35px #0ff' }
  },
  {
    id: 'shadow-fire',
    name: 'Fire Glow',
    category: 'shadows',
    description: 'Warm fire effect',
    css: { textShadow: '0 0 5px #fff, 0 0 10px #ff0, 0 0 20px #ff8000, 0 0 30px #f00' }
  },
  {
    id: 'shadow-3d',
    name: '3D Effect',
    category: 'shadows',
    description: 'Stacked 3D look',
    css: { textShadow: '1px 1px 0px #999, 2px 2px 0px #888, 3px 3px 0px #777, 4px 4px 0px #666, 5px 5px 5px rgba(0,0,0,0.3)' }
  },
  {
    id: 'shadow-retro',
    name: 'Retro Offset',
    category: 'shadows',
    description: 'Vintage offset shadow',
    css: { textShadow: '4px 4px 0px #ff6b6b' }
  },
  {
    id: 'shadow-long',
    name: 'Long Shadow',
    category: 'shadows',
    description: 'Extended diagonal shadow',
    css: { textShadow: '1px 1px #aaa, 2px 2px #aaa, 3px 3px #aaa, 4px 4px #aaa, 5px 5px #aaa, 6px 6px #aaa, 7px 7px #aaa, 8px 8px #aaa, 9px 9px 5px rgba(0,0,0,0.2)' }
  },
  
  // Outlines
  {
    id: 'outline-thin',
    name: 'Thin Outline',
    category: 'outlines',
    description: 'Subtle text outline',
    css: { textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }
  },
  {
    id: 'outline-thick',
    name: 'Thick Outline',
    category: 'outlines',
    description: 'Bold text outline',
    css: { textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, -2px 0 0 #000, 2px 0 0 #000, 0 -2px 0 #000, 0 2px 0 #000' }
  },
  {
    id: 'outline-white',
    name: 'White Outline',
    category: 'outlines',
    description: 'White stroke effect',
    css: { textShadow: '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff, -2px 0 0 #fff, 2px 0 0 #fff, 0 -2px 0 #fff, 0 2px 0 #fff' }
  },
  {
    id: 'outline-glow',
    name: 'Glowing Outline',
    category: 'outlines',
    description: 'Soft glowing outline',
    css: { textShadow: '0 0 1px #fff, 0 0 2px #fff, 0 0 3px #fff, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }
  },
  
  // Decorative
  {
    id: 'emboss',
    name: 'Embossed',
    category: 'decorative',
    description: 'Raised emboss effect',
    css: { textShadow: '-1px -1px 0 rgba(255,255,255,0.4), 1px 1px 0 rgba(0,0,0,0.3)' }
  },
  {
    id: 'engrave',
    name: 'Engraved',
    category: 'decorative',
    description: 'Carved into surface',
    css: { textShadow: '1px 1px 0 rgba(255,255,255,0.4), -1px -1px 0 rgba(0,0,0,0.3)' }
  },
  {
    id: 'vintage',
    name: 'Vintage Print',
    category: 'decorative',
    description: 'Old letterpress style',
    css: { textShadow: '2px 2px 0px rgba(139,69,19,0.5)' }
  },
  {
    id: 'chalk',
    name: 'Chalkboard',
    category: 'decorative',
    description: 'Chalk on blackboard',
    css: { textShadow: '0 0 2px #fff, 0 0 4px rgba(255,255,255,0.5)' }
  },
  {
    id: 'watercolor',
    name: 'Watercolor',
    category: 'decorative',
    description: 'Soft watercolor edges',
    css: { textShadow: '0 0 3px rgba(0,100,200,0.3), 0 0 6px rgba(0,100,200,0.2), 0 0 9px rgba(0,100,200,0.1)' }
  },
  
  // Gradient-like effects (using multiple shadows)
  {
    id: 'rainbow',
    name: 'Rainbow',
    category: 'colorful',
    description: 'Multi-color shadow',
    css: { textShadow: '0 0 5px red, 0 0 10px orange, 0 0 15px yellow, 0 0 20px green, 0 0 25px blue, 0 0 30px violet' }
  },
  {
    id: 'sunset',
    name: 'Sunset',
    category: 'colorful',
    description: 'Warm gradient glow',
    css: { textShadow: '0 0 5px #ff6b6b, 0 0 15px #ffa502, 0 0 25px #ff4757' }
  },
  {
    id: 'ocean',
    name: 'Ocean',
    category: 'colorful',
    description: 'Cool blue glow',
    css: { textShadow: '0 0 5px #70a1ff, 0 0 15px #1e90ff, 0 0 25px #0652DD' }
  },
  {
    id: 'forest',
    name: 'Forest',
    category: 'colorful',
    description: 'Natural green glow',
    css: { textShadow: '0 0 5px #7bed9f, 0 0 15px #2ed573, 0 0 25px #009432' }
  },
  
  // Special effects
  {
    id: 'blur',
    name: 'Motion Blur',
    category: 'special',
    description: 'Horizontal blur effect',
    css: { textShadow: '-3px 0 3px rgba(0,0,0,0.3), 3px 0 3px rgba(0,0,0,0.3)' }
  },
  {
    id: 'double',
    name: 'Double Vision',
    category: 'special',
    description: 'Offset duplicate',
    css: { textShadow: '3px 3px 0 rgba(255,0,0,0.5), -3px -3px 0 rgba(0,0,255,0.5)' }
  },
  {
    id: 'glitch',
    name: 'Glitch',
    category: 'special',
    description: 'Digital glitch effect',
    css: { textShadow: '2px 0 #ff0000, -2px 0 #00ff00' }
  },
  {
    id: 'comic',
    name: 'Comic Book',
    category: 'special',
    description: 'Pop art style',
    css: { textShadow: '3px 3px 0 #000, 4px 4px 0 #ff0, 5px 5px 0 #ff0' }
  },
];

const CATEGORIES = [...new Set(TEXT_EFFECTS.map(e => e.category))];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const effectId = searchParams.get('id');
  const search = searchParams.get('search')?.toLowerCase();

  // Get specific effect
  if (effectId) {
    const effect = TEXT_EFFECTS.find(e => e.id === effectId);
    if (effect) {
      return NextResponse.json({
        effect: {
          ...effect,
          usage: `style={{ ...${JSON.stringify(effect.css)} }}`
        }
      });
    }
    return NextResponse.json({ error: 'Effect not found' }, { status: 404 });
  }

  // Filter effects
  let results = [...TEXT_EFFECTS];
  
  if (category) {
    results = results.filter(e => e.category === category);
  }
  
  if (search) {
    results = results.filter(e => 
      e.name.toLowerCase().includes(search) ||
      e.description.toLowerCase().includes(search)
    );
  }

  return NextResponse.json({
    effects: results,
    categories: CATEGORIES,
    total: results.length,
    usage: {
      react: "style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}",
      tip: 'Effects can be customized by modifying colors and values'
    }
  });
}

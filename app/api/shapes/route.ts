// app/api/shapes/route.ts
// Comprehensive SVG Shape Library for Scrapbooking
// All shapes are SVG - infinitely scalable, customizable

import { NextResponse } from 'next/server';

type ShapeGenerator = (color: string, strokeColor: string, strokeWidth: number) => string;

interface Shape {
  id: string;
  name: string;
  category: string;
  svg: ShapeGenerator;
}

const SHAPES: Shape[] = [
  // Basic Shapes
  { id: 'circle', name: 'Circle', category: 'basic', svg: (c, s, w) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="${c}" stroke="${s}" stroke-width="${w}"/></svg>` },
  { id: 'square', name: 'Square', category: 'basic', svg: (c, s, w) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="90" height="90" fill="${c}" stroke="${s}" stroke-width="${w}"/></svg>` },
  { id: 'rectangle', name: 'Rectangle', category: 'basic', svg: (c, s, w) => `<svg viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="140" height="90" fill="${c}" stroke="${s}" stroke-width="${w}"/></svg>` },
  { id: 'triangle', name: 'Triangle', category: 'basic', svg: (c, s, w) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,5 95,95 5,95" fill="${c}" stroke="${s}" stroke-width="${w}"/></svg>` },
  { id: 'diamond', name: 'Diamond', category: 'basic', svg: (c, s, w) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,5 95,50 50,95 5,50" fill="${c}" stroke="${s}" stroke-width="${w}"/></svg>` },
  { id: 'pentagon', name: 'Pentagon', category: 'basic', svg: (c, s, w) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,5 97,38 79,95 21,95 3,38" fill="${c}" stroke="${s}" stroke-width="${w}"/></svg>` },
  { id: 'hexagon', name: 'Hexagon', category: 'basic', svg: (c, s, w) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5" fill="${c}" stroke="${s}" stroke-width="${w}"/></svg>` },
  { id: 'octagon', name: 'Octagon', category: 'basic', svg: (c, s, w) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30" fill="${c}" stroke="${s}" stroke-width="${w}"/></svg>` },
  { id: 'oval', name: 'Oval', category: 'basic', svg: (c, s, w) => `<svg viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="75" cy="50" rx="70" ry="45" fill="${c}" stroke="${s}" stroke-width="${w}"/></svg>` },
  
  // Hearts & Love
  { id: 'heart', name: 'Heart', category: 'love', svg: (c, s, w) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50,88 C20,60 5,40 5,25 C5,10 20,5 35,15 C45,22 50,30 50,30 C50,30 55,22 65,15 C80,5 95,10 95,25 C95,40 80,60 50,88Z" fill="${c}" stroke="${s}" stroke-width="${w}"/></svg>` },
  { id: 'heart-outline', name: 'Heart Outline', category: 'love', svg: (c, s, w) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50,88 C20,60 5,40 5,25 C5,10 20,5 35,15 C45,22 50,30 50,30 C50,30 55,22 65,15 C80,5 95,10 95,25 C95,40 80,60 50,88Z" fill="none" stroke="${c}" stroke-width="${w*2}"/></svg>` },
  { id: 'double-heart', name: 'Double Heart', category: 'love', svg: (c, s, w) => `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg"><path d="M35,80 C15,55 5,40 5,28 C5,15 15,8 27,15 C35,20 40,28 40,28 C40,28 45,20 53,15 C65,8 75,15 75,28 C75,40 65,55 45,80Z" fill="${c}" stroke="${s}" stroke-width="${w}" opacity="0.7"/><path d="M75,75 C55,50 45,35 45,23 C45,10 55,3 67,10 C75,15 80,23 80,23 C80,23 85,15 93,10 C105,3 115,10 115,23 C115,35 105,50 85,75Z" fill="${c}" stroke="${s}" stroke-width="${w}"/></svg>` },
  
  // Stars
  { id: 'star-5', name: '5-Point Star', category: 'stars', svg: (c, s, w) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,5 61,40 98,40 68,62 79,97 50,75 21,97 32,62 2,40 39,40" fill="${c}" stroke="${s}" stroke-width="${w}"/></svg>` },
  { id: 'star-6', name: '6-Point Star', category: 'stars', svg: (c, s, w) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,5 60,35 95,35 70,55 80,90 50,70 20,90 30,55 5,35 40,35" fill="${c}" stroke="${s}" stroke-width="${w}"/></svg>` },
  { id: 'star-burst', name: 'Starburst', category: 'stars', svg: (c, s, w) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,0 55,40 95,20 60,45 100,50 60,55 95,80 55,60 50,100 45,60 5,80 40,55 0,50 40,45 5,20 45,40" fill="${c}" stroke="${s}" stroke-width="${w}"/></svg>` },
  { id: 'sparkle', name: 'Sparkle', category: 'stars', svg: (c, s, w) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50,0 L55,45 L100,50 L55,55 L50,100 L45,55 L0,50 L45,45 Z" fill="${c}" stroke="${s}" stroke-width="${w}"/></svg>` },
  
  // Arrows
  { id: 'arrow-right', name: 'Arrow Right', category: 'arrows', svg: (c, s, w) => `<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg"><polygon points="0,20 60,20 60,0 100,30 60,60 60,40 0,40" fill="${c}" stroke="${s}" stroke-width="${w}"/></svg>` },
  { id: 'arrow-left', name: 'Arrow Left', category: 'arrows', svg: (c, s, w) => `<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg"><polygon points="100,20 40,20 40,0 0,30 40,60 40,40 100,40" fill="${c}" stroke="${s}" stroke-width="${w}"/></svg>` },
  { id: 'arrow-up', name: 'Arrow Up', category: 'arrows', svg: (c, s, w) => `<svg viewBox="0 0 60 100" xmlns="http://www.w3.org/2000/svg"><polygon points="20,100 20,40 0,40 30,0 60,40 40,40 40,100" fill="${c}" stroke="${s}" stroke-width="${w}"/></svg>` },
  { id: 'arrow-down', name: 'Arrow Down', category: 'arrows', svg: (c, s, w) => `<svg viewBox="0 0 60 100" xmlns="http://www.w3.org/2000/svg"><polygon points="20,0 20,60 0,60 30,100 60,60 40,60 40,0" fill="${c}" stroke="${s}" stroke-width="${w}"/></svg>` },
  { id: 'curved-arrow', name: 'Curved Arrow', category: 'arrows', svg: (c, s, w) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M10,80 Q10,20 50,20 L50,5 L80,25 L50,45 L50,30 Q20,30 20,80 Z" fill="${c}" stroke="${s}" stroke-width="${w}"/></svg>` },
  
  // Speech Bubbles
  { id: 'speech-bubble', name: 'Speech Bubble', category: 'callouts', svg: (c, s, w) => `<svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg"><path d="M10,5 H90 Q95,5 95,10 V50 Q95,55 90,55 H30 L15,75 L20,55 H10 Q5,55 5,50 V10 Q5,5 10,5 Z" fill="${c}" stroke="${s}" stroke-width="${w}"/></svg>` },
  { id: 'thought-bubble', name: 'Thought Bubble', category: 'callouts', svg: (c, s, w) => `<svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="30" rx="45" ry="25" fill="${c}" stroke="${s}" stroke-width="${w}"/><circle cx="20" cy="60" r="8" fill="${c}" stroke="${s}" stroke-width="${w}"/><circle cx="10" cy="72" r="5" fill="${c}" stroke="${s}" stroke-width="${w}"/></svg>` },
  { id: 'banner', name: 'Banner', category: 'callouts', svg: (c, s, w) => `<svg viewBox="0 0 150 60" xmlns="http://www.w3.org/2000/svg"><path d="M0,15 L20,15 L20,0 L130,0 L130,15 L150,15 L140,30 L150,45 L130,45 L130,60 L20,60 L20,45 L0,45 L10,30 Z" fill="${c}" stroke="${s}" stroke-width="${w}"/></svg>` },
  { id: 'ribbon', name: 'Ribbon', category: 'callouts', svg: (c, s, w) => `<svg viewBox="0 0 150 50" xmlns="http://www.w3.org/2000/svg"><path d="M0,25 L15,10 L15,20 L135,20 L135,10 L150,25 L135,40 L135,30 L15,30 L15,40 Z" fill="${c}" stroke="${s}" stroke-width="${w}"/></svg>` },
  
  // Decorative
  { id: 'cloud', name: 'Cloud', category: 'decorative', svg: (c, s, w) => `<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg"><path d="M20,50 A15,15 0 0,1 20,30 A20,20 0 0,1 40,15 A25,25 0 0,1 80,20 A15,15 0 0,1 90,45 A10,10 0 0,1 80,55 Z" fill="${c}" stroke="${s}" stroke-width="${w}"/></svg>` },
  { id: 'sun', name: 'Sun', category: 'decorative', svg: (c, s, w) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="20" fill="${c}" stroke="${s}" stroke-width="${w}"/><g stroke="${c}" stroke-width="3"><line x1="50" y1="5" x2="50" y2="20"/><line x1="50" y1="80" x2="50" y2="95"/><line x1="5" y1="50" x2="20" y2="50"/><line x1="80" y1="50" x2="95" y2="50"/><line x1="18" y1="18" x2="29" y2="29"/><line x1="71" y1="71" x2="82" y2="82"/><line x1="18" y1="82" x2="29" y2="71"/><line x1="71" y1="29" x2="82" y2="18"/></g></svg>` },
  { id: 'moon', name: 'Crescent Moon', category: 'decorative', svg: (c, s, w) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M60,10 A40,40 0 1,0 60,90 A30,30 0 1,1 60,10" fill="${c}" stroke="${s}" stroke-width="${w}"/></svg>` },
  { id: 'lightning', name: 'Lightning Bolt', category: 'decorative', svg: (c, s, w) => `<svg viewBox="0 0 60 100" xmlns="http://www.w3.org/2000/svg"><polygon points="35,0 10,45 25,45 15,100 50,40 35,40 55,0" fill="${c}" stroke="${s}" stroke-width="${w}"/></svg>` },
  { id: 'flower', name: 'Flower', category: 'decorative', svg: (c, s, w) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="12" fill="#FFD700"/><ellipse cx="50" cy="20" rx="12" ry="18" fill="${c}" stroke="${s}" stroke-width="${w}"/><ellipse cx="50" cy="80" rx="12" ry="18" fill="${c}" stroke="${s}" stroke-width="${w}"/><ellipse cx="20" cy="50" rx="18" ry="12" fill="${c}" stroke="${s}" stroke-width="${w}"/><ellipse cx="80" cy="50" rx="18" ry="12" fill="${c}" stroke="${s}" stroke-width="${w}"/></svg>` },
  { id: 'leaf', name: 'Leaf', category: 'decorative', svg: (c, s, w) => `<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg"><path d="M40,5 Q75,20 75,60 Q75,95 40,95 Q5,95 5,60 Q5,20 40,5" fill="${c}" stroke="${s}" stroke-width="${w}"/><path d="M40,20 L40,85 M40,35 Q55,45 55,55 M40,50 Q25,60 25,70" fill="none" stroke="${s}" stroke-width="2"/></svg>` },
  
  // Frames
  { id: 'frame-simple', name: 'Simple Frame', category: 'frames', svg: (c, s, w) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="90" height="90" fill="none" stroke="${c}" stroke-width="8"/><rect x="12" y="12" width="76" height="76" fill="none" stroke="${c}" stroke-width="2"/></svg>` },
  { id: 'frame-rounded', name: 'Rounded Frame', category: 'frames', svg: (c, s, w) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="90" height="90" rx="15" fill="none" stroke="${c}" stroke-width="8"/></svg>` },
  { id: 'frame-fancy', name: 'Fancy Frame', category: 'frames', svg: (c, s, w) => `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="10" width="80" height="80" fill="none" stroke="${c}" stroke-width="3"/><circle cx="10" cy="10" r="5" fill="${c}"/><circle cx="90" cy="10" r="5" fill="${c}"/><circle cx="10" cy="90" r="5" fill="${c}"/><circle cx="90" cy="90" r="5" fill="${c}"/></svg>` },
  { id: 'frame-polaroid', name: 'Polaroid Frame', category: 'frames', svg: (c, s, w) => `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="90" height="110" fill="${c}" stroke="${s}" stroke-width="${w}"/><rect x="10" y="10" width="80" height="80" fill="#f0f0f0"/></svg>` },
];

const CATEGORIES = [...new Set(SHAPES.map(s => s.category))];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const shapeId = searchParams.get('id');
  const color = searchParams.get('color') || '6366f1';
  const strokeColor = searchParams.get('stroke') || '4f46e5';
  const strokeWidth = parseInt(searchParams.get('strokeWidth') || '2');
  const search = searchParams.get('search')?.toLowerCase();

  // Return specific shape as SVG
  if (shapeId) {
    const shape = SHAPES.find(s => s.id === shapeId);
    if (shape) {
      const svg = shape.svg(`#${color}`, `#${strokeColor}`, strokeWidth);
      const base64 = Buffer.from(svg).toString('base64');
      return NextResponse.json({
        shape: {
          id: shape.id,
          name: shape.name,
          category: shape.category,
          svg,
          dataUrl: `data:image/svg+xml;base64,${base64}`,
          color: `#${color}`,
          strokeColor: `#${strokeColor}`,
          strokeWidth
        }
      });
    }
    return NextResponse.json({ error: 'Shape not found' }, { status: 404 });
  }

  // Filter shapes
  let results = [...SHAPES];
  
  if (category) {
    results = results.filter(s => s.category === category);
  }
  
  if (search) {
    results = results.filter(s => 
      s.name.toLowerCase().includes(search) || 
      s.category.toLowerCase().includes(search)
    );
  }

  return NextResponse.json({
    shapes: results.map(s => ({
      id: s.id,
      name: s.name,
      category: s.category,
      preview: `/api/shapes?id=${s.id}&color=${color}&stroke=${strokeColor}&strokeWidth=${strokeWidth}`
    })),
    categories: CATEGORIES,
    total: results.length,
    customization: {
      parameters: ['color', 'stroke', 'strokeWidth'],
      example: '/api/shapes?id=heart&color=ec4899&stroke=db2777&strokeWidth=3'
    }
  });
}

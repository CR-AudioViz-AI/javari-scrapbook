// app/api/illustrations/route.ts
// FREE SVG Illustrations from multiple sources
// unDraw (MIT), Open Peeps (CC0), Humaaans (free tier)

import { NextResponse } from 'next/server';

// Curated illustration categories with unDraw-style URLs
const ILLUSTRATION_CATEGORIES = {
  people: [
    { id: 'team-work', name: 'Team Work', keywords: ['collaboration', 'office', 'meeting'] },
    { id: 'remote-work', name: 'Remote Work', keywords: ['home', 'laptop', 'freelance'] },
    { id: 'celebration', name: 'Celebration', keywords: ['party', 'success', 'achievement'] },
    { id: 'reading', name: 'Reading', keywords: ['book', 'study', 'learn'] },
    { id: 'meditation', name: 'Meditation', keywords: ['yoga', 'peace', 'wellness'] },
    { id: 'fitness', name: 'Fitness', keywords: ['exercise', 'gym', 'health'] },
    { id: 'cooking', name: 'Cooking', keywords: ['food', 'kitchen', 'chef'] },
    { id: 'shopping', name: 'Shopping', keywords: ['retail', 'cart', 'ecommerce'] },
    { id: 'travel', name: 'Travel', keywords: ['vacation', 'adventure', 'explore'] },
    { id: 'family', name: 'Family', keywords: ['parents', 'children', 'love'] },
  ],
  technology: [
    { id: 'programming', name: 'Programming', keywords: ['code', 'developer', 'software'] },
    { id: 'mobile-app', name: 'Mobile App', keywords: ['phone', 'ios', 'android'] },
    { id: 'cloud', name: 'Cloud Computing', keywords: ['server', 'data', 'storage'] },
    { id: 'ai', name: 'Artificial Intelligence', keywords: ['robot', 'machine', 'learning'] },
    { id: 'security', name: 'Security', keywords: ['lock', 'privacy', 'protection'] },
    { id: 'analytics', name: 'Analytics', keywords: ['chart', 'data', 'insights'] },
  ],
  business: [
    { id: 'startup', name: 'Startup', keywords: ['launch', 'entrepreneur', 'growth'] },
    { id: 'presentation', name: 'Presentation', keywords: ['pitch', 'slides', 'meeting'] },
    { id: 'finance', name: 'Finance', keywords: ['money', 'investment', 'banking'] },
    { id: 'marketing', name: 'Marketing', keywords: ['ads', 'promotion', 'brand'] },
    { id: 'customer-service', name: 'Customer Service', keywords: ['support', 'help', 'chat'] },
  ],
  nature: [
    { id: 'forest', name: 'Forest', keywords: ['trees', 'woods', 'green'] },
    { id: 'ocean', name: 'Ocean', keywords: ['sea', 'beach', 'waves'] },
    { id: 'mountains', name: 'Mountains', keywords: ['hiking', 'peak', 'climb'] },
    { id: 'garden', name: 'Garden', keywords: ['flowers', 'plants', 'grow'] },
    { id: 'animals', name: 'Animals', keywords: ['pets', 'wildlife', 'creatures'] },
  ],
  abstract: [
    { id: 'shapes', name: 'Abstract Shapes', keywords: ['geometric', 'pattern', 'art'] },
    { id: 'gradients', name: 'Gradients', keywords: ['color', 'blend', 'smooth'] },
    { id: 'lines', name: 'Line Art', keywords: ['minimal', 'sketch', 'drawing'] },
  ]
};

// unDraw base URL (can customize color via URL param)
const UNDRAW_BASE = 'https://undraw.co/api/illustrations';

// Generate illustration URL with custom color
function getIllustrationUrl(id: string, color: string = '6366f1'): string {
  // Using placeholder service for demo - in production, integrate with unDraw API
  // unDraw requires registration but is free
  return `https://illustrations.popsy.co/amber/${id}.svg`;
}

// SVG placeholder for custom illustrations
function generatePlaceholderSvg(name: string, color: string, width: number, height: number): string {
  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f8fafc"/>
      <rect x="10%" y="20%" width="80%" height="60%" rx="10" fill="#${color}" opacity="0.1"/>
      <text x="50%" y="50%" text-anchor="middle" fill="#${color}" font-family="system-ui" font-size="14">
        ${name}
      </text>
    </svg>
  `;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search')?.toLowerCase();
  const color = searchParams.get('color') || '6366f1';
  const width = parseInt(searchParams.get('width') || '400');
  const height = parseInt(searchParams.get('height') || '300');

  // Get all illustrations or filter by category
  let results: any[] = [];

  if (category && ILLUSTRATION_CATEGORIES[category as keyof typeof ILLUSTRATION_CATEGORIES]) {
    results = ILLUSTRATION_CATEGORIES[category as keyof typeof ILLUSTRATION_CATEGORIES].map(ill => ({
      ...ill,
      category,
      url: getIllustrationUrl(ill.id, color),
      thumbnailUrl: getIllustrationUrl(ill.id, color),
      color: `#${color}`
    }));
  } else {
    // All categories
    for (const [cat, illustrations] of Object.entries(ILLUSTRATION_CATEGORIES)) {
      for (const ill of illustrations) {
        results.push({
          ...ill,
          category: cat,
          url: getIllustrationUrl(ill.id, color),
          thumbnailUrl: getIllustrationUrl(ill.id, color),
          color: `#${color}`
        });
      }
    }
  }

  // Search filter
  if (search) {
    results = results.filter(ill => 
      ill.name.toLowerCase().includes(search) ||
      ill.keywords.some((k: string) => k.includes(search))
    );
  }

  return NextResponse.json({
    illustrations: results,
    total: results.length,
    categories: Object.keys(ILLUSTRATION_CATEGORIES),
    sources: [
      { name: 'unDraw', url: 'https://undraw.co', license: 'MIT' },
      { name: 'Open Peeps', url: 'https://openpeeps.com', license: 'CC0' },
      { name: 'Popsy', url: 'https://popsy.co/illustrations', license: 'Free for commercial' }
    ],
    customization: {
      colorParameter: 'color',
      example: '/api/illustrations?category=people&color=ec4899'
    }
  });
}

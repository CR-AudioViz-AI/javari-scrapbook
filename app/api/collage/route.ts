// app/api/collage/route.ts
// Photo Collage Layout Templates
// Grid configurations for multi-photo arrangements

import { NextResponse } from 'next/server';

interface CollageCell {
  id: string;
  x: number;      // percentage
  y: number;      // percentage
  width: number;  // percentage
  height: number; // percentage
}

interface CollageLayout {
  id: string;
  name: string;
  description: string;
  category: string;
  photoCount: number;
  aspectRatio: string;
  cells: CollageCell[];
}

const COLLAGE_LAYOUTS: CollageLayout[] = [
  // 2 Photos
  {
    id: '2-horizontal',
    name: 'Side by Side',
    description: 'Two photos horizontally',
    category: '2-photos',
    photoCount: 2,
    aspectRatio: '2:1',
    cells: [
      { id: 'cell-1', x: 0, y: 0, width: 49, height: 100 },
      { id: 'cell-2', x: 51, y: 0, width: 49, height: 100 },
    ]
  },
  {
    id: '2-vertical',
    name: 'Stacked',
    description: 'Two photos vertically',
    category: '2-photos',
    photoCount: 2,
    aspectRatio: '1:2',
    cells: [
      { id: 'cell-1', x: 0, y: 0, width: 100, height: 49 },
      { id: 'cell-2', x: 0, y: 51, width: 100, height: 49 },
    ]
  },
  {
    id: '2-diagonal',
    name: 'Large & Small',
    description: 'One large, one small',
    category: '2-photos',
    photoCount: 2,
    aspectRatio: '1:1',
    cells: [
      { id: 'cell-1', x: 0, y: 0, width: 70, height: 70 },
      { id: 'cell-2', x: 60, y: 60, width: 40, height: 40 },
    ]
  },
  
  // 3 Photos
  {
    id: '3-equal',
    name: 'Three Equal',
    description: 'Three equal columns',
    category: '3-photos',
    photoCount: 3,
    aspectRatio: '3:1',
    cells: [
      { id: 'cell-1', x: 0, y: 0, width: 32, height: 100 },
      { id: 'cell-2', x: 34, y: 0, width: 32, height: 100 },
      { id: 'cell-3', x: 68, y: 0, width: 32, height: 100 },
    ]
  },
  {
    id: '3-feature-left',
    name: 'Feature Left',
    description: 'Large photo on left',
    category: '3-photos',
    photoCount: 3,
    aspectRatio: '3:2',
    cells: [
      { id: 'cell-1', x: 0, y: 0, width: 65, height: 100 },
      { id: 'cell-2', x: 67, y: 0, width: 33, height: 49 },
      { id: 'cell-3', x: 67, y: 51, width: 33, height: 49 },
    ]
  },
  {
    id: '3-feature-right',
    name: 'Feature Right',
    description: 'Large photo on right',
    category: '3-photos',
    photoCount: 3,
    aspectRatio: '3:2',
    cells: [
      { id: 'cell-1', x: 0, y: 0, width: 33, height: 49 },
      { id: 'cell-2', x: 0, y: 51, width: 33, height: 49 },
      { id: 'cell-3', x: 35, y: 0, width: 65, height: 100 },
    ]
  },
  {
    id: '3-feature-top',
    name: 'Feature Top',
    description: 'Large photo on top',
    category: '3-photos',
    photoCount: 3,
    aspectRatio: '2:3',
    cells: [
      { id: 'cell-1', x: 0, y: 0, width: 100, height: 65 },
      { id: 'cell-2', x: 0, y: 67, width: 49, height: 33 },
      { id: 'cell-3', x: 51, y: 67, width: 49, height: 33 },
    ]
  },
  
  // 4 Photos
  {
    id: '4-grid',
    name: 'Classic Grid',
    description: 'Four equal squares',
    category: '4-photos',
    photoCount: 4,
    aspectRatio: '1:1',
    cells: [
      { id: 'cell-1', x: 0, y: 0, width: 49, height: 49 },
      { id: 'cell-2', x: 51, y: 0, width: 49, height: 49 },
      { id: 'cell-3', x: 0, y: 51, width: 49, height: 49 },
      { id: 'cell-4', x: 51, y: 51, width: 49, height: 49 },
    ]
  },
  {
    id: '4-horizontal',
    name: 'Four Strip',
    description: 'Four horizontal strips',
    category: '4-photos',
    photoCount: 4,
    aspectRatio: '4:1',
    cells: [
      { id: 'cell-1', x: 0, y: 0, width: 24, height: 100 },
      { id: 'cell-2', x: 26, y: 0, width: 24, height: 100 },
      { id: 'cell-3', x: 52, y: 0, width: 24, height: 100 },
      { id: 'cell-4', x: 78, y: 0, width: 22, height: 100 },
    ]
  },
  {
    id: '4-feature',
    name: 'Feature + Three',
    description: 'One large, three small',
    category: '4-photos',
    photoCount: 4,
    aspectRatio: '3:2',
    cells: [
      { id: 'cell-1', x: 0, y: 0, width: 65, height: 100 },
      { id: 'cell-2', x: 67, y: 0, width: 33, height: 32 },
      { id: 'cell-3', x: 67, y: 34, width: 33, height: 32 },
      { id: 'cell-4', x: 67, y: 68, width: 33, height: 32 },
    ]
  },
  
  // 5 Photos
  {
    id: '5-cross',
    name: 'Cross Layout',
    description: 'Five photo cross pattern',
    category: '5-photos',
    photoCount: 5,
    aspectRatio: '1:1',
    cells: [
      { id: 'cell-1', x: 34, y: 0, width: 32, height: 32 },
      { id: 'cell-2', x: 0, y: 34, width: 32, height: 32 },
      { id: 'cell-3', x: 34, y: 34, width: 32, height: 32 },
      { id: 'cell-4', x: 68, y: 34, width: 32, height: 32 },
      { id: 'cell-5', x: 34, y: 68, width: 32, height: 32 },
    ]
  },
  {
    id: '5-feature',
    name: 'Feature + Four',
    description: 'One large, four small',
    category: '5-photos',
    photoCount: 5,
    aspectRatio: '3:2',
    cells: [
      { id: 'cell-1', x: 0, y: 0, width: 65, height: 100 },
      { id: 'cell-2', x: 67, y: 0, width: 33, height: 24 },
      { id: 'cell-3', x: 67, y: 26, width: 33, height: 24 },
      { id: 'cell-4', x: 67, y: 52, width: 33, height: 24 },
      { id: 'cell-5', x: 67, y: 78, width: 33, height: 22 },
    ]
  },
  
  // 6 Photos
  {
    id: '6-grid',
    name: 'Six Grid',
    description: 'Two rows of three',
    category: '6-photos',
    photoCount: 6,
    aspectRatio: '3:2',
    cells: [
      { id: 'cell-1', x: 0, y: 0, width: 32, height: 49 },
      { id: 'cell-2', x: 34, y: 0, width: 32, height: 49 },
      { id: 'cell-3', x: 68, y: 0, width: 32, height: 49 },
      { id: 'cell-4', x: 0, y: 51, width: 32, height: 49 },
      { id: 'cell-5', x: 34, y: 51, width: 32, height: 49 },
      { id: 'cell-6', x: 68, y: 51, width: 32, height: 49 },
    ]
  },
  {
    id: '6-masonry',
    name: 'Masonry Style',
    description: 'Varied sizes grid',
    category: '6-photos',
    photoCount: 6,
    aspectRatio: '3:2',
    cells: [
      { id: 'cell-1', x: 0, y: 0, width: 49, height: 65 },
      { id: 'cell-2', x: 51, y: 0, width: 49, height: 32 },
      { id: 'cell-3', x: 51, y: 34, width: 49, height: 32 },
      { id: 'cell-4', x: 0, y: 67, width: 32, height: 33 },
      { id: 'cell-5', x: 34, y: 67, width: 32, height: 33 },
      { id: 'cell-6', x: 68, y: 67, width: 32, height: 33 },
    ]
  },
  
  // 9 Photos
  {
    id: '9-grid',
    name: 'Nine Grid',
    description: 'Classic 3x3 grid',
    category: '9-photos',
    photoCount: 9,
    aspectRatio: '1:1',
    cells: [
      { id: 'cell-1', x: 0, y: 0, width: 32, height: 32 },
      { id: 'cell-2', x: 34, y: 0, width: 32, height: 32 },
      { id: 'cell-3', x: 68, y: 0, width: 32, height: 32 },
      { id: 'cell-4', x: 0, y: 34, width: 32, height: 32 },
      { id: 'cell-5', x: 34, y: 34, width: 32, height: 32 },
      { id: 'cell-6', x: 68, y: 34, width: 32, height: 32 },
      { id: 'cell-7', x: 0, y: 68, width: 32, height: 32 },
      { id: 'cell-8', x: 34, y: 68, width: 32, height: 32 },
      { id: 'cell-9', x: 68, y: 68, width: 32, height: 32 },
    ]
  },
];

const CATEGORIES = [...new Set(COLLAGE_LAYOUTS.map(l => l.category))];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const layoutId = searchParams.get('id');
  const photoCount = searchParams.get('photos');

  // Get specific layout
  if (layoutId) {
    const layout = COLLAGE_LAYOUTS.find(l => l.id === layoutId);
    if (layout) {
      return NextResponse.json({ layout });
    }
    return NextResponse.json({ error: 'Layout not found' }, { status: 404 });
  }

  // Filter layouts
  let results = [...COLLAGE_LAYOUTS];
  
  if (category) {
    results = results.filter(l => l.category === category);
  }
  
  if (photoCount) {
    const count = parseInt(photoCount);
    results = results.filter(l => l.photoCount === count);
  }

  return NextResponse.json({
    layouts: results.map(l => ({
      id: l.id,
      name: l.name,
      description: l.description,
      category: l.category,
      photoCount: l.photoCount,
      aspectRatio: l.aspectRatio,
      cellCount: l.cells.length
    })),
    categories: CATEGORIES,
    total: results.length,
    usage: {
      tip: 'Cell positions are in percentages. Apply to container with position:relative, cells with position:absolute.',
      example: '/api/collage?id=4-grid'
    }
  });
}

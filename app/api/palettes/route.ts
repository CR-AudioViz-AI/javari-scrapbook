// app/api/palettes/route.ts
// Curated color palettes for scrapbooking

import { NextResponse } from 'next/server';

const COLOR_PALETTES = {
  pastel: [
    { id: 'pastel-1', name: 'Cotton Candy', colors: ['#FFB5E8', '#FF9CEE', '#FFCCF9', '#FCC2FF', '#F6A6FF'] },
    { id: 'pastel-2', name: 'Spring Meadow', colors: ['#B5EAD7', '#C7F9CC', '#80ED99', '#57CC99', '#38A3A5'] },
    { id: 'pastel-3', name: 'Lavender Dreams', colors: ['#E0BBE4', '#957DAD', '#D291BC', '#FEC8D8', '#FFDFD3'] },
    { id: 'pastel-4', name: 'Sunset Blush', colors: ['#FFDAC1', '#FFB7B2', '#FF9AA2', '#E2B4BD', '#C5A3B5'] },
    { id: 'pastel-5', name: 'Ocean Mist', colors: ['#A0E7E5', '#B4F8C8', '#FBE7C6', '#FFAEBC', '#A0E7E5'] },
  ],
  vintage: [
    { id: 'vintage-1', name: 'Antique Rose', colors: ['#8B4513', '#D2691E', '#DEB887', '#F5DEB3', '#FAEBD7'] },
    { id: 'vintage-2', name: 'Sepia Tones', colors: ['#704214', '#A0522D', '#CD853F', '#DEB887', '#F5F5DC'] },
    { id: 'vintage-3', name: 'Dusty Books', colors: ['#2F4F4F', '#556B2F', '#8B8989', '#BDB76B', '#F0E68C'] },
    { id: 'vintage-4', name: 'Faded Photos', colors: ['#696969', '#808080', '#A9A9A9', '#C0C0C0', '#DCDCDC'] },
  ],
  bold: [
    { id: 'bold-1', name: 'Electric Pop', colors: ['#FF0080', '#FF8C00', '#FFE600', '#00FF00', '#00BFFF'] },
    { id: 'bold-2', name: 'Neon Nights', colors: ['#FF1493', '#00FFFF', '#FF00FF', '#FFFF00', '#00FF00'] },
    { id: 'bold-3', name: 'Tropical Punch', colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96E6A1', '#DFE667'] },
    { id: 'bold-4', name: 'Fiesta', colors: ['#E63946', '#F1FAEE', '#A8DADC', '#457B9D', '#1D3557'] },
  ],
  natural: [
    { id: 'natural-1', name: 'Forest Walk', colors: ['#1B4332', '#2D6A4F', '#40916C', '#52B788', '#74C69D'] },
    { id: 'natural-2', name: 'Ocean Breeze', colors: ['#03045E', '#0077B6', '#00B4D8', '#90E0EF', '#CAF0F8'] },
    { id: 'natural-3', name: 'Desert Sand', colors: ['#EDC4B3', '#E6B8A2', '#DEAB90', '#D69F7E', '#CD9777'] },
    { id: 'natural-4', name: 'Autumn Leaves', colors: ['#780000', '#C1121F', '#FDF0D5', '#669BBC', '#003049'] },
  ],
  romantic: [
    { id: 'romantic-1', name: 'Rose Garden', colors: ['#590D22', '#800F2F', '#A4133C', '#C9184A', '#FF4D6D'] },
    { id: 'romantic-2', name: 'Blush & Gold', colors: ['#D4A373', '#E9C46A', '#F2CC8F', '#FAEDCD', '#FEFAE0'] },
    { id: 'romantic-3', name: 'Love Letters', colors: ['#FF758F', '#FF7EB3', '#FF85D4', '#FF9CE3', '#FFB3E6'] },
  ],
  minimal: [
    { id: 'minimal-1', name: 'Clean Slate', colors: ['#FFFFFF', '#F8F9FA', '#E9ECEF', '#DEE2E6', '#CED4DA'] },
    { id: 'minimal-2', name: 'Charcoal', colors: ['#212529', '#343A40', '#495057', '#6C757D', '#ADB5BD'] },
    { id: 'minimal-3', name: 'Warm Neutrals', colors: ['#F5F5F0', '#E8E8E3', '#D5D5D0', '#C2C2BD', '#AFAFAA'] },
  ],
  baby: [
    { id: 'baby-1', name: 'Baby Blue', colors: ['#A2D2FF', '#BDE0FE', '#FFAFCC', '#FFC8DD', '#CDB4DB'] },
    { id: 'baby-2', name: 'Baby Pink', colors: ['#FFC0CB', '#FFB6C1', '#FF69B4', '#FF1493', '#DB7093'] },
    { id: 'baby-3', name: 'Nursery', colors: ['#FDFD96', '#77DD77', '#AEC6CF', '#FF6961', '#CB99C9'] },
  ],
  celebration: [
    { id: 'celebration-1', name: 'Party Time', colors: ['#FFD700', '#FF6347', '#FF69B4', '#00CED1', '#9370DB'] },
    { id: 'celebration-2', name: 'Confetti', colors: ['#FF1744', '#D500F9', '#651FFF', '#00E676', '#FFEA00'] },
    { id: 'celebration-3', name: 'Birthday', colors: ['#F72585', '#7209B7', '#3A0CA3', '#4361EE', '#4CC9F0'] },
  ]
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'all';

  try {
    let palettes: any[] = [];

    if (category === 'all') {
      palettes = Object.entries(COLOR_PALETTES).flatMap(([cat, items]) =>
        items.map(p => ({ ...p, category: cat }))
      );
    } else if (COLOR_PALETTES[category as keyof typeof COLOR_PALETTES]) {
      palettes = COLOR_PALETTES[category as keyof typeof COLOR_PALETTES].map(p => ({
        ...p,
        category
      }));
    }

    return NextResponse.json({
      palettes,
      categories: Object.keys(COLOR_PALETTES),
      total: palettes.length
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

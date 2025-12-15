// app/api/icons/route.ts
// Free icons and clipart from multiple sources

import { NextResponse } from 'next/server';

// Icon categories with emoji representations and SVG icons
const ICON_PACKS = {
  celebration: {
    name: 'Celebration',
    icons: [
      { id: 'balloon', name: 'Balloon', emoji: '🎈' },
      { id: 'party', name: 'Party', emoji: '🎉' },
      { id: 'confetti', name: 'Confetti', emoji: '🎊' },
      { id: 'gift', name: 'Gift', emoji: '🎁' },
      { id: 'cake', name: 'Cake', emoji: '🎂' },
      { id: 'candle', name: 'Candle', emoji: '🕯️' },
      { id: 'fireworks', name: 'Fireworks', emoji: '🎆' },
      { id: 'sparkler', name: 'Sparkler', emoji: '🎇' },
      { id: 'trophy', name: 'Trophy', emoji: '🏆' },
      { id: 'medal', name: 'Medal', emoji: '🏅' },
    ]
  },
  love: {
    name: 'Love & Romance',
    icons: [
      { id: 'heart', name: 'Heart', emoji: '❤️' },
      { id: 'hearts', name: 'Two Hearts', emoji: '💕' },
      { id: 'kiss', name: 'Kiss', emoji: '💋' },
      { id: 'rose', name: 'Rose', emoji: '🌹' },
      { id: 'ring', name: 'Ring', emoji: '💍' },
      { id: 'couple', name: 'Couple', emoji: '💑' },
      { id: 'love-letter', name: 'Love Letter', emoji: '💌' },
      { id: 'cupid', name: 'Cupid', emoji: '💘' },
    ]
  },
  nature: {
    name: 'Nature',
    icons: [
      { id: 'sun', name: 'Sun', emoji: '☀️' },
      { id: 'moon', name: 'Moon', emoji: '🌙' },
      { id: 'star', name: 'Star', emoji: '⭐' },
      { id: 'rainbow', name: 'Rainbow', emoji: '🌈' },
      { id: 'flower', name: 'Flower', emoji: '🌸' },
      { id: 'tree', name: 'Tree', emoji: '🌳' },
      { id: 'leaf', name: 'Leaf', emoji: '🍃' },
      { id: 'butterfly', name: 'Butterfly', emoji: '🦋' },
      { id: 'cloud', name: 'Cloud', emoji: '☁️' },
      { id: 'snowflake', name: 'Snowflake', emoji: '❄️' },
    ]
  },
  travel: {
    name: 'Travel',
    icons: [
      { id: 'plane', name: 'Airplane', emoji: '✈️' },
      { id: 'car', name: 'Car', emoji: '🚗' },
      { id: 'ship', name: 'Ship', emoji: '🚢' },
      { id: 'train', name: 'Train', emoji: '🚂' },
      { id: 'suitcase', name: 'Suitcase', emoji: '🧳' },
      { id: 'camera', name: 'Camera', emoji: '📷' },
      { id: 'map', name: 'Map', emoji: '🗺️' },
      { id: 'compass', name: 'Compass', emoji: '🧭' },
      { id: 'beach', name: 'Beach', emoji: '🏖️' },
      { id: 'mountain', name: 'Mountain', emoji: '🏔️' },
    ]
  },
  baby: {
    name: 'Baby',
    icons: [
      { id: 'baby', name: 'Baby', emoji: '👶' },
      { id: 'bottle', name: 'Bottle', emoji: '🍼' },
      { id: 'pacifier', name: 'Pacifier', emoji: '🧸' },
      { id: 'stroller', name: 'Stroller', emoji: '🛒' },
      { id: 'rattle', name: 'Rattle', emoji: '🎠' },
      { id: 'footprints', name: 'Footprints', emoji: '👣' },
      { id: 'blocks', name: 'Blocks', emoji: '🧱' },
      { id: 'duck', name: 'Duck', emoji: '🦆' },
    ]
  },
  food: {
    name: 'Food & Drinks',
    icons: [
      { id: 'coffee', name: 'Coffee', emoji: '☕' },
      { id: 'cake-slice', name: 'Cake', emoji: '🍰' },
      { id: 'cupcake', name: 'Cupcake', emoji: '🧁' },
      { id: 'pizza', name: 'Pizza', emoji: '🍕' },
      { id: 'ice-cream', name: 'Ice Cream', emoji: '🍦' },
      { id: 'fruit', name: 'Fruit', emoji: '🍎' },
      { id: 'wine', name: 'Wine', emoji: '🍷' },
      { id: 'champagne', name: 'Champagne', emoji: '🍾' },
    ]
  },
  animals: {
    name: 'Animals',
    icons: [
      { id: 'dog', name: 'Dog', emoji: '🐕' },
      { id: 'cat', name: 'Cat', emoji: '🐱' },
      { id: 'bird', name: 'Bird', emoji: '🐦' },
      { id: 'bunny', name: 'Bunny', emoji: '🐰' },
      { id: 'paw', name: 'Paw', emoji: '🐾' },
      { id: 'fish', name: 'Fish', emoji: '🐠' },
      { id: 'horse', name: 'Horse', emoji: '🐴' },
      { id: 'unicorn', name: 'Unicorn', emoji: '🦄' },
    ]
  },
  decorative: {
    name: 'Decorative',
    icons: [
      { id: 'sparkles', name: 'Sparkles', emoji: '✨' },
      { id: 'ribbon', name: 'Ribbon', emoji: '🎀' },
      { id: 'crown', name: 'Crown', emoji: '👑' },
      { id: 'diamond', name: 'Diamond', emoji: '💎' },
      { id: 'magic', name: 'Magic Wand', emoji: '🪄' },
      { id: 'feather', name: 'Feather', emoji: '🪶' },
      { id: 'scroll', name: 'Scroll', emoji: '📜' },
      { id: 'key', name: 'Key', emoji: '🔑' },
    ]
  }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'all';
  const search = searchParams.get('search') || '';

  try {
    let icons: any[] = [];

    if (category === 'all') {
      icons = Object.entries(ICON_PACKS).flatMap(([catId, cat]) =>
        cat.icons.map(icon => ({ ...icon, category: catId, categoryName: cat.name }))
      );
    } else if (ICON_PACKS[category as keyof typeof ICON_PACKS]) {
      const pack = ICON_PACKS[category as keyof typeof ICON_PACKS];
      icons = pack.icons.map(icon => ({ ...icon, category, categoryName: pack.name }));
    }

    // Filter by search
    if (search) {
      icons = icons.filter(icon =>
        icon.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json({
      icons,
      categories: Object.entries(ICON_PACKS).map(([id, pack]) => ({
        id,
        name: pack.name,
        count: pack.icons.length
      })),
      total: icons.length
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

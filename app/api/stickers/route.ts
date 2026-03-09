// app/api/stickers/route.ts
// Organized Sticker Collections for Scrapbooking
// Emoji-based + SVG custom stickers

import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface StickerPack {
  id: string;
  name: string;
  description: string;
  icon: string;
  stickers: { id: string; emoji: string; name: string }[];
}

const STICKER_PACKS: StickerPack[] = [
  {
    id: 'celebration',
    name: 'Celebration',
    description: 'Party, birthday, and celebration stickers',
    icon: '🎉',
    stickers: [
      { id: 'balloon', emoji: '🎈', name: 'Balloon' },
      { id: 'party', emoji: '🎉', name: 'Party' },
      { id: 'confetti', emoji: '🎊', name: 'Confetti' },
      { id: 'gift', emoji: '🎁', name: 'Gift' },
      { id: 'cake', emoji: '🎂', name: 'Birthday Cake' },
      { id: 'candle', emoji: '🕯️', name: 'Candle' },
      { id: 'sparkler', emoji: '🎇', name: 'Sparkler' },
      { id: 'fireworks', emoji: '🎆', name: 'Fireworks' },
      { id: 'trophy', emoji: '🏆', name: 'Trophy' },
      { id: 'medal', emoji: '🥇', name: 'Medal' },
      { id: 'crown', emoji: '👑', name: 'Crown' },
      { id: 'champagne', emoji: '🍾', name: 'Champagne' },
    ]
  },
  {
    id: 'love',
    name: 'Love & Romance',
    description: 'Hearts, love, and romantic stickers',
    icon: '❤️',
    stickers: [
      { id: 'red-heart', emoji: '❤️', name: 'Red Heart' },
      { id: 'pink-heart', emoji: '💗', name: 'Pink Heart' },
      { id: 'sparkling-heart', emoji: '💖', name: 'Sparkling Heart' },
      { id: 'growing-heart', emoji: '💗', name: 'Growing Heart' },
      { id: 'beating-heart', emoji: '💓', name: 'Beating Heart' },
      { id: 'revolving-hearts', emoji: '💞', name: 'Revolving Hearts' },
      { id: 'heart-decoration', emoji: '💟', name: 'Heart Decoration' },
      { id: 'heart-exclamation', emoji: '❣️', name: 'Heart Exclamation' },
      { id: 'kiss', emoji: '💋', name: 'Kiss' },
      { id: 'love-letter', emoji: '💌', name: 'Love Letter' },
      { id: 'couple', emoji: '💑', name: 'Couple' },
      { id: 'ring', emoji: '💍', name: 'Ring' },
      { id: 'rose', emoji: '🌹', name: 'Rose' },
      { id: 'cupid', emoji: '💘', name: 'Cupid' },
    ]
  },
  {
    id: 'baby',
    name: 'Baby & Kids',
    description: 'Baby shower and children stickers',
    icon: '👶',
    stickers: [
      { id: 'baby', emoji: '👶', name: 'Baby' },
      { id: 'baby-bottle', emoji: '🍼', name: 'Baby Bottle' },
      { id: 'pacifier', emoji: '🧸', name: 'Teddy Bear' },
      { id: 'cradle', emoji: '🛒', name: 'Stroller' },
      { id: 'rattle', emoji: '🎀', name: 'Bow' },
      { id: 'blocks', emoji: '🧱', name: 'Blocks' },
      { id: 'duck', emoji: '🦆', name: 'Duck' },
      { id: 'star', emoji: '⭐', name: 'Star' },
      { id: 'moon', emoji: '🌙', name: 'Moon' },
      { id: 'rainbow', emoji: '🌈', name: 'Rainbow' },
      { id: 'footprints', emoji: '👣', name: 'Footprints' },
      { id: 'angel', emoji: '👼', name: 'Angel' },
    ]
  },
  {
    id: 'wedding',
    name: 'Wedding',
    description: 'Wedding and marriage stickers',
    icon: '💒',
    stickers: [
      { id: 'church', emoji: '💒', name: 'Church' },
      { id: 'bride', emoji: '👰', name: 'Bride' },
      { id: 'groom', emoji: '🤵', name: 'Groom' },
      { id: 'rings', emoji: '💍', name: 'Rings' },
      { id: 'bouquet', emoji: '💐', name: 'Bouquet' },
      { id: 'cake', emoji: '🎂', name: 'Wedding Cake' },
      { id: 'champagne', emoji: '🥂', name: 'Champagne' },
      { id: 'dove', emoji: '🕊️', name: 'Dove' },
      { id: 'hearts', emoji: '💕', name: 'Hearts' },
      { id: 'bells', emoji: '🔔', name: 'Bells' },
      { id: 'car', emoji: '🚗', name: 'Car' },
      { id: 'honeymoon', emoji: '🏝️', name: 'Honeymoon' },
    ]
  },
  {
    id: 'travel',
    name: 'Travel & Adventure',
    description: 'Travel, vacation, and adventure stickers',
    icon: '✈️',
    stickers: [
      { id: 'airplane', emoji: '✈️', name: 'Airplane' },
      { id: 'car', emoji: '🚗', name: 'Car' },
      { id: 'bus', emoji: '🚌', name: 'Bus' },
      { id: 'train', emoji: '🚂', name: 'Train' },
      { id: 'ship', emoji: '🚢', name: 'Ship' },
      { id: 'anchor', emoji: '⚓', name: 'Anchor' },
      { id: 'compass', emoji: '🧭', name: 'Compass' },
      { id: 'map', emoji: '🗺️', name: 'Map' },
      { id: 'luggage', emoji: '🧳', name: 'Luggage' },
      { id: 'camera', emoji: '📷', name: 'Camera' },
      { id: 'beach', emoji: '🏖️', name: 'Beach' },
      { id: 'mountain', emoji: '⛰️', name: 'Mountain' },
      { id: 'tent', emoji: '⛺', name: 'Tent' },
      { id: 'passport', emoji: '🛂', name: 'Passport' },
      { id: 'globe', emoji: '🌍', name: 'Globe' },
    ]
  },
  {
    id: 'nature',
    name: 'Nature',
    description: 'Plants, flowers, and nature stickers',
    icon: '🌸',
    stickers: [
      { id: 'cherry-blossom', emoji: '🌸', name: 'Cherry Blossom' },
      { id: 'tulip', emoji: '🌷', name: 'Tulip' },
      { id: 'rose', emoji: '🌹', name: 'Rose' },
      { id: 'sunflower', emoji: '🌻', name: 'Sunflower' },
      { id: 'hibiscus', emoji: '🌺', name: 'Hibiscus' },
      { id: 'leaf', emoji: '🍃', name: 'Leaf' },
      { id: 'maple-leaf', emoji: '🍁', name: 'Maple Leaf' },
      { id: 'clover', emoji: '🍀', name: 'Four Leaf Clover' },
      { id: 'tree', emoji: '🌳', name: 'Tree' },
      { id: 'palm', emoji: '🌴', name: 'Palm Tree' },
      { id: 'cactus', emoji: '🌵', name: 'Cactus' },
      { id: 'mushroom', emoji: '🍄', name: 'Mushroom' },
      { id: 'butterfly', emoji: '🦋', name: 'Butterfly' },
      { id: 'bee', emoji: '🐝', name: 'Bee' },
      { id: 'ladybug', emoji: '🐞', name: 'Ladybug' },
    ]
  },
  {
    id: 'weather',
    name: 'Weather & Sky',
    description: 'Sun, moon, stars, and weather stickers',
    icon: '☀️',
    stickers: [
      { id: 'sun', emoji: '☀️', name: 'Sun' },
      { id: 'sun-face', emoji: '🌞', name: 'Sun Face' },
      { id: 'moon', emoji: '🌙', name: 'Moon' },
      { id: 'full-moon', emoji: '🌕', name: 'Full Moon' },
      { id: 'star', emoji: '⭐', name: 'Star' },
      { id: 'stars', emoji: '✨', name: 'Sparkles' },
      { id: 'cloud', emoji: '☁️', name: 'Cloud' },
      { id: 'rainbow', emoji: '🌈', name: 'Rainbow' },
      { id: 'rain', emoji: '🌧️', name: 'Rain' },
      { id: 'snow', emoji: '❄️', name: 'Snowflake' },
      { id: 'lightning', emoji: '⚡', name: 'Lightning' },
      { id: 'tornado', emoji: '🌪️', name: 'Tornado' },
    ]
  },
  {
    id: 'animals',
    name: 'Animals',
    description: 'Cute animal stickers',
    icon: '🐾',
    stickers: [
      { id: 'dog', emoji: '🐕', name: 'Dog' },
      { id: 'cat', emoji: '🐱', name: 'Cat' },
      { id: 'rabbit', emoji: '🐰', name: 'Rabbit' },
      { id: 'bear', emoji: '🐻', name: 'Bear' },
      { id: 'panda', emoji: '🐼', name: 'Panda' },
      { id: 'fox', emoji: '🦊', name: 'Fox' },
      { id: 'lion', emoji: '🦁', name: 'Lion' },
      { id: 'unicorn', emoji: '🦄', name: 'Unicorn' },
      { id: 'bird', emoji: '🐦', name: 'Bird' },
      { id: 'owl', emoji: '🦉', name: 'Owl' },
      { id: 'dolphin', emoji: '🐬', name: 'Dolphin' },
      { id: 'turtle', emoji: '🐢', name: 'Turtle' },
      { id: 'pawprint', emoji: '🐾', name: 'Paw Print' },
    ]
  },
  {
    id: 'food',
    name: 'Food & Drinks',
    description: 'Delicious food and drink stickers',
    icon: '🍕',
    stickers: [
      { id: 'pizza', emoji: '🍕', name: 'Pizza' },
      { id: 'burger', emoji: '🍔', name: 'Burger' },
      { id: 'taco', emoji: '🌮', name: 'Taco' },
      { id: 'sushi', emoji: '🍣', name: 'Sushi' },
      { id: 'cake', emoji: '🍰', name: 'Cake' },
      { id: 'donut', emoji: '🍩', name: 'Donut' },
      { id: 'ice-cream', emoji: '🍦', name: 'Ice Cream' },
      { id: 'cookie', emoji: '🍪', name: 'Cookie' },
      { id: 'coffee', emoji: '☕', name: 'Coffee' },
      { id: 'tea', emoji: '🍵', name: 'Tea' },
      { id: 'cocktail', emoji: '🍹', name: 'Cocktail' },
      { id: 'wine', emoji: '🍷', name: 'Wine' },
      { id: 'fruit', emoji: '🍎', name: 'Apple' },
      { id: 'watermelon', emoji: '🍉', name: 'Watermelon' },
    ]
  },
  {
    id: 'sports',
    name: 'Sports & Activities',
    description: 'Sports and activity stickers',
    icon: '⚽',
    stickers: [
      { id: 'soccer', emoji: '⚽', name: 'Soccer' },
      { id: 'basketball', emoji: '🏀', name: 'Basketball' },
      { id: 'football', emoji: '🏈', name: 'Football' },
      { id: 'baseball', emoji: '⚾', name: 'Baseball' },
      { id: 'tennis', emoji: '🎾', name: 'Tennis' },
      { id: 'volleyball', emoji: '🏐', name: 'Volleyball' },
      { id: 'golf', emoji: '⛳', name: 'Golf' },
      { id: 'swimming', emoji: '🏊', name: 'Swimming' },
      { id: 'cycling', emoji: '🚴', name: 'Cycling' },
      { id: 'running', emoji: '🏃', name: 'Running' },
      { id: 'yoga', emoji: '🧘', name: 'Yoga' },
      { id: 'medal', emoji: '🏅', name: 'Medal' },
    ]
  },
  {
    id: 'holidays',
    name: 'Holidays',
    description: 'Holiday and seasonal stickers',
    icon: '🎄',
    stickers: [
      { id: 'christmas-tree', emoji: '🎄', name: 'Christmas Tree' },
      { id: 'santa', emoji: '🎅', name: 'Santa' },
      { id: 'snowman', emoji: '⛄', name: 'Snowman' },
      { id: 'gift', emoji: '🎁', name: 'Gift' },
      { id: 'candy-cane', emoji: '🍬', name: 'Candy' },
      { id: 'pumpkin', emoji: '🎃', name: 'Pumpkin' },
      { id: 'ghost', emoji: '👻', name: 'Ghost' },
      { id: 'turkey', emoji: '🦃', name: 'Turkey' },
      { id: 'easter-egg', emoji: '🥚', name: 'Egg' },
      { id: 'bunny', emoji: '🐰', name: 'Bunny' },
      { id: 'fireworks', emoji: '🎆', name: 'Fireworks' },
      { id: 'flag', emoji: '🇺🇸', name: 'Flag' },
      { id: 'heart', emoji: '❤️', name: 'Valentine' },
      { id: 'shamrock', emoji: '☘️', name: 'Shamrock' },
    ]
  },
  {
    id: 'expressions',
    name: 'Expressions',
    description: 'Emoji faces and expressions',
    icon: '😊',
    stickers: [
      { id: 'smile', emoji: '😊', name: 'Smile' },
      { id: 'laugh', emoji: '😂', name: 'Laugh' },
      { id: 'love-eyes', emoji: '😍', name: 'Love Eyes' },
      { id: 'cool', emoji: '😎', name: 'Cool' },
      { id: 'wink', emoji: '😉', name: 'Wink' },
      { id: 'thinking', emoji: '🤔', name: 'Thinking' },
      { id: 'wow', emoji: '😮', name: 'Wow' },
      { id: 'party', emoji: '🥳', name: 'Party' },
      { id: 'star-struck', emoji: '🤩', name: 'Star Struck' },
      { id: 'grateful', emoji: '🥰', name: 'Grateful' },
      { id: 'thumbs-up', emoji: '👍', name: 'Thumbs Up' },
      { id: 'clap', emoji: '👏', name: 'Clap' },
      { id: 'hands-raised', emoji: '🙌', name: 'Celebrate' },
      { id: 'pray', emoji: '🙏', name: 'Thank You' },
    ]
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const packId = searchParams.get('pack');
  const search = searchParams.get('search')?.toLowerCase();
  const listPacks = searchParams.get('listPacks');

  // List all packs
  if (listPacks === 'true') {
    return NextResponse.json({
      packs: STICKER_PACKS.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        icon: p.icon,
        count: p.stickers.length
      })),
      totalPacks: STICKER_PACKS.length,
      totalStickers: STICKER_PACKS.reduce((sum, p) => sum + p.stickers.length, 0)
    });
  }

  // Get specific pack
  if (packId) {
    const pack = STICKER_PACKS.find(p => p.id === packId);
    if (pack) {
      return NextResponse.json({
        pack: {
          ...pack,
          stickers: pack.stickers.map(s => ({
            ...s,
            packId: pack.id,
            packName: pack.name
          }))
        }
      });
    }
    return NextResponse.json({ error: 'Pack not found' }, { status: 404 });
  }

  // Search across all packs
  if (search) {
    const results: any[] = [];
    for (const pack of STICKER_PACKS) {
      for (const sticker of pack.stickers) {
        if (sticker.name.toLowerCase().includes(search)) {
          results.push({
            ...sticker,
            packId: pack.id,
            packName: pack.name
          });
        }
      }
    }
    return NextResponse.json({
      stickers: results,
      total: results.length,
      query: search
    });
  }

  // Return all stickers grouped by pack
  return NextResponse.json({
    packs: STICKER_PACKS,
    totalPacks: STICKER_PACKS.length,
    totalStickers: STICKER_PACKS.reduce((sum, p) => sum + p.stickers.length, 0)
  });
}

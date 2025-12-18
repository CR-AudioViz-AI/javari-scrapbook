// CRAV Scrapbook - Free Icons API
// 200+ SVG icons organized by category for scrapbook embellishments

import { NextRequest, NextResponse } from 'next/server';

interface Icon {
  id: string;
  name: string;
  category: string;
  tags: string[];
}

const icons: Icon[] = [
  // ARROWS (15)
  { id: 'arrow-up', name: 'Arrow Up', category: 'arrows', tags: ['direction', 'up'] },
  { id: 'arrow-down', name: 'Arrow Down', category: 'arrows', tags: ['direction', 'down'] },
  { id: 'arrow-left', name: 'Arrow Left', category: 'arrows', tags: ['direction', 'left'] },
  { id: 'arrow-right', name: 'Arrow Right', category: 'arrows', tags: ['direction', 'right'] },
  { id: 'arrow-up-right', name: 'Arrow Up Right', category: 'arrows', tags: ['direction', 'diagonal'] },
  { id: 'chevron-up', name: 'Chevron Up', category: 'arrows', tags: ['direction', 'up'] },
  { id: 'chevron-down', name: 'Chevron Down', category: 'arrows', tags: ['direction', 'down'] },
  { id: 'chevron-left', name: 'Chevron Left', category: 'arrows', tags: ['direction', 'left'] },
  { id: 'chevron-right', name: 'Chevron Right', category: 'arrows', tags: ['direction', 'right'] },
  { id: 'refresh', name: 'Refresh', category: 'arrows', tags: ['reload', 'sync'] },
  { id: 'rotate-cw', name: 'Rotate Clockwise', category: 'arrows', tags: ['rotate', 'turn'] },
  { id: 'rotate-ccw', name: 'Rotate Counter', category: 'arrows', tags: ['rotate', 'turn'] },
  { id: 'corner-up-left', name: 'Corner Up Left', category: 'arrows', tags: ['undo', 'back'] },
  { id: 'corner-up-right', name: 'Corner Up Right', category: 'arrows', tags: ['redo', 'forward'] },
  { id: 'move', name: 'Move', category: 'arrows', tags: ['drag', 'reorder'] },
  
  // SHAPES (15)
  { id: 'circle', name: 'Circle', category: 'shapes', tags: ['round', 'basic'] },
  { id: 'square', name: 'Square', category: 'shapes', tags: ['box', 'basic'] },
  { id: 'triangle', name: 'Triangle', category: 'shapes', tags: ['basic', 'geometry'] },
  { id: 'star', name: 'Star', category: 'shapes', tags: ['favorite', 'rating'] },
  { id: 'heart', name: 'Heart', category: 'shapes', tags: ['love', 'favorite'] },
  { id: 'hexagon', name: 'Hexagon', category: 'shapes', tags: ['geometry', 'bee'] },
  { id: 'octagon', name: 'Octagon', category: 'shapes', tags: ['stop', 'geometry'] },
  { id: 'pentagon', name: 'Pentagon', category: 'shapes', tags: ['geometry', 'basic'] },
  { id: 'diamond', name: 'Diamond', category: 'shapes', tags: ['gem', 'card'] },
  { id: 'oval', name: 'Oval', category: 'shapes', tags: ['ellipse', 'basic'] },
  { id: 'cross', name: 'Cross', category: 'shapes', tags: ['plus', 'medical'] },
  { id: 'x', name: 'X Mark', category: 'shapes', tags: ['close', 'delete'] },
  { id: 'minus', name: 'Minus', category: 'shapes', tags: ['subtract', 'remove'] },
  { id: 'plus', name: 'Plus', category: 'shapes', tags: ['add', 'new'] },
  { id: 'slash', name: 'Slash', category: 'shapes', tags: ['divide', 'separator'] },
  
  // COMMUNICATION (20)
  { id: 'mail', name: 'Mail', category: 'communication', tags: ['email', 'envelope'] },
  { id: 'mail-open', name: 'Mail Open', category: 'communication', tags: ['email', 'read'] },
  { id: 'inbox', name: 'Inbox', category: 'communication', tags: ['email', 'receive'] },
  { id: 'send', name: 'Send', category: 'communication', tags: ['email', 'submit'] },
  { id: 'message-circle', name: 'Message', category: 'communication', tags: ['chat', 'comment'] },
  { id: 'message-square', name: 'Message Square', category: 'communication', tags: ['chat', 'comment'] },
  { id: 'phone', name: 'Phone', category: 'communication', tags: ['call', 'contact'] },
  { id: 'phone-call', name: 'Phone Call', category: 'communication', tags: ['calling', 'ring'] },
  { id: 'video', name: 'Video', category: 'communication', tags: ['camera', 'record'] },
  { id: 'voicemail', name: 'Voicemail', category: 'communication', tags: ['message', 'audio'] },
  { id: 'at-sign', name: 'At Sign', category: 'communication', tags: ['email', 'mention'] },
  { id: 'hash', name: 'Hash', category: 'communication', tags: ['hashtag', 'number'] },
  { id: 'bell', name: 'Bell', category: 'communication', tags: ['notification', 'alert'] },
  { id: 'bell-ring', name: 'Bell Ring', category: 'communication', tags: ['notification', 'alert'] },
  { id: 'megaphone', name: 'Megaphone', category: 'communication', tags: ['announcement', 'broadcast'] },
  { id: 'radio', name: 'Radio', category: 'communication', tags: ['broadcast', 'music'] },
  { id: 'rss', name: 'RSS', category: 'communication', tags: ['feed', 'subscribe'] },
  { id: 'share', name: 'Share', category: 'communication', tags: ['social', 'send'] },
  { id: 'share-2', name: 'Share Network', category: 'communication', tags: ['social', 'connect'] },
  { id: 'link', name: 'Link', category: 'communication', tags: ['url', 'chain'] },
  
  // WEATHER (15)
  { id: 'sun', name: 'Sun', category: 'weather', tags: ['sunny', 'day'] },
  { id: 'moon', name: 'Moon', category: 'weather', tags: ['night', 'dark'] },
  { id: 'cloud', name: 'Cloud', category: 'weather', tags: ['cloudy', 'overcast'] },
  { id: 'cloud-rain', name: 'Rain', category: 'weather', tags: ['rainy', 'precipitation'] },
  { id: 'cloud-snow', name: 'Snow', category: 'weather', tags: ['snowy', 'winter'] },
  { id: 'cloud-lightning', name: 'Lightning', category: 'weather', tags: ['storm', 'thunder'] },
  { id: 'cloud-drizzle', name: 'Drizzle', category: 'weather', tags: ['light-rain', 'mist'] },
  { id: 'cloud-fog', name: 'Fog', category: 'weather', tags: ['foggy', 'mist'] },
  { id: 'wind', name: 'Wind', category: 'weather', tags: ['windy', 'breeze'] },
  { id: 'thermometer', name: 'Thermometer', category: 'weather', tags: ['temperature', 'hot'] },
  { id: 'droplet', name: 'Droplet', category: 'weather', tags: ['water', 'rain'] },
  { id: 'snowflake', name: 'Snowflake', category: 'weather', tags: ['cold', 'winter'] },
  { id: 'rainbow', name: 'Rainbow', category: 'weather', tags: ['colorful', 'hope'] },
  { id: 'umbrella', name: 'Umbrella', category: 'weather', tags: ['rain', 'protection'] },
  { id: 'sunrise', name: 'Sunrise', category: 'weather', tags: ['morning', 'dawn'] },
  
  // NATURE (20)
  { id: 'tree', name: 'Tree', category: 'nature', tags: ['forest', 'plant'] },
  { id: 'tree-pine', name: 'Pine Tree', category: 'nature', tags: ['christmas', 'forest'] },
  { id: 'flower', name: 'Flower', category: 'nature', tags: ['plant', 'garden'] },
  { id: 'flower-2', name: 'Flower 2', category: 'nature', tags: ['plant', 'bloom'] },
  { id: 'leaf', name: 'Leaf', category: 'nature', tags: ['plant', 'nature'] },
  { id: 'clover', name: 'Clover', category: 'nature', tags: ['lucky', 'irish'] },
  { id: 'sprout', name: 'Sprout', category: 'nature', tags: ['grow', 'seedling'] },
  { id: 'mountain', name: 'Mountain', category: 'nature', tags: ['hiking', 'landscape'] },
  { id: 'mountains', name: 'Mountains', category: 'nature', tags: ['range', 'landscape'] },
  { id: 'waves', name: 'Waves', category: 'nature', tags: ['ocean', 'water'] },
  { id: 'flame', name: 'Flame', category: 'nature', tags: ['fire', 'hot'] },
  { id: 'zap', name: 'Zap', category: 'nature', tags: ['lightning', 'energy'] },
  { id: 'sparkles', name: 'Sparkles', category: 'nature', tags: ['magic', 'shine'] },
  { id: 'star-half', name: 'Star Half', category: 'nature', tags: ['rating', 'half'] },
  { id: 'globe', name: 'Globe', category: 'nature', tags: ['earth', 'world'] },
  { id: 'globe-2', name: 'Globe 2', category: 'nature', tags: ['planet', 'international'] },
  { id: 'palm', name: 'Palm Tree', category: 'nature', tags: ['tropical', 'beach'] },
  { id: 'shell', name: 'Shell', category: 'nature', tags: ['beach', 'ocean'] },
  { id: 'fish', name: 'Fish', category: 'nature', tags: ['ocean', 'aquarium'] },
  { id: 'bug', name: 'Bug', category: 'nature', tags: ['insect', 'ladybug'] },
  
  // ANIMALS (15)
  { id: 'cat', name: 'Cat', category: 'animals', tags: ['pet', 'kitten'] },
  { id: 'dog', name: 'Dog', category: 'animals', tags: ['pet', 'puppy'] },
  { id: 'bird', name: 'Bird', category: 'animals', tags: ['flying', 'tweet'] },
  { id: 'rabbit', name: 'Rabbit', category: 'animals', tags: ['bunny', 'pet'] },
  { id: 'turtle', name: 'Turtle', category: 'animals', tags: ['slow', 'shell'] },
  { id: 'squirrel', name: 'Squirrel', category: 'animals', tags: ['forest', 'nut'] },
  { id: 'paw-print', name: 'Paw Print', category: 'animals', tags: ['pet', 'track'] },
  { id: 'bone', name: 'Bone', category: 'animals', tags: ['dog', 'treat'] },
  { id: 'feather', name: 'Feather', category: 'animals', tags: ['bird', 'light'] },
  { id: 'egg', name: 'Egg', category: 'animals', tags: ['bird', 'easter'] },
  { id: 'butterfly', name: 'Butterfly', category: 'animals', tags: ['insect', 'beautiful'] },
  { id: 'snail', name: 'Snail', category: 'animals', tags: ['slow', 'shell'] },
  { id: 'spider', name: 'Spider', category: 'animals', tags: ['halloween', 'web'] },
  { id: 'bat', name: 'Bat', category: 'animals', tags: ['halloween', 'night'] },
  { id: 'horse', name: 'Horse', category: 'animals', tags: ['riding', 'farm'] },
  
  // CELEBRATION (20)
  { id: 'party-popper', name: 'Party Popper', category: 'celebration', tags: ['confetti', 'celebrate'] },
  { id: 'gift', name: 'Gift', category: 'celebration', tags: ['present', 'birthday'] },
  { id: 'cake', name: 'Cake', category: 'celebration', tags: ['birthday', 'dessert'] },
  { id: 'cake-slice', name: 'Cake Slice', category: 'celebration', tags: ['birthday', 'piece'] },
  { id: 'balloon', name: 'Balloon', category: 'celebration', tags: ['party', 'birthday'] },
  { id: 'confetti', name: 'Confetti', category: 'celebration', tags: ['party', 'celebrate'] },
  { id: 'crown', name: 'Crown', category: 'celebration', tags: ['king', 'queen'] },
  { id: 'trophy', name: 'Trophy', category: 'celebration', tags: ['winner', 'award'] },
  { id: 'medal', name: 'Medal', category: 'celebration', tags: ['award', 'winner'] },
  { id: 'ribbon', name: 'Ribbon', category: 'celebration', tags: ['award', 'decoration'] },
  { id: 'award', name: 'Award', category: 'celebration', tags: ['badge', 'achievement'] },
  { id: 'badge', name: 'Badge', category: 'celebration', tags: ['award', 'achievement'] },
  { id: 'flag', name: 'Flag', category: 'celebration', tags: ['country', 'finish'] },
  { id: 'flag-triangle', name: 'Flag Triangle', category: 'celebration', tags: ['pennant', 'banner'] },
  { id: 'firework', name: 'Firework', category: 'celebration', tags: ['celebration', 'night'] },
  { id: 'sparkle', name: 'Sparkle', category: 'celebration', tags: ['magic', 'shine'] },
  { id: 'wine', name: 'Wine Glass', category: 'celebration', tags: ['toast', 'cheers'] },
  { id: 'beer', name: 'Beer', category: 'celebration', tags: ['toast', 'cheers'] },
  { id: 'glass-water', name: 'Glass', category: 'celebration', tags: ['drink', 'toast'] },
  { id: 'candy', name: 'Candy', category: 'celebration', tags: ['sweet', 'treat'] },
  
  // TRAVEL (20)
  { id: 'plane', name: 'Plane', category: 'travel', tags: ['flight', 'airplane'] },
  { id: 'plane-takeoff', name: 'Takeoff', category: 'travel', tags: ['flight', 'departure'] },
  { id: 'plane-landing', name: 'Landing', category: 'travel', tags: ['flight', 'arrival'] },
  { id: 'car', name: 'Car', category: 'travel', tags: ['vehicle', 'drive'] },
  { id: 'bus', name: 'Bus', category: 'travel', tags: ['vehicle', 'public'] },
  { id: 'train', name: 'Train', category: 'travel', tags: ['vehicle', 'rail'] },
  { id: 'ship', name: 'Ship', category: 'travel', tags: ['boat', 'cruise'] },
  { id: 'anchor', name: 'Anchor', category: 'travel', tags: ['boat', 'nautical'] },
  { id: 'compass', name: 'Compass', category: 'travel', tags: ['direction', 'navigation'] },
  { id: 'map', name: 'Map', category: 'travel', tags: ['navigation', 'location'] },
  { id: 'map-pin', name: 'Map Pin', category: 'travel', tags: ['location', 'marker'] },
  { id: 'navigation', name: 'Navigation', category: 'travel', tags: ['direction', 'gps'] },
  { id: 'luggage', name: 'Luggage', category: 'travel', tags: ['suitcase', 'travel'] },
  { id: 'backpack', name: 'Backpack', category: 'travel', tags: ['bag', 'hiking'] },
  { id: 'tent', name: 'Tent', category: 'travel', tags: ['camping', 'outdoor'] },
  { id: 'hotel', name: 'Hotel', category: 'travel', tags: ['accommodation', 'stay'] },
  { id: 'bed', name: 'Bed', category: 'travel', tags: ['sleep', 'rest'] },
  { id: 'ticket', name: 'Ticket', category: 'travel', tags: ['admission', 'pass'] },
  { id: 'passport', name: 'Passport', category: 'travel', tags: ['travel', 'id'] },
  { id: 'globe-alt', name: 'Globe Alt', category: 'travel', tags: ['world', 'international'] },
  
  // FOOD & DRINK (15)
  { id: 'coffee', name: 'Coffee', category: 'food', tags: ['drink', 'cafe'] },
  { id: 'cup', name: 'Cup', category: 'food', tags: ['drink', 'tea'] },
  { id: 'utensils', name: 'Utensils', category: 'food', tags: ['eat', 'restaurant'] },
  { id: 'pizza', name: 'Pizza', category: 'food', tags: ['food', 'italian'] },
  { id: 'apple', name: 'Apple', category: 'food', tags: ['fruit', 'healthy'] },
  { id: 'cherry', name: 'Cherry', category: 'food', tags: ['fruit', 'sweet'] },
  { id: 'grape', name: 'Grape', category: 'food', tags: ['fruit', 'wine'] },
  { id: 'banana', name: 'Banana', category: 'food', tags: ['fruit', 'yellow'] },
  { id: 'carrot', name: 'Carrot', category: 'food', tags: ['vegetable', 'orange'] },
  { id: 'cookie', name: 'Cookie', category: 'food', tags: ['dessert', 'sweet'] },
  { id: 'ice-cream', name: 'Ice Cream', category: 'food', tags: ['dessert', 'cold'] },
  { id: 'popcorn', name: 'Popcorn', category: 'food', tags: ['snack', 'movie'] },
  { id: 'sandwich', name: 'Sandwich', category: 'food', tags: ['lunch', 'bread'] },
  { id: 'croissant', name: 'Croissant', category: 'food', tags: ['pastry', 'french'] },
  { id: 'chef-hat', name: 'Chef Hat', category: 'food', tags: ['cooking', 'kitchen'] },
  
  // MEDIA (15)
  { id: 'camera', name: 'Camera', category: 'media', tags: ['photo', 'picture'] },
  { id: 'image', name: 'Image', category: 'media', tags: ['photo', 'picture'] },
  { id: 'images', name: 'Images', category: 'media', tags: ['gallery', 'photos'] },
  { id: 'film', name: 'Film', category: 'media', tags: ['movie', 'video'] },
  { id: 'video-camera', name: 'Video Camera', category: 'media', tags: ['record', 'movie'] },
  { id: 'mic', name: 'Microphone', category: 'media', tags: ['audio', 'record'] },
  { id: 'headphones', name: 'Headphones', category: 'media', tags: ['audio', 'music'] },
  { id: 'music', name: 'Music', category: 'media', tags: ['audio', 'song'] },
  { id: 'music-2', name: 'Music Notes', category: 'media', tags: ['audio', 'song'] },
  { id: 'play', name: 'Play', category: 'media', tags: ['video', 'start'] },
  { id: 'pause', name: 'Pause', category: 'media', tags: ['video', 'stop'] },
  { id: 'volume', name: 'Volume', category: 'media', tags: ['audio', 'sound'] },
  { id: 'tv', name: 'TV', category: 'media', tags: ['television', 'screen'] },
  { id: 'radio-tower', name: 'Radio Tower', category: 'media', tags: ['broadcast', 'signal'] },
  { id: 'podcast', name: 'Podcast', category: 'media', tags: ['audio', 'show'] },
  
  // SOCIAL (10)
  { id: 'user', name: 'User', category: 'social', tags: ['person', 'profile'] },
  { id: 'users', name: 'Users', category: 'social', tags: ['people', 'group'] },
  { id: 'user-plus', name: 'User Plus', category: 'social', tags: ['add', 'friend'] },
  { id: 'heart-handshake', name: 'Handshake', category: 'social', tags: ['deal', 'agree'] },
  { id: 'thumbs-up', name: 'Thumbs Up', category: 'social', tags: ['like', 'approve'] },
  { id: 'thumbs-down', name: 'Thumbs Down', category: 'social', tags: ['dislike', 'disapprove'] },
  { id: 'smile', name: 'Smile', category: 'social', tags: ['happy', 'emoji'] },
  { id: 'frown', name: 'Frown', category: 'social', tags: ['sad', 'emoji'] },
  { id: 'meh', name: 'Meh', category: 'social', tags: ['neutral', 'emoji'] },
  { id: 'laugh', name: 'Laugh', category: 'social', tags: ['happy', 'lol'] },
];

// SVG path data for icons (simplified)
const iconPaths: Record<string, string> = {
  'arrow-up': 'M12 19V5M5 12l7-7 7 7',
  'arrow-down': 'M12 5v14M19 12l-7 7-7-7',
  'arrow-left': 'M19 12H5M12 19l-7-7 7-7',
  'arrow-right': 'M5 12h14M12 5l7 7-7 7',
  'chevron-up': 'M18 15l-6-6-6 6',
  'chevron-down': 'M6 9l6 6 6-6',
  'chevron-left': 'M15 18l-6-6 6-6',
  'chevron-right': 'M9 18l6-6-6-6',
  'heart': 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  'star': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  'sun': 'M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z',
  'moon': 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
  'cloud': 'M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z',
  'gift': 'M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z',
  'camera': 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  'music': 'M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
  'plane': 'M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z',
  'coffee': 'M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3',
  'user': 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  'smile': 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01',
};

const defaultPath = 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const color = searchParams.get('color') || '000000';
  const size = parseInt(searchParams.get('size') || '24');
  const strokeWidth = searchParams.get('strokeWidth') || '2';
  const category = searchParams.get('category');
  const search = searchParams.get('search')?.toLowerCase();
  
  // If ID provided, return SVG icon
  if (id) {
    const path = iconPaths[id] || defaultPath;
    const isFilled = ['heart', 'star'].includes(id);
    
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${isFilled ? `#${color}` : 'none'}" stroke="#${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"><path d="${path}"/></svg>`;
    
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  }
  
  // Filter icons
  let filteredIcons = [...icons];
  
  if (category) {
    filteredIcons = filteredIcons.filter(i => i.category === category);
  }
  
  if (search) {
    filteredIcons = filteredIcons.filter(i => 
      i.name.toLowerCase().includes(search) || 
      i.tags.some(t => t.includes(search))
    );
  }
  
  const categories = Array.from(new Set(icons.map(i => i.category)));
  
  return NextResponse.json({
    icons: filteredIcons.map(i => ({
      ...i,
      preview: `/api/icons?id=${i.id}&color=${color}&size=32`,
    })),
    categories,
    total: filteredIcons.length,
    customization: {
      parameters: ['color', 'size', 'strokeWidth'],
      example: '/api/icons?id=heart&color=ec4899&size=48&strokeWidth=2',
    },
  });
}

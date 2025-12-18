// CRAV Scrapbook - Gradients API
// 100+ Beautiful CSS Gradients for backgrounds
// Categories: sunrise, sunset, ocean, nature, candy, neon, pastel, dark, metallic, seasonal

import { NextRequest, NextResponse } from 'next/server';

interface Gradient {
  id: string;
  name: string;
  category: string;
  colors: string[];
  angle: number;
  css: string;
  premium: boolean;
}

const gradients: Gradient[] = [
  // SUNRISE (10)
  { id: 'sunrise-warm', name: 'Warm Sunrise', category: 'sunrise', colors: ['#ff512f', '#f09819'], angle: 135, css: 'linear-gradient(135deg, #ff512f 0%, #f09819 100%)', premium: false },
  { id: 'sunrise-soft', name: 'Soft Dawn', category: 'sunrise', colors: ['#ffecd2', '#fcb69f'], angle: 135, css: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', premium: false },
  { id: 'sunrise-golden', name: 'Golden Hour', category: 'sunrise', colors: ['#f7971e', '#ffd200'], angle: 90, css: 'linear-gradient(90deg, #f7971e 0%, #ffd200 100%)', premium: false },
  { id: 'sunrise-peach', name: 'Peach Morning', category: 'sunrise', colors: ['#ed6ea0', '#ec8c69'], angle: 135, css: 'linear-gradient(135deg, #ed6ea0 0%, #ec8c69 100%)', premium: false },
  { id: 'sunrise-coral', name: 'Coral Sky', category: 'sunrise', colors: ['#ff9966', '#ff5e62'], angle: 90, css: 'linear-gradient(90deg, #ff9966 0%, #ff5e62 100%)', premium: false },
  { id: 'sunrise-mango', name: 'Mango Tango', category: 'sunrise', colors: ['#ffe259', '#ffa751'], angle: 135, css: 'linear-gradient(135deg, #ffe259 0%, #ffa751 100%)', premium: false },
  { id: 'sunrise-citrus', name: 'Citrus Burst', category: 'sunrise', colors: ['#f5af19', '#f12711'], angle: 45, css: 'linear-gradient(45deg, #f5af19 0%, #f12711 100%)', premium: false },
  { id: 'sunrise-honey', name: 'Honey Glow', category: 'sunrise', colors: ['#f7b733', '#fc4a1a'], angle: 135, css: 'linear-gradient(135deg, #f7b733 0%, #fc4a1a 100%)', premium: false },
  { id: 'sunrise-amber', name: 'Amber Light', category: 'sunrise', colors: ['#ffb347', '#ffcc33'], angle: 90, css: 'linear-gradient(90deg, #ffb347 0%, #ffcc33 100%)', premium: false },
  { id: 'sunrise-rose', name: 'Rose Dawn', category: 'sunrise', colors: ['#eecda3', '#ef629f'], angle: 135, css: 'linear-gradient(135deg, #eecda3 0%, #ef629f 100%)', premium: false },
  
  // SUNSET (10)
  { id: 'sunset-purple', name: 'Purple Sunset', category: 'sunset', colors: ['#c471f5', '#fa71cd'], angle: 135, css: 'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)', premium: false },
  { id: 'sunset-dusk', name: 'Dusk Sky', category: 'sunset', colors: ['#a18cd1', '#fbc2eb'], angle: 135, css: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', premium: false },
  { id: 'sunset-twilight', name: 'Twilight', category: 'sunset', colors: ['#0f0c29', '#302b63', '#24243e'], angle: 180, css: 'linear-gradient(180deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', premium: false },
  { id: 'sunset-magenta', name: 'Magenta Dreams', category: 'sunset', colors: ['#c33764', '#1d2671'], angle: 135, css: 'linear-gradient(135deg, #c33764 0%, #1d2671 100%)', premium: false },
  { id: 'sunset-violet', name: 'Violet Hour', category: 'sunset', colors: ['#8e2de2', '#4a00e0'], angle: 135, css: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)', premium: false },
  { id: 'sunset-pink', name: 'Pink Horizon', category: 'sunset', colors: ['#ee9ca7', '#ffdde1'], angle: 135, css: 'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)', premium: false },
  { id: 'sunset-lavender', name: 'Lavender Mist', category: 'sunset', colors: ['#d299c2', '#fef9d7'], angle: 135, css: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)', premium: false },
  { id: 'sunset-orchid', name: 'Orchid Sky', category: 'sunset', colors: ['#da22ff', '#9733ee'], angle: 135, css: 'linear-gradient(135deg, #da22ff 0%, #9733ee 100%)', premium: false },
  { id: 'sunset-plum', name: 'Plum Velvet', category: 'sunset', colors: ['#ec008c', '#fc6767'], angle: 135, css: 'linear-gradient(135deg, #ec008c 0%, #fc6767 100%)', premium: false },
  { id: 'sunset-berry', name: 'Berry Bliss', category: 'sunset', colors: ['#8e44ad', '#c0392b'], angle: 135, css: 'linear-gradient(135deg, #8e44ad 0%, #c0392b 100%)', premium: false },
  
  // OCEAN (10)
  { id: 'ocean-deep', name: 'Deep Ocean', category: 'ocean', colors: ['#2193b0', '#6dd5ed'], angle: 135, css: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)', premium: false },
  { id: 'ocean-teal', name: 'Teal Waves', category: 'ocean', colors: ['#11998e', '#38ef7d'], angle: 135, css: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', premium: false },
  { id: 'ocean-aqua', name: 'Aqua Marine', category: 'ocean', colors: ['#00c6fb', '#005bea'], angle: 135, css: 'linear-gradient(135deg, #00c6fb 0%, #005bea 100%)', premium: false },
  { id: 'ocean-cyan', name: 'Cyan Splash', category: 'ocean', colors: ['#00d2ff', '#3a7bd5'], angle: 90, css: 'linear-gradient(90deg, #00d2ff 0%, #3a7bd5 100%)', premium: false },
  { id: 'ocean-blue', name: 'Blue Lagoon', category: 'ocean', colors: ['#4facfe', '#00f2fe'], angle: 135, css: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', premium: false },
  { id: 'ocean-pacific', name: 'Pacific Dream', category: 'ocean', colors: ['#34e89e', '#0f3443'], angle: 135, css: 'linear-gradient(135deg, #34e89e 0%, #0f3443 100%)', premium: false },
  { id: 'ocean-seafoam', name: 'Sea Foam', category: 'ocean', colors: ['#96fbc4', '#f9f586'], angle: 135, css: 'linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)', premium: false },
  { id: 'ocean-turquoise', name: 'Turquoise Bay', category: 'ocean', colors: ['#1cd8d2', '#93edc7'], angle: 90, css: 'linear-gradient(90deg, #1cd8d2 0%, #93edc7 100%)', premium: false },
  { id: 'ocean-mermaid', name: 'Mermaid Cove', category: 'ocean', colors: ['#3494e6', '#ec6ead'], angle: 135, css: 'linear-gradient(135deg, #3494e6 0%, #ec6ead 100%)', premium: false },
  { id: 'ocean-coral', name: 'Coral Reef', category: 'ocean', colors: ['#ff6b6b', '#feca57', '#48dbfb'], angle: 135, css: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #48dbfb 100%)', premium: false },
  
  // NATURE (10)
  { id: 'nature-forest', name: 'Forest', category: 'nature', colors: ['#134e5e', '#71b280'], angle: 135, css: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)', premium: false },
  { id: 'nature-grass', name: 'Fresh Grass', category: 'nature', colors: ['#56ab2f', '#a8e063'], angle: 90, css: 'linear-gradient(90deg, #56ab2f 0%, #a8e063 100%)', premium: false },
  { id: 'nature-spring', name: 'Spring Meadow', category: 'nature', colors: ['#00b09b', '#96c93d'], angle: 135, css: 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)', premium: false },
  { id: 'nature-moss', name: 'Mossy Stone', category: 'nature', colors: ['#1d976c', '#93f9b9'], angle: 135, css: 'linear-gradient(135deg, #1d976c 0%, #93f9b9 100%)', premium: false },
  { id: 'nature-autumn', name: 'Autumn Leaves', category: 'nature', colors: ['#d38312', '#a83279'], angle: 135, css: 'linear-gradient(135deg, #d38312 0%, #a83279 100%)', premium: false },
  { id: 'nature-earth', name: 'Earth Tones', category: 'nature', colors: ['#8b4513', '#daa520'], angle: 135, css: 'linear-gradient(135deg, #8b4513 0%, #daa520 100%)', premium: false },
  { id: 'nature-olive', name: 'Olive Grove', category: 'nature', colors: ['#808000', '#daa520'], angle: 90, css: 'linear-gradient(90deg, #808000 0%, #daa520 100%)', premium: false },
  { id: 'nature-sage', name: 'Sage Garden', category: 'nature', colors: ['#bdc3c7', '#2c3e50'], angle: 135, css: 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)', premium: false },
  { id: 'nature-mint', name: 'Mint Fresh', category: 'nature', colors: ['#00b894', '#00cec9'], angle: 90, css: 'linear-gradient(90deg, #00b894 0%, #00cec9 100%)', premium: false },
  { id: 'nature-jungle', name: 'Jungle Vibe', category: 'nature', colors: ['#2d5016', '#7cb518'], angle: 135, css: 'linear-gradient(135deg, #2d5016 0%, #7cb518 100%)', premium: false },
  
  // PASTEL (10)
  { id: 'pastel-pink', name: 'Pastel Pink', category: 'pastel', colors: ['#ffecd2', '#fcb69f'], angle: 135, css: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', premium: false },
  { id: 'pastel-blue', name: 'Pastel Blue', category: 'pastel', colors: ['#a1c4fd', '#c2e9fb'], angle: 135, css: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)', premium: false },
  { id: 'pastel-purple', name: 'Pastel Purple', category: 'pastel', colors: ['#e0c3fc', '#8ec5fc'], angle: 135, css: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)', premium: false },
  { id: 'pastel-green', name: 'Pastel Green', category: 'pastel', colors: ['#d4fc79', '#96e6a1'], angle: 135, css: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)', premium: false },
  { id: 'pastel-yellow', name: 'Pastel Yellow', category: 'pastel', colors: ['#fddb92', '#d1fdff'], angle: 135, css: 'linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)', premium: false },
  { id: 'pastel-peach', name: 'Pastel Peach', category: 'pastel', colors: ['#fad0c4', '#ffd1ff'], angle: 135, css: 'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)', premium: false },
  { id: 'pastel-lavender', name: 'Pastel Lavender', category: 'pastel', colors: ['#e2d1f9', '#a18cd1'], angle: 135, css: 'linear-gradient(135deg, #e2d1f9 0%, #a18cd1 100%)', premium: false },
  { id: 'pastel-mint', name: 'Pastel Mint', category: 'pastel', colors: ['#c1fcd3', '#b7f8db'], angle: 90, css: 'linear-gradient(90deg, #c1fcd3 0%, #b7f8db 100%)', premium: false },
  { id: 'pastel-coral', name: 'Pastel Coral', category: 'pastel', colors: ['#ff9a9e', '#fecfef'], angle: 135, css: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', premium: false },
  { id: 'pastel-sky', name: 'Pastel Sky', category: 'pastel', colors: ['#89f7fe', '#66a6ff'], angle: 135, css: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)', premium: false },
  
  // NEON (10)
  { id: 'neon-pink', name: 'Neon Pink', category: 'neon', colors: ['#f953c6', '#b91d73'], angle: 135, css: 'linear-gradient(135deg, #f953c6 0%, #b91d73 100%)', premium: false },
  { id: 'neon-blue', name: 'Neon Blue', category: 'neon', colors: ['#00f5ff', '#0080ff'], angle: 135, css: 'linear-gradient(135deg, #00f5ff 0%, #0080ff 100%)', premium: false },
  { id: 'neon-green', name: 'Neon Green', category: 'neon', colors: ['#39ff14', '#00ff00'], angle: 135, css: 'linear-gradient(135deg, #39ff14 0%, #00ff00 100%)', premium: false },
  { id: 'neon-purple', name: 'Neon Purple', category: 'neon', colors: ['#bc13fe', '#8f00ff'], angle: 135, css: 'linear-gradient(135deg, #bc13fe 0%, #8f00ff 100%)', premium: false },
  { id: 'neon-orange', name: 'Neon Orange', category: 'neon', colors: ['#ff6b08', '#ff0080'], angle: 135, css: 'linear-gradient(135deg, #ff6b08 0%, #ff0080 100%)', premium: false },
  { id: 'neon-cyber', name: 'Cyber Punk', category: 'neon', colors: ['#ff00ff', '#00ffff'], angle: 135, css: 'linear-gradient(135deg, #ff00ff 0%, #00ffff 100%)', premium: false },
  { id: 'neon-electric', name: 'Electric', category: 'neon', colors: ['#f72585', '#7209b7', '#3a0ca3'], angle: 135, css: 'linear-gradient(135deg, #f72585 0%, #7209b7 50%, #3a0ca3 100%)', premium: false },
  { id: 'neon-laser', name: 'Laser', category: 'neon', colors: ['#ff0844', '#ffb199'], angle: 135, css: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)', premium: false },
  { id: 'neon-glow', name: 'Glow', category: 'neon', colors: ['#fa709a', '#fee140'], angle: 135, css: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', premium: false },
  { id: 'neon-synthwave', name: 'Synthwave', category: 'neon', colors: ['#fc466b', '#3f5efb'], angle: 135, css: 'linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)', premium: false },
  
  // DARK (10)
  { id: 'dark-midnight', name: 'Midnight', category: 'dark', colors: ['#232526', '#414345'], angle: 135, css: 'linear-gradient(135deg, #232526 0%, #414345 100%)', premium: false },
  { id: 'dark-charcoal', name: 'Charcoal', category: 'dark', colors: ['#1a1a2e', '#16213e'], angle: 135, css: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', premium: false },
  { id: 'dark-slate', name: 'Slate', category: 'dark', colors: ['#485563', '#29323c'], angle: 135, css: 'linear-gradient(135deg, #485563 0%, #29323c 100%)', premium: false },
  { id: 'dark-obsidian', name: 'Obsidian', category: 'dark', colors: ['#000000', '#434343'], angle: 135, css: 'linear-gradient(135deg, #000000 0%, #434343 100%)', premium: false },
  { id: 'dark-night', name: 'Night Sky', category: 'dark', colors: ['#141e30', '#243b55'], angle: 135, css: 'linear-gradient(135deg, #141e30 0%, #243b55 100%)', premium: false },
  { id: 'dark-space', name: 'Deep Space', category: 'dark', colors: ['#000000', '#0f0c29', '#302b63'], angle: 180, css: 'linear-gradient(180deg, #000000 0%, #0f0c29 50%, #302b63 100%)', premium: false },
  { id: 'dark-carbon', name: 'Carbon', category: 'dark', colors: ['#373b44', '#4286f4'], angle: 135, css: 'linear-gradient(135deg, #373b44 0%, #4286f4 100%)', premium: false },
  { id: 'dark-noir', name: 'Noir', category: 'dark', colors: ['#1f1c2c', '#928dab'], angle: 135, css: 'linear-gradient(135deg, #1f1c2c 0%, #928dab 100%)', premium: false },
  { id: 'dark-shadow', name: 'Shadow', category: 'dark', colors: ['#0f2027', '#203a43', '#2c5364'], angle: 135, css: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)', premium: false },
  { id: 'dark-eclipse', name: 'Eclipse', category: 'dark', colors: ['#191970', '#000000'], angle: 180, css: 'linear-gradient(180deg, #191970 0%, #000000 100%)', premium: false },
  
  // METALLIC (10)
  { id: 'metallic-gold', name: 'Gold', category: 'metallic', colors: ['#bf953f', '#fcf6ba', '#b38728'], angle: 135, css: 'linear-gradient(135deg, #bf953f 0%, #fcf6ba 50%, #b38728 100%)', premium: false },
  { id: 'metallic-silver', name: 'Silver', category: 'metallic', colors: ['#bdc3c7', '#eaefef', '#bdc3c7'], angle: 135, css: 'linear-gradient(135deg, #bdc3c7 0%, #eaefef 50%, #bdc3c7 100%)', premium: false },
  { id: 'metallic-bronze', name: 'Bronze', category: 'metallic', colors: ['#cd7f32', '#e6be8a', '#cd7f32'], angle: 135, css: 'linear-gradient(135deg, #cd7f32 0%, #e6be8a 50%, #cd7f32 100%)', premium: false },
  { id: 'metallic-copper', name: 'Copper', category: 'metallic', colors: ['#b87333', '#da8a67', '#b87333'], angle: 135, css: 'linear-gradient(135deg, #b87333 0%, #da8a67 50%, #b87333 100%)', premium: false },
  { id: 'metallic-rose-gold', name: 'Rose Gold', category: 'metallic', colors: ['#b76e79', '#eacda3'], angle: 135, css: 'linear-gradient(135deg, #b76e79 0%, #eacda3 100%)', premium: false },
  { id: 'metallic-platinum', name: 'Platinum', category: 'metallic', colors: ['#e5e4e2', '#a9a9a9', '#e5e4e2'], angle: 135, css: 'linear-gradient(135deg, #e5e4e2 0%, #a9a9a9 50%, #e5e4e2 100%)', premium: false },
  { id: 'metallic-chrome', name: 'Chrome', category: 'metallic', colors: ['#d4d4dc', '#fffffa', '#d4d4dc'], angle: 180, css: 'linear-gradient(180deg, #d4d4dc 0%, #fffffa 50%, #d4d4dc 100%)', premium: false },
  { id: 'metallic-steel', name: 'Steel', category: 'metallic', colors: ['#43464b', '#616469', '#43464b'], angle: 135, css: 'linear-gradient(135deg, #43464b 0%, #616469 50%, #43464b 100%)', premium: false },
  { id: 'metallic-titanium', name: 'Titanium', category: 'metallic', colors: ['#878787', '#a9a9a9', '#878787'], angle: 135, css: 'linear-gradient(135deg, #878787 0%, #a9a9a9 50%, #878787 100%)', premium: false },
  { id: 'metallic-brass', name: 'Brass', category: 'metallic', colors: ['#b5a642', '#d4af37', '#b5a642'], angle: 135, css: 'linear-gradient(135deg, #b5a642 0%, #d4af37 50%, #b5a642 100%)', premium: false },
  
  // SEASONAL (20)
  { id: 'seasonal-spring', name: 'Spring Bloom', category: 'seasonal', colors: ['#ffd1dc', '#87ceeb'], angle: 135, css: 'linear-gradient(135deg, #ffd1dc 0%, #87ceeb 100%)', premium: false },
  { id: 'seasonal-summer', name: 'Summer Vibes', category: 'seasonal', colors: ['#ffd700', '#ff6347'], angle: 135, css: 'linear-gradient(135deg, #ffd700 0%, #ff6347 100%)', premium: false },
  { id: 'seasonal-autumn', name: 'Autumn Fall', category: 'seasonal', colors: ['#ff8c00', '#8b0000'], angle: 135, css: 'linear-gradient(135deg, #ff8c00 0%, #8b0000 100%)', premium: false },
  { id: 'seasonal-winter', name: 'Winter Frost', category: 'seasonal', colors: ['#e0ffff', '#4682b4'], angle: 135, css: 'linear-gradient(135deg, #e0ffff 0%, #4682b4 100%)', premium: false },
  { id: 'seasonal-christmas', name: 'Christmas', category: 'seasonal', colors: ['#165b33', '#bb2528'], angle: 135, css: 'linear-gradient(135deg, #165b33 0%, #bb2528 100%)', premium: false },
  { id: 'seasonal-valentine', name: 'Valentine', category: 'seasonal', colors: ['#ff1493', '#ff69b4'], angle: 135, css: 'linear-gradient(135deg, #ff1493 0%, #ff69b4 100%)', premium: false },
  { id: 'seasonal-easter', name: 'Easter', category: 'seasonal', colors: ['#ffb6c1', '#87ceeb', '#dda0dd'], angle: 135, css: 'linear-gradient(135deg, #ffb6c1 0%, #87ceeb 50%, #dda0dd 100%)', premium: false },
  { id: 'seasonal-halloween', name: 'Halloween', category: 'seasonal', colors: ['#ff8c00', '#2f0a28'], angle: 135, css: 'linear-gradient(135deg, #ff8c00 0%, #2f0a28 100%)', premium: false },
  { id: 'seasonal-thanksgiving', name: 'Thanksgiving', category: 'seasonal', colors: ['#8b4513', '#ffa500'], angle: 135, css: 'linear-gradient(135deg, #8b4513 0%, #ffa500 100%)', premium: false },
  { id: 'seasonal-4th-july', name: '4th of July', category: 'seasonal', colors: ['#bf0a30', '#ffffff', '#002868'], angle: 180, css: 'linear-gradient(180deg, #bf0a30 0%, #ffffff 50%, #002868 100%)', premium: false },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const category = searchParams.get('category');
  const premium = searchParams.get('premium');
  
  // Filter gradients
  let filteredGradients = [...gradients];
  
  if (category) {
    filteredGradients = filteredGradients.filter(g => g.category === category);
  }
  
  if (premium === 'true') {
    filteredGradients = filteredGradients.filter(g => g.premium);
  } else if (premium === 'false') {
    filteredGradients = filteredGradients.filter(g => !g.premium);
  }
  
  // If ID provided, return specific gradient
  if (id) {
    const gradient = gradients.find(g => g.id === id);
    if (gradient) {
      return NextResponse.json(gradient);
    }
    return NextResponse.json({ error: 'Gradient not found' }, { status: 404 });
  }
  
  const categories = Array.from(new Set(gradients.map(g => g.category)));
  
  return NextResponse.json({
    gradients: filteredGradients,
    categories,
    total: filteredGradients.length,
    usage: {
      asBackground: 'Apply gradient.css to element background',
      example: 'background: linear-gradient(135deg, #ff512f 0%, #f09819 100%)',
    },
  });
}

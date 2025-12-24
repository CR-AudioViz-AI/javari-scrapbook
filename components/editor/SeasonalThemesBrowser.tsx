// components/editor/SeasonalThemesBrowser.tsx
// Seasonal & Holiday Theme Packs for Scrapbooking
// Timestamp: Tuesday, December 24, 2025 – 2:35 PM Eastern Time
// CR AudioViz AI - "Your Story. Our Design"

'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  Sun, 
  Snowflake, 
  Leaf, 
  Flower2,
  Heart,
  Gift,
  Cake,
  GraduationCap,
  Baby,
  Plane,
  Star,
  Moon,
  TreePine,
  Egg
} from 'lucide-react';

interface ThemePack {
  id: string;
  name: string;
  category: string;
  description: string;
  colors: string[];
  patterns: string[];
  fonts: string[];
  elements: string[];
  preview: string;
  tags: string[];
}

interface SeasonalThemesBrowserProps {
  onSelectTheme?: (theme: ThemePack) => void;
  onApplyTheme?: (theme: ThemePack) => void;
}

// Comprehensive theme packs
const THEME_PACKS: ThemePack[] = [
  // SEASONS
  {
    id: 'spring-garden',
    name: 'Spring Garden',
    category: 'seasons',
    description: 'Fresh florals, soft pastels, and new beginnings',
    colors: ['#FDF2F8', '#FBCFE8', '#A7F3D0', '#FDE68A', '#93C5FD'],
    patterns: ['floral', 'polka-dots', 'stripes', 'gingham'],
    fonts: ['Dancing Script', 'Playfair Display', 'Lato'],
    elements: ['flowers', 'butterflies', 'birds', 'bees', 'rainbows'],
    preview: '🌸🦋🌷',
    tags: ['spring', 'flowers', 'pastel', 'fresh']
  },
  {
    id: 'summer-sunshine',
    name: 'Summer Sunshine',
    category: 'seasons',
    description: 'Bright colors, beach vibes, and endless fun',
    colors: ['#FEF3C7', '#FCD34D', '#F97316', '#0EA5E9', '#10B981'],
    patterns: ['waves', 'palm-trees', 'stripes', 'tropical'],
    fonts: ['Pacifico', 'Bebas Neue', 'Open Sans'],
    elements: ['sun', 'beach', 'ice-cream', 'sunglasses', 'flip-flops'],
    preview: '☀️🏖️🍦',
    tags: ['summer', 'beach', 'bright', 'vacation']
  },
  {
    id: 'autumn-harvest',
    name: 'Autumn Harvest',
    category: 'seasons',
    description: 'Warm earth tones, falling leaves, and cozy vibes',
    colors: ['#FEF3C7', '#F59E0B', '#DC2626', '#92400E', '#365314'],
    patterns: ['leaves', 'plaid', 'wood-grain', 'burlap'],
    fonts: ['Amatic SC', 'Merriweather', 'Roboto Slab'],
    elements: ['leaves', 'pumpkins', 'acorns', 'scarecrows', 'corn'],
    preview: '🍂🎃🍁',
    tags: ['autumn', 'fall', 'harvest', 'thanksgiving']
  },
  {
    id: 'winter-wonderland',
    name: 'Winter Wonderland',
    category: 'seasons',
    description: 'Snowy scenes, icy blues, and magical moments',
    colors: ['#F8FAFC', '#E0F2FE', '#BAE6FD', '#7DD3FC', '#1E3A8A'],
    patterns: ['snowflakes', 'argyle', 'cable-knit', 'frost'],
    fonts: ['Mountains of Christmas', 'Quicksand', 'Montserrat'],
    elements: ['snowflakes', 'snowman', 'mittens', 'hot-cocoa', 'icicles'],
    preview: '❄️⛄🎿',
    tags: ['winter', 'snow', 'cold', 'cozy']
  },

  // MAJOR HOLIDAYS
  {
    id: 'christmas-magic',
    name: 'Christmas Magic',
    category: 'holidays',
    description: 'Traditional Christmas with red, green, and gold',
    colors: ['#DC2626', '#166534', '#FCD34D', '#FAFAFA', '#1F2937'],
    patterns: ['plaid', 'candy-cane', 'snowflakes', 'holly'],
    fonts: ['Mountains of Christmas', 'Cinzel', 'Great Vibes'],
    elements: ['tree', 'ornaments', 'gifts', 'santa', 'reindeer', 'stockings'],
    preview: '🎄🎅🎁',
    tags: ['christmas', 'holiday', 'festive', 'december']
  },
  {
    id: 'hanukkah-lights',
    name: 'Hanukkah Lights',
    category: 'holidays',
    description: 'Beautiful blues, silvers, and golden light',
    colors: ['#1E40AF', '#3B82F6', '#93C5FD', '#FCD34D', '#F8FAFC'],
    patterns: ['stars', 'geometric', 'damask'],
    fonts: ['David Libre', 'Playfair Display', 'Lato'],
    elements: ['menorah', 'dreidel', 'star-of-david', 'gelt', 'candles'],
    preview: '🕎✡️🕯️',
    tags: ['hanukkah', 'chanukah', 'jewish', 'holiday']
  },
  {
    id: 'new-years-celebration',
    name: 'New Year\'s Eve',
    category: 'holidays',
    description: 'Glamorous gold, silver, and black sparkle',
    colors: ['#1F2937', '#FCD34D', '#E5E7EB', '#9333EA', '#EC4899'],
    patterns: ['confetti', 'stars', 'glitter', 'streamers'],
    fonts: ['Playfair Display', 'Bebas Neue', 'Great Vibes'],
    elements: ['champagne', 'clock', 'fireworks', 'balloons', 'confetti'],
    preview: '🎆🥂🎉',
    tags: ['new-year', 'celebration', 'party', 'midnight']
  },
  {
    id: 'valentines-love',
    name: 'Valentine\'s Day',
    category: 'holidays',
    description: 'Romantic reds, pinks, and lots of hearts',
    colors: ['#FDF2F8', '#FBCFE8', '#F472B6', '#DB2777', '#BE123C'],
    patterns: ['hearts', 'roses', 'polka-dots', 'lace'],
    fonts: ['Great Vibes', 'Parisienne', 'Quicksand'],
    elements: ['hearts', 'roses', 'cupid', 'love-letters', 'candy'],
    preview: '💕🌹💝',
    tags: ['valentines', 'love', 'romance', 'february']
  },
  {
    id: 'easter-spring',
    name: 'Easter Joy',
    category: 'holidays',
    description: 'Pastel eggs, bunnies, and spring flowers',
    colors: ['#FDF4FF', '#F5D0FE', '#A7F3D0', '#FDE68A', '#93C5FD'],
    patterns: ['eggs', 'gingham', 'floral', 'polka-dots'],
    fonts: ['Pacifico', 'Lora', 'Nunito'],
    elements: ['bunny', 'eggs', 'basket', 'chicks', 'flowers', 'cross'],
    preview: '🐰🥚🌸',
    tags: ['easter', 'spring', 'bunny', 'eggs']
  },
  {
    id: 'halloween-spooky',
    name: 'Halloween Spooky',
    category: 'holidays',
    description: 'Spooky fun with orange, black, and purple',
    colors: ['#1F2937', '#F97316', '#7C3AED', '#84CC16', '#FAFAFA'],
    patterns: ['spiderwebs', 'bats', 'stripes', 'polka-dots'],
    fonts: ['Creepster', 'Nosifer', 'Fredoka One'],
    elements: ['pumpkins', 'ghosts', 'bats', 'witches', 'spiders', 'candy'],
    preview: '🎃👻🦇',
    tags: ['halloween', 'spooky', 'october', 'costume']
  },
  {
    id: 'thanksgiving-gratitude',
    name: 'Thanksgiving',
    category: 'holidays',
    description: 'Grateful hearts, autumn colors, and family',
    colors: ['#FEF3C7', '#F59E0B', '#92400E', '#7C2D12', '#365314'],
    patterns: ['leaves', 'plaid', 'stripes', 'wood-grain'],
    fonts: ['Playfair Display', 'Amatic SC', 'Lora'],
    elements: ['turkey', 'pumpkin', 'cornucopia', 'leaves', 'pie'],
    preview: '🦃🍂🥧',
    tags: ['thanksgiving', 'gratitude', 'family', 'november']
  },
  {
    id: 'independence-day',
    name: '4th of July',
    category: 'holidays',
    description: 'Patriotic red, white, and blue celebration',
    colors: ['#DC2626', '#FAFAFA', '#1E40AF', '#FCD34D', '#F8FAFC'],
    patterns: ['stars', 'stripes', 'fireworks', 'flags'],
    fonts: ['Oswald', 'Bebas Neue', 'Lato'],
    elements: ['flag', 'fireworks', 'stars', 'eagle', 'liberty'],
    preview: '🇺🇸🎆⭐',
    tags: ['july-4th', 'patriotic', 'america', 'fireworks']
  },
  {
    id: 'st-patricks',
    name: 'St. Patrick\'s Day',
    category: 'holidays',
    description: 'Lucky greens, gold, and Irish charm',
    colors: ['#166534', '#22C55E', '#86EFAC', '#FCD34D', '#FAFAFA'],
    patterns: ['shamrocks', 'plaid', 'celtic', 'polka-dots'],
    fonts: ['Celtic', 'Spectral', 'Merriweather'],
    elements: ['shamrock', 'leprechaun', 'pot-of-gold', 'rainbow', 'beer'],
    preview: '☘️🌈💰',
    tags: ['st-patricks', 'irish', 'lucky', 'green']
  },

  // LIFE EVENTS
  {
    id: 'baby-boy',
    name: 'Baby Boy',
    category: 'milestones',
    description: 'Sweet blues, animals, and baby things',
    colors: ['#DBEAFE', '#93C5FD', '#3B82F6', '#F8FAFC', '#FDE68A'],
    patterns: ['stripes', 'polka-dots', 'chevron', 'stars'],
    fonts: ['Quicksand', 'Nunito', 'Pacifico'],
    elements: ['bottle', 'rattle', 'stork', 'teddy', 'blocks', 'footprints'],
    preview: '👶💙🍼',
    tags: ['baby', 'boy', 'newborn', 'birth']
  },
  {
    id: 'baby-girl',
    name: 'Baby Girl',
    category: 'milestones',
    description: 'Precious pinks, florals, and baby sweetness',
    colors: ['#FDF2F8', '#FBCFE8', '#F472B6', '#F8FAFC', '#FDE68A'],
    patterns: ['floral', 'polka-dots', 'stripes', 'hearts'],
    fonts: ['Dancing Script', 'Quicksand', 'Lora'],
    elements: ['bottle', 'bow', 'stork', 'teddy', 'blocks', 'footprints'],
    preview: '👶💗🎀',
    tags: ['baby', 'girl', 'newborn', 'birth']
  },
  {
    id: 'wedding-elegant',
    name: 'Elegant Wedding',
    category: 'milestones',
    description: 'Timeless elegance in white, gold, and blush',
    colors: ['#FAFAFA', '#FDF2F8', '#FCD34D', '#D4AF37', '#1F2937'],
    patterns: ['lace', 'damask', 'floral', 'geometric'],
    fonts: ['Great Vibes', 'Playfair Display', 'Cormorant Garamond'],
    elements: ['rings', 'flowers', 'cake', 'champagne', 'dress', 'hearts'],
    preview: '💒💍🥂',
    tags: ['wedding', 'marriage', 'elegant', 'love']
  },
  {
    id: 'wedding-rustic',
    name: 'Rustic Wedding',
    category: 'milestones',
    description: 'Country charm with burlap, wood, and wildflowers',
    colors: ['#FEF3C7', '#92400E', '#365314', '#F8FAFC', '#D4A574'],
    patterns: ['burlap', 'wood-grain', 'lace', 'floral'],
    fonts: ['Amatic SC', 'Josefin Sans', 'Sacramento'],
    elements: ['mason-jar', 'wildflowers', 'barn', 'wood', 'lantern'],
    preview: '🌾💐🪵',
    tags: ['wedding', 'rustic', 'country', 'barn']
  },
  {
    id: 'graduation',
    name: 'Graduation Day',
    category: 'milestones',
    description: 'Celebrate achievements in classic colors',
    colors: ['#1F2937', '#FCD34D', '#DC2626', '#1E40AF', '#FAFAFA'],
    patterns: ['confetti', 'geometric', 'stars'],
    fonts: ['Cinzel', 'Oswald', 'Lato'],
    elements: ['cap', 'diploma', 'tassel', 'books', 'stars', 'balloons'],
    preview: '🎓📜🌟',
    tags: ['graduation', 'school', 'achievement', 'celebration']
  },
  {
    id: 'birthday-fun',
    name: 'Birthday Party',
    category: 'milestones',
    description: 'Colorful celebration with cake and balloons',
    colors: ['#F472B6', '#8B5CF6', '#06B6D4', '#FCD34D', '#F97316'],
    patterns: ['confetti', 'stripes', 'polka-dots', 'stars'],
    fonts: ['Fredoka One', 'Bubblegum Sans', 'Quicksand'],
    elements: ['cake', 'balloons', 'presents', 'candles', 'confetti', 'banner'],
    preview: '🎂🎈🎁',
    tags: ['birthday', 'party', 'celebration', 'cake']
  },
  {
    id: 'travel-adventure',
    name: 'Travel Adventure',
    category: 'milestones',
    description: 'Explore the world with maps and memories',
    colors: ['#0EA5E9', '#10B981', '#F59E0B', '#F8FAFC', '#1F2937'],
    patterns: ['maps', 'stripes', 'geometric', 'stamps'],
    fonts: ['Abril Fatface', 'Oswald', 'Open Sans'],
    elements: ['airplane', 'compass', 'camera', 'suitcase', 'globe', 'stamps'],
    preview: '✈️🗺️📸',
    tags: ['travel', 'vacation', 'adventure', 'explore']
  },
  {
    id: 'back-to-school',
    name: 'Back to School',
    category: 'milestones',
    description: 'Notebooks, apples, and new beginnings',
    colors: ['#DC2626', '#FCD34D', '#22C55E', '#3B82F6', '#1F2937'],
    patterns: ['notebook', 'chalkboard', 'polka-dots', 'stripes'],
    fonts: ['Patrick Hand', 'Fredoka One', 'Nunito'],
    elements: ['apple', 'pencil', 'bus', 'books', 'backpack', 'ruler'],
    preview: '🍎✏️📚',
    tags: ['school', 'education', 'learning', 'september']
  },
];

// Category definitions
const CATEGORIES = [
  { id: 'all', name: 'All Themes', icon: Sparkles },
  { id: 'seasons', name: 'Seasons', icon: Sun },
  { id: 'holidays', name: 'Holidays', icon: Gift },
  { id: 'milestones', name: 'Life Events', icon: Star },
];

export default function SeasonalThemesBrowser({ onSelectTheme, onApplyTheme }: SeasonalThemesBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter themes
  const filteredThemes = useMemo(() => {
    return THEME_PACKS.filter(theme => {
      const matchesSearch = searchQuery === '' || 
        theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        theme.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || theme.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Handle theme selection
  const handleThemeSelect = (theme: ThemePack) => {
    onSelectTheme?.(theme);
    onApplyTheme?.(theme);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-amber-50 to-rose-50">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-gradient-to-br from-amber-500 to-rose-500 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Theme Packs</h3>
            <p className="text-xs text-gray-500">{filteredThemes.length} seasonal & holiday themes</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search themes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="p-2 border-b overflow-x-auto">
        <div className="flex gap-1">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-3 h-3" />
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Themes Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 gap-4">
          {filteredThemes.map(theme => (
            <button
              key={theme.id}
              onClick={() => handleThemeSelect(theme)}
              className="group bg-white rounded-xl border hover:border-amber-300 hover:shadow-lg transition-all overflow-hidden text-left"
            >
              {/* Color Strip */}
              <div className="h-3 flex">
                {theme.colors.map((color, i) => (
                  <div key={i} className="flex-1" style={{ backgroundColor: color }} />
                ))}
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{theme.name}</h4>
                    <p className="text-xs text-gray-500">{theme.description}</p>
                  </div>
                  <span className="text-2xl">{theme.preview}</span>
                </div>

                {/* Theme Details */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {theme.elements.slice(0, 5).map((el, i) => (
                    <span key={i} className="px-2 py-0.5 bg-gray-100 rounded text-[10px] text-gray-600 capitalize">
                      {el}
                    </span>
                  ))}
                  {theme.elements.length > 5 && (
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] text-gray-600">
                      +{theme.elements.length - 5} more
                    </span>
                  )}
                </div>

                {/* Apply button - appears on hover */}
                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-medium rounded-full">
                    Apply Theme
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {filteredThemes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No themes found</p>
          </div>
        )}
      </div>
    </div>
  );
}

// components/editor/WashiTapeBrowser.tsx
// Digital Washi Tape Designs Browser
// Timestamp: Tuesday, December 24, 2025 – 4:20 PM Eastern Time
// CR AudioViz AI - "Your Story. Our Design"

'use client';

import React, { useState, useMemo } from 'react';
import { Search, Ribbon } from 'lucide-react';

interface WashiTape {
  id: string;
  name: string;
  category: string;
  pattern: string;
  colors: string[];
  opacity: number;
  tags: string[];
}

interface WashiTapeBrowserProps {
  onSelectTape?: (tape: WashiTape) => void;
  onAddToCanvas?: (pattern: string, name: string) => void;
}

// Washi tape designs using CSS patterns
const WASHI_TAPES: WashiTape[] = [
  // SOLID COLORS
  { id: 'solid-red', name: 'Cherry Red', category: 'solid', pattern: '#DC2626', colors: ['#DC2626'], opacity: 0.85, tags: ['red', 'solid'] },
  { id: 'solid-pink', name: 'Bubblegum Pink', category: 'solid', pattern: '#EC4899', colors: ['#EC4899'], opacity: 0.85, tags: ['pink', 'solid'] },
  { id: 'solid-purple', name: 'Grape Purple', category: 'solid', pattern: '#8B5CF6', colors: ['#8B5CF6'], opacity: 0.85, tags: ['purple', 'solid'] },
  { id: 'solid-blue', name: 'Ocean Blue', category: 'solid', pattern: '#3B82F6', colors: ['#3B82F6'], opacity: 0.85, tags: ['blue', 'solid'] },
  { id: 'solid-teal', name: 'Mint Teal', category: 'solid', pattern: '#14B8A6', colors: ['#14B8A6'], opacity: 0.85, tags: ['teal', 'solid'] },
  { id: 'solid-green', name: 'Forest Green', category: 'solid', pattern: '#22C55E', colors: ['#22C55E'], opacity: 0.85, tags: ['green', 'solid'] },
  { id: 'solid-yellow', name: 'Sunny Yellow', category: 'solid', pattern: '#FBBF24', colors: ['#FBBF24'], opacity: 0.85, tags: ['yellow', 'solid'] },
  { id: 'solid-orange', name: 'Tangerine', category: 'solid', pattern: '#F97316', colors: ['#F97316'], opacity: 0.85, tags: ['orange', 'solid'] },
  { id: 'solid-gold', name: 'Gold Foil', category: 'solid', pattern: 'linear-gradient(135deg, #D4AF37, #F5E7A3, #D4AF37)', colors: ['#D4AF37'], opacity: 0.9, tags: ['gold', 'foil', 'metallic'] },
  { id: 'solid-silver', name: 'Silver Foil', category: 'solid', pattern: 'linear-gradient(135deg, #C0C0C0, #E8E8E8, #C0C0C0)', colors: ['#C0C0C0'], opacity: 0.9, tags: ['silver', 'foil', 'metallic'] },

  // STRIPES
  { id: 'stripe-red-white', name: 'Candy Cane', category: 'stripes', pattern: 'repeating-linear-gradient(45deg, #DC2626 0px, #DC2626 10px, #FFFFFF 10px, #FFFFFF 20px)', colors: ['#DC2626', '#FFFFFF'], opacity: 0.9, tags: ['stripes', 'red', 'christmas'] },
  { id: 'stripe-pink-white', name: 'Pink Stripe', category: 'stripes', pattern: 'repeating-linear-gradient(45deg, #F9A8D4 0px, #F9A8D4 10px, #FFFFFF 10px, #FFFFFF 20px)', colors: ['#F9A8D4', '#FFFFFF'], opacity: 0.9, tags: ['stripes', 'pink'] },
  { id: 'stripe-blue-white', name: 'Sailor Stripe', category: 'stripes', pattern: 'repeating-linear-gradient(0deg, #3B82F6 0px, #3B82F6 5px, #FFFFFF 5px, #FFFFFF 10px)', colors: ['#3B82F6', '#FFFFFF'], opacity: 0.9, tags: ['stripes', 'blue', 'nautical'] },
  { id: 'stripe-rainbow', name: 'Rainbow Stripe', category: 'stripes', pattern: 'repeating-linear-gradient(90deg, #FF0000 0px, #FF7F00 14px, #FFFF00 28px, #00FF00 42px, #0000FF 56px, #8B00FF 70px)', colors: ['#FF0000', '#FFFF00', '#0000FF'], opacity: 0.9, tags: ['rainbow', 'colorful'] },
  { id: 'stripe-pastel', name: 'Pastel Stripe', category: 'stripes', pattern: 'repeating-linear-gradient(45deg, #FBCFE8 0px, #FBCFE8 8px, #BFDBFE 8px, #BFDBFE 16px, #BBF7D0 16px, #BBF7D0 24px)', colors: ['#FBCFE8', '#BFDBFE', '#BBF7D0'], opacity: 0.9, tags: ['pastel', 'stripes'] },
  { id: 'stripe-black-white', name: 'Zebra', category: 'stripes', pattern: 'repeating-linear-gradient(45deg, #1F2937 0px, #1F2937 8px, #FFFFFF 8px, #FFFFFF 16px)', colors: ['#1F2937', '#FFFFFF'], opacity: 0.9, tags: ['black', 'white', 'zebra'] },

  // POLKA DOTS
  { id: 'dots-pink', name: 'Pink Polka', category: 'dots', pattern: 'radial-gradient(circle, #EC4899 20%, transparent 20%) 0 0, radial-gradient(circle, #EC4899 20%, transparent 20%) 10px 10px, #FDF2F8', colors: ['#EC4899', '#FDF2F8'], opacity: 0.9, tags: ['dots', 'pink', 'polka'] },
  { id: 'dots-blue', name: 'Blue Polka', category: 'dots', pattern: 'radial-gradient(circle, #3B82F6 20%, transparent 20%) 0 0, radial-gradient(circle, #3B82F6 20%, transparent 20%) 10px 10px, #EFF6FF', colors: ['#3B82F6', '#EFF6FF'], opacity: 0.9, tags: ['dots', 'blue', 'polka'] },
  { id: 'dots-gold', name: 'Gold Dots', category: 'dots', pattern: 'radial-gradient(circle, #D4AF37 15%, transparent 15%) 0 0, radial-gradient(circle, #D4AF37 15%, transparent 15%) 8px 8px, #FFFBEB', colors: ['#D4AF37', '#FFFBEB'], opacity: 0.9, tags: ['dots', 'gold', 'elegant'] },
  { id: 'dots-confetti', name: 'Confetti', category: 'dots', pattern: 'radial-gradient(circle, #EC4899 8%, transparent 8%) 0 0, radial-gradient(circle, #3B82F6 8%, transparent 8%) 15px 5px, radial-gradient(circle, #22C55E 8%, transparent 8%) 5px 15px, radial-gradient(circle, #FBBF24 8%, transparent 8%) 20px 20px, #FAFAFA', colors: ['#EC4899', '#3B82F6', '#22C55E', '#FBBF24'], opacity: 0.9, tags: ['confetti', 'party', 'colorful'] },
  { id: 'dots-white-red', name: 'White on Red', category: 'dots', pattern: 'radial-gradient(circle, #FFFFFF 20%, transparent 20%) 0 0, radial-gradient(circle, #FFFFFF 20%, transparent 20%) 10px 10px, #DC2626', colors: ['#FFFFFF', '#DC2626'], opacity: 0.9, tags: ['dots', 'red', 'retro'] },

  // HEARTS
  { id: 'hearts-pink', name: 'Pink Hearts', category: 'hearts', pattern: 'linear-gradient(135deg, #FBCFE8 25%, transparent 25%), linear-gradient(225deg, #FBCFE8 25%, transparent 25%), linear-gradient(45deg, #FBCFE8 25%, transparent 25%), linear-gradient(315deg, #FBCFE8 25%, #FDF2F8 25%)', colors: ['#FBCFE8', '#FDF2F8'], opacity: 0.9, tags: ['hearts', 'pink', 'love'] },
  { id: 'hearts-red', name: 'Red Hearts', category: 'hearts', pattern: '#FEE2E2', colors: ['#DC2626', '#FEE2E2'], opacity: 0.9, tags: ['hearts', 'red', 'valentine'] },

  // FLORALS
  { id: 'floral-spring', name: 'Spring Flowers', category: 'floral', pattern: 'radial-gradient(circle at 25% 25%, #F9A8D4 3px, transparent 3px), radial-gradient(circle at 75% 75%, #A7F3D0 3px, transparent 3px), radial-gradient(circle at 50% 50%, #FDE68A 2px, transparent 2px), #FEFCE8', colors: ['#F9A8D4', '#A7F3D0', '#FDE68A'], opacity: 0.9, tags: ['floral', 'spring', 'flowers'] },
  { id: 'floral-roses', name: 'Rose Garden', category: 'floral', pattern: 'radial-gradient(circle at 20% 30%, #FBCFE8 4px, transparent 4px), radial-gradient(circle at 60% 70%, #F9A8D4 5px, transparent 5px), radial-gradient(circle at 80% 20%, #F472B6 3px, transparent 3px), #FDF2F8', colors: ['#FBCFE8', '#F9A8D4', '#F472B6'], opacity: 0.9, tags: ['roses', 'pink', 'romantic'] },

  // GINGHAM & CHECKS
  { id: 'gingham-pink', name: 'Pink Gingham', category: 'gingham', pattern: 'repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(236,72,153,0.1) 10px, rgba(236,72,153,0.1) 20px), repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(236,72,153,0.1) 10px, rgba(236,72,153,0.1) 20px), #FDF2F8', colors: ['#EC4899', '#FDF2F8'], opacity: 0.9, tags: ['gingham', 'pink', 'picnic'] },
  { id: 'gingham-blue', name: 'Blue Gingham', category: 'gingham', pattern: 'repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(59,130,246,0.1) 10px, rgba(59,130,246,0.1) 20px), repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(59,130,246,0.1) 10px, rgba(59,130,246,0.1) 20px), #EFF6FF', colors: ['#3B82F6', '#EFF6FF'], opacity: 0.9, tags: ['gingham', 'blue', 'country'] },
  { id: 'gingham-red', name: 'Red Gingham', category: 'gingham', pattern: 'repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(220,38,38,0.15) 10px, rgba(220,38,38,0.15) 20px), repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(220,38,38,0.15) 10px, rgba(220,38,38,0.15) 20px), #FEF2F2', colors: ['#DC2626', '#FEF2F2'], opacity: 0.9, tags: ['gingham', 'red', 'picnic'] },

  // GEOMETRIC
  { id: 'geo-triangles', name: 'Triangles', category: 'geometric', pattern: 'linear-gradient(135deg, #8B5CF6 25%, transparent 25%), linear-gradient(225deg, #8B5CF6 25%, transparent 25%), linear-gradient(45deg, #8B5CF6 25%, transparent 25%), linear-gradient(315deg, #8B5CF6 25%, #EDE9FE 25%)', colors: ['#8B5CF6', '#EDE9FE'], opacity: 0.9, tags: ['triangles', 'geometric', 'purple'] },
  { id: 'geo-chevron', name: 'Chevron', category: 'geometric', pattern: 'linear-gradient(135deg, #F97316 25%, transparent 25%) -10px 0, linear-gradient(225deg, #F97316 25%, transparent 25%) -10px 0, linear-gradient(315deg, #F97316 25%, transparent 25%), linear-gradient(45deg, #F97316 25%, #FFF7ED 25%)', colors: ['#F97316', '#FFF7ED'], opacity: 0.9, tags: ['chevron', 'zigzag', 'orange'] },
  { id: 'geo-diamonds', name: 'Diamonds', category: 'geometric', pattern: 'linear-gradient(45deg, #14B8A6 25%, transparent 25%), linear-gradient(-45deg, #14B8A6 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #14B8A6 75%), linear-gradient(-45deg, transparent 75%, #14B8A6 75%), #F0FDFA', colors: ['#14B8A6', '#F0FDFA'], opacity: 0.9, tags: ['diamonds', 'geometric', 'teal'] },

  // SEASONAL
  { id: 'season-christmas', name: 'Christmas', category: 'seasonal', pattern: 'repeating-linear-gradient(45deg, #DC2626 0px, #DC2626 15px, #166534 15px, #166534 30px)', colors: ['#DC2626', '#166534'], opacity: 0.9, tags: ['christmas', 'holiday', 'red', 'green'] },
  { id: 'season-halloween', name: 'Halloween', category: 'seasonal', pattern: 'repeating-linear-gradient(45deg, #F97316 0px, #F97316 15px, #1F2937 15px, #1F2937 30px)', colors: ['#F97316', '#1F2937'], opacity: 0.9, tags: ['halloween', 'orange', 'black'] },
  { id: 'season-easter', name: 'Easter Pastel', category: 'seasonal', pattern: 'repeating-linear-gradient(90deg, #FBCFE8 0px, #FBCFE8 10px, #A7F3D0 10px, #A7F3D0 20px, #FDE68A 20px, #FDE68A 30px, #BFDBFE 30px, #BFDBFE 40px)', colors: ['#FBCFE8', '#A7F3D0', '#FDE68A', '#BFDBFE'], opacity: 0.9, tags: ['easter', 'pastel', 'spring'] },
  { id: 'season-autumn', name: 'Autumn Leaves', category: 'seasonal', pattern: 'repeating-linear-gradient(90deg, #F97316 0px, #F97316 12px, #DC2626 12px, #DC2626 24px, #92400E 24px, #92400E 36px)', colors: ['#F97316', '#DC2626', '#92400E'], opacity: 0.9, tags: ['autumn', 'fall', 'leaves'] },
  { id: 'season-winter', name: 'Winter Snow', category: 'seasonal', pattern: 'radial-gradient(circle, #FFFFFF 2px, transparent 2px) 0 0, radial-gradient(circle, #FFFFFF 1px, transparent 1px) 10px 10px, #7DD3FC', colors: ['#FFFFFF', '#7DD3FC'], opacity: 0.9, tags: ['winter', 'snow', 'blue'] },

  // KRAFT & NATURAL
  { id: 'kraft-plain', name: 'Kraft Paper', category: 'kraft', pattern: '#D4A574', colors: ['#D4A574'], opacity: 0.85, tags: ['kraft', 'brown', 'natural'] },
  { id: 'kraft-dots', name: 'Kraft Dots', category: 'kraft', pattern: 'radial-gradient(circle, #FFFFFF 15%, transparent 15%) 0 0, radial-gradient(circle, #FFFFFF 15%, transparent 15%) 8px 8px, #D4A574', colors: ['#FFFFFF', '#D4A574'], opacity: 0.9, tags: ['kraft', 'dots', 'natural'] },

  // GLITTER & SHIMMER
  { id: 'glitter-pink', name: 'Pink Glitter', category: 'glitter', pattern: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.8) 1px, transparent 1px), radial-gradient(circle at 60% 70%, rgba(255,255,255,0.6) 1px, transparent 1px), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.7) 1px, transparent 1px), radial-gradient(circle at 40% 90%, rgba(255,255,255,0.5) 1px, transparent 1px), #EC4899', colors: ['#EC4899'], opacity: 0.95, tags: ['glitter', 'sparkle', 'pink'] },
  { id: 'glitter-gold', name: 'Gold Glitter', category: 'glitter', pattern: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.8) 1px, transparent 1px), radial-gradient(circle at 60% 70%, rgba(255,255,255,0.6) 1px, transparent 1px), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(135deg, #D4AF37, #F5E7A3, #D4AF37)', colors: ['#D4AF37'], opacity: 0.95, tags: ['glitter', 'sparkle', 'gold'] },
];

// Categories
const CATEGORIES = [
  { id: 'all', name: 'All Tapes' },
  { id: 'solid', name: 'Solid' },
  { id: 'stripes', name: 'Stripes' },
  { id: 'dots', name: 'Polka Dots' },
  { id: 'gingham', name: 'Gingham' },
  { id: 'geometric', name: 'Geometric' },
  { id: 'floral', name: 'Floral' },
  { id: 'seasonal', name: 'Seasonal' },
  { id: 'kraft', name: 'Kraft' },
  { id: 'glitter', name: 'Glitter' },
];

export default function WashiTapeBrowser({ onSelectTape, onAddToCanvas }: WashiTapeBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter tapes
  const filteredTapes = useMemo(() => {
    return WASHI_TAPES.filter(tape => {
      const matchesSearch = searchQuery === '' || 
        tape.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tape.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || tape.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Handle selection
  const handleSelect = (tape: WashiTape) => {
    onSelectTape?.(tape);
    onAddToCanvas?.(tape.pattern, tape.name);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-pink-50 to-rose-50">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg">
            <Ribbon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Washi Tape</h3>
            <p className="text-xs text-gray-500">{filteredTapes.length} tape designs</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tapes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="p-2 border-b overflow-x-auto">
        <div className="flex gap-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tapes Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {filteredTapes.map(tape => (
            <button
              key={tape.id}
              onClick={() => handleSelect(tape)}
              className="w-full group"
            >
              {/* Tape Preview */}
              <div 
                className="h-8 rounded-sm mb-1 border border-gray-200 group-hover:scale-[1.02] transition-transform"
                style={{ 
                  background: tape.pattern,
                  backgroundSize: '20px 20px',
                  opacity: tape.opacity
                }}
              />
              
              {/* Tape Name */}
              <p className="text-xs text-gray-600 text-left">{tape.name}</p>
            </button>
          ))}
        </div>

        {filteredTapes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Ribbon className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No tapes found</p>
          </div>
        )}
      </div>
    </div>
  );
}

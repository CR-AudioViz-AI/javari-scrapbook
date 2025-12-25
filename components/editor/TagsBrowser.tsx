// components/editor/TagsBrowser.tsx
// Decorative Tags & Labels Browser
// Timestamp: Tuesday, December 24, 2025 – 4:25 PM Eastern Time
// CR AudioViz AI - "Your Story. Our Design"

'use client';

import React, { useState, useMemo } from 'react';
import { Search, Tag } from 'lucide-react';

interface TagDesign {
  id: string;
  name: string;
  category: string;
  shape: 'rectangle' | 'rounded' | 'ticket' | 'flag' | 'circle' | 'heart' | 'star';
  backgroundColor: string;
  textColor: string;
  borderColor?: string;
  borderWidth?: string;
  borderStyle?: string;
  shadow?: string;
  hasHole?: boolean;
  tags: string[];
}

interface TagsBrowserProps {
  onSelectTag?: (tag: TagDesign) => void;
  onAddToCanvas?: (styles: React.CSSProperties, shape: string) => void;
}

// Decorative tag designs
const TAG_DESIGNS: TagDesign[] = [
  // KRAFT TAGS
  { id: 'kraft-simple', name: 'Kraft Simple', category: 'kraft', shape: 'rectangle', backgroundColor: '#D4A574', textColor: '#1F2937', hasHole: true, tags: ['kraft', 'natural', 'simple'] },
  { id: 'kraft-rounded', name: 'Kraft Rounded', category: 'kraft', shape: 'rounded', backgroundColor: '#D4A574', textColor: '#1F2937', hasHole: true, tags: ['kraft', 'rounded'] },
  { id: 'kraft-ticket', name: 'Kraft Ticket', category: 'kraft', shape: 'ticket', backgroundColor: '#D4A574', textColor: '#1F2937', tags: ['kraft', 'ticket'] },
  { id: 'kraft-stamp', name: 'Kraft Stamp', category: 'kraft', shape: 'rectangle', backgroundColor: '#D4A574', textColor: '#DC2626', borderColor: '#DC2626', borderWidth: '2px', borderStyle: 'dashed', hasHole: true, tags: ['kraft', 'stamp', 'vintage'] },

  // WHITE TAGS
  { id: 'white-simple', name: 'White Classic', category: 'white', shape: 'rectangle', backgroundColor: '#FFFFFF', textColor: '#1F2937', borderColor: '#E5E7EB', borderWidth: '1px', hasHole: true, tags: ['white', 'clean', 'simple'] },
  { id: 'white-rounded', name: 'White Rounded', category: 'white', shape: 'rounded', backgroundColor: '#FFFFFF', textColor: '#1F2937', shadow: '0 2px 4px rgba(0,0,0,0.1)', hasHole: true, tags: ['white', 'rounded', 'soft'] },
  { id: 'white-elegant', name: 'White Elegant', category: 'white', shape: 'rectangle', backgroundColor: '#FFFFFF', textColor: '#1F2937', borderColor: '#D4AF37', borderWidth: '2px', hasHole: true, tags: ['white', 'gold', 'elegant'] },
  { id: 'white-shadow', name: 'White Shadow', category: 'white', shape: 'rounded', backgroundColor: '#FFFFFF', textColor: '#374151', shadow: '0 4px 12px rgba(0,0,0,0.15)', hasHole: true, tags: ['white', 'shadow', 'modern'] },

  // COLORFUL TAGS
  { id: 'color-red', name: 'Cherry Red', category: 'colorful', shape: 'rounded', backgroundColor: '#DC2626', textColor: '#FFFFFF', hasHole: true, tags: ['red', 'bold'] },
  { id: 'color-pink', name: 'Bubblegum Pink', category: 'colorful', shape: 'rounded', backgroundColor: '#EC4899', textColor: '#FFFFFF', hasHole: true, tags: ['pink', 'cute'] },
  { id: 'color-purple', name: 'Royal Purple', category: 'colorful', shape: 'rounded', backgroundColor: '#8B5CF6', textColor: '#FFFFFF', hasHole: true, tags: ['purple', 'royal'] },
  { id: 'color-blue', name: 'Ocean Blue', category: 'colorful', shape: 'rounded', backgroundColor: '#3B82F6', textColor: '#FFFFFF', hasHole: true, tags: ['blue', 'calm'] },
  { id: 'color-teal', name: 'Mint Teal', category: 'colorful', shape: 'rounded', backgroundColor: '#14B8A6', textColor: '#FFFFFF', hasHole: true, tags: ['teal', 'fresh'] },
  { id: 'color-green', name: 'Forest Green', category: 'colorful', shape: 'rounded', backgroundColor: '#22C55E', textColor: '#FFFFFF', hasHole: true, tags: ['green', 'nature'] },
  { id: 'color-yellow', name: 'Sunny Yellow', category: 'colorful', shape: 'rounded', backgroundColor: '#FBBF24', textColor: '#1F2937', hasHole: true, tags: ['yellow', 'sunny'] },
  { id: 'color-orange', name: 'Tangerine', category: 'colorful', shape: 'rounded', backgroundColor: '#F97316', textColor: '#FFFFFF', hasHole: true, tags: ['orange', 'warm'] },

  // PASTEL TAGS
  { id: 'pastel-pink', name: 'Pastel Pink', category: 'pastel', shape: 'rounded', backgroundColor: '#FBCFE8', textColor: '#9D174D', hasHole: true, tags: ['pastel', 'pink', 'soft'] },
  { id: 'pastel-blue', name: 'Pastel Blue', category: 'pastel', shape: 'rounded', backgroundColor: '#BFDBFE', textColor: '#1E40AF', hasHole: true, tags: ['pastel', 'blue', 'soft'] },
  { id: 'pastel-green', name: 'Pastel Mint', category: 'pastel', shape: 'rounded', backgroundColor: '#A7F3D0', textColor: '#065F46', hasHole: true, tags: ['pastel', 'green', 'soft'] },
  { id: 'pastel-purple', name: 'Pastel Lavender', category: 'pastel', shape: 'rounded', backgroundColor: '#DDD6FE', textColor: '#5B21B6', hasHole: true, tags: ['pastel', 'purple', 'soft'] },
  { id: 'pastel-yellow', name: 'Pastel Lemon', category: 'pastel', shape: 'rounded', backgroundColor: '#FEF08A', textColor: '#854D0E', hasHole: true, tags: ['pastel', 'yellow', 'soft'] },

  // FLAG TAGS
  { id: 'flag-red', name: 'Red Flag', category: 'flags', shape: 'flag', backgroundColor: '#DC2626', textColor: '#FFFFFF', tags: ['flag', 'red'] },
  { id: 'flag-blue', name: 'Blue Flag', category: 'flags', shape: 'flag', backgroundColor: '#3B82F6', textColor: '#FFFFFF', tags: ['flag', 'blue'] },
  { id: 'flag-gold', name: 'Gold Flag', category: 'flags', shape: 'flag', backgroundColor: '#D4AF37', textColor: '#1F2937', tags: ['flag', 'gold', 'elegant'] },
  { id: 'flag-kraft', name: 'Kraft Flag', category: 'flags', shape: 'flag', backgroundColor: '#D4A574', textColor: '#1F2937', tags: ['flag', 'kraft'] },
  { id: 'flag-black', name: 'Black Flag', category: 'flags', shape: 'flag', backgroundColor: '#1F2937', textColor: '#FFFFFF', tags: ['flag', 'black', 'modern'] },

  // TICKET TAGS
  { id: 'ticket-classic', name: 'Classic Ticket', category: 'tickets', shape: 'ticket', backgroundColor: '#FFFBEB', textColor: '#1F2937', borderColor: '#D4AF37', borderWidth: '2px', tags: ['ticket', 'vintage', 'classic'] },
  { id: 'ticket-admit', name: 'Admit One', category: 'tickets', shape: 'ticket', backgroundColor: '#DC2626', textColor: '#FFFFFF', tags: ['ticket', 'red', 'admit'] },
  { id: 'ticket-movie', name: 'Movie Ticket', category: 'tickets', shape: 'ticket', backgroundColor: '#1F2937', textColor: '#FBBF24', tags: ['ticket', 'movie', 'cinema'] },
  { id: 'ticket-carnival', name: 'Carnival Ticket', category: 'tickets', shape: 'ticket', backgroundColor: '#F97316', textColor: '#1F2937', tags: ['ticket', 'carnival', 'fun'] },

  // CIRCLE TAGS
  { id: 'circle-red', name: 'Red Circle', category: 'circles', shape: 'circle', backgroundColor: '#DC2626', textColor: '#FFFFFF', tags: ['circle', 'red'] },
  { id: 'circle-gold', name: 'Gold Circle', category: 'circles', shape: 'circle', backgroundColor: '#D4AF37', textColor: '#1F2937', tags: ['circle', 'gold', 'medal'] },
  { id: 'circle-black', name: 'Black Circle', category: 'circles', shape: 'circle', backgroundColor: '#1F2937', textColor: '#FFFFFF', tags: ['circle', 'black'] },
  { id: 'circle-white', name: 'White Circle', category: 'circles', shape: 'circle', backgroundColor: '#FFFFFF', textColor: '#1F2937', borderColor: '#E5E7EB', borderWidth: '2px', tags: ['circle', 'white'] },
  { id: 'circle-pastel', name: 'Pastel Circle', category: 'circles', shape: 'circle', backgroundColor: '#F9A8D4', textColor: '#9D174D', tags: ['circle', 'pastel', 'pink'] },

  // SPECIAL SHAPES
  { id: 'heart-red', name: 'Red Heart', category: 'special', shape: 'heart', backgroundColor: '#DC2626', textColor: '#FFFFFF', tags: ['heart', 'red', 'love'] },
  { id: 'heart-pink', name: 'Pink Heart', category: 'special', shape: 'heart', backgroundColor: '#EC4899', textColor: '#FFFFFF', tags: ['heart', 'pink', 'love'] },
  { id: 'star-gold', name: 'Gold Star', category: 'special', shape: 'star', backgroundColor: '#D4AF37', textColor: '#1F2937', tags: ['star', 'gold', 'award'] },
  { id: 'star-blue', name: 'Blue Star', category: 'special', shape: 'star', backgroundColor: '#3B82F6', textColor: '#FFFFFF', tags: ['star', 'blue'] },

  // VINTAGE TAGS
  { id: 'vintage-sepia', name: 'Sepia Vintage', category: 'vintage', shape: 'rectangle', backgroundColor: '#F5E6D3', textColor: '#78350F', borderColor: '#92400E', borderWidth: '1px', hasHole: true, tags: ['vintage', 'sepia', 'antique'] },
  { id: 'vintage-library', name: 'Library Card', category: 'vintage', shape: 'rectangle', backgroundColor: '#FFFBEB', textColor: '#1F2937', borderColor: '#78350F', borderWidth: '2px', hasHole: true, tags: ['vintage', 'library', 'book'] },
  { id: 'vintage-postage', name: 'Postage Stamp', category: 'vintage', shape: 'rectangle', backgroundColor: '#FFFFFF', textColor: '#1F2937', borderColor: '#6B7280', borderWidth: '2px', borderStyle: 'dotted', tags: ['vintage', 'postage', 'stamp'] },

  // MODERN TAGS
  { id: 'modern-gradient-pink', name: 'Pink Gradient', category: 'modern', shape: 'rounded', backgroundColor: 'linear-gradient(135deg, #EC4899, #8B5CF6)', textColor: '#FFFFFF', shadow: '0 4px 12px rgba(236,72,153,0.3)', hasHole: true, tags: ['modern', 'gradient', 'pink'] },
  { id: 'modern-gradient-blue', name: 'Blue Gradient', category: 'modern', shape: 'rounded', backgroundColor: 'linear-gradient(135deg, #3B82F6, #06B6D4)', textColor: '#FFFFFF', shadow: '0 4px 12px rgba(59,130,246,0.3)', hasHole: true, tags: ['modern', 'gradient', 'blue'] },
  { id: 'modern-glass', name: 'Glass Effect', category: 'modern', shape: 'rounded', backgroundColor: 'rgba(255,255,255,0.8)', textColor: '#1F2937', borderColor: 'rgba(255,255,255,0.5)', borderWidth: '1px', shadow: '0 4px 12px rgba(0,0,0,0.1)', hasHole: true, tags: ['modern', 'glass', 'frosted'] },
];

// Categories
const CATEGORIES = [
  { id: 'all', name: 'All Tags' },
  { id: 'kraft', name: 'Kraft' },
  { id: 'white', name: 'White' },
  { id: 'colorful', name: 'Colorful' },
  { id: 'pastel', name: 'Pastel' },
  { id: 'flags', name: 'Flags' },
  { id: 'tickets', name: 'Tickets' },
  { id: 'circles', name: 'Circles' },
  { id: 'special', name: 'Special' },
  { id: 'vintage', name: 'Vintage' },
  { id: 'modern', name: 'Modern' },
];

export default function TagsBrowser({ onSelectTag, onAddToCanvas }: TagsBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter tags
  const filteredTags = useMemo(() => {
    return TAG_DESIGNS.filter(tag => {
      const matchesSearch = searchQuery === '' || 
        tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tag.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || tag.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Get tag styles
  const getTagStyles = (tag: TagDesign): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      background: tag.backgroundColor,
      color: tag.textColor,
      padding: '8px 16px',
      display: 'inline-block',
      position: 'relative',
    };

    if (tag.borderColor) {
      baseStyles.border = `${tag.borderWidth || '1px'} ${tag.borderStyle || 'solid'} ${tag.borderColor}`;
    }

    if (tag.shadow) {
      baseStyles.boxShadow = tag.shadow;
    }

    switch (tag.shape) {
      case 'rounded':
        baseStyles.borderRadius = '8px';
        break;
      case 'circle':
        baseStyles.borderRadius = '50%';
        baseStyles.width = '60px';
        baseStyles.height = '60px';
        baseStyles.display = 'flex';
        baseStyles.alignItems = 'center';
        baseStyles.justifyContent = 'center';
        baseStyles.padding = '8px';
        break;
      case 'flag':
        baseStyles.clipPath = 'polygon(0 0, 100% 0, 85% 50%, 100% 100%, 0 100%)';
        baseStyles.paddingRight = '24px';
        break;
      case 'ticket':
        baseStyles.borderRadius = '4px';
        break;
      default:
        baseStyles.borderRadius = '2px';
    }

    return baseStyles;
  };

  // Handle selection
  const handleSelect = (tag: TagDesign) => {
    onSelectTag?.(tag);
    onAddToCanvas?.(getTagStyles(tag), tag.shape);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg">
            <Tag className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Tags & Labels</h3>
            <p className="text-xs text-gray-500">{filteredTags.length} tag designs</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tags Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {filteredTags.map(tag => (
            <button
              key={tag.id}
              onClick={() => handleSelect(tag)}
              className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all flex flex-col items-center"
            >
              {/* Tag Preview */}
              <div 
                className="mb-2 text-xs font-medium"
                style={getTagStyles(tag)}
              >
                {tag.shape === 'circle' ? '•' : 'Label'}
                {tag.hasHole && (
                  <div 
                    className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gray-100 border border-gray-300"
                    style={{ top: '4px' }}
                  />
                )}
              </div>
              
              {/* Tag Name */}
              <p className="text-xs text-gray-600 text-center">{tag.name}</p>
            </button>
          ))}
        </div>

        {filteredTags.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Tag className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No tags found</p>
          </div>
        )}
      </div>
    </div>
  );
}

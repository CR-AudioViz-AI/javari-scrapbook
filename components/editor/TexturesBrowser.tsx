// components/editor/TexturesBrowser.tsx
// Paper & Surface Textures Browser
// Timestamp: Tuesday, December 24, 2025 – 4:10 PM Eastern Time
// CR AudioViz AI - "Your Story. Our Design"

'use client';

import React, { useState, useMemo } from 'react';
import { Search, Layers } from 'lucide-react';

interface Texture {
  id: string;
  name: string;
  category: string;
  cssBackground: string;
  tags: string[];
}

interface TexturesBrowserProps {
  onSelectTexture?: (texture: Texture) => void;
  onApplyTexture?: (css: string) => void;
}

// CSS-based textures (no external images needed)
const TEXTURES_LIBRARY: Texture[] = [
  // PAPER TEXTURES
  {
    id: 'white-paper',
    name: 'White Paper',
    category: 'paper',
    cssBackground: 'linear-gradient(135deg, #FAFAFA 0%, #F5F5F5 100%)',
    tags: ['white', 'clean', 'simple']
  },
  {
    id: 'cream-paper',
    name: 'Cream Paper',
    category: 'paper',
    cssBackground: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
    tags: ['cream', 'warm', 'vintage']
  },
  {
    id: 'aged-paper',
    name: 'Aged Paper',
    category: 'paper',
    cssBackground: 'linear-gradient(180deg, #F5E6D3 0%, #E8D5C0 50%, #DBC7B0 100%)',
    tags: ['old', 'vintage', 'antique']
  },
  {
    id: 'kraft-paper',
    name: 'Kraft Paper',
    category: 'paper',
    cssBackground: 'linear-gradient(135deg, #D4A574 0%, #C9956B 100%)',
    tags: ['brown', 'craft', 'natural']
  },
  {
    id: 'recycled-paper',
    name: 'Recycled Paper',
    category: 'paper',
    cssBackground: 'linear-gradient(180deg, #E8E4DF 0%, #DDD8D3 100%)',
    tags: ['eco', 'natural', 'gray']
  },
  {
    id: 'parchment',
    name: 'Parchment',
    category: 'paper',
    cssBackground: 'linear-gradient(160deg, #F5E6C8 0%, #EED9B6 50%, #E8CDA4 100%)',
    tags: ['old', 'scroll', 'antique']
  },
  {
    id: 'rice-paper',
    name: 'Rice Paper',
    category: 'paper',
    cssBackground: 'linear-gradient(135deg, #FEFEFE 0%, #F8F8F6 100%)',
    tags: ['delicate', 'asian', 'thin']
  },
  {
    id: 'newsprint',
    name: 'Newsprint',
    category: 'paper',
    cssBackground: 'linear-gradient(180deg, #F5F3EE 0%, #EBE8E3 100%)',
    tags: ['newspaper', 'gray', 'vintage']
  },

  // FABRIC TEXTURES
  {
    id: 'linen',
    name: 'Linen',
    category: 'fabric',
    cssBackground: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px),
      repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px),
      #FAF9F6`,
    tags: ['fabric', 'natural', 'woven']
  },
  {
    id: 'canvas',
    name: 'Canvas',
    category: 'fabric',
    cssBackground: `repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.05) 1px, rgba(0,0,0,0.05) 3px),
      repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(0,0,0,0.05) 1px, rgba(0,0,0,0.05) 3px),
      #F8F6F3`,
    tags: ['fabric', 'art', 'textured']
  },
  {
    id: 'burlap',
    name: 'Burlap',
    category: 'fabric',
    cssBackground: `repeating-linear-gradient(0deg, #D4A574 0px, #D4A574 2px, #C9956B 2px, #C9956B 4px),
      repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)`,
    tags: ['rough', 'rustic', 'country']
  },
  {
    id: 'denim',
    name: 'Denim',
    category: 'fabric',
    cssBackground: `repeating-linear-gradient(45deg, #4B6B8A 0px, #4B6B8A 1px, #5A7A9A 1px, #5A7A9A 2px)`,
    tags: ['blue', 'jeans', 'casual']
  },
  {
    id: 'velvet',
    name: 'Velvet',
    category: 'fabric',
    cssBackground: 'linear-gradient(180deg, #7C3AED 0%, #6D28D9 100%)',
    tags: ['luxury', 'soft', 'purple']
  },
  {
    id: 'silk',
    name: 'Silk',
    category: 'fabric',
    cssBackground: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 50%, #FBCFE8 100%)',
    tags: ['smooth', 'elegant', 'pink']
  },

  // WOOD TEXTURES
  {
    id: 'light-wood',
    name: 'Light Wood',
    category: 'wood',
    cssBackground: `repeating-linear-gradient(90deg, #DEB887 0px, #D2A679 2px, #DEB887 4px, #E8C99B 6px)`,
    tags: ['wood', 'natural', 'light']
  },
  {
    id: 'dark-wood',
    name: 'Dark Wood',
    category: 'wood',
    cssBackground: `repeating-linear-gradient(90deg, #5D4037 0px, #4E342E 2px, #5D4037 4px, #6D4C41 6px)`,
    tags: ['wood', 'dark', 'rich']
  },
  {
    id: 'walnut',
    name: 'Walnut',
    category: 'wood',
    cssBackground: `repeating-linear-gradient(90deg, #5C4033 0px, #4A3328 2px, #5C4033 4px, #6B4D3E 6px)`,
    tags: ['wood', 'brown', 'elegant']
  },
  {
    id: 'pine',
    name: 'Pine',
    category: 'wood',
    cssBackground: `repeating-linear-gradient(90deg, #E8D5A2 0px, #DEC98E 2px, #E8D5A2 4px, #F0DFB4 6px)`,
    tags: ['wood', 'light', 'natural']
  },
  {
    id: 'whitewash-wood',
    name: 'Whitewash Wood',
    category: 'wood',
    cssBackground: `repeating-linear-gradient(90deg, #F5F5F5 0px, #EBEBEB 2px, #F5F5F5 4px, #FAFAFA 6px)`,
    tags: ['wood', 'white', 'beach']
  },

  // PATTERNS
  {
    id: 'polka-dots',
    name: 'Polka Dots',
    category: 'pattern',
    cssBackground: `radial-gradient(circle, #EC4899 10%, transparent 10%),
      radial-gradient(circle, #EC4899 10%, transparent 10%) 15px 15px,
      #FDF2F8`,
    tags: ['dots', 'playful', 'pink']
  },
  {
    id: 'stripes-vertical',
    name: 'Vertical Stripes',
    category: 'pattern',
    cssBackground: `repeating-linear-gradient(90deg, #FFFFFF 0px, #FFFFFF 10px, #F3F4F6 10px, #F3F4F6 20px)`,
    tags: ['stripes', 'classic', 'vertical']
  },
  {
    id: 'stripes-diagonal',
    name: 'Diagonal Stripes',
    category: 'pattern',
    cssBackground: `repeating-linear-gradient(45deg, #FFFFFF 0px, #FFFFFF 10px, #F3F4F6 10px, #F3F4F6 20px)`,
    tags: ['stripes', 'diagonal', 'dynamic']
  },
  {
    id: 'chevron',
    name: 'Chevron',
    category: 'pattern',
    cssBackground: `linear-gradient(135deg, #3B82F6 25%, transparent 25%) -20px 0,
      linear-gradient(225deg, #3B82F6 25%, transparent 25%) -20px 0,
      linear-gradient(315deg, #3B82F6 25%, transparent 25%),
      linear-gradient(45deg, #3B82F6 25%, transparent 25%),
      #DBEAFE`,
    tags: ['zigzag', 'modern', 'blue']
  },
  {
    id: 'gingham',
    name: 'Gingham',
    category: 'pattern',
    cssBackground: `repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(220,38,38,0.1) 20px, rgba(220,38,38,0.1) 40px),
      repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(220,38,38,0.1) 20px, rgba(220,38,38,0.1) 40px),
      #FEF2F2`,
    tags: ['checkered', 'picnic', 'red']
  },
  {
    id: 'plaid',
    name: 'Plaid',
    category: 'pattern',
    cssBackground: `repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(34,197,94,0.2) 30px, rgba(34,197,94,0.2) 60px),
      repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(220,38,38,0.2) 30px, rgba(220,38,38,0.2) 60px),
      #F0FDF4`,
    tags: ['scottish', 'holiday', 'checkered']
  },
  {
    id: 'houndstooth',
    name: 'Houndstooth',
    category: 'pattern',
    cssBackground: `linear-gradient(45deg, #1F2937 25%, transparent 25%, transparent 75%, #1F2937 75%),
      linear-gradient(45deg, #1F2937 25%, transparent 25%, transparent 75%, #1F2937 75%) 10px 10px,
      #FFFFFF`,
    tags: ['classic', 'fashion', 'black']
  },

  // GRADIENT TEXTURES
  {
    id: 'sunset-gradient',
    name: 'Sunset',
    category: 'gradient',
    cssBackground: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 50%, #FFC3A0 100%)',
    tags: ['warm', 'orange', 'pink']
  },
  {
    id: 'ocean-gradient',
    name: 'Ocean',
    category: 'gradient',
    cssBackground: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    tags: ['blue', 'purple', 'calm']
  },
  {
    id: 'mint-gradient',
    name: 'Fresh Mint',
    category: 'gradient',
    cssBackground: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    tags: ['green', 'fresh', 'nature']
  },
  {
    id: 'peach-gradient',
    name: 'Peach',
    category: 'gradient',
    cssBackground: 'linear-gradient(135deg, #FFECD2 0%, #FCB69F 100%)',
    tags: ['warm', 'soft', 'orange']
  },
  {
    id: 'lavender-gradient',
    name: 'Lavender',
    category: 'gradient',
    cssBackground: 'linear-gradient(135deg, #E0C3FC 0%, #8EC5FC 100%)',
    tags: ['purple', 'blue', 'soft']
  },
  {
    id: 'rose-gradient',
    name: 'Rose',
    category: 'gradient',
    cssBackground: 'linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)',
    tags: ['pink', 'teal', 'romantic']
  },

  // SPECIAL EFFECTS
  {
    id: 'noise',
    name: 'Noise',
    category: 'special',
    cssBackground: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"), #F5F5F5`,
    tags: ['grain', 'film', 'vintage']
  },
  {
    id: 'grid-paper',
    name: 'Grid Paper',
    category: 'special',
    cssBackground: `repeating-linear-gradient(0deg, transparent, transparent 19px, #E5E7EB 19px, #E5E7EB 20px),
      repeating-linear-gradient(90deg, transparent, transparent 19px, #E5E7EB 19px, #E5E7EB 20px),
      #FFFFFF`,
    tags: ['grid', 'notebook', 'math']
  },
  {
    id: 'lined-paper',
    name: 'Lined Paper',
    category: 'special',
    cssBackground: `repeating-linear-gradient(0deg, transparent, transparent 27px, #93C5FD 27px, #93C5FD 28px),
      #FFFFFF`,
    tags: ['lines', 'notebook', 'writing']
  },
  {
    id: 'cork-board',
    name: 'Cork Board',
    category: 'special',
    cssBackground: `radial-gradient(circle at 20% 30%, #D4A574 1px, transparent 1px),
      radial-gradient(circle at 60% 70%, #C9956B 1px, transparent 1px),
      radial-gradient(circle at 80% 20%, #BF8A5E 1px, transparent 1px),
      #DEB887`,
    tags: ['cork', 'office', 'bulletin']
  },
  {
    id: 'chalkboard',
    name: 'Chalkboard',
    category: 'special',
    cssBackground: 'linear-gradient(180deg, #1F2937 0%, #374151 100%)',
    tags: ['dark', 'school', 'chalk']
  },
  {
    id: 'watercolor',
    name: 'Watercolor',
    category: 'special',
    cssBackground: `radial-gradient(ellipse at 20% 30%, rgba(236,72,153,0.2) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 60%, rgba(59,130,246,0.2) 0%, transparent 50%),
      radial-gradient(ellipse at 40% 80%, rgba(34,197,94,0.2) 0%, transparent 50%),
      #FFFFFF`,
    tags: ['artistic', 'soft', 'paint']
  },
];

// Categories
const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'paper', name: 'Paper' },
  { id: 'fabric', name: 'Fabric' },
  { id: 'wood', name: 'Wood' },
  { id: 'pattern', name: 'Patterns' },
  { id: 'gradient', name: 'Gradients' },
  { id: 'special', name: 'Special' },
];

export default function TexturesBrowser({ onSelectTexture, onApplyTexture }: TexturesBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter textures
  const filteredTextures = useMemo(() => {
    return TEXTURES_LIBRARY.filter(texture => {
      const matchesSearch = searchQuery === '' || 
        texture.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        texture.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || texture.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Handle selection
  const handleSelect = (texture: Texture) => {
    onSelectTexture?.(texture);
    onApplyTexture?.(texture.cssBackground);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-stone-50 to-neutral-50">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-gradient-to-br from-stone-500 to-neutral-600 rounded-lg">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Textures</h3>
            <p className="text-xs text-gray-500">{filteredTextures.length} textures</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search textures..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-500"
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
                  ? 'bg-stone-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Textures Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {filteredTextures.map(texture => (
            <button
              key={texture.id}
              onClick={() => handleSelect(texture)}
              className="group p-2 rounded-lg hover:bg-gray-50 transition-all"
            >
              {/* Texture Preview */}
              <div 
                className="aspect-square rounded-lg border mb-2"
                style={{ background: texture.cssBackground, backgroundSize: '20px 20px' }}
              />
              
              {/* Texture Name */}
              <p className="text-xs font-medium text-gray-700 text-center truncate">
                {texture.name}
              </p>
            </button>
          ))}
        </div>

        {filteredTextures.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Layers className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No textures found</p>
          </div>
        )}
      </div>
    </div>
  );
}

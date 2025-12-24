'use client';

import React, { useState, useMemo } from 'react';
import { Search, Scissors, RotateCw, FlipHorizontal, Palette } from 'lucide-react';

// Comprehensive washi tape patterns - all CSS-based, no external dependencies
const WASHI_TAPE_COLLECTIONS = {
  'solid-colors': {
    name: 'Solid Colors',
    tapes: [
      { id: 'sc-1', name: 'Rose Pink', colors: ['#f472b6'] },
      { id: 'sc-2', name: 'Sky Blue', colors: ['#60a5fa'] },
      { id: 'sc-3', name: 'Mint Green', colors: ['#34d399'] },
      { id: 'sc-4', name: 'Lavender', colors: ['#a78bfa'] },
      { id: 'sc-5', name: 'Coral', colors: ['#fb7185'] },
      { id: 'sc-6', name: 'Gold', colors: ['#fbbf24'] },
      { id: 'sc-7', name: 'Sage', colors: ['#86efac'] },
      { id: 'sc-8', name: 'Peach', colors: ['#fdba74'] },
    ]
  },
  'stripes': {
    name: 'Stripes',
    tapes: [
      { id: 'st-1', name: 'Candy Stripe', pattern: 'stripe-diagonal', colors: ['#f472b6', '#ffffff'] },
      { id: 'st-2', name: 'Navy Stripe', pattern: 'stripe-diagonal', colors: ['#1e3a5f', '#ffffff'] },
      { id: 'st-3', name: 'Rainbow Stripe', pattern: 'stripe-horizontal', colors: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'] },
      { id: 'st-4', name: 'Mint Stripe', pattern: 'stripe-diagonal', colors: ['#6ee7b7', '#ffffff'] },
      { id: 'st-5', name: 'Black & Gold', pattern: 'stripe-diagonal', colors: ['#1f2937', '#fbbf24'] },
      { id: 'st-6', name: 'Pastel Stripe', pattern: 'stripe-vertical', colors: ['#fecaca', '#bfdbfe', '#d9f99d', '#fbcfe8'] },
    ]
  },
  'polka-dots': {
    name: 'Polka Dots',
    tapes: [
      { id: 'pd-1', name: 'White Dots on Pink', pattern: 'dots', colors: ['#f472b6', '#ffffff'] },
      { id: 'pd-2', name: 'Gold Dots on Black', pattern: 'dots', colors: ['#1f2937', '#fbbf24'] },
      { id: 'pd-3', name: 'Multi Dots', pattern: 'dots-multi', colors: ['#fef3c7', '#ef4444', '#3b82f6', '#22c55e', '#f97316'] },
      { id: 'pd-4', name: 'Confetti Dots', pattern: 'dots-scattered', colors: ['#ffffff', '#f472b6', '#60a5fa', '#34d399', '#a78bfa'] },
      { id: 'pd-5', name: 'Navy Dots', pattern: 'dots', colors: ['#1e3a5f', '#ffffff'] },
      { id: 'pd-6', name: 'Lavender Dots', pattern: 'dots', colors: ['#ddd6fe', '#7c3aed'] },
    ]
  },
  'geometric': {
    name: 'Geometric',
    tapes: [
      { id: 'ge-1', name: 'Chevron Pink', pattern: 'chevron', colors: ['#fce7f3', '#f472b6'] },
      { id: 'ge-2', name: 'Triangles', pattern: 'triangles', colors: ['#e0f2fe', '#0ea5e9', '#0284c7'] },
      { id: 'ge-3', name: 'Diamonds', pattern: 'diamonds', colors: ['#fef3c7', '#f59e0b'] },
      { id: 'ge-4', name: 'Zigzag', pattern: 'zigzag', colors: ['#dcfce7', '#22c55e'] },
      { id: 'ge-5', name: 'Grid', pattern: 'grid', colors: ['#f3f4f6', '#6b7280'] },
      { id: 'ge-6', name: 'Hexagons', pattern: 'hexagons', colors: ['#fdf4ff', '#d946ef'] },
    ]
  },
  'nature': {
    name: 'Nature',
    tapes: [
      { id: 'na-1', name: 'Leaves', pattern: 'leaves', colors: ['#ecfccb', '#65a30d'] },
      { id: 'na-2', name: 'Flowers', pattern: 'flowers', colors: ['#fce7f3', '#ec4899', '#22c55e'] },
      { id: 'na-3', name: 'Stars', pattern: 'stars', colors: ['#1e3a5f', '#fbbf24'] },
      { id: 'na-4', name: 'Hearts', pattern: 'hearts', colors: ['#fff1f2', '#f43f5e'] },
      { id: 'na-5', name: 'Clouds', pattern: 'clouds', colors: ['#e0f2fe', '#ffffff'] },
      { id: 'na-6', name: 'Butterflies', pattern: 'butterflies', colors: ['#faf5ff', '#c084fc', '#f472b6'] },
    ]
  },
  'seasonal': {
    name: 'Seasonal',
    tapes: [
      { id: 'se-1', name: 'Autumn Leaves', pattern: 'autumn', colors: ['#fef3c7', '#f97316', '#dc2626', '#ca8a04'] },
      { id: 'se-2', name: 'Winter Snowflakes', pattern: 'snowflakes', colors: ['#e0f2fe', '#ffffff', '#93c5fd'] },
      { id: 'se-3', name: 'Spring Blossoms', pattern: 'blossoms', colors: ['#fdf2f8', '#f9a8d4', '#86efac'] },
      { id: 'se-4', name: 'Summer Beach', pattern: 'beach', colors: ['#fef9c3', '#38bdf8', '#fbbf24'] },
      { id: 'se-5', name: 'Halloween', pattern: 'halloween', colors: ['#1f2937', '#f97316', '#a855f7'] },
      { id: 'se-6', name: 'Christmas', pattern: 'christmas', colors: ['#166534', '#dc2626', '#fbbf24'] },
    ]
  },
  'vintage': {
    name: 'Vintage',
    tapes: [
      { id: 'vi-1', name: 'Lace Edge', pattern: 'lace', colors: ['#fffbeb', '#d4d4d4'] },
      { id: 'vi-2', name: 'Old Paper', pattern: 'paper', colors: ['#fef3c7', '#d97706'] },
      { id: 'vi-3', name: 'Typewriter', pattern: 'typewriter', colors: ['#f5f5f4', '#292524'] },
      { id: 'vi-4', name: 'Sepia Floral', pattern: 'sepia-floral', colors: ['#fef3c7', '#92400e', '#78350f'] },
      { id: 'vi-5', name: 'Postage Stamp', pattern: 'postage', colors: ['#faf5ff', '#7c3aed', '#dc2626'] },
      { id: 'vi-6', name: 'Ticket Stub', pattern: 'ticket', colors: ['#fef3c7', '#dc2626'] },
    ]
  },
  'glitter': {
    name: 'Glitter & Metallic',
    tapes: [
      { id: 'gl-1', name: 'Gold Glitter', pattern: 'glitter', colors: ['#fbbf24', '#f59e0b', '#d97706'] },
      { id: 'gl-2', name: 'Silver Sparkle', pattern: 'glitter', colors: ['#e5e7eb', '#9ca3af', '#6b7280'] },
      { id: 'gl-3', name: 'Rose Gold', pattern: 'glitter', colors: ['#fda4af', '#f472b6', '#db2777'] },
      { id: 'gl-4', name: 'Holographic', pattern: 'holographic', colors: ['#c084fc', '#60a5fa', '#34d399', '#f472b6'] },
      { id: 'gl-5', name: 'Copper Shimmer', pattern: 'glitter', colors: ['#fdba74', '#ea580c', '#c2410c'] },
      { id: 'gl-6', name: 'Rainbow Glitter', pattern: 'glitter-rainbow', colors: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'] },
    ]
  },
};

// Generate SVG patterns for washi tape
function generateTapePattern(pattern: string | undefined, colors: string[]): string {
  const primary = colors[0];
  const secondary = colors[1] || '#ffffff';
  
  if (!pattern) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10" fill="${primary}"/></svg>`;
  }

  switch (pattern) {
    case 'stripe-diagonal':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="20" height="20" fill="${primary}"/><path d="M-5,5 L5,-5 M0,20 L20,0 M15,25 L25,15" stroke="${secondary}" stroke-width="4"/></svg>`;
    
    case 'stripe-horizontal':
      const stripeHeight = 20 / colors.length;
      const stripes = colors.map((c, i) => `<rect y="${i * stripeHeight}" width="20" height="${stripeHeight}" fill="${c}"/>`).join('');
      return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">${stripes}</svg>`;
    
    case 'stripe-vertical':
      const vStripeWidth = 20 / colors.length;
      const vStripes = colors.map((c, i) => `<rect x="${i * vStripeWidth}" width="${vStripeWidth}" height="20" fill="${c}"/>`).join('');
      return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">${vStripes}</svg>`;
    
    case 'dots':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="20" height="20" fill="${primary}"/><circle cx="5" cy="5" r="3" fill="${secondary}"/><circle cx="15" cy="15" r="3" fill="${secondary}"/></svg>`;
    
    case 'dots-multi':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="20"><rect width="30" height="20" fill="${colors[0]}"/><circle cx="5" cy="5" r="2.5" fill="${colors[1]}"/><circle cx="15" cy="10" r="2.5" fill="${colors[2]}"/><circle cx="25" cy="5" r="2.5" fill="${colors[3]}"/><circle cx="10" cy="15" r="2.5" fill="${colors[4] || colors[1]}"/><circle cx="20" cy="15" r="2.5" fill="${colors[2]}"/></svg>`;
    
    case 'dots-scattered':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="20"><rect width="40" height="20" fill="${colors[0]}"/><circle cx="5" cy="5" r="2" fill="${colors[1]}"/><circle cx="20" cy="8" r="2.5" fill="${colors[2]}"/><circle cx="35" cy="4" r="2" fill="${colors[3]}"/><circle cx="12" cy="15" r="2" fill="${colors[4] || colors[1]}"/><circle cx="28" cy="16" r="2.5" fill="${colors[2]}"/></svg>`;
    
    case 'chevron':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="20" height="20" fill="${primary}"/><path d="M0,10 L10,0 L20,10 M0,20 L10,10 L20,20" stroke="${secondary}" stroke-width="3" fill="none"/></svg>`;
    
    case 'triangles':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="20"><rect width="24" height="20" fill="${colors[0]}"/><polygon points="6,2 12,14 0,14" fill="${colors[1]}"/><polygon points="18,6 24,18 12,18" fill="${colors[2] || colors[1]}"/></svg>`;
    
    case 'diamonds':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="20" height="20" fill="${primary}"/><polygon points="10,0 20,10 10,20 0,10" fill="${secondary}" opacity="0.7"/></svg>`;
    
    case 'zigzag':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="20" height="20" fill="${primary}"/><path d="M0,5 L5,15 L10,5 L15,15 L20,5" stroke="${secondary}" stroke-width="3" fill="none"/></svg>`;
    
    case 'grid':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="20" height="20" fill="${primary}"/><path d="M10,0 L10,20 M0,10 L20,10" stroke="${secondary}" stroke-width="1"/></svg>`;
    
    case 'hexagons':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="20"><rect width="28" height="20" fill="${primary}"/><polygon points="7,2 13,2 16,10 13,18 7,18 4,10" stroke="${secondary}" stroke-width="1" fill="none"/></svg>`;
    
    case 'leaves':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="20"><rect width="30" height="20" fill="${primary}"/><ellipse cx="10" cy="10" rx="4" ry="6" fill="${secondary}" transform="rotate(-30,10,10)"/><ellipse cx="25" cy="10" rx="4" ry="6" fill="${secondary}" transform="rotate(30,25,10)"/></svg>`;
    
    case 'flowers':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="20"><rect width="30" height="20" fill="${primary}"/><circle cx="15" cy="10" r="3" fill="${colors[1]}"/><circle cx="15" cy="5" r="2" fill="${colors[1]}" opacity="0.7"/><circle cx="15" cy="15" r="2" fill="${colors[1]}" opacity="0.7"/><circle cx="11" cy="8" r="2" fill="${colors[1]}" opacity="0.7"/><circle cx="19" cy="8" r="2" fill="${colors[1]}" opacity="0.7"/><circle cx="11" cy="12" r="2" fill="${colors[1]}" opacity="0.7"/><circle cx="19" cy="12" r="2" fill="${colors[1]}" opacity="0.7"/><circle cx="15" cy="10" r="1.5" fill="${colors[2] || '#fbbf24'}"/></svg>`;
    
    case 'stars':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="20"><rect width="30" height="20" fill="${primary}"/><text x="8" y="14" font-size="12" fill="${secondary}">★</text><text x="22" y="10" font-size="8" fill="${secondary}">★</text></svg>`;
    
    case 'hearts':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="20"><rect width="30" height="20" fill="${primary}"/><text x="5" y="14" font-size="12" fill="${secondary}">♥</text><text x="20" y="12" font-size="8" fill="${secondary}">♥</text></svg>`;
    
    case 'clouds':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="20"><rect width="40" height="20" fill="${primary}"/><ellipse cx="15" cy="12" rx="8" ry="5" fill="${secondary}"/><ellipse cx="10" cy="13" rx="5" ry="4" fill="${secondary}"/><ellipse cx="20" cy="13" rx="5" ry="4" fill="${secondary}"/></svg>`;
    
    case 'butterflies':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="20"><rect width="30" height="20" fill="${primary}"/><ellipse cx="13" cy="10" rx="4" ry="3" fill="${colors[1]}" transform="rotate(-20,13,10)"/><ellipse cx="17" cy="10" rx="4" ry="3" fill="${colors[2] || colors[1]}" transform="rotate(20,17,10)"/><line x1="15" y1="7" x2="15" y2="14" stroke="${primary}" stroke-width="1"/></svg>`;
    
    case 'snowflakes':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="20"><rect width="30" height="20" fill="${primary}"/><text x="5" y="14" font-size="12" fill="${colors[1]}">❄</text><text x="20" y="10" font-size="8" fill="${colors[2] || colors[1]}">❄</text></svg>`;
    
    case 'glitter':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><defs><linearGradient id="glitterGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${colors[0]}"/><stop offset="50%" stop-color="${colors[1]}"/><stop offset="100%" stop-color="${colors[2] || colors[0]}"/></linearGradient></defs><rect width="20" height="20" fill="url(#glitterGrad)"/><circle cx="3" cy="5" r="1" fill="white" opacity="0.6"/><circle cx="12" cy="3" r="0.8" fill="white" opacity="0.5"/><circle cx="8" cy="12" r="1" fill="white" opacity="0.6"/><circle cx="17" cy="8" r="0.8" fill="white" opacity="0.5"/><circle cx="5" cy="17" r="1" fill="white" opacity="0.6"/><circle cx="15" cy="15" r="0.8" fill="white" opacity="0.5"/></svg>`;
    
    case 'holographic':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="20"><defs><linearGradient id="holoGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${colors[0]}"/><stop offset="25%" stop-color="${colors[1]}"/><stop offset="50%" stop-color="${colors[2]}"/><stop offset="75%" stop-color="${colors[3]}"/><stop offset="100%" stop-color="${colors[0]}"/></linearGradient></defs><rect width="40" height="20" fill="url(#holoGrad)"/></svg>`;
    
    case 'lace':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="20" height="20" fill="${primary}"/><circle cx="0" cy="0" r="5" fill="none" stroke="${secondary}" stroke-width="0.5"/><circle cx="20" cy="0" r="5" fill="none" stroke="${secondary}" stroke-width="0.5"/><circle cx="10" cy="10" r="5" fill="none" stroke="${secondary}" stroke-width="0.5"/><circle cx="0" cy="20" r="5" fill="none" stroke="${secondary}" stroke-width="0.5"/><circle cx="20" cy="20" r="5" fill="none" stroke="${secondary}" stroke-width="0.5"/></svg>`;
    
    default:
      return `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10" fill="${primary}"/></svg>`;
  }
}

interface WashiTapeBrowserProps {
  onSelectTape?: (tape: { id: string; name: string; svg: string; colors: string[] }) => void;
}

export function WashiTapeBrowser({ onSelectTape }: WashiTapeBrowserProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string>('solid-colors');
  const [tapeWidth, setTapeWidth] = useState(30);
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(90);

  const filteredTapes = useMemo(() => {
    const collection = WASHI_TAPE_COLLECTIONS[selectedCollection as keyof typeof WASHI_TAPE_COLLECTIONS];
    if (!collection) return [];
    
    if (!searchTerm) return collection.tapes;
    
    return collection.tapes.filter(tape =>
      tape.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [selectedCollection, searchTerm]);

  const getTapeStyle = (tape: { pattern?: string; colors: string[] }) => {
    const svg = generateTapePattern(tape.pattern, tape.colors);
    const encoded = encodeURIComponent(svg);
    return {
      backgroundImage: `url("data:image/svg+xml,${encoded}")`,
      backgroundRepeat: 'repeat',
    };
  };

  const handleSelectTape = (tape: { id: string; name: string; pattern?: string; colors: string[] }) => {
    const svg = generateTapePattern(tape.pattern, tape.colors);
    onSelectTape?.({
      id: tape.id,
      name: tape.name,
      svg,
      colors: tape.colors,
    });
  };

  const totalTapes = Object.values(WASHI_TAPE_COLLECTIONS).reduce(
    (acc, col) => acc + col.tapes.length, 0
  );

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Header */}
      <div className="p-3 border-b border-gray-700">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Scissors className="w-5 h-5 text-pink-400" />
          Washi Tape
        </h3>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search washi tape..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-pink-500"
          />
        </div>
      </div>

      {/* Collection Tabs */}
      <div className="flex overflow-x-auto p-2 gap-1 border-b border-gray-700">
        {Object.entries(WASHI_TAPE_COLLECTIONS).map(([key, collection]) => (
          <button
            key={key}
            onClick={() => setSelectedCollection(key)}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
              selectedCollection === key
                ? 'bg-pink-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {collection.name}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="p-3 border-b border-gray-700 space-y-2">
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-400 w-16">Width:</label>
          <input
            type="range"
            min="15"
            max="60"
            value={tapeWidth}
            onChange={(e) => setTapeWidth(Number(e.target.value))}
            className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs text-gray-400 w-10">{tapeWidth}px</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-400 w-16">Rotate:</label>
          <input
            type="range"
            min="-45"
            max="45"
            value={rotation}
            onChange={(e) => setRotation(Number(e.target.value))}
            className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs text-gray-400 w-10">{rotation}°</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-400 w-16">Opacity:</label>
          <input
            type="range"
            min="50"
            max="100"
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs text-gray-400 w-10">{opacity}%</span>
        </div>
      </div>

      {/* Tape Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-3">
          {filteredTapes.map((tape) => (
            <button
              key={tape.id}
              onClick={() => handleSelectTape(tape)}
              className="w-full group"
            >
              {/* Tape Preview */}
              <div 
                className="relative overflow-hidden rounded border-2 border-transparent hover:border-pink-500 transition-colors"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                {/* Tape strip */}
                <div
                  className="w-full"
                  style={{
                    ...getTapeStyle(tape),
                    height: `${tapeWidth}px`,
                    opacity: opacity / 100,
                  }}
                />
                
                {/* Torn edge effect */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-2"
                  style={{
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, transparent 100%)',
                    clipPath: 'polygon(0 0, 100% 5%, 100% 10%, 80% 15%, 100% 20%, 80% 25%, 100% 30%, 80% 35%, 100% 40%, 80% 45%, 100% 50%, 80% 55%, 100% 60%, 80% 65%, 100% 70%, 80% 75%, 100% 80%, 80% 85%, 100% 90%, 80% 95%, 100% 100%, 0 100%)',
                  }}
                />
                <div 
                  className="absolute right-0 top-0 bottom-0 w-2"
                  style={{
                    background: 'linear-gradient(270deg, rgba(0,0,0,0.2) 0%, transparent 100%)',
                    clipPath: 'polygon(0 5%, 100% 0, 100% 100%, 0 100%, 20% 95%, 0 90%, 20% 85%, 0 80%, 20% 75%, 0 70%, 20% 65%, 0 60%, 20% 55%, 0 50%, 20% 45%, 0 40%, 20% 35%, 0 30%, 20% 25%, 0 20%, 20% 15%, 0 10%)',
                  }}
                />
              </div>
              
              {/* Label */}
              <p className="text-xs text-center mt-1 text-gray-400 group-hover:text-white transition-colors">
                {tape.name}
              </p>
            </button>
          ))}
        </div>
        
        {filteredTapes.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No washi tape found
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-2 border-t border-gray-700 text-center text-xs text-gray-500">
        {totalTapes} washi tapes • 8 collections • 100% Free
      </div>
    </div>
  );
}

export default WashiTapeBrowser;

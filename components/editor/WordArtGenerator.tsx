// components/editor/WordArtGenerator.tsx
// Word Art Generator - Text Effects & Decorative Typography
// Timestamp: Tuesday, December 24, 2025 – 3:28 PM Eastern Time
// CR AudioViz AI - "Your Story. Our Design"

'use client';

import React, { useState, useMemo } from 'react';
import { 
  Type, 
  Sparkles, 
  Palette,
  RotateCcw,
  Check,
  Wand2,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronDown
} from 'lucide-react';

interface WordArtStyle {
  id: string;
  name: string;
  category: string;
  styles: React.CSSProperties;
  preview: string;
}

interface WordArtGeneratorProps {
  onApplyStyle?: (text: string, styles: React.CSSProperties) => void;
  onAddToCanvas?: (text: string, styles: React.CSSProperties) => void;
}

// Comprehensive word art styles
const WORD_ART_STYLES: WordArtStyle[] = [
  // GRADIENTS
  { 
    id: 'rainbow-gradient', 
    name: 'Rainbow', 
    category: 'gradient',
    styles: { 
      background: 'linear-gradient(90deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #8B00FF)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 'bold'
    },
    preview: 'Rainbow'
  },
  { 
    id: 'sunset-gradient', 
    name: 'Sunset', 
    category: 'gradient',
    styles: { 
      background: 'linear-gradient(135deg, #FF6B6B, #FF8E53, #FFC93C)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 'bold'
    },
    preview: 'Sunset'
  },
  { 
    id: 'ocean-gradient', 
    name: 'Ocean', 
    category: 'gradient',
    styles: { 
      background: 'linear-gradient(135deg, #667eea, #764ba2, #6B8DD6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 'bold'
    },
    preview: 'Ocean'
  },
  { 
    id: 'gold-gradient', 
    name: 'Gold Foil', 
    category: 'gradient',
    styles: { 
      background: 'linear-gradient(135deg, #D4AF37, #F5E7A3, #D4AF37, #AA8C2C)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 'bold'
    },
    preview: 'Gold'
  },
  { 
    id: 'silver-gradient', 
    name: 'Silver Foil', 
    category: 'gradient',
    styles: { 
      background: 'linear-gradient(135deg, #C0C0C0, #E8E8E8, #C0C0C0, #A8A8A8)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 'bold'
    },
    preview: 'Silver'
  },
  { 
    id: 'rose-gold', 
    name: 'Rose Gold', 
    category: 'gradient',
    styles: { 
      background: 'linear-gradient(135deg, #B76E79, #E8B4B8, #B76E79)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 'bold'
    },
    preview: 'Rose Gold'
  },
  { 
    id: 'pink-gradient', 
    name: 'Cotton Candy', 
    category: 'gradient',
    styles: { 
      background: 'linear-gradient(135deg, #FF9A9E, #FECFEF, #A18CD1)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 'bold'
    },
    preview: 'Candy'
  },
  { 
    id: 'mint-gradient', 
    name: 'Fresh Mint', 
    category: 'gradient',
    styles: { 
      background: 'linear-gradient(135deg, #11998E, #38EF7D)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 'bold'
    },
    preview: 'Mint'
  },

  // SHADOWS & OUTLINES
  { 
    id: 'drop-shadow', 
    name: 'Drop Shadow', 
    category: 'shadow',
    styles: { 
      color: '#1F2937',
      textShadow: '3px 3px 6px rgba(0,0,0,0.3)',
      fontWeight: 'bold'
    },
    preview: 'Shadow'
  },
  { 
    id: 'hard-shadow', 
    name: 'Hard Shadow', 
    category: 'shadow',
    styles: { 
      color: '#3B82F6',
      textShadow: '4px 4px 0px #1E40AF',
      fontWeight: 'bold'
    },
    preview: 'Hard'
  },
  { 
    id: 'retro-shadow', 
    name: 'Retro 3D', 
    category: 'shadow',
    styles: { 
      color: '#F59E0B',
      textShadow: '1px 1px 0 #92400E, 2px 2px 0 #92400E, 3px 3px 0 #92400E, 4px 4px 0 #92400E',
      fontWeight: 'bold'
    },
    preview: '3D'
  },
  { 
    id: 'long-shadow', 
    name: 'Long Shadow', 
    category: 'shadow',
    styles: { 
      color: '#EC4899',
      textShadow: '1px 1px 0 #BE185D, 2px 2px 0 #BE185D, 3px 3px 0 #BE185D, 4px 4px 0 #BE185D, 5px 5px 0 #BE185D, 6px 6px 0 #BE185D',
      fontWeight: 'bold'
    },
    preview: 'Long'
  },
  { 
    id: 'outline', 
    name: 'Outline', 
    category: 'shadow',
    styles: { 
      color: 'transparent',
      WebkitTextStroke: '2px #1F2937',
      fontWeight: 'bold'
    },
    preview: 'Outline'
  },
  { 
    id: 'double-outline', 
    name: 'Double Outline', 
    category: 'shadow',
    styles: { 
      color: '#FFFFFF',
      WebkitTextStroke: '1px #1F2937',
      textShadow: '0 0 0 3px #1F2937',
      fontWeight: 'bold'
    },
    preview: 'Double'
  },

  // NEON & GLOW
  { 
    id: 'neon-pink', 
    name: 'Neon Pink', 
    category: 'neon',
    styles: { 
      color: '#FF10F0',
      textShadow: '0 0 5px #FF10F0, 0 0 10px #FF10F0, 0 0 20px #FF10F0, 0 0 40px #FF10F0',
      fontWeight: 'bold'
    },
    preview: 'Neon'
  },
  { 
    id: 'neon-blue', 
    name: 'Neon Blue', 
    category: 'neon',
    styles: { 
      color: '#00F5FF',
      textShadow: '0 0 5px #00F5FF, 0 0 10px #00F5FF, 0 0 20px #00F5FF, 0 0 40px #00F5FF',
      fontWeight: 'bold'
    },
    preview: 'Cyan'
  },
  { 
    id: 'neon-green', 
    name: 'Neon Green', 
    category: 'neon',
    styles: { 
      color: '#39FF14',
      textShadow: '0 0 5px #39FF14, 0 0 10px #39FF14, 0 0 20px #39FF14, 0 0 40px #39FF14',
      fontWeight: 'bold'
    },
    preview: 'Lime'
  },
  { 
    id: 'neon-yellow', 
    name: 'Neon Yellow', 
    category: 'neon',
    styles: { 
      color: '#FFFF00',
      textShadow: '0 0 5px #FFFF00, 0 0 10px #FFFF00, 0 0 20px #FFA500',
      fontWeight: 'bold'
    },
    preview: 'Yellow'
  },
  { 
    id: 'glow-white', 
    name: 'Soft Glow', 
    category: 'neon',
    styles: { 
      color: '#FFFFFF',
      textShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.6), 0 0 30px rgba(255,255,255,0.4)',
      fontWeight: 'bold'
    },
    preview: 'Glow'
  },

  // VINTAGE & RETRO
  { 
    id: 'vintage-stamp', 
    name: 'Vintage Stamp', 
    category: 'vintage',
    styles: { 
      color: '#78350F',
      textShadow: '1px 1px 0 #FEF3C7',
      fontWeight: 'bold',
      letterSpacing: '0.1em',
      textTransform: 'uppercase' as const
    },
    preview: 'STAMP'
  },
  { 
    id: 'typewriter', 
    name: 'Typewriter', 
    category: 'vintage',
    styles: { 
      color: '#1F2937',
      fontFamily: '"Courier New", monospace',
      letterSpacing: '0.05em'
    },
    preview: 'Type'
  },
  { 
    id: 'western', 
    name: 'Western', 
    category: 'vintage',
    styles: { 
      color: '#92400E',
      textShadow: '2px 2px 0 #FCD34D',
      fontWeight: 'bold',
      letterSpacing: '0.15em',
      textTransform: 'uppercase' as const
    },
    preview: 'WEST'
  },
  { 
    id: 'circus', 
    name: 'Circus', 
    category: 'vintage',
    styles: { 
      color: '#DC2626',
      textShadow: '3px 3px 0 #FCD34D, 6px 6px 0 #1F2937',
      fontWeight: 'bold',
      letterSpacing: '0.1em'
    },
    preview: 'FUN'
  },

  // ELEGANT & FANCY
  { 
    id: 'elegant-script', 
    name: 'Elegant Script', 
    category: 'elegant',
    styles: { 
      color: '#1F2937',
      fontStyle: 'italic',
      letterSpacing: '0.05em'
    },
    preview: 'Elegant'
  },
  { 
    id: 'embossed', 
    name: 'Embossed', 
    category: 'elegant',
    styles: { 
      color: '#D1D5DB',
      textShadow: '-1px -1px 1px rgba(255,255,255,0.8), 1px 1px 1px rgba(0,0,0,0.2)',
      fontWeight: 'bold'
    },
    preview: 'Emboss'
  },
  { 
    id: 'debossed', 
    name: 'Debossed', 
    category: 'elegant',
    styles: { 
      color: '#9CA3AF',
      textShadow: '1px 1px 1px rgba(255,255,255,0.5), -1px -1px 1px rgba(0,0,0,0.1)',
      fontWeight: 'bold'
    },
    preview: 'Deboss'
  },
  { 
    id: 'luxury-gold', 
    name: 'Luxury', 
    category: 'elegant',
    styles: { 
      background: 'linear-gradient(180deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 'bold',
      letterSpacing: '0.1em'
    },
    preview: 'Luxury'
  },

  // PLAYFUL & FUN
  { 
    id: 'bubble', 
    name: 'Bubble', 
    category: 'playful',
    styles: { 
      color: '#EC4899',
      textShadow: '0 2px 0 #BE185D, 0 4px 0 #9D174D',
      fontWeight: 'bold'
    },
    preview: 'Bubble'
  },
  { 
    id: 'comic', 
    name: 'Comic', 
    category: 'playful',
    styles: { 
      color: '#FBBF24',
      WebkitTextStroke: '2px #1F2937',
      fontWeight: 'bold',
      letterSpacing: '0.05em'
    },
    preview: 'POW!'
  },
  { 
    id: 'chalk', 
    name: 'Chalkboard', 
    category: 'playful',
    styles: { 
      color: '#FFFFFF',
      textShadow: '1px 1px 2px rgba(255,255,255,0.3)',
      fontWeight: 'normal',
      letterSpacing: '0.02em'
    },
    preview: 'Chalk'
  },
  { 
    id: 'graffiti', 
    name: 'Graffiti', 
    category: 'playful',
    styles: { 
      color: '#8B5CF6',
      WebkitTextStroke: '1px #1F2937',
      textShadow: '3px 3px 0 #EC4899, 6px 6px 0 #3B82F6',
      fontWeight: 'bold'
    },
    preview: 'WILD'
  },

  // SEASONAL
  { 
    id: 'christmas', 
    name: 'Christmas', 
    category: 'seasonal',
    styles: { 
      background: 'linear-gradient(180deg, #DC2626, #166534)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 'bold'
    },
    preview: 'Merry'
  },
  { 
    id: 'valentine', 
    name: 'Valentine', 
    category: 'seasonal',
    styles: { 
      color: '#BE185D',
      textShadow: '0 0 10px rgba(236,72,153,0.5)',
      fontWeight: 'bold'
    },
    preview: 'Love'
  },
  { 
    id: 'halloween', 
    name: 'Halloween', 
    category: 'seasonal',
    styles: { 
      color: '#F97316',
      textShadow: '0 0 10px #F97316, 0 0 20px #7C3AED',
      fontWeight: 'bold'
    },
    preview: 'Spooky'
  },
  { 
    id: 'spring', 
    name: 'Spring', 
    category: 'seasonal',
    styles: { 
      background: 'linear-gradient(135deg, #A7F3D0, #FBCFE8, #FDE68A)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 'bold'
    },
    preview: 'Bloom'
  },
];

// Categories
const CATEGORIES = [
  { id: 'all', name: 'All Styles' },
  { id: 'gradient', name: 'Gradients' },
  { id: 'shadow', name: 'Shadows' },
  { id: 'neon', name: 'Neon & Glow' },
  { id: 'vintage', name: 'Vintage' },
  { id: 'elegant', name: 'Elegant' },
  { id: 'playful', name: 'Playful' },
  { id: 'seasonal', name: 'Seasonal' },
];

// Font options
const FONTS = [
  { id: 'default', name: 'Default', family: 'inherit' },
  { id: 'serif', name: 'Serif', family: 'Georgia, serif' },
  { id: 'sans', name: 'Sans Serif', family: 'Arial, sans-serif' },
  { id: 'mono', name: 'Monospace', family: '"Courier New", monospace' },
  { id: 'script', name: 'Script', family: '"Dancing Script", cursive' },
  { id: 'display', name: 'Display', family: '"Playfair Display", serif' },
  { id: 'handwritten', name: 'Handwritten', family: '"Caveat", cursive' },
];

export default function WordArtGenerator({ onApplyStyle, onAddToCanvas }: WordArtGeneratorProps) {
  const [text, setText] = useState('Your Text');
  const [selectedStyle, setSelectedStyle] = useState<WordArtStyle | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFont, setSelectedFont] = useState('default');
  const [fontSize, setFontSize] = useState(32);
  const [isBold, setIsBold] = useState(true);
  const [isItalic, setIsItalic] = useState(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');

  // Filter styles
  const filteredStyles = useMemo(() => {
    return WORD_ART_STYLES.filter(style => 
      selectedCategory === 'all' || style.category === selectedCategory
    );
  }, [selectedCategory]);

  // Get combined styles
  const getCombinedStyles = (): React.CSSProperties => {
    const font = FONTS.find(f => f.id === selectedFont);
    return {
      ...(selectedStyle?.styles || {}),
      fontFamily: font?.family || 'inherit',
      fontSize: `${fontSize}px`,
      fontWeight: isBold ? 'bold' : 'normal',
      fontStyle: isItalic ? 'italic' : 'normal',
      textAlign,
    };
  };

  // Handle add to canvas
  const handleAddToCanvas = () => {
    const styles = getCombinedStyles();
    onApplyStyle?.(text, styles);
    onAddToCanvas?.(text, styles);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-fuchsia-50 to-pink-50">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-gradient-to-br from-fuchsia-500 to-pink-500 rounded-lg">
            <Type className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Word Art</h3>
            <p className="text-xs text-gray-500">{filteredStyles.length} text effects</p>
          </div>
        </div>

        {/* Text Input */}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text..."
          className="w-full px-4 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
        />
      </div>

      {/* Text Controls */}
      <div className="p-3 border-b bg-gray-50">
        <div className="flex items-center gap-2 mb-2">
          {/* Font Selector */}
          <select
            value={selectedFont}
            onChange={(e) => setSelectedFont(e.target.value)}
            className="flex-1 px-2 py-1.5 text-xs border rounded bg-white"
          >
            {FONTS.map(font => (
              <option key={font.id} value={font.id}>{font.name}</option>
            ))}
          </select>

          {/* Font Size */}
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              min={12}
              max={120}
              className="w-14 px-2 py-1.5 text-xs border rounded bg-white text-center"
            />
            <span className="text-xs text-gray-500">px</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Bold */}
          <button
            onClick={() => setIsBold(!isBold)}
            className={`p-1.5 rounded ${isBold ? 'bg-fuchsia-200 text-fuchsia-700' : 'hover:bg-gray-200'}`}
          >
            <Bold className="w-4 h-4" />
          </button>
          {/* Italic */}
          <button
            onClick={() => setIsItalic(!isItalic)}
            className={`p-1.5 rounded ${isItalic ? 'bg-fuchsia-200 text-fuchsia-700' : 'hover:bg-gray-200'}`}
          >
            <Italic className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Alignment */}
          <button
            onClick={() => setTextAlign('left')}
            className={`p-1.5 rounded ${textAlign === 'left' ? 'bg-fuchsia-200 text-fuchsia-700' : 'hover:bg-gray-200'}`}
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTextAlign('center')}
            className={`p-1.5 rounded ${textAlign === 'center' ? 'bg-fuchsia-200 text-fuchsia-700' : 'hover:bg-gray-200'}`}
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTextAlign('right')}
            className={`p-1.5 rounded ${textAlign === 'right' ? 'bg-fuchsia-200 text-fuchsia-700' : 'hover:bg-gray-200'}`}
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="p-4 border-b bg-gray-100">
        <div 
          className="min-h-[80px] flex items-center justify-center p-4 bg-white rounded-lg border"
          style={{ textAlign }}
        >
          <span style={getCombinedStyles()}>
            {text || 'Your Text'}
          </span>
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
                  ? 'bg-fuchsia-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Styles Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {filteredStyles.map(style => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style)}
              className={`p-3 rounded-lg border transition-all text-center ${
                selectedStyle?.id === style.id
                  ? 'border-fuchsia-500 bg-fuchsia-50'
                  : 'border-gray-200 hover:border-fuchsia-300 bg-white'
              }`}
            >
              <div 
                className="text-lg mb-1"
                style={style.styles}
              >
                {style.preview}
              </div>
              <p className="text-[10px] text-gray-500">{style.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Add Button */}
      <div className="p-4 border-t">
        <button
          onClick={handleAddToCanvas}
          disabled={!text.trim()}
          className="w-full py-2.5 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-medium rounded-lg hover:from-fuchsia-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          Add to Canvas
        </button>
      </div>
    </div>
  );
}

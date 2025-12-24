// components/editor/AlphabetsBrowser.tsx
// 50+ Decorative Alphabet Styles for Scrapbook Titles & Monograms
// Timestamp: Tuesday, December 24, 2025 – 1:25 PM Eastern Time
// CR AudioViz AI - "Your Story. Our Design"

'use client';

import React, { useState, useMemo } from 'react';
import { Search, Type, Sparkles, Heart, Star, Flower2, Crown, Palette, Plus } from 'lucide-react';

interface AlphabetStyle {
  id: string;
  name: string;
  category: string;
  preview: string;
  fontFamily: string;
  fontWeight: string;
  letterSpacing: string;
  textShadow?: string;
  gradient?: string;
  tags: string[];
}

interface AlphabetsBrowserProps {
  onSelect?: (style: AlphabetStyle, text: string) => void;
  onAddToCanvas?: (text: string, style: React.CSSProperties, styleName: string) => void;
}

// Comprehensive alphabet styles - 50+ styles
const ALPHABET_STYLES: AlphabetStyle[] = [
  // ELEGANT & SCRIPT (10 styles)
  { id: 'elegant-script', name: 'Elegant Script', category: 'script', preview: 'AaBbCc', fontFamily: "'Dancing Script', cursive", fontWeight: '700', letterSpacing: '0.02em', tags: ['wedding', 'romantic'] },
  { id: 'classic-cursive', name: 'Classic Cursive', category: 'script', preview: 'AaBbCc', fontFamily: "'Great Vibes', cursive", fontWeight: '400', letterSpacing: '0.01em', tags: ['elegant', 'formal'] },
  { id: 'romantic-calligraphy', name: 'Romantic Calligraphy', category: 'script', preview: 'AaBbCc', fontFamily: "'Parisienne', cursive", fontWeight: '400', letterSpacing: '0.02em', tags: ['love', 'wedding'] },
  { id: 'brush-script', name: 'Brush Script', category: 'script', preview: 'AaBbCc', fontFamily: "'Satisfy', cursive", fontWeight: '400', letterSpacing: '0.01em', tags: ['artistic', 'casual'] },
  { id: 'fancy-flourish', name: 'Fancy Flourish', category: 'script', preview: 'AaBbCc', fontFamily: "'Tangerine', cursive", fontWeight: '700', letterSpacing: '0.02em', tags: ['decorative', 'ornate'] },
  { id: 'sacramento-flow', name: 'Sacramento Flow', category: 'script', preview: 'AaBbCc', fontFamily: "'Sacramento', cursive", fontWeight: '400', letterSpacing: '0.02em', tags: ['flowing', 'gentle'] },
  { id: 'alex-brush', name: 'Alex Brush', category: 'script', preview: 'AaBbCc', fontFamily: "'Alex Brush', cursive", fontWeight: '400', letterSpacing: '0.01em', tags: ['brush', 'natural'] },
  { id: 'allura-script', name: 'Allura Script', category: 'script', preview: 'AaBbCc', fontFamily: "'Allura', cursive", fontWeight: '400', letterSpacing: '0.02em', tags: ['beautiful', 'flowing'] },
  { id: 'pacifico-wave', name: 'Pacifico Wave', category: 'script', preview: 'AaBbCc', fontFamily: "'Pacifico', cursive", fontWeight: '400', letterSpacing: '0.01em', tags: ['retro', 'surf'] },
  { id: 'lobster-bold', name: 'Lobster Bold', category: 'script', preview: 'AaBbCc', fontFamily: "'Lobster', cursive", fontWeight: '400', letterSpacing: '0.01em', tags: ['bold', 'script'] },

  // BOLD & DISPLAY (10 styles)
  { id: 'bold-impact', name: 'Bold Impact', category: 'display', preview: 'AABBCC', fontFamily: "'Anton', sans-serif", fontWeight: '400', letterSpacing: '0.05em', tags: ['strong', 'sports'] },
  { id: 'chunky-block', name: 'Chunky Block', category: 'display', preview: 'AABBCC', fontFamily: "'Black Ops One', cursive", fontWeight: '400', letterSpacing: '0.02em', tags: ['bold', 'military'] },
  { id: 'modern-sans', name: 'Modern Sans', category: 'display', preview: 'AaBbCc', fontFamily: "'Poppins', sans-serif", fontWeight: '700', letterSpacing: '0.03em', tags: ['clean', 'minimal'] },
  { id: 'bebas-neue', name: 'Bebas Neue', category: 'display', preview: 'AABBCC', fontFamily: "'Bebas Neue', sans-serif", fontWeight: '400', letterSpacing: '0.08em', tags: ['modern', 'poster'] },
  { id: 'oswald-tall', name: 'Oswald Tall', category: 'display', preview: 'AABBCC', fontFamily: "'Oswald', sans-serif", fontWeight: '700', letterSpacing: '0.04em', tags: ['narrow', 'headline'] },
  { id: 'montserrat-black', name: 'Montserrat Black', category: 'display', preview: 'AaBbCc', fontFamily: "'Montserrat', sans-serif", fontWeight: '900', letterSpacing: '0.02em', tags: ['geometric', 'modern'] },
  { id: 'raleway-heavy', name: 'Raleway Heavy', category: 'display', preview: 'AaBbCc', fontFamily: "'Raleway', sans-serif", fontWeight: '800', letterSpacing: '0.05em', tags: ['elegant', 'thin'] },
  { id: 'righteous-bold', name: 'Righteous Bold', category: 'display', preview: 'AaBbCc', fontFamily: "'Righteous', cursive", fontWeight: '400', letterSpacing: '0.02em', tags: ['retro', 'groovy'] },
  { id: 'russo-one', name: 'Russo One', category: 'display', preview: 'AABBCC', fontFamily: "'Russo One', sans-serif", fontWeight: '400', letterSpacing: '0.03em', tags: ['tech', 'industrial'] },
  { id: 'teko-bold', name: 'Teko Bold', category: 'display', preview: 'AABBCC', fontFamily: "'Teko', sans-serif", fontWeight: '700', letterSpacing: '0.04em', tags: ['sports', 'modern'] },

  // VINTAGE & RETRO (10 styles)
  { id: 'vintage-serif', name: 'Vintage Serif', category: 'vintage', preview: 'AaBbCc', fontFamily: "'Playfair Display', serif", fontWeight: '700', letterSpacing: '0.02em', tags: ['classic', 'elegant'] },
  { id: 'retro-typewriter', name: 'Retro Typewriter', category: 'vintage', preview: 'AaBbCc', fontFamily: "'Special Elite', cursive", fontWeight: '400', letterSpacing: '0.05em', tags: ['nostalgic', 'typed'] },
  { id: 'western-slab', name: 'Western Slab', category: 'vintage', preview: 'AABBCC', fontFamily: "'Rye', cursive", fontWeight: '400', letterSpacing: '0.03em', tags: ['cowboy', 'country'] },
  { id: 'art-deco', name: 'Art Deco', category: 'vintage', preview: 'AABBCC', fontFamily: "'Poiret One', cursive", fontWeight: '400', letterSpacing: '0.08em', tags: ['1920s', 'gatsby'] },
  { id: 'circus-carnival', name: 'Circus Carnival', category: 'vintage', preview: 'AABBCC', fontFamily: "'Fascinate Inline', cursive", fontWeight: '400', letterSpacing: '0.04em', tags: ['fun', 'carnival'] },
  { id: 'old-standard', name: 'Old Standard', category: 'vintage', preview: 'AaBbCc', fontFamily: "'Old Standard TT', serif", fontWeight: '700', letterSpacing: '0.02em', tags: ['newspaper', 'classic'] },
  { id: 'libre-baskerville', name: 'Libre Baskerville', category: 'vintage', preview: 'AaBbCc', fontFamily: "'Libre Baskerville', serif", fontWeight: '700', letterSpacing: '0.01em', tags: ['book', 'traditional'] },
  { id: 'cinzel-decorative', name: 'Cinzel Decorative', category: 'vintage', preview: 'AABBCC', fontFamily: "'Cinzel Decorative', cursive", fontWeight: '700', letterSpacing: '0.05em', tags: ['roman', 'classical'] },
  { id: 'abril-fatface', name: 'Abril Fatface', category: 'vintage', preview: 'AaBbCc', fontFamily: "'Abril Fatface', cursive", fontWeight: '400', letterSpacing: '0.01em', tags: ['display', 'magazine'] },
  { id: 'cormorant-garamond', name: 'Cormorant Garamond', category: 'vintage', preview: 'AaBbCc', fontFamily: "'Cormorant Garamond', serif", fontWeight: '700', letterSpacing: '0.02em', tags: ['french', 'elegant'] },

  // PLAYFUL & KIDS (10 styles)
  { id: 'bubble-fun', name: 'Bubble Fun', category: 'playful', preview: 'AaBbCc', fontFamily: "'Bubblegum Sans', cursive", fontWeight: '400', letterSpacing: '0.02em', tags: ['kids', 'birthday'] },
  { id: 'comic-pop', name: 'Comic Pop', category: 'playful', preview: 'AaBbCc', fontFamily: "'Bangers', cursive", fontWeight: '400', letterSpacing: '0.04em', tags: ['superhero', 'action'] },
  { id: 'crayon-kids', name: 'Crayon Kids', category: 'playful', preview: 'AaBbCc', fontFamily: "'Patrick Hand', cursive", fontWeight: '400', letterSpacing: '0.01em', tags: ['handwritten', 'school'] },
  { id: 'fredoka-one', name: 'Fredoka One', category: 'playful', preview: 'AaBbCc', fontFamily: "'Fredoka One', cursive", fontWeight: '400', letterSpacing: '0.02em', tags: ['cute', 'round'] },
  { id: 'luckiest-guy', name: 'Luckiest Guy', category: 'playful', preview: 'AaBbCc', fontFamily: "'Luckiest Guy', cursive", fontWeight: '400', letterSpacing: '0.02em', tags: ['cartoon', 'adventure'] },
  { id: 'chewy-fun', name: 'Chewy Fun', category: 'playful', preview: 'AaBbCc', fontFamily: "'Chewy', cursive", fontWeight: '400', letterSpacing: '0.02em', tags: ['bouncy', 'fun'] },
  { id: 'gloria-hallelujah', name: 'Gloria Hallelujah', category: 'playful', preview: 'AaBbCc', fontFamily: "'Gloria Hallelujah', cursive", fontWeight: '400', letterSpacing: '0.01em', tags: ['comic', 'casual'] },
  { id: 'schoolbell', name: 'Schoolbell', category: 'playful', preview: 'AaBbCc', fontFamily: "'Schoolbell', cursive", fontWeight: '400', letterSpacing: '0.01em', tags: ['school', 'childlike'] },
  { id: 'comic-neue', name: 'Comic Neue', category: 'playful', preview: 'AaBbCc', fontFamily: "'Comic Neue', cursive", fontWeight: '700', letterSpacing: '0.01em', tags: ['comic', 'friendly'] },
  { id: 'baloo-2', name: 'Baloo 2', category: 'playful', preview: 'AaBbCc', fontFamily: "'Baloo 2', cursive", fontWeight: '700', letterSpacing: '0.01em', tags: ['rounded', 'cute'] },

  // HANDWRITTEN (10 styles)
  { id: 'permanent-marker', name: 'Permanent Marker', category: 'handwritten', preview: 'AaBbCc', fontFamily: "'Permanent Marker', cursive", fontWeight: '400', letterSpacing: '0.01em', tags: ['marker', 'bold'] },
  { id: 'caveat-brush', name: 'Caveat Brush', category: 'handwritten', preview: 'AaBbCc', fontFamily: "'Caveat Brush', cursive", fontWeight: '400', letterSpacing: '0.01em', tags: ['notes', 'personal'] },
  { id: 'indie-flower', name: 'Indie Flower', category: 'handwritten', preview: 'AaBbCc', fontFamily: "'Indie Flower', cursive", fontWeight: '400', letterSpacing: '0.02em', tags: ['sketched', 'casual'] },
  { id: 'kalam-journal', name: 'Kalam Journal', category: 'handwritten', preview: 'AaBbCc', fontFamily: "'Kalam', cursive", fontWeight: '400', letterSpacing: '0.01em', tags: ['diary', 'personal'] },
  { id: 'amatic-chalk', name: 'Amatic Chalk', category: 'handwritten', preview: 'AaBbCc', fontFamily: "'Amatic SC', cursive", fontWeight: '700', letterSpacing: '0.05em', tags: ['chalk', 'rustic'] },
  { id: 'handlee', name: 'Handlee', category: 'handwritten', preview: 'AaBbCc', fontFamily: "'Handlee', cursive", fontWeight: '400', letterSpacing: '0.01em', tags: ['casual', 'friendly'] },
  { id: 'coming-soon', name: 'Coming Soon', category: 'handwritten', preview: 'AaBbCc', fontFamily: "'Coming Soon', cursive", fontWeight: '400', letterSpacing: '0.01em', tags: ['casual', 'notes'] },
  { id: 'shadows-into-light', name: 'Shadows Into Light', category: 'handwritten', preview: 'AaBbCc', fontFamily: "'Shadows Into Light', cursive", fontWeight: '400', letterSpacing: '0.02em', tags: ['light', 'airy'] },
  { id: 'architects-daughter', name: 'Architects Daughter', category: 'handwritten', preview: 'AaBbCc', fontFamily: "'Architects Daughter', cursive", fontWeight: '400', letterSpacing: '0.01em', tags: ['architectural', 'neat'] },
  { id: 'just-another-hand', name: 'Just Another Hand', category: 'handwritten', preview: 'AaBbCc', fontFamily: "'Just Another Hand', cursive", fontWeight: '400', letterSpacing: '0.02em', tags: ['casual', 'quick'] },

  // DECORATIVE & EFFECTS (5 styles)
  { id: 'shadow-3d', name: '3D Shadow', category: 'effects', preview: 'ABC', fontFamily: "'Bungee', cursive", fontWeight: '400', letterSpacing: '0.02em', textShadow: '3px 3px 0 rgba(0,0,0,0.3)', tags: ['3d', 'shadow'] },
  { id: 'bungee-outline', name: 'Bungee Outline', category: 'effects', preview: 'ABC', fontFamily: "'Bungee Outline', cursive", fontWeight: '400', letterSpacing: '0.02em', tags: ['outline', 'hollow'] },
  { id: 'monoton-neon', name: 'Monoton Neon', category: 'effects', preview: 'ABC', fontFamily: "'Monoton', cursive", fontWeight: '400', letterSpacing: '0.02em', textShadow: '0 0 10px currentColor', tags: ['neon', 'glowing'] },
  { id: 'bungee-shade', name: 'Bungee Shade', category: 'effects', preview: 'ABC', fontFamily: "'Bungee Shade', cursive", fontWeight: '400', letterSpacing: '0.02em', tags: ['shade', 'dimensional'] },
  { id: 'press-start', name: 'Press Start', category: 'effects', preview: 'ABC', fontFamily: "'Press Start 2P', cursive", fontWeight: '400', letterSpacing: '0.02em', tags: ['pixel', 'retro', 'gaming'] },
];

// Category definitions
const CATEGORIES = [
  { id: 'all', name: 'All Styles', icon: Sparkles },
  { id: 'script', name: 'Script', icon: Heart },
  { id: 'display', name: 'Display', icon: Crown },
  { id: 'vintage', name: 'Vintage', icon: Star },
  { id: 'playful', name: 'Playful', icon: Flower2 },
  { id: 'handwritten', name: 'Handwritten', icon: Type },
  { id: 'effects', name: 'Effects', icon: Palette },
];

// Google Fonts to load
const GOOGLE_FONTS = [
  'Dancing+Script:wght@700',
  'Great+Vibes',
  'Parisienne',
  'Satisfy',
  'Tangerine:wght@700',
  'Sacramento',
  'Anton',
  'Black+Ops+One',
  'Poppins:wght@700',
  'Bebas+Neue',
  'Oswald:wght@700',
  'Playfair+Display:wght@700',
  'Special+Elite',
  'Rye',
  'Poiret+One',
  'Bubblegum+Sans',
  'Bangers',
  'Patrick+Hand',
  'Fredoka+One',
  'Luckiest+Guy',
  'Permanent+Marker',
  'Caveat+Brush',
  'Indie+Flower',
  'Kalam',
  'Amatic+SC:wght@700',
  'Bungee',
  'Bungee+Outline',
  'Monoton',
  'Pacifico',
  'Lobster',
  'Montserrat:wght@900',
  'Raleway:wght@800',
  'Righteous',
  'Press+Start+2P',
];

export default function AlphabetsBrowser({ onSelect, onAddToCanvas }: AlphabetsBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [customText, setCustomText] = useState('Your Text Here');
  const [selectedColor, setSelectedColor] = useState('#6366f1');
  const [fontSize, setFontSize] = useState(48);

  // Load Google Fonts
  React.useEffect(() => {
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${GOOGLE_FONTS.join('&family=')}&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  // Filter styles
  const filteredStyles = useMemo(() => {
    return ALPHABET_STYLES.filter(style => {
      const matchesSearch = searchQuery === '' || 
        style.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        style.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || style.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Handle style selection
  const handleSelect = (style: AlphabetStyle) => {
    const cssStyle: React.CSSProperties = {
      fontFamily: style.fontFamily,
      fontWeight: style.fontWeight,
      letterSpacing: style.letterSpacing,
      color: selectedColor,
      fontSize: `${fontSize}px`,
      textShadow: style.textShadow,
    };
    
    onSelect?.(style, customText);
    onAddToCanvas?.(customText, cssStyle, style.name);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-violet-50 to-purple-50">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg">
            <Type className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Alphabets & Titles</h3>
            <p className="text-xs text-gray-500">{filteredStyles.length} decorative styles</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search styles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Custom Text Input */}
        <div className="space-y-2">
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Type your text..."
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          
          <div className="flex gap-2">
            {/* Color Picker */}
            <div className="flex items-center gap-1 flex-1">
              <span className="text-xs text-gray-500">Color:</span>
              <div className="flex gap-1">
                {['#6366f1', '#ec4899', '#ef4444', '#f59e0b', '#10b981', '#000000'].map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-5 h-5 rounded-full border-2 transition-transform ${
                      selectedColor === color ? 'border-gray-400 scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-5 h-5 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Size Slider */}
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">Size:</span>
              <input
                type="range"
                min="24"
                max="96"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-16"
              />
              <span className="text-xs text-gray-600 w-6">{fontSize}</span>
            </div>
          </div>
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
                    ? 'bg-violet-500 text-white'
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

      {/* Styles Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {filteredStyles.map(style => (
            <button
              key={style.id}
              onClick={() => handleSelect(style)}
              className="w-full group relative bg-white rounded-lg border hover:border-violet-300 hover:shadow-md transition-all p-4 text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">{style.name}</span>
                <Plus className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div 
                className="truncate"
                style={{
                  fontFamily: style.fontFamily,
                  fontWeight: style.fontWeight,
                  letterSpacing: style.letterSpacing,
                  color: selectedColor,
                  fontSize: `${Math.min(fontSize, 36)}px`,
                  textShadow: style.textShadow,
                  lineHeight: 1.2,
                }}
              >
                {customText || style.preview}
              </div>
            </button>
          ))}
        </div>

        {filteredStyles.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Type className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No alphabet styles found</p>
          </div>
        )}
      </div>
    </div>
  );
}

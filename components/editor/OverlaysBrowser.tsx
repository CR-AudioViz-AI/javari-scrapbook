'use client';

import React, { useState, useMemo } from 'react';
import { Search, Sparkles, Sun, Moon, Heart, Camera, Cloud, Snowflake, Leaf, Star } from 'lucide-react';

// Overlay categories with SVG-based overlays (no external dependencies)
const OVERLAY_CATEGORIES = {
  'light-leaks': {
    name: 'Light Leaks',
    icon: Sun,
    overlays: [
      { id: 'll-1', name: 'Golden Hour', gradient: 'linear-gradient(135deg, rgba(255,200,100,0.4) 0%, transparent 60%)' },
      { id: 'll-2', name: 'Sunset Flare', gradient: 'linear-gradient(45deg, rgba(255,100,50,0.3) 0%, rgba(255,200,100,0.2) 50%, transparent 100%)' },
      { id: 'll-3', name: 'Film Burn', gradient: 'radial-gradient(ellipse at 20% 80%, rgba(255,150,50,0.5) 0%, transparent 50%)' },
      { id: 'll-4', name: 'Vintage Leak', gradient: 'linear-gradient(180deg, rgba(255,220,180,0.3) 0%, transparent 40%, rgba(200,150,100,0.2) 100%)' },
      { id: 'll-5', name: 'Rainbow Prism', gradient: 'linear-gradient(120deg, rgba(255,0,0,0.2) 0%, rgba(255,165,0,0.2) 20%, rgba(255,255,0,0.2) 40%, rgba(0,255,0,0.2) 60%, rgba(0,0,255,0.2) 80%, rgba(128,0,128,0.2) 100%)' },
      { id: 'll-6', name: 'Warm Haze', gradient: 'radial-gradient(circle at 80% 20%, rgba(255,180,100,0.4) 0%, transparent 60%)' },
    ]
  },
  'bokeh': {
    name: 'Bokeh Effects',
    icon: Sparkles,
    overlays: [
      { id: 'bk-1', name: 'Soft Circles', pattern: 'bokeh-circles' },
      { id: 'bk-2', name: 'Heart Bokeh', pattern: 'bokeh-hearts' },
      { id: 'bk-3', name: 'Star Bokeh', pattern: 'bokeh-stars' },
      { id: 'bk-4', name: 'Diamond Sparkle', pattern: 'bokeh-diamonds' },
      { id: 'bk-5', name: 'Fairy Lights', pattern: 'bokeh-fairy' },
      { id: 'bk-6', name: 'City Lights', pattern: 'bokeh-city' },
    ]
  },
  'vignette': {
    name: 'Vignettes',
    icon: Camera,
    overlays: [
      { id: 'vg-1', name: 'Classic Dark', gradient: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)' },
      { id: 'vg-2', name: 'Soft Fade', gradient: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.3) 100%)' },
      { id: 'vg-3', name: 'Warm Vignette', gradient: 'radial-gradient(ellipse at center, transparent 40%, rgba(80,40,20,0.5) 100%)' },
      { id: 'vg-4', name: 'Cool Vignette', gradient: 'radial-gradient(ellipse at center, transparent 40%, rgba(20,40,80,0.5) 100%)' },
      { id: 'vg-5', name: 'Vintage Corner', gradient: 'radial-gradient(ellipse at center, transparent 30%, rgba(60,40,30,0.7) 100%)' },
      { id: 'vg-6', name: 'Dreamy White', gradient: 'radial-gradient(ellipse at center, transparent 50%, rgba(255,255,255,0.4) 100%)' },
    ]
  },
  'weather': {
    name: 'Weather Effects',
    icon: Cloud,
    overlays: [
      { id: 'wt-1', name: 'Rain Drops', pattern: 'weather-rain' },
      { id: 'wt-2', name: 'Snow Fall', pattern: 'weather-snow' },
      { id: 'wt-3', name: 'Fog Mist', gradient: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(200,200,200,0.3) 50%, transparent 100%)' },
      { id: 'wt-4', name: 'Frost', pattern: 'weather-frost' },
      { id: 'wt-5', name: 'Sunbeams', pattern: 'weather-sunbeams' },
      { id: 'wt-6', name: 'Storm Clouds', gradient: 'linear-gradient(180deg, rgba(50,50,70,0.6) 0%, rgba(80,80,100,0.3) 50%, transparent 100%)' },
    ]
  },
  'seasonal': {
    name: 'Seasonal',
    icon: Leaf,
    overlays: [
      { id: 'ss-1', name: 'Falling Leaves', pattern: 'seasonal-leaves' },
      { id: 'ss-2', name: 'Cherry Blossoms', pattern: 'seasonal-cherry' },
      { id: 'ss-3', name: 'Snowflakes', pattern: 'seasonal-snowflakes' },
      { id: 'ss-4', name: 'Confetti', pattern: 'seasonal-confetti' },
      { id: 'ss-5', name: 'Autumn Glow', gradient: 'linear-gradient(135deg, rgba(200,100,50,0.2) 0%, rgba(150,80,30,0.3) 100%)' },
      { id: 'ss-6', name: 'Spring Bloom', gradient: 'linear-gradient(135deg, rgba(255,200,220,0.3) 0%, rgba(200,255,200,0.2) 100%)' },
    ]
  },
  'grunge': {
    name: 'Grunge & Texture',
    icon: Moon,
    overlays: [
      { id: 'gr-1', name: 'Film Grain', pattern: 'grunge-grain' },
      { id: 'gr-2', name: 'Dust & Scratches', pattern: 'grunge-dust' },
      { id: 'gr-3', name: 'Paper Texture', pattern: 'grunge-paper' },
      { id: 'gr-4', name: 'Noise', pattern: 'grunge-noise' },
      { id: 'gr-5', name: 'Halftone', pattern: 'grunge-halftone' },
      { id: 'gr-6', name: 'Cracked Paint', pattern: 'grunge-cracked' },
    ]
  },
};

// SVG patterns for overlays that need patterns
const SVG_PATTERNS: Record<string, string> = {
  'bokeh-circles': `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><filter id="blur"><feGaussianBlur stdDeviation="2"/></filter></defs><circle cx="30" cy="40" r="15" fill="rgba(255,255,255,0.3)" filter="url(#blur)"/><circle cx="150" cy="30" r="20" fill="rgba(255,255,255,0.2)" filter="url(#blur)"/><circle cx="80" cy="120" r="25" fill="rgba(255,255,255,0.25)" filter="url(#blur)"/><circle cx="170" cy="150" r="18" fill="rgba(255,255,255,0.2)" filter="url(#blur)"/><circle cx="50" cy="180" r="12" fill="rgba(255,255,255,0.3)" filter="url(#blur)"/></svg>`,
  'bokeh-hearts': `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><filter id="blur2"><feGaussianBlur stdDeviation="1.5"/></filter></defs><text x="20" y="50" font-size="30" fill="rgba(255,100,150,0.4)" filter="url(#blur2)">♥</text><text x="120" y="80" font-size="25" fill="rgba(255,150,180,0.3)" filter="url(#blur2)">♥</text><text x="60" y="140" font-size="35" fill="rgba(255,120,160,0.35)" filter="url(#blur2)">♥</text><text x="150" y="170" font-size="20" fill="rgba(255,100,150,0.3)" filter="url(#blur2)">♥</text></svg>`,
  'bokeh-stars': `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><filter id="blur3"><feGaussianBlur stdDeviation="1"/></filter></defs><text x="20" y="40" font-size="25" fill="rgba(255,255,200,0.5)" filter="url(#blur3)">★</text><text x="100" y="60" font-size="20" fill="rgba(255,255,220,0.4)" filter="url(#blur3)">★</text><text x="160" y="100" font-size="30" fill="rgba(255,255,180,0.45)" filter="url(#blur3)">★</text><text x="50" y="150" font-size="22" fill="rgba(255,255,200,0.4)" filter="url(#blur3)">★</text><text x="130" y="180" font-size="18" fill="rgba(255,255,220,0.35)" filter="url(#blur3)">★</text></svg>`,
  'bokeh-diamonds': `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><filter id="blur4"><feGaussianBlur stdDeviation="1.5"/></filter></defs><text x="30" y="50" font-size="25" fill="rgba(200,220,255,0.4)" filter="url(#blur4)">◆</text><text x="120" y="70" font-size="20" fill="rgba(220,200,255,0.35)" filter="url(#blur4)">◆</text><text x="70" y="130" font-size="30" fill="rgba(200,255,220,0.4)" filter="url(#blur4)">◆</text><text x="160" y="160" font-size="22" fill="rgba(255,200,220,0.35)" filter="url(#blur4)">◆</text></svg>`,
  'bokeh-fairy': `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><filter id="glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><circle cx="30" cy="30" r="3" fill="rgba(255,255,200,0.8)" filter="url(#glow)"/><circle cx="80" cy="50" r="2" fill="rgba(255,255,220,0.7)" filter="url(#glow)"/><circle cx="150" cy="40" r="4" fill="rgba(255,255,180,0.8)" filter="url(#glow)"/><circle cx="40" cy="100" r="3" fill="rgba(255,255,200,0.7)" filter="url(#glow)"/><circle cx="120" cy="120" r="2" fill="rgba(255,255,220,0.8)" filter="url(#glow)"/><circle cx="180" cy="90" r="3" fill="rgba(255,255,200,0.7)" filter="url(#glow)"/><circle cx="60" cy="170" r="4" fill="rgba(255,255,180,0.8)" filter="url(#glow)"/><circle cx="140" cy="180" r="2" fill="rgba(255,255,220,0.7)" filter="url(#glow)"/></svg>`,
  'bokeh-city': `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><filter id="blur5"><feGaussianBlur stdDeviation="2"/></filter></defs><circle cx="20" cy="180" r="8" fill="rgba(255,200,100,0.5)" filter="url(#blur5)"/><circle cx="60" cy="170" r="10" fill="rgba(255,150,50,0.4)" filter="url(#blur5)"/><circle cx="100" cy="185" r="7" fill="rgba(200,255,200,0.4)" filter="url(#blur5)"/><circle cx="140" cy="175" r="9" fill="rgba(255,100,100,0.4)" filter="url(#blur5)"/><circle cx="180" cy="180" r="8" fill="rgba(100,200,255,0.4)" filter="url(#blur5)"/></svg>`,
  'weather-rain': `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><line x1="10" y1="0" x2="5" y2="30" stroke="rgba(150,200,255,0.3)" stroke-width="1"/><line x1="30" y1="10" x2="25" y2="40" stroke="rgba(150,200,255,0.25)" stroke-width="1"/><line x1="50" y1="5" x2="45" y2="35" stroke="rgba(150,200,255,0.3)" stroke-width="1"/><line x1="70" y1="15" x2="65" y2="45" stroke="rgba(150,200,255,0.25)" stroke-width="1"/><line x1="90" y1="0" x2="85" y2="30" stroke="rgba(150,200,255,0.3)" stroke-width="1"/><line x1="20" y1="50" x2="15" y2="80" stroke="rgba(150,200,255,0.25)" stroke-width="1"/><line x1="40" y1="55" x2="35" y2="85" stroke="rgba(150,200,255,0.3)" stroke-width="1"/><line x1="60" y1="45" x2="55" y2="75" stroke="rgba(150,200,255,0.25)" stroke-width="1"/><line x1="80" y1="60" x2="75" y2="90" stroke="rgba(150,200,255,0.3)" stroke-width="1"/></svg>`,
  'weather-snow': `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><text x="10" y="20" font-size="12" fill="rgba(255,255,255,0.6)">❄</text><text x="50" y="40" font-size="10" fill="rgba(255,255,255,0.5)">❄</text><text x="80" y="25" font-size="14" fill="rgba(255,255,255,0.55)">❄</text><text x="30" y="70" font-size="11" fill="rgba(255,255,255,0.5)">❄</text><text x="70" y="85" font-size="13" fill="rgba(255,255,255,0.6)">❄</text></svg>`,
  'weather-frost': `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><filter id="frost"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.3 0"/></filter></defs><rect width="200" height="200" filter="url(#frost)"/></svg>`,
  'weather-sunbeams': `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><linearGradient id="beam1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="rgba(255,255,200,0.4)"/><stop offset="100%" stop-color="transparent"/></linearGradient></defs><polygon points="0,0 80,200 0,200" fill="url(#beam1)"/><polygon points="50,0 150,200 70,200" fill="url(#beam1)" opacity="0.7"/><polygon points="120,0 200,150 200,200 140,200" fill="url(#beam1)" opacity="0.5"/></svg>`,
  'seasonal-leaves': `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><text x="20" y="30" font-size="20" fill="rgba(200,100,50,0.5)" transform="rotate(30,20,30)">🍂</text><text x="80" y="60" font-size="18" fill="rgba(180,80,30,0.4)" transform="rotate(-20,80,60)">🍁</text><text x="40" y="100" font-size="22" fill="rgba(220,120,40,0.45)" transform="rotate(45,40,100)">🍂</text><text x="110" y="130" font-size="16" fill="rgba(190,90,35,0.4)" transform="rotate(-10,110,130)">🍁</text></svg>`,
  'seasonal-cherry': `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><text x="20" y="40" font-size="18" fill="rgba(255,180,200,0.5)" transform="rotate(15,20,40)">🌸</text><text x="70" y="30" font-size="16" fill="rgba(255,200,210,0.4)" transform="rotate(-25,70,30)">🌸</text><text x="110" y="70" font-size="20" fill="rgba(255,170,190,0.45)" transform="rotate(30,110,70)">🌸</text><text x="50" y="110" font-size="14" fill="rgba(255,190,205,0.4)" transform="rotate(-15,50,110)">🌸</text><text x="100" y="130" font-size="17" fill="rgba(255,180,200,0.45)" transform="rotate(20,100,130)">🌸</text></svg>`,
  'seasonal-snowflakes': `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><text x="20" y="30" font-size="24" fill="rgba(200,220,255,0.5)">❄</text><text x="80" y="50" font-size="18" fill="rgba(180,200,255,0.4)">❄</text><text x="120" y="90" font-size="28" fill="rgba(210,230,255,0.45)">❄</text><text x="40" y="120" font-size="20" fill="rgba(190,210,255,0.4)">❄</text></svg>`,
  'seasonal-confetti': `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><rect x="20" y="30" width="8" height="3" fill="rgba(255,100,100,0.6)" transform="rotate(30,24,31)"/><rect x="60" y="20" width="6" height="3" fill="rgba(100,255,100,0.5)" transform="rotate(-45,63,21)"/><rect x="100" y="50" width="9" height="3" fill="rgba(100,100,255,0.6)" transform="rotate(60,104,51)"/><rect x="40" y="80" width="7" height="3" fill="rgba(255,255,100,0.5)" transform="rotate(-30,43,81)"/><rect x="80" y="100" width="8" height="3" fill="rgba(255,100,255,0.6)" transform="rotate(45,84,101)"/><rect x="120" y="120" width="6" height="3" fill="rgba(100,255,255,0.5)" transform="rotate(-60,123,121)"/></svg>`,
  'grunge-grain': `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="discrete" tableValues="0 0.1 0.1 0.1"/></feComponentTransfer></filter></defs><rect width="200" height="200" filter="url(#grain)"/></svg>`,
  'grunge-dust': `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><circle cx="30" cy="40" r="1" fill="rgba(255,255,255,0.3)"/><circle cx="80" cy="20" r="0.5" fill="rgba(255,255,255,0.2)"/><circle cx="150" cy="60" r="1.5" fill="rgba(255,255,255,0.25)"/><circle cx="40" cy="100" r="0.8" fill="rgba(255,255,255,0.2)"/><circle cx="120" cy="130" r="1" fill="rgba(255,255,255,0.3)"/><circle cx="180" cy="90" r="0.6" fill="rgba(255,255,255,0.2)"/><circle cx="60" cy="170" r="1.2" fill="rgba(255,255,255,0.25)"/><circle cx="140" cy="180" r="0.7" fill="rgba(255,255,255,0.2)"/><line x1="100" y1="80" x2="110" y2="82" stroke="rgba(255,255,255,0.15)" stroke-width="0.5"/><line x1="50" y1="140" x2="58" y2="138" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></svg>`,
  'grunge-paper': `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><filter id="paper"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5"/><feColorMatrix values="0 0 0 0 0.95 0 0 0 0 0.93 0 0 0 0 0.88 0 0 0 0.15 0"/></filter></defs><rect width="200" height="200" filter="url(#paper)"/></svg>`,
  'grunge-noise': `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><filter id="noise"><feTurbulence type="turbulence" baseFrequency="0.5" numOctaves="2"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.15"/></feComponentTransfer></filter></defs><rect width="200" height="200" filter="url(#noise)"/></svg>`,
  'grunge-halftone': `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><circle cx="10" cy="10" r="3" fill="rgba(0,0,0,0.1)"/></svg>`,
  'grunge-cracked': `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><path d="M0,100 Q50,80 100,100 T200,100" stroke="rgba(0,0,0,0.1)" fill="none" stroke-width="0.5"/><path d="M50,0 Q60,50 50,100 T60,200" stroke="rgba(0,0,0,0.08)" fill="none" stroke-width="0.5"/><path d="M150,0 Q140,60 150,120 T140,200" stroke="rgba(0,0,0,0.1)" fill="none" stroke-width="0.5"/></svg>`,
};

interface OverlaysBrowserProps {
  onSelectOverlay?: (overlay: { id: string; name: string; css: string; svg?: string }) => void;
}

export function OverlaysBrowser({ onSelectOverlay }: OverlaysBrowserProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('light-leaks');
  const [opacity, setOpacity] = useState(100);
  const [blendMode, setBlendMode] = useState<string>('normal');

  const blendModes = [
    'normal', 'multiply', 'screen', 'overlay', 'soft-light', 
    'hard-light', 'color-dodge', 'color-burn', 'difference'
  ];

  const filteredOverlays = useMemo(() => {
    const category = OVERLAY_CATEGORIES[selectedCategory as keyof typeof OVERLAY_CATEGORIES];
    if (!category) return [];
    
    if (!searchTerm) return category.overlays;
    
    return category.overlays.filter(overlay =>
      overlay.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [selectedCategory, searchTerm]);

  const getOverlayStyle = (overlay: { gradient?: string; pattern?: string }) => {
    if (overlay.gradient) {
      return { background: overlay.gradient };
    }
    if (overlay.pattern && SVG_PATTERNS[overlay.pattern]) {
      const svgEncoded = encodeURIComponent(SVG_PATTERNS[overlay.pattern]);
      return { backgroundImage: `url("data:image/svg+xml,${svgEncoded}")` };
    }
    return { background: 'rgba(128,128,128,0.3)' };
  };

  const handleSelectOverlay = (overlay: { id: string; name: string; gradient?: string; pattern?: string }) => {
    const style = getOverlayStyle(overlay);
    const css = overlay.gradient 
      ? overlay.gradient 
      : overlay.pattern && SVG_PATTERNS[overlay.pattern]
        ? `url("data:image/svg+xml,${encodeURIComponent(SVG_PATTERNS[overlay.pattern])}")`
        : '';
    
    onSelectOverlay?.({
      id: overlay.id,
      name: overlay.name,
      css,
      svg: overlay.pattern ? SVG_PATTERNS[overlay.pattern] : undefined
    });
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Header */}
      <div className="p-3 border-b border-gray-700">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          Photo Overlays
        </h3>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search overlays..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto p-2 gap-1 border-b border-gray-700">
        {Object.entries(OVERLAY_CATEGORIES).map(([key, category]) => {
          const Icon = category.icon;
          return (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
                selectedCategory === key
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {category.name}
            </button>
          );
        })}
      </div>

      {/* Controls */}
      <div className="p-3 border-b border-gray-700 space-y-2">
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-400 w-16">Opacity:</label>
          <input
            type="range"
            min="0"
            max="100"
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs text-gray-400 w-8">{opacity}%</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-400 w-16">Blend:</label>
          <select
            value={blendMode}
            onChange={(e) => setBlendMode(e.target.value)}
            className="flex-1 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs"
          >
            {blendModes.map(mode => (
              <option key={mode} value={mode}>{mode}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Overlay Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 gap-3">
          {filteredOverlays.map((overlay) => (
            <button
              key={overlay.id}
              onClick={() => handleSelectOverlay(overlay)}
              className="group relative aspect-square rounded-lg overflow-hidden border-2 border-gray-700 hover:border-purple-500 transition-colors"
            >
              {/* Preview background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500" />
              
              {/* Overlay effect */}
              <div
                className="absolute inset-0"
                style={{
                  ...getOverlayStyle(overlay),
                  opacity: opacity / 100,
                  mixBlendMode: blendMode as any,
                }}
              />
              
              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1">
                <p className="text-xs truncate">{overlay.name}</p>
              </div>
            </button>
          ))}
        </div>
        
        {filteredOverlays.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No overlays found
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-2 border-t border-gray-700 text-center text-xs text-gray-500">
        {Object.values(OVERLAY_CATEGORIES).reduce((acc, cat) => acc + cat.overlays.length, 0)} overlays • 6 categories • 100% Free
      </div>
    </div>
  );
}

export default OverlaysBrowser;

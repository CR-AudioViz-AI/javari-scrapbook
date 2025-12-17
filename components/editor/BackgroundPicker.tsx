'use client';

import { useState, useEffect } from 'react';
import { Loader2, Check, Palette, Image as ImageIcon, Sparkles } from 'lucide-react';

interface Background {
  id: string;
  name: string;
  category: string;
  css: string;
  description: string;
}

interface BackgroundPickerProps {
  currentBackground?: string;
  onSelectBackground: (background: { id: string; name: string; css: string }) => void;
}

const CATEGORIES = ['solid', 'gradients', 'pastels', 'textures', 'special'];

export default function BackgroundPicker({ currentBackground, onSelectBackground }: BackgroundPickerProps) {
  const [backgrounds, setBackgrounds] = useState<Background[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [selectedBg, setSelectedBg] = useState(currentBackground || '');
  const [customColor, setCustomColor] = useState('#ffffff');

  useEffect(() => {
    fetchBackgrounds();
  }, [category]);

  const fetchBackgrounds = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      
      const res = await fetch(`/api/backgrounds?${params}`);
      const data = await res.json();
      setBackgrounds(data.backgrounds || []);
    } catch (error) {
      console.error('Error fetching backgrounds:', error);
    }
    setLoading(false);
  };

  const handleSelectBackground = (bg: Background) => {
    setSelectedBg(bg.id);
    onSelectBackground({
      id: bg.id,
      name: bg.name,
      css: bg.css
    });
  };

  const handleCustomColor = () => {
    const customBg = {
      id: 'custom',
      name: 'Custom Color',
      css: `background: ${customColor};`
    };
    setSelectedBg('custom');
    onSelectBackground(customBg);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'solid': return '🎨';
      case 'gradients': return '🌈';
      case 'pastels': return '🍭';
      case 'textures': return '📄';
      case 'special': return '✨';
      default: return '🖼️';
    }
  };

  // Parse CSS to create preview style
  const parseBackgroundCSS = (css: string) => {
    const style: React.CSSProperties = {};
    const bgMatch = css.match(/background:\s*([^;]+)/);
    const bgImageMatch = css.match(/background-image:\s*([^;]+)/);
    
    if (bgMatch) {
      style.background = bgMatch[1];
    }
    if (bgImageMatch) {
      style.backgroundImage = bgImageMatch[1];
    }
    
    return style;
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-4 border-b space-y-3">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Page Background
        </h3>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory('')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
              category === '' ? 'bg-purple-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition flex items-center gap-1 ${
                category === cat ? 'bg-purple-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <span>{getCategoryIcon(cat)}</span>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Color Picker */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            className="w-10 h-10 rounded cursor-pointer"
          />
          <div className="flex-1">
            <p className="text-sm font-medium">Custom Color</p>
            <p className="text-xs text-gray-500">{customColor}</p>
          </div>
          <button
            onClick={handleCustomColor}
            className="px-3 py-1.5 bg-purple-600 text-white rounded text-sm font-medium hover:bg-purple-700"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Backgrounds Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {backgrounds.map((bg) => (
              <button
                key={bg.id}
                onClick={() => handleSelectBackground(bg)}
                className={`relative aspect-square rounded-lg border-2 transition overflow-hidden ${
                  selectedBg === bg.id
                    ? 'border-purple-600 ring-2 ring-purple-200'
                    : 'border-transparent hover:border-gray-300'
                }`}
                title={bg.description}
              >
                <div
                  className="absolute inset-0"
                  style={parseBackgroundCSS(bg.css)}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] py-1 px-1 text-center truncate">
                  {bg.name}
                </div>
                {selectedBg === bg.id && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t bg-gray-50 text-xs text-gray-500 text-center">
        {backgrounds.length} backgrounds • Click to apply
      </div>
    </div>
  );
}

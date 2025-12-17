'use client';

import { useState, useEffect } from 'react';
import { Loader2, Copy, Check, Shuffle, Palette, Lock, Unlock } from 'lucide-react';

interface ColorPalette {
  id: string;
  name: string;
  category: string;
  colors: string[];
  tags: string[];
}

interface ColorPalettePickerProps {
  onSelectColor: (color: string) => void;
  onSelectPalette?: (palette: { name: string; colors: string[] }) => void;
}

const CATEGORIES = ['popular', 'pastel', 'vibrant', 'earth', 'vintage', 'modern', 'nature', 'gradient'];

export default function ColorPalettePicker({ onSelectColor, onSelectPalette }: ColorPalettePickerProps) {
  const [palettes, setPalettes] = useState<ColorPalette[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [generatedPalette, setGeneratedPalette] = useState<string[]>([]);
  const [lockedColors, setLockedColors] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchPalettes();
  }, [category]);

  const fetchPalettes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      
      const res = await fetch(`/api/color-palettes?${params}`);
      const data = await res.json();
      setPalettes(data.palettes || []);
    } catch (error) {
      console.error('Error fetching palettes:', error);
    }
    setLoading(false);
  };

  const generateRandomPalette = async () => {
    try {
      const res = await fetch('/api/color-palettes?generate=random');
      const data = await res.json();
      if (data.palette?.colors) {
        // Keep locked colors, replace others
        const newColors = data.palette.colors.map((color: string, i: number) => 
          lockedColors.has(i) && generatedPalette[i] ? generatedPalette[i] : color
        );
        setGeneratedPalette(newColors);
      }
    } catch (error) {
      console.error('Error generating palette:', error);
    }
  };

  const handleCopyColor = async (color: string) => {
    await navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const toggleLock = (index: number) => {
    const newLocked = new Set(lockedColors);
    if (newLocked.has(index)) {
      newLocked.delete(index);
    } else {
      newLocked.add(index);
    }
    setLockedColors(newLocked);
  };

  const ColorSwatch = ({ color, size = 'md', showCopy = true }: { color: string; size?: 'sm' | 'md' | 'lg'; showCopy?: boolean }) => {
    const sizeClasses = {
      sm: 'w-6 h-6',
      md: 'w-10 h-10',
      lg: 'w-12 h-12'
    };

    return (
      <button
        onClick={() => {
          onSelectColor(color);
          if (showCopy) handleCopyColor(color);
        }}
        className={`${sizeClasses[size]} rounded-lg border border-gray-200 relative group transition hover:scale-110 hover:shadow-lg`}
        style={{ backgroundColor: color }}
        title={color}
      >
        {showCopy && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 rounded-lg transition">
            {copiedColor === color ? (
              <Check className="w-4 h-4 text-white" />
            ) : (
              <Copy className="w-4 h-4 text-white" />
            )}
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-4 border-b space-y-3">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Color Palettes
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
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition ${
                category === cat ? 'bg-purple-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Generator */}
      <div className="p-4 border-b bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Palette Generator</span>
          <button
            onClick={generateRandomPalette}
            className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
          >
            <Shuffle className="w-4 h-4" />
            Generate
          </button>
        </div>
        
        {generatedPalette.length > 0 ? (
          <div className="flex gap-2">
            {generatedPalette.map((color, i) => (
              <div key={i} className="flex-1 relative group">
                <button
                  onClick={() => onSelectColor(color)}
                  className="w-full aspect-square rounded-lg border border-gray-200 hover:scale-105 transition"
                  style={{ backgroundColor: color }}
                />
                <button
                  onClick={() => toggleLock(i)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full border shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  {lockedColors.has(i) ? (
                    <Lock className="w-3 h-3 text-purple-600" />
                  ) : (
                    <Unlock className="w-3 h-3 text-gray-400" />
                  )}
                </button>
                <p className="text-[10px] text-center text-gray-500 mt-1">{color}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex-1 aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                <span className="text-gray-400 text-xs">?</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Palettes Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
          </div>
        ) : palettes.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No palettes found</p>
        ) : (
          <div className="space-y-4">
            {palettes.map((palette) => (
              <div
                key={palette.id}
                className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                onClick={() => onSelectPalette?.({ name: palette.name, colors: palette.colors })}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{palette.name}</span>
                  <span className="text-xs text-gray-500 capitalize">{palette.category}</span>
                </div>
                <div className="flex gap-1">
                  {palette.colors.map((color, i) => (
                    <ColorSwatch key={i} color={color} size="lg" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t bg-gray-50 text-xs text-gray-500 text-center">
        {palettes.length} palettes • Click color to select
      </div>
    </div>
  );
}

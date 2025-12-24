// components/editor/ColorPaletteGenerator.tsx
// AI-Powered Color Palette Generator with Photo Extraction
// Timestamp: Tuesday, December 24, 2025 – 2:50 PM Eastern Time
// CR AudioViz AI - "Your Story. Our Design"

'use client';

import React, { useState, useCallback, useRef } from 'react';
import { 
  Palette, 
  Upload, 
  RefreshCw, 
  Copy, 
  Check, 
  Sparkles,
  Image,
  Wand2,
  Lock,
  Unlock,
  Plus,
  Minus,
  Download,
  Heart
} from 'lucide-react';

interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
  category: string;
  tags: string[];
}

interface ColorPaletteGeneratorProps {
  onSelectPalette?: (colors: string[]) => void;
  onApplyColor?: (color: string) => void;
}

// Curated palettes for scrapbooking
const CURATED_PALETTES: ColorPalette[] = [
  // Pastels
  { id: 'pastel-dreams', name: 'Pastel Dreams', colors: ['#FDF2F8', '#FBCFE8', '#A7F3D0', '#FDE68A', '#BFDBFE'], category: 'pastel', tags: ['soft', 'baby', 'spring'] },
  { id: 'cotton-candy', name: 'Cotton Candy', colors: ['#FDF4FF', '#F5D0FE', '#E9D5FF', '#C4B5FD', '#A5B4FC'], category: 'pastel', tags: ['pink', 'purple', 'sweet'] },
  { id: 'mint-blush', name: 'Mint & Blush', colors: ['#D1FAE5', '#A7F3D0', '#FDF2F8', '#FBCFE8', '#F9A8D4'], category: 'pastel', tags: ['green', 'pink', 'fresh'] },
  
  // Warm
  { id: 'autumn-harvest', name: 'Autumn Harvest', colors: ['#FEF3C7', '#FDE68A', '#F59E0B', '#DC2626', '#7C2D12'], category: 'warm', tags: ['fall', 'orange', 'cozy'] },
  { id: 'sunset-glow', name: 'Sunset Glow', colors: ['#FEF3C7', '#FDBA74', '#F97316', '#EA580C', '#9A3412'], category: 'warm', tags: ['orange', 'sunset', 'warm'] },
  { id: 'terracotta', name: 'Terracotta', colors: ['#FEF7ED', '#FDDEC0', '#E19C65', '#C27B4A', '#92400E'], category: 'warm', tags: ['earth', 'rust', 'boho'] },
  
  // Cool
  { id: 'ocean-breeze', name: 'Ocean Breeze', colors: ['#F0F9FF', '#BAE6FD', '#38BDF8', '#0284C7', '#075985'], category: 'cool', tags: ['blue', 'sea', 'calm'] },
  { id: 'northern-lights', name: 'Northern Lights', colors: ['#F0FDFA', '#99F6E4', '#2DD4BF', '#0891B2', '#164E63'], category: 'cool', tags: ['teal', 'aurora', 'magical'] },
  { id: 'lavender-fields', name: 'Lavender Fields', colors: ['#FAF5FF', '#E9D5FF', '#C084FC', '#9333EA', '#6B21A8'], category: 'cool', tags: ['purple', 'lavender', 'elegant'] },
  
  // Neutral
  { id: 'warm-neutrals', name: 'Warm Neutrals', colors: ['#FAF5F0', '#E7DDD4', '#C4B5A3', '#A39282', '#736357'], category: 'neutral', tags: ['beige', 'cream', 'natural'] },
  { id: 'cool-grays', name: 'Cool Grays', colors: ['#F8FAFC', '#E2E8F0', '#94A3B8', '#64748B', '#334155'], category: 'neutral', tags: ['gray', 'modern', 'minimal'] },
  { id: 'black-white', name: 'Black & White', colors: ['#FFFFFF', '#F3F4F6', '#9CA3AF', '#4B5563', '#111827'], category: 'neutral', tags: ['monochrome', 'classic', 'elegant'] },
  
  // Vintage
  { id: 'vintage-rose', name: 'Vintage Rose', colors: ['#FDF2F8', '#E8C4C4', '#CE9393', '#9E6363', '#6B4242'], category: 'vintage', tags: ['rose', 'dusty', 'romantic'] },
  { id: 'retro-pop', name: 'Retro Pop', colors: ['#FEF3C7', '#F97316', '#DC2626', '#0891B2', '#1E3A8A'], category: 'vintage', tags: ['70s', 'bold', 'fun'] },
  { id: 'sepia-tones', name: 'Sepia Tones', colors: ['#FEF7ED', '#E8DCCC', '#C9B896', '#A09070', '#6B5B4B'], category: 'vintage', tags: ['old', 'photo', 'antique'] },
  
  // Holiday
  { id: 'christmas-classic', name: 'Christmas Classic', colors: ['#DC2626', '#166534', '#FCD34D', '#FAFAFA', '#1F2937'], category: 'holiday', tags: ['christmas', 'festive', 'red'] },
  { id: 'valentine-love', name: 'Valentine Love', colors: ['#FDF2F8', '#FBCFE8', '#F472B6', '#DB2777', '#BE123C'], category: 'holiday', tags: ['valentine', 'love', 'pink'] },
  { id: 'easter-spring', name: 'Easter Spring', colors: ['#FDF4FF', '#F5D0FE', '#A7F3D0', '#FDE68A', '#93C5FD'], category: 'holiday', tags: ['easter', 'pastel', 'spring'] },
  { id: 'halloween-spooky', name: 'Halloween Spooky', colors: ['#1F2937', '#F97316', '#7C3AED', '#84CC16', '#FAFAFA'], category: 'holiday', tags: ['halloween', 'orange', 'spooky'] },
  
  // Nature
  { id: 'forest-green', name: 'Forest Green', colors: ['#F0FDF4', '#BBF7D0', '#4ADE80', '#16A34A', '#14532D'], category: 'nature', tags: ['green', 'forest', 'natural'] },
  { id: 'desert-sand', name: 'Desert Sand', colors: ['#FEF7ED', '#FDE68A', '#D4A574', '#92400E', '#451A03'], category: 'nature', tags: ['sand', 'desert', 'warm'] },
  { id: 'ocean-depths', name: 'Ocean Depths', colors: ['#F0F9FF', '#7DD3FC', '#0EA5E9', '#0369A1', '#0C4A6E'], category: 'nature', tags: ['ocean', 'blue', 'deep'] },
];

// Category filter options
const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'pastel', name: 'Pastel' },
  { id: 'warm', name: 'Warm' },
  { id: 'cool', name: 'Cool' },
  { id: 'neutral', name: 'Neutral' },
  { id: 'vintage', name: 'Vintage' },
  { id: 'holiday', name: 'Holiday' },
  { id: 'nature', name: 'Nature' },
];

export default function ColorPaletteGenerator({ onSelectPalette, onApplyColor }: ColorPaletteGeneratorProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [customPalette, setCustomPalette] = useState<string[]>(['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#3B82F6']);
  const [lockedColors, setLockedColors] = useState<boolean[]>([false, false, false, false, false]);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [savedPalettes, setSavedPalettes] = useState<string[][]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter palettes
  const filteredPalettes = CURATED_PALETTES.filter(
    p => selectedCategory === 'all' || p.category === selectedCategory
  );

  // Generate random color
  const generateRandomColor = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  };

  // Generate new palette (preserving locked colors)
  const generateNewPalette = () => {
    setCustomPalette(prev => 
      prev.map((color, i) => lockedColors[i] ? color : generateRandomColor())
    );
  };

  // Toggle lock on a color
  const toggleLock = (index: number) => {
    setLockedColors(prev => {
      const newLocks = [...prev];
      newLocks[index] = !newLocks[index];
      return newLocks;
    });
  };

  // Copy color to clipboard
  const copyColor = async (color: string) => {
    await navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  // Extract colors from image
  const extractColorsFromImage = useCallback(async (file: File) => {
    setIsExtracting(true);
    
    try {
      // Create image element
      const img = document.createElement('img');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          canvas.width = 100;
          canvas.height = 100;
          ctx?.drawImage(img, 0, 0, 100, 100);
          
          // Get image data
          const imageData = ctx?.getImageData(0, 0, 100, 100).data;
          if (!imageData) {
            reject(new Error('Failed to get image data'));
            return;
          }
          
          // Simple color extraction (sample pixels)
          const colors: { [key: string]: number } = {};
          for (let i = 0; i < imageData.length; i += 40) { // Sample every 10th pixel
            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];
            
            // Quantize colors
            const qr = Math.round(r / 32) * 32;
            const qg = Math.round(g / 32) * 32;
            const qb = Math.round(b / 32) * 32;
            
            const hex = `#${qr.toString(16).padStart(2, '0')}${qg.toString(16).padStart(2, '0')}${qb.toString(16).padStart(2, '0')}`;
            colors[hex] = (colors[hex] || 0) + 1;
          }
          
          // Get top 5 colors
          const sortedColors = Object.entries(colors)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([color]) => color);
          
          // Ensure we have 5 colors
          while (sortedColors.length < 5) {
            sortedColors.push(generateRandomColor());
          }
          
          setCustomPalette(sortedColors);
          setLockedColors([false, false, false, false, false]);
          resolve();
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
      });
    } catch (error) {
      console.error('Color extraction failed:', error);
    } finally {
      setIsExtracting(false);
    }
  }, []);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      extractColorsFromImage(file);
    }
  };

  // Save current palette
  const savePalette = () => {
    setSavedPalettes(prev => [...prev, [...customPalette]]);
  };

  // Add/remove color from custom palette
  const addColor = () => {
    if (customPalette.length < 8) {
      setCustomPalette(prev => [...prev, generateRandomColor()]);
      setLockedColors(prev => [...prev, false]);
    }
  };

  const removeColor = (index: number) => {
    if (customPalette.length > 3) {
      setCustomPalette(prev => prev.filter((_, i) => i !== index));
      setLockedColors(prev => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-violet-50 to-fuchsia-50">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Color Palettes</h3>
            <p className="text-xs text-gray-500">Generate & extract colors</p>
          </div>
        </div>
      </div>

      {/* Custom Palette Generator */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Custom Palette</span>
          <div className="flex gap-1">
            <button
              onClick={addColor}
              disabled={customPalette.length >= 8}
              className="p-1.5 hover:bg-gray-200 rounded disabled:opacity-50"
              title="Add color"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={generateNewPalette}
              className="p-1.5 hover:bg-gray-200 rounded"
              title="Generate new"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 hover:bg-gray-200 rounded"
              title="Extract from image"
            >
              <Image className="w-4 h-4" />
            </button>
            <button
              onClick={savePalette}
              className="p-1.5 hover:bg-gray-200 rounded"
              title="Save palette"
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Custom Colors */}
        <div className="flex gap-2 mb-3">
          {customPalette.map((color, index) => (
            <div key={index} className="flex-1 relative group">
              <button
                onClick={() => onApplyColor?.(color)}
                className="w-full aspect-square rounded-lg shadow-sm transition-transform hover:scale-105"
                style={{ backgroundColor: color }}
              />
              <div className="absolute -top-1 -right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => toggleLock(index)}
                  className="p-1 bg-white rounded shadow-sm"
                  title={lockedColors[index] ? 'Unlock' : 'Lock'}
                >
                  {lockedColors[index] ? (
                    <Lock className="w-3 h-3 text-gray-600" />
                  ) : (
                    <Unlock className="w-3 h-3 text-gray-400" />
                  )}
                </button>
                <button
                  onClick={() => copyColor(color)}
                  className="p-1 bg-white rounded shadow-sm"
                  title="Copy"
                >
                  {copiedColor === color ? (
                    <Check className="w-3 h-3 text-green-500" />
                  ) : (
                    <Copy className="w-3 h-3 text-gray-400" />
                  )}
                </button>
                {customPalette.length > 3 && (
                  <button
                    onClick={() => removeColor(index)}
                    className="p-1 bg-white rounded shadow-sm"
                    title="Remove"
                  >
                    <Minus className="w-3 h-3 text-gray-400" />
                  </button>
                )}
              </div>
              <input
                type="color"
                value={color}
                onChange={(e) => {
                  const newPalette = [...customPalette];
                  newPalette[index] = e.target.value;
                  setCustomPalette(newPalette);
                }}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          ))}
        </div>

        {/* Apply Palette Button */}
        <button
          onClick={() => onSelectPalette?.(customPalette)}
          className="w-full py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-medium rounded-lg hover:from-violet-600 hover:to-fuchsia-600 transition-all"
        >
          Apply Palette
        </button>

        {isExtracting && (
          <div className="mt-2 text-center text-xs text-gray-500">
            <Sparkles className="w-4 h-4 inline mr-1 animate-pulse" />
            Extracting colors...
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="p-2 border-b overflow-x-auto">
        <div className="flex gap-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-violet-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Curated Palettes */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {filteredPalettes.map(palette => (
            <button
              key={palette.id}
              onClick={() => onSelectPalette?.(palette.colors)}
              className="w-full bg-white rounded-lg border hover:border-violet-300 hover:shadow-md transition-all overflow-hidden"
            >
              {/* Color Strip */}
              <div className="h-12 flex">
                {palette.colors.map((color, i) => (
                  <div key={i} className="flex-1" style={{ backgroundColor: color }} />
                ))}
              </div>
              
              {/* Info */}
              <div className="p-3 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{palette.name}</h4>
                  <div className="flex gap-1 mt-1">
                    {palette.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] text-gray-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <Wand2 className="w-4 h-4 text-gray-400" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Saved Palettes */}
      {savedPalettes.length > 0 && (
        <div className="p-4 border-t bg-gray-50">
          <h4 className="text-xs font-medium text-gray-500 mb-2">Saved Palettes</h4>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {savedPalettes.map((palette, idx) => (
              <button
                key={idx}
                onClick={() => onSelectPalette?.(palette)}
                className="flex-shrink-0 flex rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {palette.map((color, i) => (
                  <div key={i} className="w-6 h-8" style={{ backgroundColor: color }} />
                ))}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

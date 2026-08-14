'use client';

// javari Scrapbook - Gradients Browser Component
// Browse and apply 100+ beautiful gradients to backgrounds

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrapbookStore } from '@/lib/store';
import { 
  Search, Loader2, Check, ChevronDown, Sparkles, Sun, Moon, 
  Waves, Leaf, Palette, Zap, Moon as MoonIcon, Star, Gift
} from 'lucide-react';

interface Gradient {
  id: string;
  name: string;
  category: string;
  colors: string[];
  angle: number;
  css: string;
  premium: boolean;
}

const categoryIcons: Record<string, React.ReactNode> = {
  sunrise: <Sun className="w-4 h-4" />,
  sunset: <Moon className="w-4 h-4" />,
  ocean: <Waves className="w-4 h-4" />,
  nature: <Leaf className="w-4 h-4" />,
  pastel: <Palette className="w-4 h-4" />,
  neon: <Zap className="w-4 h-4" />,
  dark: <MoonIcon className="w-4 h-4" />,
  metallic: <Star className="w-4 h-4" />,
  seasonal: <Gift className="w-4 h-4" />,
};

export function GradientsBrowser() {
  const [gradients, setGradients] = useState<Gradient[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGradient, setSelectedGradient] = useState<string | null>(null);
  const [customAngle, setCustomAngle] = useState(135);
  
  const { updatePageBackground, getCurrentPage } = useScrapbookStore();
  const currentPage = getCurrentPage();

  useEffect(() => {
    const loadGradients = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/gradients');
        const data = await res.json();
        setGradients(data.gradients || []);
        setCategories(data.categories || []);
      } catch (err) {
        console.error('Failed to load gradients:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadGradients();
  }, []);

  const handleGradientSelect = useCallback((gradient: Gradient) => {
    setSelectedGradient(gradient.id);
    
    // Parse colors from gradient
    const colors = gradient.colors.map((color, index) => ({
      color,
      position: (index / (gradient.colors.length - 1)) * 100,
    }));
    
    updatePageBackground({
      backgroundType: 'gradient',
      gradient: {
        type: 'linear',
        angle: gradient.angle,
        colors,
      },
    });
  }, [updatePageBackground]);

  const handleCustomGradient = useCallback(() => {
    // Create a custom gradient with current selections
    updatePageBackground({
      backgroundType: 'gradient',
      gradient: {
        type: 'linear',
        angle: customAngle,
        colors: [
          { color: '#6366f1', position: 0 },
          { color: '#ec4899', position: 100 },
        ],
      },
    });
  }, [customAngle, updatePageBackground]);

  // Filter gradients
  const filteredGradients = gradients.filter(g => {
    const matchesCategory = !selectedCategory || g.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-2" />
        <p className="text-sm text-gray-500">Loading gradients...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Gradients</h3>
          <span className="ml-auto text-xs text-gray-500">{filteredGradients.length} available</span>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search gradients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg border-0 focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>
      
      {/* Categories */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-2 py-1 text-xs rounded-full transition-colors ${
              !selectedCategory 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-1 text-xs rounded-full capitalize flex items-center gap-1 transition-colors ${
                selectedCategory === cat 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {categoryIcons[cat]}
              {cat}
            </button>
          ))}
        </div>
      </div>
      
      {/* Custom Angle Control */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <label className="text-xs text-gray-500 dark:text-gray-400 block mb-2">
          Gradient Angle: {customAngle}°
        </label>
        <input
          type="range"
          min="0"
          max="360"
          value={customAngle}
          onChange={(e) => setCustomAngle(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
      </div>
      
      {/* Gradient Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          <AnimatePresence mode="popLayout">
            {filteredGradients.map((gradient) => (
              <motion.button
                key={gradient.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleGradientSelect(gradient)}
                className={`relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm border-2 transition-all ${
                  selectedGradient === gradient.id 
                    ? 'border-purple-500 ring-2 ring-purple-500/30' 
                    : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                style={{ background: gradient.css }}
              >
                {/* Selected indicator */}
                {selectedGradient === gradient.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                
                {/* Premium badge */}
                {gradient.premium && (
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-yellow-500 text-white text-[10px] font-bold rounded">
                    PRO
                  </div>
                )}
                
                {/* Name overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <p className="text-white text-xs font-medium truncate">{gradient.name}</p>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
        
        {filteredGradients.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">No gradients found</p>
          </div>
        )}
      </div>
      
      {/* Color Swatches for Selected */}
      {selectedGradient && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Colors in this gradient:</p>
          <div className="flex gap-2">
            {gradients.find(g => g.id === selectedGradient)?.colors.map((color, i) => (
              <div key={i} className="flex flex-col items-center">
                <div 
                  className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                  onClick={() => navigator.clipboard.writeText(color)}
                />
                <span className="text-[10px] text-gray-400 mt-1">{color}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default GradientsBrowser;

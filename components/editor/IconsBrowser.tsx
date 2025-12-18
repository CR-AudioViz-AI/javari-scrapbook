'use client';

// CRAV Scrapbook - Icons Browser Component
// Browse 170+ free SVG icons for scrapbook embellishments

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrapbookStore, createStickerElement } from '@/lib/store';
import { 
  Search, Loader2, Download, Check, Palette,
  ArrowRight, Shapes, MessageCircle, Cloud, Leaf, Paw, Gift, Plane, Coffee, Camera, Users
} from 'lucide-react';

interface Icon {
  id: string;
  name: string;
  category: string;
  tags: string[];
  preview: string;
}

const categoryIcons: Record<string, React.ReactNode> = {
  arrows: <ArrowRight className="w-4 h-4" />,
  shapes: <Shapes className="w-4 h-4" />,
  communication: <MessageCircle className="w-4 h-4" />,
  weather: <Cloud className="w-4 h-4" />,
  nature: <Leaf className="w-4 h-4" />,
  animals: <Paw className="w-4 h-4" />,
  celebration: <Gift className="w-4 h-4" />,
  travel: <Plane className="w-4 h-4" />,
  food: <Coffee className="w-4 h-4" />,
  media: <Camera className="w-4 h-4" />,
  social: <Users className="w-4 h-4" />,
};

export function IconsBrowser() {
  const [icons, setIcons] = useState<Icon[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [iconColor, setIconColor] = useState('6366f1');
  const [iconSize, setIconSize] = useState(48);
  
  const { addElement, getCurrentPage } = useScrapbookStore();
  const currentPage = getCurrentPage();

  useEffect(() => {
    const loadIcons = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/icons?color=${iconColor}`);
        const data = await res.json();
        setIcons(data.icons || []);
        setCategories(data.categories || []);
      } catch (err) {
        console.error('Failed to load icons:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadIcons();
  }, [iconColor]);

  const handleIconSelect = useCallback((icon: Icon) => {
    const page = useScrapbookStore.getState().getCurrentPage();
    if (!page) {
      alert('Please wait for the editor to load.');
      return;
    }
    
    // Add icon as a sticker element
    const iconUrl = `/api/icons?id=${icon.id}&color=${iconColor}&size=${iconSize}`;
    addElement(createStickerElement(
      icon.id,
      iconUrl,
      icon.category,
      { x: page.width / 2 - iconSize / 2, y: page.height / 2 - iconSize / 2 },
      { width: iconSize, height: iconSize }
    ));
  }, [addElement, iconColor, iconSize]);

  // Filter icons
  const filteredIcons = icons.filter(icon => {
    const matchesCategory = !selectedCategory || icon.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      icon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      icon.tags.some(tag => tag.includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Preset colors
  const presetColors = [
    { name: 'Indigo', hex: '6366f1' },
    { name: 'Pink', hex: 'ec4899' },
    { name: 'Red', hex: 'ef4444' },
    { name: 'Orange', hex: 'f97316' },
    { name: 'Yellow', hex: 'eab308' },
    { name: 'Green', hex: '22c55e' },
    { name: 'Teal', hex: '14b8a6' },
    { name: 'Blue', hex: '3b82f6' },
    { name: 'Purple', hex: 'a855f7' },
    { name: 'Gray', hex: '6b7280' },
    { name: 'Black', hex: '000000' },
    { name: 'White', hex: 'ffffff' },
  ];

  if (isLoading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-2" />
        <p className="text-sm text-gray-500">Loading icons...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <Shapes className="w-5 h-5 text-indigo-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Icons</h3>
          <span className="ml-auto text-xs text-gray-500">{filteredIcons.length} available</span>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search icons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg border-0 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      
      {/* Color & Size Controls */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 space-y-3">
        {/* Color picker */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Palette className="w-3 h-3" />
              Icon Color
            </label>
            <input
              type="text"
              value={`#${iconColor}`}
              onChange={(e) => setIconColor(e.target.value.replace('#', ''))}
              className="w-20 text-xs text-right bg-transparent border-0 focus:ring-0"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {presetColors.map(color => (
              <button
                key={color.hex}
                onClick={() => setIconColor(color.hex)}
                className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                  iconColor === color.hex ? 'border-indigo-500 scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: `#${color.hex}` }}
                title={color.name}
              />
            ))}
          </div>
        </div>
        
        {/* Size slider */}
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
            Size: {iconSize}px
          </label>
          <input
            type="range"
            min="24"
            max="128"
            value={iconSize}
            onChange={(e) => setIconSize(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
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
                ? 'bg-indigo-500 text-white' 
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
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {categoryIcons[cat]}
              {cat}
            </button>
          ))}
        </div>
      </div>
      
      {/* Icons Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-5 gap-2">
          <AnimatePresence mode="popLayout">
            {filteredIcons.map((icon) => (
              <motion.button
                key={icon.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleIconSelect(icon)}
                className="aspect-square bg-gray-50 dark:bg-gray-800 rounded-lg p-2 cursor-pointer hover:ring-2 hover:ring-indigo-500 flex items-center justify-center group relative"
                title={icon.name}
              >
                <img
                  src={`/api/icons?id=${icon.id}&color=${iconColor}&size=32`}
                  alt={icon.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%23${iconColor}"/></svg>`;
                  }}
                />
                
                {/* Tooltip */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {icon.name}
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
        
        {filteredIcons.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">No icons found</p>
            <p className="text-gray-400 text-xs mt-1">Try a different search term</p>
          </div>
        )}
      </div>
      
      {/* Preview */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Click any icon to add it to your scrapbook
        </p>
      </div>
    </div>
  );
}

export default IconsBrowser;

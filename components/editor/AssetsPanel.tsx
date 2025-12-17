'use client';

// CRAV Scrapbook - Enhanced Assets Panel
// Integrates with all free APIs: shapes, stickers, filters, frames, backgrounds, patterns, etc.

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrapbookStore, createStickerElement, createPhotoElement, createShapeElement } from '@/lib/store';
import { 
  Image, Sticker, Frame, Palette, LayoutTemplate, Search, ChevronRight, ChevronLeft,
  Sparkles, Heart, PartyPopper, Cake, Baby, Plane, Flower2, TreePine, X, 
  Loader2, RefreshCw, Shapes, Filter, QrCode, User, Grid, Type, Upload
} from 'lucide-react';

type AssetTab = 'uploads' | 'shapes' | 'stickers' | 'filters' | 'frames' | 'backgrounds' | 'patterns' | 'palettes' | 'text-effects';

interface ApiShape {
  id: string;
  name: string;
  category: string;
  preview: string;
}

interface ApiSticker {
  id: string;
  name: string;
  emoji: string;
  category: string;
}

interface ApiFilter {
  id: string;
  name: string;
  category: string;
  css: string;
}

interface ApiBackground {
  id: string;
  name: string;
  type: string;
  value: string;
  category: string;
}

interface ApiPattern {
  id: string;
  name: string;
  category: string;
}

interface ApiPalette {
  id: string;
  name: string;
  colors: string[];
  category: string;
}

export function AssetsPanel() {
  const [activeTab, setActiveTab] = useState<AssetTab>('uploads');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userUploads, setUserUploads] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // API Data
  const [shapes, setShapes] = useState<ApiShape[]>([]);
  const [shapeCategories, setShapeCategories] = useState<string[]>([]);
  const [stickers, setStickers] = useState<ApiSticker[]>([]);
  const [stickerCategories, setStickerCategories] = useState<string[]>([]);
  const [filters, setFilters] = useState<ApiFilter[]>([]);
  const [filterCategories, setFilterCategories] = useState<string[]>([]);
  const [backgrounds, setBackgrounds] = useState<ApiBackground[]>([]);
  const [backgroundCategories, setBackgroundCategories] = useState<string[]>([]);
  const [patterns, setPatterns] = useState<ApiPattern[]>([]);
  const [patternCategories, setPatternCategories] = useState<string[]>([]);
  const [palettes, setPalettes] = useState<ApiPalette[]>([]);
  const [paletteCategories, setPaletteCategories] = useState<string[]>([]);
  
  const { addElement, updatePageBackground, getCurrentPage, scrapbook } = useScrapbookStore();
  const currentPage = getCurrentPage();
  const isEditorReady = !!scrapbook && !!currentPage;

  // Load data when tab changes
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        switch (activeTab) {
          case 'shapes':
            if (shapes.length === 0) {
              const res = await fetch('/api/shapes');
              const data = await res.json();
              setShapes(data.shapes || []);
              setShapeCategories(data.categories || []);
            }
            break;
          case 'stickers':
            if (stickers.length === 0) {
              const res = await fetch('/api/stickers');
              const data = await res.json();
              setStickers(data.stickers || []);
              setStickerCategories(data.categories || []);
            }
            break;
          case 'filters':
            if (filters.length === 0) {
              const res = await fetch('/api/filters');
              const data = await res.json();
              setFilters(data.filters || []);
              setFilterCategories(data.categories || []);
            }
            break;
          case 'backgrounds':
            if (backgrounds.length === 0) {
              const res = await fetch('/api/backgrounds');
              const data = await res.json();
              setBackgrounds(data.backgrounds || []);
              setBackgroundCategories(data.categories || []);
            }
            break;
          case 'patterns':
            if (patterns.length === 0) {
              const res = await fetch('/api/patterns');
              const data = await res.json();
              setPatterns(data.patterns || []);
              setPatternCategories(data.categories || []);
            }
            break;
          case 'palettes':
            if (palettes.length === 0) {
              const res = await fetch('/api/color-palettes');
              const data = await res.json();
              setPalettes(data.palettes || []);
              setPaletteCategories(data.categories || []);
            }
            break;
        }
      } catch (err) {
        console.error(`Failed to load ${activeTab}:`, err);
        setError(`Failed to load ${activeTab}. Please try again.`);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (activeTab !== 'uploads') {
      loadData();
    }
  }, [activeTab, shapes.length, stickers.length, filters.length, backgrounds.length, patterns.length, palettes.length]);

  const handleUserUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => { 
        const result = event.target?.result as string;
        if (result) {
          setUserUploads((prev) => [...prev, result]); 
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  }, []);

  const handleAddUpload = useCallback((src: string) => {
    const page = useScrapbookStore.getState().getCurrentPage();
    if (!page) {
      alert('Please wait for the editor to load.');
      return;
    }
    
    const img = new window.Image();
    img.onload = () => {
      const maxW = page.width * 0.5;
      const maxH = page.height * 0.5;
      let w = img.width;
      let h = img.height;
      if (w > maxW) { h = (maxW / w) * h; w = maxW; }
      if (h > maxH) { w = (maxH / h) * w; h = maxH; }
      addElement(createPhotoElement(src, { x: page.width / 2 - w / 2, y: page.height / 2 - h / 2 }, { width: w, height: h }));
    };
    img.src = src;
  }, [addElement]);

  const handleAddShape = useCallback((shape: ApiShape) => {
    const page = useScrapbookStore.getState().getCurrentPage();
    if (!page) {
      alert('Please wait for the editor to load.');
      return;
    }
    
    // For now, add as a basic shape - later we can render SVG from API
    const shapeType = shape.id.includes('circle') ? 'circle' : 
                      shape.id.includes('triangle') ? 'triangle' :
                      shape.id.includes('star') ? 'star' :
                      shape.id.includes('heart') ? 'heart' : 'rectangle';
    
    addElement(createShapeElement(shapeType as any, { x: page.width / 2 - 50, y: page.height / 2 - 50 }, { width: 100, height: 100 }));
  }, [addElement]);

  const handleAddSticker = useCallback((sticker: ApiSticker) => {
    const page = useScrapbookStore.getState().getCurrentPage();
    if (!page) {
      alert('Please wait for the editor to load.');
      return;
    }
    
    // Create a text element with the emoji for now
    // Later we can use proper sticker images
    addElement(createStickerElement(
      sticker.id, 
      sticker.emoji, // Using emoji as src for now
      sticker.category,
      { x: page.width / 2 - 40, y: page.height / 2 - 40 }, 
      { width: 80, height: 80 }
    ));
  }, [addElement]);

  const handleBackgroundSelect = useCallback((bg: ApiBackground) => {
    if (bg.type === 'solid') {
      updatePageBackground({ backgroundType: 'solid', color: bg.value });
    } else if (bg.type === 'gradient') {
      // Parse gradient colors
      const colors = bg.value.match(/#[a-fA-F0-9]{6}/g) || ['#ffffff', '#000000'];
      updatePageBackground({ 
        backgroundType: 'gradient', 
        gradient: { 
          type: 'linear', 
          angle: 135, 
          colors: colors.map((c, i) => ({ color: c, position: (i / (colors.length - 1)) * 100 }))
        } 
      });
    }
  }, [updatePageBackground]);

  const tabs = [
    { id: 'uploads' as AssetTab, label: 'Uploads', icon: <Upload className="w-4 h-4" /> },
    { id: 'shapes' as AssetTab, label: 'Shapes', icon: <Shapes className="w-4 h-4" /> },
    { id: 'stickers' as AssetTab, label: 'Stickers', icon: <Sticker className="w-4 h-4" /> },
    { id: 'backgrounds' as AssetTab, label: 'Backgrounds', icon: <Palette className="w-4 h-4" /> },
    { id: 'patterns' as AssetTab, label: 'Patterns', icon: <Grid className="w-4 h-4" /> },
    { id: 'palettes' as AssetTab, label: 'Colors', icon: <Palette className="w-4 h-4" /> },
  ];

  // Filter items by search query
  const filterBySearch = <T extends { name: string }>(items: T[]): T[] => {
    if (!searchQuery) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(item => item.name.toLowerCase().includes(query));
  };

  // Filter items by category
  const filterByCategory = <T extends { category: string }>(items: T[]): T[] => {
    if (!selectedCategory) return items;
    return items.filter(item => item.category === selectedCategory);
  };

  const filteredShapes = filterBySearch(filterByCategory(shapes));
  const filteredStickers = filterBySearch(filterByCategory(stickers));
  const filteredBackgrounds = filterBySearch(filterByCategory(backgrounds));
  const filteredPatterns = filterBySearch(filterByCategory(patterns));
  const filteredPalettes = filterBySearch(filterByCategory(palettes));

  return (
    <div className="w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        {tabs.map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => { setActiveTab(tab.id); setSelectedCategory(null); }}
            className={`flex-1 flex flex-col items-center justify-center py-3 px-2 text-xs font-medium transition-colors min-w-[60px] ${
              activeTab === tab.id 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon}
            <span className="mt-1">{tab.label}</span>
          </button>
        ))}
      </div>
      
      {/* Search */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder={`Search ${activeTab}...`} 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg border-0 focus:ring-2 focus:ring-blue-500" 
          />
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
            <p className="text-sm text-gray-500">Loading {activeTab}...</p>
          </div>
        )}
        
        {/* Error State */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <X className="w-8 h-8 text-red-500 mb-2" />
            <p className="text-sm text-red-500 text-center mb-2">{error}</p>
            <button 
              onClick={() => { setError(null); setActiveTab(activeTab); }}
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Try again
            </button>
          </div>
        )}
        
        {!isLoading && !error && (
          <AnimatePresence mode="wait">
            {/* Uploads Tab */}
            {activeTab === 'uploads' && (
              <motion.div key="uploads" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <label className="block w-full p-8 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-blue-500 mb-4 transition-colors">
                  <input type="file" accept="image/*" multiple onChange={handleUserUpload} className="hidden" />
                  <Image className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Drop images here or click to upload</p>
                </label>
                
                {userUploads.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {userUploads.map((src, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, scale: 0.8 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 group" 
                        onClick={() => handleAddUpload(src)}
                      >
                        <img src={src} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
                        <button 
                          onClick={(e) => { e.stopPropagation(); setUserUploads((prev) => prev.filter((_, idx) => idx !== i)); }} 
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-medium">Click to add</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
                
                {userUploads.length === 0 && (
                  <p className="text-center text-sm text-gray-400 mt-4">
                    No uploads yet. Add some photos to get started!
                  </p>
                )}
              </motion.div>
            )}
            
            {/* Shapes Tab */}
            {activeTab === 'shapes' && (
              <motion.div key="shapes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {/* Category filter */}
                {shapeCategories.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    <button 
                      onClick={() => setSelectedCategory(null)}
                      className={`px-2 py-1 text-xs rounded ${!selectedCategory ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      All
                    </button>
                    {shapeCategories.map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-2 py-1 text-xs rounded capitalize ${selectedCategory === cat ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
                
                <div className="grid grid-cols-4 gap-2">
                  {filteredShapes.map((shape) => (
                    <motion.button
                      key={shape.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddShape(shape)}
                      className="aspect-square bg-gray-50 dark:bg-gray-800 rounded-lg p-2 cursor-pointer hover:ring-2 hover:ring-blue-500 flex items-center justify-center"
                      title={shape.name}
                    >
                      <img 
                        src={`/api/shapes?id=${shape.id}&color=6366f1`} 
                        alt={shape.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          // Fallback to placeholder
                          (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%236366f1"><rect width="24" height="24" rx="4"/></svg>`;
                        }}
                      />
                    </motion.button>
                  ))}
                </div>
                
                {filteredShapes.length === 0 && (
                  <p className="text-center text-sm text-gray-400 mt-4">
                    No shapes found. Try a different search or category.
                  </p>
                )}
              </motion.div>
            )}
            
            {/* Stickers Tab */}
            {activeTab === 'stickers' && (
              <motion.div key="stickers" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {/* Category filter */}
                {stickerCategories.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    <button 
                      onClick={() => setSelectedCategory(null)}
                      className={`px-2 py-1 text-xs rounded ${!selectedCategory ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      All
                    </button>
                    {stickerCategories.slice(0, 8).map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-2 py-1 text-xs rounded capitalize ${selectedCategory === cat ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
                
                <div className="grid grid-cols-5 gap-2">
                  {filteredStickers.map((sticker) => (
                    <motion.button
                      key={sticker.id}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleAddSticker(sticker)}
                      className="aspect-square bg-gray-50 dark:bg-gray-800 rounded-lg p-1 cursor-pointer hover:ring-2 hover:ring-blue-500 flex items-center justify-center text-2xl"
                      title={sticker.name}
                    >
                      {sticker.emoji}
                    </motion.button>
                  ))}
                </div>
                
                {filteredStickers.length === 0 && (
                  <p className="text-center text-sm text-gray-400 mt-4">
                    No stickers found. Try a different search or category.
                  </p>
                )}
              </motion.div>
            )}
            
            {/* Backgrounds Tab */}
            {activeTab === 'backgrounds' && (
              <motion.div key="backgrounds" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {/* Category filter */}
                {backgroundCategories.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    <button 
                      onClick={() => setSelectedCategory(null)}
                      className={`px-2 py-1 text-xs rounded ${!selectedCategory ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      All
                    </button>
                    {backgroundCategories.map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-2 py-1 text-xs rounded capitalize ${selectedCategory === cat ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
                
                <div className="grid grid-cols-3 gap-2">
                  {filteredBackgrounds.map((bg) => (
                    <motion.button
                      key={bg.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleBackgroundSelect(bg)}
                      className="aspect-square rounded-lg cursor-pointer hover:ring-2 hover:ring-blue-500 border border-gray-200"
                      style={{ background: bg.value }}
                      title={bg.name}
                    />
                  ))}
                </div>
                
                {filteredBackgrounds.length === 0 && (
                  <p className="text-center text-sm text-gray-400 mt-4">
                    No backgrounds found. Try a different search or category.
                  </p>
                )}
              </motion.div>
            )}
            
            {/* Patterns Tab */}
            {activeTab === 'patterns' && (
              <motion.div key="patterns" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {patternCategories.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    <button 
                      onClick={() => setSelectedCategory(null)}
                      className={`px-2 py-1 text-xs rounded ${!selectedCategory ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      All
                    </button>
                    {patternCategories.map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-2 py-1 text-xs rounded capitalize ${selectedCategory === cat ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
                
                <div className="grid grid-cols-3 gap-2">
                  {filteredPatterns.map((pattern) => (
                    <motion.button
                      key={pattern.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        // Apply pattern as background
                        updatePageBackground({ 
                          backgroundType: 'pattern' as any, 
                          patternId: pattern.id 
                        });
                      }}
                      className="aspect-square rounded-lg cursor-pointer hover:ring-2 hover:ring-blue-500 border border-gray-200 overflow-hidden"
                      title={pattern.name}
                    >
                      <img 
                        src={`/api/patterns?id=${pattern.id}&color=6366f1&bg=ffffff`}
                        alt={pattern.name}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Palettes Tab */}
            {activeTab === 'palettes' && (
              <motion.div key="palettes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="space-y-3">
                  {filteredPalettes.map((palette) => (
                    <motion.div
                      key={palette.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 cursor-pointer hover:ring-2 hover:ring-blue-500"
                    >
                      <p className="text-xs font-medium mb-2 truncate">{palette.name}</p>
                      <div className="flex rounded overflow-hidden">
                        {palette.colors.map((color, i) => (
                          <div 
                            key={i}
                            className="flex-1 h-8 cursor-pointer hover:scale-y-110 transition-transform"
                            style={{ backgroundColor: color }}
                            title={color}
                            onClick={() => {
                              // Copy color to clipboard
                              navigator.clipboard.writeText(color);
                            }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export default AssetsPanel;

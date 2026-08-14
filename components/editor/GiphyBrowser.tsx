'use client';

// javari Scrapbook - Giphy Browser
// Browse GIFs and animated stickers from Giphy API
// FIX: Made onClose/onSelect optional with default auto-add behavior
// Timestamp: Tuesday, December 17, 2025 – 10:15 PM Eastern Time

import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useScrapbookStore, createPhotoElement } from '@/lib/store';
import { 
  Search, X, Loader2, Smile, TrendingUp, 
  Sparkles, Heart, Zap, PartyPopper, Star
} from 'lucide-react';

// Props are now optional
export interface GiphyBrowserProps {
  onClose?: () => void;
  onSelect?: (gifUrl: string, metadata?: GifMetadata) => void;
  isModal?: boolean;
}

interface GifMetadata {
  id: string;
  url: string;
  title: string;
  width: number;
  height: number;
}

interface GifItem {
  id: string;
  url: string;
  preview: string;
  title: string;
  width: number;
  height: number;
}

// Curated free GIFs (placeholder URLs - would be from Giphy API)
const TRENDING_GIFS: GifItem[] = [
  { id: 'g1', url: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif', preview: 'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/200w.gif', title: 'Celebration', width: 480, height: 270 },
  { id: 'g2', url: 'https://media.giphy.com/media/3o7TKoWXm3okO1kgHC/giphy.gif', preview: 'https://media.giphy.com/media/3o7TKoWXm3okO1kgHC/200w.gif', title: 'Party', width: 480, height: 360 },
  { id: 'g3', url: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif', preview: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/200w.gif', title: 'Confetti', width: 480, height: 480 },
  { id: 'g4', url: 'https://media.giphy.com/media/xT5LMHxhOfscxPfIfm/giphy.gif', preview: 'https://media.giphy.com/media/xT5LMHxhOfscxPfIfm/200w.gif', title: 'Applause', width: 480, height: 270 },
  { id: 'g5', url: 'https://media.giphy.com/media/3oEjHV0z8S7WM4MwnK/giphy.gif', preview: 'https://media.giphy.com/media/3oEjHV0z8S7WM4MwnK/200w.gif', title: 'Fireworks', width: 480, height: 270 },
  { id: 'g6', url: 'https://media.giphy.com/media/l4pTfx2qLszoacZRS/giphy.gif', preview: 'https://media.giphy.com/media/l4pTfx2qLszoacZRS/200w.gif', title: 'Thumbs Up', width: 480, height: 360 },
  { id: 'g7', url: 'https://media.giphy.com/media/xUPGcguWZHRC2HyBRS/giphy.gif', preview: 'https://media.giphy.com/media/xUPGcguWZHRC2HyBRS/200w.gif', title: 'High Five', width: 480, height: 384 },
  { id: 'g8', url: 'https://media.giphy.com/media/3oKIPf3C7HqqYBVcCk/giphy.gif', preview: 'https://media.giphy.com/media/3oKIPf3C7HqqYBVcCk/200w.gif', title: 'Heart', width: 480, height: 360 },
  { id: 'g9', url: 'https://media.giphy.com/media/26BRBKqUiq586bRVm/giphy.gif', preview: 'https://media.giphy.com/media/26BRBKqUiq586bRVm/200w.gif', title: 'Stars', width: 480, height: 294 },
  { id: 'g10', url: 'https://media.giphy.com/media/l0HlvtIPzPdt2usKs/giphy.gif', preview: 'https://media.giphy.com/media/l0HlvtIPzPdt2usKs/200w.gif', title: 'Rainbow', width: 480, height: 360 },
  { id: 'g11', url: 'https://media.giphy.com/media/26gsjCZpPolPr3sBy/giphy.gif', preview: 'https://media.giphy.com/media/26gsjCZpPolPr3sBy/200w.gif', title: 'Dancing', width: 480, height: 352 },
  { id: 'g12', url: 'https://media.giphy.com/media/26uf2JHNV0Tq3ugkE/giphy.gif', preview: 'https://media.giphy.com/media/26uf2JHNV0Tq3ugkE/200w.gif', title: 'Sparkle', width: 480, height: 270 },
];

const CATEGORIES = [
  { id: 'trending', label: 'Trending', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'reactions', label: 'Reactions', icon: <Smile className="w-4 h-4" /> },
  { id: 'celebration', label: 'Celebrate', icon: <PartyPopper className="w-4 h-4" /> },
  { id: 'love', label: 'Love', icon: <Heart className="w-4 h-4" /> },
  { id: 'stickers', label: 'Stickers', icon: <Star className="w-4 h-4" /> },
];

export function GiphyBrowser({ onClose, onSelect, isModal = false }: GiphyBrowserProps) {
  const [gifs, setGifs] = useState<GifItem[]>(TRENDING_GIFS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('trending');
  
  const { addElement } = useScrapbookStore();

  // Default handler - adds GIF directly to canvas
  const handleAddToCanvas = useCallback((gif: GifItem) => {
    const page = useScrapbookStore.getState().getCurrentPage();
    if (!page) {
      alert('Please wait for the editor to load.');
      return;
    }
    
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const maxW = page.width * 0.4;
      const maxH = page.height * 0.4;
      let w = gif.width;
      let h = gif.height;
      if (w > maxW) { h = (maxW / w) * h; w = maxW; }
      if (h > maxH) { w = (maxH / h) * w; h = maxH; }
      
      addElement(createPhotoElement(
        gif.url, 
        { x: page.width / 2 - w / 2, y: page.height / 2 - h / 2 }, 
        { width: w, height: h }
      ));
    };
    img.src = gif.url;
  }, [addElement]);

  // Handle GIF selection
  const handleGifSelect = useCallback((gif: GifItem) => {
    if (onSelect) {
      onSelect(gif.url, {
        id: gif.id,
        url: gif.url,
        title: gif.title,
        width: gif.width,
        height: gif.height
      });
    } else {
      handleAddToCanvas(gif);
    }
  }, [onSelect, handleAddToCanvas]);

  // Search handler
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setGifs(TRENDING_GIFS);
      return;
    }
    
    setLoading(true);
    try {
      // API call would go here
      // For now, filter existing GIFs
      const filtered = TRENDING_GIFS.filter(g => 
        g.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setGifs(filtered.length > 0 ? filtered : TRENDING_GIFS);
    } finally {
      setLoading(false);
    }
  };

  const containerClasses = isModal 
    ? 'fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4'
    : 'h-full flex flex-col';

  const panelClasses = isModal
    ? 'bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col'
    : 'flex flex-col h-full';

  return (
    <div className={containerClasses}>
      <div className={panelClasses}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Smile className="w-5 h-5 text-purple-500" />
              <h2 className="font-semibold text-gray-900 dark:text-white">GIFs & Stickers</h2>
              <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">FREE</span>
            </div>
            {isModal && onClose && (
              <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {/* Search */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search GIFs..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg border-0 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 text-sm font-medium"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
            </button>
          </div>

          {/* Categories */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* GIF Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-2" />
              <p className="text-sm text-gray-500">Searching GIFs...</p>
            </div>
          ) : gifs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Smile className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-500">No GIFs found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {gifs.map((gif) => (
                <motion.div
                  key={gif.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer"
                  onClick={() => handleGifSelect(gif)}
                >
                  <img
                    src={gif.preview}
                    alt={gif.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-medium bg-purple-500 px-3 py-1.5 rounded-full shadow-lg transition-opacity">
                      Click to add
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
            Powered by <Zap className="w-3 h-3 text-yellow-500" /> GIPHY
          </p>
        </div>
      </div>
    </div>
  );
}

export default GiphyBrowser;

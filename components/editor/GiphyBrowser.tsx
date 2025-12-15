'use client';

// components/editor/GiphyBrowser.tsx
// Browse Giphy stickers and GIFs

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2, Sparkles, TrendingUp, Smile, Heart, Star, PartyPopper, Cake, Gift, Sun, Cloud, Music, Ghost, Dog, Cat } from 'lucide-react';

interface GiphyItem {
  id: string;
  url: string;
  thumbUrl: string;
  fullUrl: string;
  webpUrl?: string;
  width: number;
  height: number;
  title: string;
}

interface GiphyBrowserProps {
  onClose: () => void;
  onSelect: (url: string) => void;
  type?: 'stickers' | 'gifs';
}

const STICKER_CATEGORIES = [
  { id: 'trending', name: 'Trending', icon: TrendingUp },
  { id: 'happy', name: 'Happy', icon: Smile },
  { id: 'love', name: 'Love', icon: Heart },
  { id: 'celebrate', name: 'Celebrate', icon: PartyPopper },
  { id: 'birthday', name: 'Birthday', icon: Cake },
  { id: 'thank you', name: 'Thanks', icon: Gift },
  { id: 'good morning', name: 'Morning', icon: Sun },
  { id: 'weather', name: 'Weather', icon: Cloud },
  { id: 'music', name: 'Music', icon: Music },
  { id: 'spooky', name: 'Spooky', icon: Ghost },
  { id: 'dogs', name: 'Dogs', icon: Dog },
  { id: 'cats', name: 'Cats', icon: Cat },
];

export function GiphyBrowser({ onClose, onSelect, type = 'stickers' }: GiphyBrowserProps) {
  const [items, setItems] = useState<GiphyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('trending');

  const fetchItems = useCallback(async (searchQuery: string) => {
    setLoading(true);
    try {
      const endpoint = searchQuery === 'trending' 
        ? '/api/stock/gifs'
        : `/api/stock/gifs?query=${encodeURIComponent(searchQuery)}&type=${type}`;

      const response = await fetch(endpoint, {
        method: searchQuery === 'trending' ? 'POST' : 'GET',
        headers: searchQuery === 'trending' ? { 'Content-Type': 'application/json' } : {},
        body: searchQuery === 'trending' ? JSON.stringify({ type, limit: 30 }) : undefined
      });

      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      console.error('Failed to fetch stickers:', error);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchItems(activeCategory);
  }, [activeCategory, fetchItems]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setActiveCategory('');
      fetchItems(query);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    setQuery('');
    fetchItems(categoryId);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-cyan-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {type === 'stickers' ? 'Stickers' : 'GIFs'}
              </h2>
              <p className="text-sm text-gray-500">Powered by GIPHY</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${type}...`}
                className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-green-400 to-cyan-500 text-white rounded-xl font-medium hover:opacity-90"
            >
              Search
            </button>
          </form>

          {/* Categories */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {STICKER_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-green-400 to-cyan-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-green-500" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Sparkles className="w-16 h-16 mb-4 opacity-50" />
              <p>No {type} found. Try a different search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {items.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    onSelect(item.webpUrl || item.url);
                    onClose();
                  }}
                  className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 hover:ring-4 hover:ring-green-500/50 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={item.thumbUrl}
                    alt={item.title}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center">
          <a
            href="https://giphy.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
          >
            <img src="https://giphy.com/static/img/giphy_logo_square_social.png" alt="GIPHY" className="w-5 h-5" />
            Powered by GIPHY
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

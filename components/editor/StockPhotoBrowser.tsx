'use client';

// components/editor/StockPhotoBrowser.tsx
// Browse and add free stock photos from Unsplash, Pexels, Pixabay

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Download, ExternalLink, Loader2, Image as ImageIcon, Filter, ChevronDown } from 'lucide-react';
import { useScrapbookStore } from '@/lib/store';

interface StockPhoto {
  id: string;
  source: 'unsplash' | 'pexels' | 'pixabay';
  url: string;
  thumbUrl: string;
  fullUrl: string;
  width: number;
  height: number;
  description: string;
  photographer: string;
  photographerUrl: string;
  color: string | null;
}

interface StockPhotoBrowserProps {
  onClose: () => void;
  onSelect: (url: string) => void;
}

const CATEGORIES = [
  'Scrapbook', 'Family', 'Nature', 'Travel', 'Food', 'Flowers',
  'Birthday', 'Wedding', 'Baby', 'Pets', 'Beach', 'Mountains',
  'City', 'Vintage', 'Abstract', 'Patterns', 'Textures'
];

export function StockPhotoBrowser({ onClose, onSelect }: StockPhotoBrowserProps) {
  const [photos, setPhotos] = useState<StockPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('scrapbook');
  const [source, setSource] = useState<'all' | 'unsplash' | 'pexels' | 'pixabay'>('all');
  const [orientation, setOrientation] = useState<'all' | 'portrait' | 'landscape' | 'square'>('all');
  const [page, setPage] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState<StockPhoto | null>(null);

  const searchPhotos = useCallback(async (searchQuery: string, pageNum: number = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        query: searchQuery,
        source,
        orientation,
        page: pageNum.toString(),
        per_page: '30'
      });

      const response = await fetch(`/api/stock/photos?${params}`);
      const data = await response.json();

      if (pageNum === 1) {
        setPhotos(data.photos || []);
      } else {
        setPhotos(prev => [...prev, ...(data.photos || [])]);
      }
    } catch (error) {
      console.error('Failed to fetch photos:', error);
    } finally {
      setLoading(false);
    }
  }, [source, orientation]);

  useEffect(() => {
    searchPhotos(query);
  }, [query, source, orientation, searchPhotos]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    searchPhotos(query, 1);
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    searchPhotos(query, nextPage);
  };

  const handleSelect = (photo: StockPhoto) => {
    setSelectedPhoto(photo);
  };

  const confirmSelect = () => {
    if (selectedPhoto) {
      onSelect(selectedPhoto.url);
      onClose();
    }
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
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Free Stock Photos</h2>
              <p className="text-sm text-gray-500">Powered by Unsplash, Pexels & Pixabay</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search millions of free photos..."
                className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:opacity-90 transition"
            >
              Search
            </button>
          </form>

          {/* Quick Categories */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.slice(0, 10).map(cat => (
              <button
                key={cat}
                onClick={() => { setQuery(cat.toLowerCase()); setPage(1); }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  query.toLowerCase() === cat.toLowerCase()
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as any)}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm"
            >
              <option value="all">All Sources</option>
              <option value="unsplash">Unsplash</option>
              <option value="pexels">Pexels</option>
              <option value="pixabay">Pixabay</option>
            </select>

            <select
              value={orientation}
              onChange={(e) => setOrientation(e.target.value as any)}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm"
            >
              <option value="all">All Orientations</option>
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
              <option value="square">Square</option>
            </select>
          </div>
        </div>

        {/* Photo Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading && photos.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : photos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
              <p>No photos found. Try a different search term.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((photo) => (
                  <motion.div
                    key={photo.id}
                    layoutId={photo.id}
                    onClick={() => handleSelect(photo)}
                    className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer group ${
                      selectedPhoto?.id === photo.id ? 'ring-4 ring-blue-500' : ''
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <img
                      src={photo.thumbUrl}
                      alt={photo.description || 'Stock photo'}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white text-sm font-medium truncate">{photo.photographer}</p>
                        <p className="text-white/70 text-xs capitalize">{photo.source}</p>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 rounded text-xs text-white capitalize opacity-0 group-hover:opacity-100 transition">
                      {photo.source}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Load More */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Load More Photos
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer with selected photo */}
        {selectedPhoto && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center gap-4">
              <img
                src={selectedPhoto.thumbUrl}
                alt=""
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{selectedPhoto.photographer}</p>
                <p className="text-sm text-gray-500">
                  {selectedPhoto.width} × {selectedPhoto.height} • {selectedPhoto.source}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <a
                href={selectedPhoto.photographerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Credit
              </a>
              <button
                onClick={confirmSelect}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:opacity-90 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Add to Scrapbook
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

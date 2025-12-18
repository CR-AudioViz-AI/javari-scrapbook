'use client';

// CRAV Scrapbook - Stock Photo Browser
// Browse free stock photos from Unsplash/Pexels APIs
// FIX: Made onClose/onSelect optional with default auto-add behavior
// Timestamp: Tuesday, December 17, 2025 – 10:10 PM Eastern Time

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrapbookStore, createPhotoElement } from '@/lib/store';
import { 
  Search, X, Loader2, ImageIcon, Download, 
  Heart, ExternalLink, RefreshCw, AlertCircle 
} from 'lucide-react';

// Props are now optional - component works standalone or as modal
export interface StockPhotoBrowserProps {
  onClose?: () => void;
  onSelect?: (imageUrl: string, metadata?: PhotoMetadata) => void;
  isModal?: boolean;
}

interface PhotoMetadata {
  id: string;
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  photographer?: string;
  photographerUrl?: string;
  source: 'unsplash' | 'pexels';
  alt?: string;
}

interface Photo {
  id: string;
  src: {
    original: string;
    large: string;
    medium: string;
    small: string;
    tiny: string;
  };
  width: number;
  height: number;
  photographer: string;
  photographer_url: string;
  alt: string;
}

// Free stock photo sources - curated collection
const CURATED_PHOTOS: Photo[] = [
  // Nature & Landscapes
  { id: 'n1', src: { original: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200', large: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800', medium: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400', small: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200', tiny: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=100' }, width: 1200, height: 800, photographer: 'Bailey Zindel', photographer_url: '#', alt: 'Mountain landscape' },
  { id: 'n2', src: { original: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200', large: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800', medium: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400', small: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200', tiny: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=100' }, width: 1200, height: 800, photographer: 'David Marcu', photographer_url: '#', alt: 'Forest sunrise' },
  { id: 'n3', src: { original: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1200', large: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800', medium: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400', small: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=200', tiny: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=100' }, width: 1200, height: 800, photographer: 'Sergei Akulich', photographer_url: '#', alt: 'Lake reflection' },
  { id: 'n4', src: { original: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1200', large: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800', medium: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400', small: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=200', tiny: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=100' }, width: 1200, height: 900, photographer: 'Luca Bravo', photographer_url: '#', alt: 'Waterfall' },
  { id: 'n5', src: { original: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200', large: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800', medium: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400', small: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=200', tiny: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=100' }, width: 1200, height: 800, photographer: 'Foggy morning', photographer_url: '#', alt: 'Foggy hills' },
  // Abstract & Textures
  { id: 'a1', src: { original: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1200', large: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800', medium: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400', small: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=200', tiny: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=100' }, width: 1200, height: 800, photographer: 'Gradienta', photographer_url: '#', alt: 'Gradient abstract' },
  { id: 'a2', src: { original: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1200', large: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800', medium: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400', small: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=200', tiny: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=100' }, width: 1200, height: 800, photographer: 'Milad Fakurian', photographer_url: '#', alt: 'Abstract waves' },
  { id: 'a3', src: { original: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200', large: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800', medium: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400', small: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=200', tiny: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=100' }, width: 1200, height: 800, photographer: 'Gradienta', photographer_url: '#', alt: 'Colorful gradient' },
  // People & Lifestyle
  { id: 'p1', src: { original: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200', large: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800', medium: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400', small: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200', tiny: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=100' }, width: 1200, height: 800, photographer: 'Helena Lopes', photographer_url: '#', alt: 'Friends laughing' },
  { id: 'p2', src: { original: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200', large: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800', medium: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400', small: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200', tiny: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=100' }, width: 1200, height: 800, photographer: 'Brooke Cagle', photographer_url: '#', alt: 'Team collaboration' },
  // Food & Drinks
  { id: 'f1', src: { original: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200', large: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', medium: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400', small: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200', tiny: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100' }, width: 1200, height: 800, photographer: 'Lily Banse', photographer_url: '#', alt: 'Gourmet food' },
  { id: 'f2', src: { original: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=1200', large: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800', medium: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=400', small: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=200', tiny: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=100' }, width: 1200, height: 800, photographer: 'Brooke Lark', photographer_url: '#', alt: 'Healthy breakfast' },
  // Technology
  { id: 't1', src: { original: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200', large: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800', medium: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400', small: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200', tiny: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100' }, width: 1200, height: 800, photographer: 'Alexandre Debiève', photographer_url: '#', alt: 'Circuit board' },
  { id: 't2', src: { original: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200', large: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800', medium: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400', small: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=200', tiny: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=100' }, width: 1200, height: 800, photographer: 'Adi Goldstein', photographer_url: '#', alt: 'Cybersecurity' },
  // Travel & Architecture
  { id: 'tr1', src: { original: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1200', large: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800', medium: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400', small: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=200', tiny: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=100' }, width: 1200, height: 800, photographer: 'Anthony DELANOIX', photographer_url: '#', alt: 'Paris Eiffel Tower' },
  { id: 'tr2', src: { original: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=1200', large: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=800', medium: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=400', small: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=200', tiny: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=100' }, width: 1200, height: 800, photographer: 'Eva Dang', photographer_url: '#', alt: 'London Big Ben' },
];

const CATEGORIES = ['All', 'Nature', 'Abstract', 'People', 'Food', 'Technology', 'Travel'];

export function StockPhotoBrowser({ onClose, onSelect, isModal = false }: StockPhotoBrowserProps) {
  const [photos, setPhotos] = useState<Photo[]>(CURATED_PHOTOS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  
  const { addElement } = useScrapbookStore();

  // Filter photos based on search and category
  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.alt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || photo.alt.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  // Default handler - adds photo directly to canvas
  const handleAddToCanvas = useCallback((photo: Photo) => {
    const page = useScrapbookStore.getState().getCurrentPage();
    if (!page) {
      alert('Please wait for the editor to load.');
      return;
    }
    
    const imageUrl = photo.src.large;
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const maxW = page.width * 0.6;
      const maxH = page.height * 0.6;
      let w = img.width;
      let h = img.height;
      if (w > maxW) { h = (maxW / w) * h; w = maxW; }
      if (h > maxH) { w = (maxH / h) * w; h = maxH; }
      
      addElement(createPhotoElement(
        imageUrl, 
        { x: page.width / 2 - w / 2, y: page.height / 2 - h / 2 }, 
        { width: w, height: h }
      ));
    };
    img.onerror = () => {
      alert('Failed to load image. Please try another.');
    };
    img.src = imageUrl;
  }, [addElement]);

  // Handle photo selection - use custom handler or default
  const handlePhotoSelect = useCallback((photo: Photo) => {
    if (onSelect) {
      onSelect(photo.src.large, {
        id: photo.id,
        url: photo.src.large,
        thumbnailUrl: photo.src.small,
        width: photo.width,
        height: photo.height,
        photographer: photo.photographer,
        photographerUrl: photo.photographer_url,
        source: 'unsplash',
        alt: photo.alt
      });
    } else {
      // Default: add directly to canvas
      handleAddToCanvas(photo);
    }
  }, [onSelect, handleAddToCanvas]);

  const toggleFavorite = (photoId: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(photoId)) {
        next.delete(photoId);
      } else {
        next.add(photoId);
      }
      return next;
    });
  };

  // Search via API (placeholder - would connect to Unsplash/Pexels)
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setPhotos(CURATED_PHOTOS);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // API call would go here
      // For now, filter curated photos
      const results = CURATED_PHOTOS.filter(p => 
        p.alt.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setPhotos(results.length > 0 ? results : CURATED_PHOTOS);
    } catch (err) {
      setError('Failed to search photos. Showing curated collection.');
      setPhotos(CURATED_PHOTOS);
    } finally {
      setLoading(false);
    }
  };

  // Container classes based on modal vs inline mode
  const containerClasses = isModal 
    ? 'fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4'
    : 'h-full flex flex-col';

  const panelClasses = isModal
    ? 'bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col'
    : 'flex flex-col h-full';

  return (
    <div className={containerClasses}>
      <div className={panelClasses}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-blue-500" />
              <h2 className="font-semibold text-gray-900 dark:text-white">Stock Photos</h2>
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
                placeholder="Search photos..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg border-0 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 text-sm font-medium"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
            </button>
          </div>

          {/* Categories */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mx-4 mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Photo Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
              <p className="text-sm text-gray-500">Searching photos...</p>
            </div>
          ) : filteredPhotos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <ImageIcon className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-500">No photos found</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="mt-2 text-sm text-blue-500 hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredPhotos.map((photo) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer"
                  onClick={() => handlePhotoSelect(photo)}
                >
                  <img
                    src={photo.src.medium}
                    alt={photo.alt}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p className="text-white text-xs truncate">{photo.photographer}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(photo.id); }}
                      className={`p-1.5 rounded-full ${
                        favorites.has(photo.id) 
                          ? 'bg-red-500 text-white' 
                          : 'bg-white/90 text-gray-700 hover:bg-white'
                      }`}
                    >
                      <Heart className="w-3 h-3" fill={favorites.has(photo.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  {/* Click to add indicator */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="bg-blue-500 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg">
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
          <p className="text-xs text-gray-500 text-center">
            Photos from Unsplash • Free for commercial use • No attribution required
          </p>
        </div>
      </div>
    </div>
  );
}

export default StockPhotoBrowser;

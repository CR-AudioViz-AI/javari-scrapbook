// components/editor/GiphyStickerBrowser.tsx
// GIPHY API Integration - Animated Stickers & GIFs
// Timestamp: Tuesday, December 24, 2025 – 2:28 PM Eastern Time
// CR AudioViz AI - "Your Story. Our Design"

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Search, 
  Sparkles,
  Loader2,
  RefreshCw,
  Smile,
  Heart,
  Star,
  ThumbsUp,
  PartyPopper,
  Flame,
  Music,
  Zap
} from 'lucide-react';

interface GiphyGif {
  id: string;
  title: string;
  url: string;
  slug: string;
  images: {
    original: { url: string; width: string; height: string };
    fixed_height: { url: string; width: string; height: string };
    fixed_width: { url: string; width: string; height: string };
    preview_gif: { url: string; width: string; height: string };
    fixed_height_small: { url: string; width: string; height: string };
    downsized_medium: { url: string; width: string; height: string };
  };
  user?: {
    username: string;
    display_name: string;
    avatar_url: string;
  };
}

interface GiphyStickerBrowserProps {
  onSelect?: (gif: GiphyGif) => void;
  onAddToCanvas?: (gifUrl: string, title: string) => void;
  mode?: 'stickers' | 'gifs';
}

// Trending/Featured categories
const STICKER_CATEGORIES = [
  { id: 'trending', name: 'Trending', icon: Flame, query: '' },
  { id: 'love', name: 'Love', icon: Heart, query: 'love hearts' },
  { id: 'happy', name: 'Happy', icon: Smile, query: 'happy smile' },
  { id: 'celebrate', name: 'Celebrate', icon: PartyPopper, query: 'celebration party' },
  { id: 'thanks', name: 'Thanks', icon: ThumbsUp, query: 'thank you thanks' },
  { id: 'stars', name: 'Stars', icon: Star, query: 'stars sparkle' },
  { id: 'reactions', name: 'Reactions', icon: Zap, query: 'reaction' },
  { id: 'animals', name: 'Animals', icon: Sparkles, query: 'cute animals' },
  { id: 'food', name: 'Food', icon: Sparkles, query: 'food yummy' },
  { id: 'weather', name: 'Weather', icon: Sparkles, query: 'weather sun rain' },
  { id: 'music', name: 'Music', icon: Music, query: 'music dance' },
  { id: 'holidays', name: 'Holidays', icon: Sparkles, query: 'holiday christmas' },
];

export default function GiphyStickerBrowser({ 
  onSelect, 
  onAddToCanvas,
  mode = 'stickers'
}: GiphyStickerBrowserProps) {
  const [gifs, setGifs] = useState<GiphyGif[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('trending');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Fetch GIFs/Stickers from API
  const fetchGifs = useCallback(async (
    query: string, 
    offsetNum: number, 
    append: boolean = false
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = query 
        ? `/api/giphy/search?q=${encodeURIComponent(query)}&offset=${offsetNum}&type=${mode}`
        : `/api/giphy/trending?offset=${offsetNum}&type=${mode}`;

      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error('Failed to fetch from GIPHY');
      }

      const data = await response.json();
      const newGifs = data.data || [];

      if (append) {
        setGifs(prev => [...prev, ...newGifs]);
      } else {
        setGifs(newGifs);
      }

      setHasMore(newGifs.length >= 25);
    } catch (err) {
      setError('Unable to load stickers. Please try again.');
      console.error('GIPHY fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [mode]);

  // Initial load - trending
  useEffect(() => {
    fetchGifs('', 0);
  }, [fetchGifs]);

  // Search handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setOffset(0);
      setSelectedCategory('');
      fetchGifs(searchQuery, 0);
    }
  };

  // Category selection
  const handleCategorySelect = (category: typeof STICKER_CATEGORIES[0]) => {
    setSelectedCategory(category.id);
    setSearchQuery(category.query);
    setOffset(0);
    fetchGifs(category.query, 0);
  };

  // Load more
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      const nextOffset = offset + 25;
      setOffset(nextOffset);
      const query = selectedCategory === 'trending' ? '' : searchQuery;
      fetchGifs(query, nextOffset, true);
    }
  }, [isLoading, hasMore, offset, searchQuery, selectedCategory, fetchGifs]);

  // Infinite scroll observer
  useEffect(() => {
    if (loadMoreRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadMore();
          }
        },
        { threshold: 0.1 }
      );
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore]);

  // Handle GIF selection
  const handleGifSelect = (gif: GiphyGif) => {
    const url = gif.images.fixed_height.url || gif.images.original.url;
    onSelect?.(gif);
    onAddToCanvas?.(url, gif.title);
  };

  // Refresh
  const handleRefresh = () => {
    setOffset(0);
    const query = selectedCategory === 'trending' ? '' : searchQuery;
    fetchGifs(query, 0);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {mode === 'stickers' ? 'Animated Stickers' : 'GIFs'}
              </h3>
              <p className="text-xs text-gray-500">Powered by GIPHY</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded hover:bg-purple-100"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${mode}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </form>
      </div>

      {/* Categories */}
      <div className="p-2 border-b overflow-x-auto">
        <div className="flex gap-1">
          {STICKER_CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-3 h-3" />
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* GIFs Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {error && (
          <div className="text-center py-8 text-red-500">
            <p className="text-sm">{error}</p>
            <button onClick={handleRefresh} className="mt-2 text-xs text-gray-500 hover:text-gray-700 underline">
              Try again
            </button>
          </div>
        )}

        {!error && (
          <div className="grid grid-cols-3 gap-2">
            {gifs.map(gif => (
              <button
                key={gif.id}
                onClick={() => handleGifSelect(gif)}
                className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 hover:ring-2 hover:ring-purple-500 transition-all"
              >
                <img
                  src={gif.images.fixed_height_small?.url || gif.images.preview_gif?.url}
                  alt={gif.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
          </div>
        )}

        {/* Load more trigger */}
        <div ref={loadMoreRef} className="h-4" />

        {/* Empty state */}
        {!isLoading && gifs.length === 0 && !error && (
          <div className="text-center py-8 text-gray-500">
            <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No {mode} found</p>
            <p className="text-xs mt-1">Try a different search</p>
          </div>
        )}
      </div>

      {/* GIPHY Attribution (Required) */}
      <div className="p-2 border-t bg-purple-50 flex items-center justify-center gap-2">
        <span className="text-xs text-purple-700">Powered by</span>
        <img 
          src="https://giphy.com/static/img/giphy-logo-black.svg" 
          alt="GIPHY" 
          className="h-4"
        />
      </div>
    </div>
  );
}

// components/editor/UnsplashBrowser.tsx
// Unsplash API Integration - 3M+ Free Stock Photos
// Timestamp: Tuesday, December 24, 2025 – 1:40 PM Eastern Time
// CR AudioViz AI - "Your Story. Our Design"

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Search, 
  Image, 
  Download, 
  Heart, 
  User, 
  ExternalLink, 
  Loader2,
  Camera,
  Sparkles,
  Grid,
  LayoutGrid,
  RefreshCw
} from 'lucide-react';

interface UnsplashPhoto {
  id: string;
  width: number;
  height: number;
  color: string;
  blur_hash: string;
  description: string | null;
  alt_description: string | null;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  links: {
    html: string;
    download: string;
    download_location: string;
  };
  user: {
    name: string;
    username: string;
    profile_image: {
      small: string;
      medium: string;
    };
  };
  likes: number;
}

interface UnsplashBrowserProps {
  onSelect?: (photo: UnsplashPhoto) => void;
  onAddToCanvas?: (imageUrl: string, attribution: string) => void;
}

// Curated collections for scrapbooking
const CURATED_TOPICS = [
  { id: 'family', name: 'Family', query: 'family moments' },
  { id: 'baby', name: 'Baby', query: 'baby newborn' },
  { id: 'wedding', name: 'Wedding', query: 'wedding celebration' },
  { id: 'travel', name: 'Travel', query: 'travel adventure' },
  { id: 'nature', name: 'Nature', query: 'nature landscape' },
  { id: 'flowers', name: 'Flowers', query: 'flowers botanical' },
  { id: 'seasons', name: 'Seasons', query: 'seasons autumn spring' },
  { id: 'holidays', name: 'Holidays', query: 'holiday celebration' },
  { id: 'food', name: 'Food', query: 'food photography' },
  { id: 'pets', name: 'Pets', query: 'pets dogs cats' },
  { id: 'birthday', name: 'Birthday', query: 'birthday party cake' },
  { id: 'school', name: 'School', query: 'school education' },
  { id: 'sports', name: 'Sports', query: 'sports activities' },
  { id: 'textures', name: 'Textures', query: 'texture background pattern' },
  { id: 'minimal', name: 'Minimal', query: 'minimal white background' },
];

export default function UnsplashBrowser({ onSelect, onAddToCanvas }: UnsplashBrowserProps) {
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Fetch photos from API
  const fetchPhotos = useCallback(async (query: string, pageNum: number, append: boolean = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = query 
        ? `/api/unsplash/search?query=${encodeURIComponent(query)}&page=${pageNum}`
        : `/api/unsplash/photos?page=${pageNum}`;

      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error('Failed to fetch photos');
      }

      const data = await response.json();
      const newPhotos = query ? data.results : data;

      if (append) {
        setPhotos(prev => [...prev, ...newPhotos]);
      } else {
        setPhotos(newPhotos);
      }

      setHasMore(newPhotos.length === 30);
    } catch (err) {
      setError('Unable to load photos. Please try again.');
      console.error('Unsplash fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load - random photos
  useEffect(() => {
    fetchPhotos('', 1);
  }, [fetchPhotos]);

  // Search handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setPage(1);
      setSelectedTopic(null);
      fetchPhotos(searchQuery, 1);
    }
  };

  // Topic selection
  const handleTopicSelect = (topic: typeof CURATED_TOPICS[0]) => {
    setSelectedTopic(topic.id);
    setSearchQuery(topic.query);
    setPage(1);
    fetchPhotos(topic.query, 1);
  };

  // Load more (infinite scroll)
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPhotos(searchQuery || '', nextPage, true);
    }
  }, [isLoading, hasMore, page, searchQuery, fetchPhotos]);

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

  // Handle photo selection
  const handlePhotoSelect = async (photo: UnsplashPhoto) => {
    // Track download for Unsplash API guidelines
    try {
      await fetch(`/api/unsplash/download?url=${encodeURIComponent(photo.links.download_location)}`);
    } catch (err) {
      console.error('Download tracking failed:', err);
    }

    const attribution = `Photo by ${photo.user.name} on Unsplash`;
    onSelect?.(photo);
    onAddToCanvas?.(photo.urls.regular, attribution);
  };

  // Refresh photos
  const handleRefresh = () => {
    setPage(1);
    fetchPhotos(searchQuery || '', 1);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-slate-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-gray-800 to-black rounded-lg">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Unsplash Photos</h3>
              <p className="text-xs text-gray-500">3M+ free high-res photos</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('masonry')}
              className={`p-1.5 rounded ${viewMode === 'masonry' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={handleRefresh}
              className="p-1.5 rounded hover:bg-gray-100"
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search free photos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </form>
      </div>

      {/* Curated Topics */}
      <div className="p-2 border-b overflow-x-auto">
        <div className="flex gap-1">
          {CURATED_TOPICS.map(topic => (
            <button
              key={topic.id}
              onClick={() => handleTopicSelect(topic)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedTopic === topic.id
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {topic.name}
            </button>
          ))}
        </div>
      </div>

      {/* Photos Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {error && (
          <div className="text-center py-8 text-red-500">
            <p className="text-sm">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-2 text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Try again
            </button>
          </div>
        )}

        {!error && (
          <div className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-2 gap-3' 
              : 'columns-2 gap-3 space-y-3'
            }
          `}>
            {photos.map(photo => (
              <div
                key={photo.id}
                className={`
                  group relative overflow-hidden rounded-lg cursor-pointer
                  ${viewMode === 'grid' ? 'aspect-square' : 'break-inside-avoid'}
                `}
                onClick={() => handlePhotoSelect(photo)}
              >
                {/* Photo */}
                <img
                  src={photo.urls.small}
                  alt={photo.alt_description || 'Unsplash photo'}
                  className={`
                    w-full object-cover transition-transform group-hover:scale-105
                    ${viewMode === 'grid' ? 'h-full' : 'h-auto'}
                  `}
                  style={{ backgroundColor: photo.color }}
                  loading="lazy"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Attribution */}
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={photo.user.profile_image.small}
                        alt={photo.user.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-white text-xs truncate flex-1">
                        {photo.user.name}
                      </span>
                      <div className="flex items-center gap-1 text-white text-xs">
                        <Heart className="w-3 h-3" />
                        {photo.likes}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <a
                      href={photo.links.html}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors"
                    >
                      <ExternalLink className="w-3 h-3 text-gray-700" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
          </div>
        )}

        {/* Load more trigger */}
        <div ref={loadMoreRef} className="h-4" />

        {/* Empty state */}
        {!isLoading && photos.length === 0 && !error && (
          <div className="text-center py-8 text-gray-500">
            <Image className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No photos found</p>
            <p className="text-xs mt-1">Try a different search term</p>
          </div>
        )}
      </div>

      {/* Unsplash Attribution */}
      <div className="p-2 border-t bg-gray-50 text-center">
        <a
          href="https://unsplash.com/?utm_source=craudiovizai&utm_medium=referral"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Photos by Unsplash
        </a>
      </div>
    </div>
  );
}

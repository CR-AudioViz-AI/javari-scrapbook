'use client';

// app/view/[id]/page.tsx
// Public view for shared scrapbooks

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Heart, Share2, Download, Eye,
  BookOpen, Maximize, Minimize, X, MessageSquare, User,
  Calendar, Loader2, ExternalLink
} from 'lucide-react';

interface ViewPageProps {
  params: { id: string };
}

export default function ViewPage({ params }: ViewPageProps) {
  const [scrapbook, setScrapbook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    fetchScrapbook();
  }, [params.id]);

  const fetchScrapbook = async () => {
    try {
      const response = await fetch(`/api/scrapbooks/${params.id}`);
      const data = await response.json();
      setScrapbook(data);
      setLiked(data.hasLiked);
    } catch (error) {
      console.error('Failed to fetch scrapbook:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async () => {
    try {
      const response = await fetch(`/api/scrapbooks/${params.id}/like`, {
        method: 'POST'
      });
      const data = await response.json();
      setLiked(data.liked);
      setScrapbook((prev: any) => ({
        ...prev,
        likeCount: prev.likeCount + (data.liked ? 1 : -1)
      }));
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const nextPage = () => {
    if (scrapbook?.pages && currentPage < scrapbook.pages.length - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({
        title: scrapbook?.title,
        text: scrapbook?.description,
        url
      });
    } else {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader2 className="w-12 h-12 animate-spin text-pink-500" />
      </div>
    );
  }

  if (!scrapbook) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <BookOpen className="w-24 h-24 text-gray-600 mb-6" />
        <h1 className="text-2xl font-bold mb-2">Scrapbook Not Found</h1>
        <p className="text-gray-400">This scrapbook may have been removed or is private.</p>
      </div>
    );
  }

  const currentPageData = scrapbook.pages?.[currentPage];

  return (
    <div className={`min-h-screen bg-gray-900 text-white ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <header className="bg-gray-800/90 backdrop-blur-xl border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <a href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
              </a>
              <div>
                <h1 className="font-bold text-lg line-clamp-1">{scrapbook.title}</h1>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {scrapbook.viewCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" /> {scrapbook.likeCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {new Date(scrapbook.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleLike}
                className={`p-3 rounded-xl transition ${liked ? 'bg-pink-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={() => setShowComments(!showComments)}
                className="p-3 bg-gray-700 rounded-xl hover:bg-gray-600 transition"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
              <button
                onClick={share}
                className="p-3 bg-gray-700 rounded-xl hover:bg-gray-600 transition"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-3 bg-gray-700 rounded-xl hover:bg-gray-600 transition"
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        {/* Page Viewer */}
        <div className="relative w-full max-w-4xl">
          {/* Navigation Buttons */}
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 p-3 bg-white/10 backdrop-blur rounded-full hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextPage}
            disabled={currentPage === (scrapbook.pages?.length || 1) - 1}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 p-3 bg-white/10 backdrop-blur rounded-full hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Page Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="aspect-[3/4] bg-white rounded-2xl shadow-2xl overflow-hidden"
              style={{
                background: currentPageData?.background?.color || '#ffffff'
              }}
            >
              {/* Render page elements */}
              <div className="relative w-full h-full">
                {currentPageData?.elements?.map((element: any, index: number) => (
                  <div
                    key={element.id || index}
                    className="absolute"
                    style={{
                      left: element.position?.x || 0,
                      top: element.position?.y || 0,
                      width: element.size?.width || 100,
                      height: element.size?.height || 100,
                      transform: `rotate(${element.transform?.rotation || 0}deg)`,
                      opacity: element.opacity ?? 1,
                      zIndex: element.z_index || index
                    }}
                  >
                    {element.element_type === 'photo' && element.properties?.src && (
                      <img
                        src={element.properties.src}
                        alt=""
                        className="w-full h-full object-cover"
                        style={{
                          borderRadius: element.border?.radius || 0
                        }}
                      />
                    )}
                    {element.element_type === 'text' && (
                      <div
                        style={{
                          fontFamily: element.properties?.fontFamily || 'inherit',
                          fontSize: element.properties?.fontSize || 16,
                          fontWeight: element.properties?.fontWeight || 'normal',
                          color: element.properties?.color || '#000',
                          textAlign: element.properties?.textAlign || 'left'
                        }}
                      >
                        {element.properties?.content}
                      </div>
                    )}
                    {element.element_type === 'shape' && (
                      <div
                        className="w-full h-full"
                        style={{
                          backgroundColor: element.properties?.fill || 'transparent',
                          border: element.properties?.stroke ? `${element.properties.strokeWidth || 1}px solid ${element.properties.stroke}` : 'none',
                          borderRadius: element.properties?.shapeType === 'circle' ? '50%' : (element.border?.radius || 0)
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Page Navigation Dots */}
        <div className="flex items-center gap-2 mt-8">
          {scrapbook.pages?.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-3 h-3 rounded-full transition ${
                index === currentPage ? 'bg-pink-500 scale-125' : 'bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        {/* Page Counter */}
        <p className="text-gray-400 mt-4">
          Page {currentPage + 1} of {scrapbook.pages?.length || 1}
        </p>
      </main>

      {/* Comments Sidebar */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 bottom-0 w-96 bg-gray-800 border-l border-gray-700 z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className="font-bold text-lg">Comments</h2>
              <button onClick={() => setShowComments(false)} className="p-2 hover:bg-gray-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-gray-400 text-center py-8">No comments yet</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

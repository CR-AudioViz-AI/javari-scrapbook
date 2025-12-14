'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrapbookStore, createStickerElement, createPhotoElement } from '@/lib/store';
import { Image, Sticker, Frame, Palette, LayoutTemplate, Search, ChevronRight, Sparkles, Heart, PartyPopper, Cake, Baby, Plane, Flower2, TreePine, X } from 'lucide-react';

type AssetTab = 'stickers' | 'frames' | 'backgrounds' | 'templates' | 'uploads';

const stickerCategories = [
  { id: 'decorative', name: 'Decorative', icon: <Sparkles className="w-4 h-4" />, stickers: [{ id: 's1', src: '/stickers/sparkle.svg', name: 'Sparkle' }] },
  { id: 'celebration', name: 'Celebration', icon: <PartyPopper className="w-4 h-4" />, stickers: [{ id: 'c1', src: '/stickers/balloon.svg', name: 'Balloon' }] },
  { id: 'birthday', name: 'Birthday', icon: <Cake className="w-4 h-4" />, stickers: [{ id: 'b1', src: '/stickers/cake.svg', name: 'Cake' }] },
  { id: 'love', name: 'Love', icon: <Heart className="w-4 h-4" />, stickers: [{ id: 'l1', src: '/stickers/heart.svg', name: 'Heart' }] },
  { id: 'baby', name: 'Baby', icon: <Baby className="w-4 h-4" />, stickers: [{ id: 'ba1', src: '/stickers/baby.svg', name: 'Baby' }] },
  { id: 'travel', name: 'Travel', icon: <Plane className="w-4 h-4" />, stickers: [{ id: 't1', src: '/stickers/plane.svg', name: 'Plane' }] },
  { id: 'nature', name: 'Nature', icon: <Flower2 className="w-4 h-4" />, stickers: [{ id: 'n1', src: '/stickers/flower.svg', name: 'Flower' }] },
  { id: 'holidays', name: 'Holidays', icon: <TreePine className="w-4 h-4" />, stickers: [{ id: 'h1', src: '/stickers/tree.svg', name: 'Tree' }] },
];

const backgroundPatterns = [
  { id: 'solid-white', name: 'White', type: 'solid', color: '#ffffff' },
  { id: 'solid-cream', name: 'Cream', type: 'solid', color: '#f5f5dc' },
  { id: 'solid-pink', name: 'Blush', type: 'solid', color: '#ffe4e1' },
  { id: 'solid-blue', name: 'Sky', type: 'solid', color: '#e0f2fe' },
  { id: 'solid-mint', name: 'Mint', type: 'solid', color: '#d1fae5' },
  { id: 'solid-lavender', name: 'Lavender', type: 'solid', color: '#e9d5ff' },
  { id: 'gradient-sunset', name: 'Sunset', type: 'gradient', colors: ['#f97316', '#ec4899', '#8b5cf6'] },
  { id: 'gradient-ocean', name: 'Ocean', type: 'gradient', colors: ['#06b6d4', '#3b82f6', '#6366f1'] },
];

export function AssetsPanel() {
  const [activeTab, setActiveTab] = useState<AssetTab>('stickers');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userUploads, setUserUploads] = useState<string[]>([]);
  const { addElement, updatePageBackground, getCurrentPage } = useScrapbookStore();
  const currentPage = getCurrentPage();

  const handleStickerClick = (sticker: { id: string; src: string; name: string }, category: string) => {
    if (!currentPage) return;
    addElement(createStickerElement(sticker.id, sticker.src, category, { x: currentPage.width / 2 - 50, y: currentPage.height / 2 - 50 }, { width: 100, height: 100 }));
  };

  const handleBackgroundSelect = (bg: typeof backgroundPatterns[0]) => {
    if (bg.type === 'solid') updatePageBackground({ backgroundType: 'solid', color: bg.color });
    else if (bg.type === 'gradient') updatePageBackground({ backgroundType: 'gradient', gradient: { type: 'linear', angle: 135, colors: bg.colors!.map((c, i) => ({ color: c, position: (i / (bg.colors!.length - 1)) * 100 })) } });
  };

  const handleUserUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => { setUserUploads((prev) => [...prev, event.target?.result as string]); };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleAddUpload = (src: string) => {
    if (!currentPage) return;
    const img = new window.Image();
    img.onload = () => {
      const maxW = currentPage.width * 0.5, maxH = currentPage.height * 0.5;
      let w = img.width, h = img.height;
      if (w > maxW) { h = (maxW / w) * h; w = maxW; }
      if (h > maxH) { w = (maxH / h) * w; h = maxH; }
      addElement(createPhotoElement(src, { x: currentPage.width / 2 - w / 2, y: currentPage.height / 2 - h / 2 }, { width: w, height: h }));
    };
    img.src = src;
  };

  const tabs = [
    { id: 'uploads' as AssetTab, label: 'Uploads', icon: <Image className="w-4 h-4" /> },
    { id: 'stickers' as AssetTab, label: 'Stickers', icon: <Sticker className="w-4 h-4" /> },
    { id: 'frames' as AssetTab, label: 'Frames', icon: <Frame className="w-4 h-4" /> },
    { id: 'backgrounds' as AssetTab, label: 'Backgrounds', icon: <Palette className="w-4 h-4" /> },
    { id: 'templates' as AssetTab, label: 'Templates', icon: <LayoutTemplate className="w-4 h-4" /> },
  ];

  return (
    <div className="w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSelectedCategory(null); }}
            className={`flex-1 flex flex-col items-center justify-center py-3 px-2 text-xs font-medium transition-colors min-w-[60px] ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-500 hover:text-gray-700'}`}>
            {tab.icon}<span className="mt-1">{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder={`Search ${activeTab}...`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg border-0 focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <AnimatePresence mode="wait">
          {activeTab === 'uploads' && (
            <motion.div key="uploads" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <label className="block w-full p-8 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-blue-500 mb-4">
                <input type="file" accept="image/*" multiple onChange={handleUserUpload} className="hidden" />
                <Image className="w-8 h-8 mx-auto text-gray-400 mb-2" /><p className="text-sm text-gray-500">Drop images here or click to upload</p>
              </label>
              {userUploads.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {userUploads.map((src, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 group" onClick={() => handleAddUpload(src)}>
                      <img src={src} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
                      <button onClick={(e) => { e.stopPropagation(); setUserUploads((prev) => prev.filter((_, idx) => idx !== i)); }} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100"><X className="w-3 h-3" /></button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
          {activeTab === 'stickers' && (
            <motion.div key="stickers" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {!selectedCategory ? (
                <div className="space-y-2">
                  {stickerCategories.map((cat) => (
                    <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                      <div className="flex items-center gap-3">{cat.icon}<span className="font-medium">{cat.name}</span></div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  <button onClick={() => setSelectedCategory(null)} className="flex items-center gap-2 text-sm text-blue-600 mb-4 hover:underline">← Back</button>
                  <div className="grid grid-cols-3 gap-2">
                    {stickerCategories.find((c) => c.id === selectedCategory)?.stickers.map((sticker) => (
                      <motion.div key={sticker.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="aspect-square bg-gray-50 dark:bg-gray-800 rounded-lg p-2 cursor-pointer hover:ring-2 hover:ring-blue-500" onClick={() => handleStickerClick(sticker, selectedCategory)}>
                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center"><Sparkles className="w-8 h-8 text-gray-400" /></div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
          {activeTab === 'backgrounds' && (
            <motion.div key="backgrounds" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Solid Colors</h4>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {backgroundPatterns.filter((bg) => bg.type === 'solid').map((bg) => (
                  <motion.div key={bg.id} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="aspect-square rounded-lg cursor-pointer hover:ring-2 hover:ring-blue-500 border border-gray-200" style={{ backgroundColor: bg.color }} onClick={() => handleBackgroundSelect(bg)} title={bg.name} />
                ))}
              </div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Gradients</h4>
              <div className="grid grid-cols-2 gap-2">
                {backgroundPatterns.filter((bg) => bg.type === 'gradient').map((bg) => (
                  <motion.div key={bg.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="aspect-video rounded-lg cursor-pointer hover:ring-2 hover:ring-blue-500" style={{ background: `linear-gradient(135deg, ${bg.colors!.join(', ')})` }} onClick={() => handleBackgroundSelect(bg)} title={bg.name} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AssetsPanel;

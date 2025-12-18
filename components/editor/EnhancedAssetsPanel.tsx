'use client';

// CRAV Scrapbook - Comprehensive Assets Panel
// All 24+ components organized into logical categories with tabbed navigation
// Timestamp: Tuesday, December 17, 2025 – 9:35 PM Eastern Time

import React, { useState, useCallback, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrapbookStore, createStickerElement, createPhotoElement, createShapeElement } from '@/lib/store';
import { 
  Image, Sticker, Frame, Palette, LayoutTemplate, Search, 
  Sparkles, Shapes, Filter, QrCode, User, Grid, Type, Upload,
  ImageIcon, Wand2, GalleryHorizontal, Store, Gift,
  Loader2, ChevronDown, ChevronRight, X, RefreshCw, Heart, Smile
} from 'lucide-react';

// Lazy load heavy components for better performance
// Components use default exports
const StockPhotoBrowser = lazy(() => import('./StockPhotoBrowser'));
const GiphyBrowser = lazy(() => import('./GiphyBrowser'));
const IconsBrowser = lazy(() => import('./IconsBrowser'));
const GradientsBrowser = lazy(() => import('./GradientsBrowser'));
const FiltersBrowser = lazy(() => import('./FiltersBrowser'));
const FramesBrowser = lazy(() => import('./FramesBrowser'));
const StickersBrowser = lazy(() => import('./StickersBrowser'));
const ShapesBrowser = lazy(() => import('./ShapesBrowser'));
const QRCodeGenerator = lazy(() => import('./QRCodeGenerator'));
const AvatarCreator = lazy(() => import('./AvatarCreator'));
const CollageBuilder = lazy(() => import('./CollageBuilder'));
const BackgroundPicker = lazy(() => import('./BackgroundPicker'));
const PatternPicker = lazy(() => import('./PatternPicker'));
const ColorPalettePicker = lazy(() => import('./ColorPalettePicker'));
const TextEffectsPanel = lazy(() => import('./TextEffectsPanel'));
const TemplateGallery = lazy(() => import('./TemplateGallery'));
const PremiumStore = lazy(() => import('./PremiumStore'));
const AIEnhancePanel = lazy(() => import('./AIEnhancePanel'));

// Category definitions
type CategoryId = 'media' | 'elements' | 'design' | 'tools' | 'premium';
type TabId = 
  | 'uploads' | 'stock' | 'giphy'  // Media
  | 'shapes' | 'icons' | 'stickers' | 'frames'  // Elements
  | 'backgrounds' | 'gradients' | 'patterns' | 'palettes' | 'filters' | 'text-effects'  // Design
  | 'templates' | 'collage' | 'qrcode' | 'avatars' | 'ai-enhance'  // Tools
  | 'store';  // Premium

interface Category {
  id: CategoryId;
  label: string;
  icon: React.ReactNode;
  tabs: TabConfig[];
}

interface TabConfig {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  premium?: boolean;
}

const categories: Category[] = [
  {
    id: 'media',
    label: 'Media',
    icon: <ImageIcon className="w-4 h-4" />,
    tabs: [
      { id: 'uploads', label: 'My Uploads', icon: <Upload className="w-4 h-4" /> },
      { id: 'stock', label: 'Stock Photos', icon: <Image className="w-4 h-4" />, badge: 'FREE' },
      { id: 'giphy', label: 'GIFs & Stickers', icon: <Smile className="w-4 h-4" />, badge: 'FREE' },
    ]
  },
  {
    id: 'elements',
    label: 'Elements',
    icon: <Shapes className="w-4 h-4" />,
    tabs: [
      { id: 'shapes', label: 'Shapes', icon: <Shapes className="w-4 h-4" /> },
      { id: 'icons', label: 'Icons', icon: <Heart className="w-4 h-4" />, badge: '170+' },
      { id: 'stickers', label: 'Stickers', icon: <Sticker className="w-4 h-4" />, badge: '150+' },
      { id: 'frames', label: 'Frames', icon: <Frame className="w-4 h-4" />, badge: '20+' },
    ]
  },
  {
    id: 'design',
    label: 'Design',
    icon: <Palette className="w-4 h-4" />,
    tabs: [
      { id: 'backgrounds', label: 'Backgrounds', icon: <Grid className="w-4 h-4" /> },
      { id: 'gradients', label: 'Gradients', icon: <Palette className="w-4 h-4" />, badge: '100+' },
      { id: 'patterns', label: 'Patterns', icon: <Grid className="w-4 h-4" />, badge: '55+' },
      { id: 'palettes', label: 'Color Palettes', icon: <Palette className="w-4 h-4" />, badge: '40+' },
      { id: 'filters', label: 'Photo Filters', icon: <Filter className="w-4 h-4" />, badge: '40+' },
      { id: 'text-effects', label: 'Text Effects', icon: <Type className="w-4 h-4" />, badge: '25+' },
    ]
  },
  {
    id: 'tools',
    label: 'Tools',
    icon: <Wand2 className="w-4 h-4" />,
    tabs: [
      { id: 'templates', label: 'Templates', icon: <LayoutTemplate className="w-4 h-4" />, badge: '50+' },
      { id: 'collage', label: 'Collage Layouts', icon: <GalleryHorizontal className="w-4 h-4" />, badge: '15+' },
      { id: 'qrcode', label: 'QR Codes', icon: <QrCode className="w-4 h-4" /> },
      { id: 'avatars', label: 'Avatar Creator', icon: <User className="w-4 h-4" />, badge: '19 styles' },
      { id: 'ai-enhance', label: 'AI Enhance', icon: <Sparkles className="w-4 h-4" />, premium: true },
    ]
  },
  {
    id: 'premium',
    label: 'Store',
    icon: <Store className="w-4 h-4" />,
    tabs: [
      { id: 'store', label: 'Premium Assets', icon: <Gift className="w-4 h-4" />, premium: true },
    ]
  }
];

// Loading spinner component
function LoadingSpinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
      <p className="text-sm text-gray-500">{label || 'Loading...'}</p>
    </div>
  );
}

// Error boundary fallback
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <X className="w-8 h-8 text-red-500 mb-2" />
      <p className="text-sm text-red-500 text-center mb-2">Failed to load component</p>
      <button 
        onClick={resetErrorBoundary}
        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
      >
        <RefreshCw className="w-3 h-3" /> Try again
      </button>
    </div>
  );
}

// Upload panel component (inline since it's simple)
function UploadsPanel() {
  const [userUploads, setUserUploads] = useState<string[]>([]);
  const { addElement, getCurrentPage } = useScrapbookStore();

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

  return (
    <div className="p-3">
      <label className="block w-full p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 mb-4 transition-all">
        <input type="file" accept="image/*" multiple onChange={handleUserUpload} className="hidden" />
        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-gray-500">Drop images or click to upload</p>
        <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
      </label>
      
      {userUploads.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {userUploads.map((src, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 group" 
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
                <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-medium bg-black/50 px-2 py-1 rounded">Click to add</span>
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
    </div>
  );
}

export function EnhancedAssetsPanel() {
  const [expandedCategory, setExpandedCategory] = useState<CategoryId>('media');
  const [activeTab, setActiveTab] = useState<TabId>('uploads');
  const [searchQuery, setSearchQuery] = useState('');

  const handleTabChange = (tabId: TabId, categoryId: CategoryId) => {
    setActiveTab(tabId);
    setExpandedCategory(categoryId);
  };

  const toggleCategory = (categoryId: CategoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? expandedCategory : categoryId);
    // Set first tab of the category as active
    const category = categories.find(c => c.id === categoryId);
    if (category && category.tabs.length > 0) {
      setActiveTab(category.tabs[0].id);
    }
  };

  // Render the active tab content
  const renderContent = () => {
    return (
      <Suspense fallback={<LoadingSpinner label={`Loading ${activeTab}...`} />}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="h-full"
          >
            {activeTab === 'uploads' && <UploadsPanel />}
            {activeTab === 'stock' && <StockPhotoBrowser />}
            {activeTab === 'giphy' && <GiphyBrowser />}
            {activeTab === 'shapes' && <ShapesBrowser />}
            {activeTab === 'icons' && <IconsBrowser />}
            {activeTab === 'stickers' && <StickersBrowser />}
            {activeTab === 'frames' && <FramesBrowser />}
            {activeTab === 'backgrounds' && <BackgroundPicker />}
            {activeTab === 'gradients' && <GradientsBrowser />}
            {activeTab === 'patterns' && <PatternPicker />}
            {activeTab === 'palettes' && <ColorPalettePicker />}
            {activeTab === 'filters' && <FiltersBrowser />}
            {activeTab === 'text-effects' && <TextEffectsPanel />}
            {activeTab === 'templates' && <TemplateGallery />}
            {activeTab === 'collage' && <CollageBuilder />}
            {activeTab === 'qrcode' && <QRCodeGenerator />}
            {activeTab === 'avatars' && <AvatarCreator />}
            {activeTab === 'ai-enhance' && <AIEnhancePanel />}
            {activeTab === 'store' && <PremiumStore />}
          </motion.div>
        </AnimatePresence>
      </Suspense>
    );
  };

  return (
    <div className="w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Search Bar */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search assets..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 transition-all" 
          />
        </div>
      </div>

      {/* Category Accordion Navigation */}
      <div className="overflow-y-auto flex-shrink-0 border-b border-gray-200 dark:border-gray-700" style={{ maxHeight: '280px' }}>
        {categories.map((category) => (
          <div key={category.id} className="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium transition-colors ${
                expandedCategory === category.id
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-2">
                {category.icon}
                <span>{category.label}</span>
              </div>
              <motion.div
                animate={{ rotate: expandedCategory === category.id ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </button>

            {/* Category Tabs */}
            <AnimatePresence>
              {expandedCategory === category.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="py-1 px-2 space-y-0.5">
                    {category.tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id, category.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all ${
                          activeTab === tab.id
                            ? 'bg-blue-500 text-white shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {tab.icon}
                          <span>{tab.label}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {tab.badge && (
                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                              activeTab === tab.id 
                                ? 'bg-white/20 text-white' 
                                : tab.badge === 'FREE' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                            }`}>
                              {tab.badge}
                            </span>
                          )}
                          {tab.premium && (
                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                              activeTab === tab.id 
                                ? 'bg-yellow-400 text-yellow-900' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              PRO
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>

      {/* Asset Count Footer */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="text-xs text-gray-500 text-center">
          <span className="font-medium text-blue-600">650+</span> free assets • <span className="font-medium text-purple-600">15+</span> API integrations
        </div>
      </div>
    </div>
  );
}

export default EnhancedAssetsPanel;

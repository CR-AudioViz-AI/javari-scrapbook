// components/editor/SidebarNavigation.tsx
// Complete Sidebar Navigation - Wires All Components
// Timestamp: Tuesday, December 24, 2025 – 4:40 PM Eastern Time
// CR AudioViz AI - "Your Story. Our Design"

'use client';

import React, { useState } from 'react';
import {
  Image,
  Scissors,
  Type,
  Palette,
  Square,
  Frame,
  Layers,
  Calendar,
  Tag,
  Ribbon,
  Quote,
  Sparkles,
  Shapes,
  Layout,
  Download,
  Share2,
  FileCheck,
  Wand2,
  Film,
  Camera,
  Search,
  ChevronRight,
  X
} from 'lucide-react';

// Import all browser components
import UnsplashBrowser from './UnsplashBrowser';
import PexelsBrowser from './PexelsBrowser';
import PixabayBrowser from './PixabayBrowser';
import GiphyStickerBrowser from './GiphyStickerBrowser';
import BackgroundRemover from './BackgroundRemover';
import PhotoEnhancer from './PhotoEnhancer';
import ColorPaletteGenerator from './ColorPaletteGenerator';
import DieCutsBrowser from './DieCutsBrowser';
import AlphabetsBrowser from './AlphabetsBrowser';
import JournalingCardsBrowser from './JournalingCardsBrowser';
import SeasonalThemesBrowser from './SeasonalThemesBrowser';
import QuotesBrowser from './QuotesBrowser';
import PageBordersBrowser from './PageBordersBrowser';
import PhotoMatsBrowser from './PhotoMatsBrowser';
import WashiTapeBrowser from './WashiTapeBrowser';
import TagsBrowser from './TagsBrowser';
import DateStampsBrowser from './DateStampsBrowser';
import IconsBrowserPro from './IconsBrowserPro';
import ClipArtBrowser from './ClipArtBrowser';
import WordArtGenerator from './WordArtGenerator';
import TexturesBrowser from './TexturesBrowser';
import TemplateLayoutEngine from './TemplateLayoutEngine';
import OverlaysBrowser from './OverlaysBrowser';
import PrintExportModal from './PrintExportModal';
import SocialShareModal from './SocialShareModal';
import AttributionTracker from './AttributionTracker';

interface NavItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<any>;
  category: string;
  badge?: string;
}

// All navigation items organized by category
const NAV_ITEMS: NavItem[] = [
  // PHOTOS & MEDIA
  { id: 'unsplash', name: 'Unsplash Photos', icon: Image, component: UnsplashBrowser, category: 'photos', badge: '3M+' },
  { id: 'pexels', name: 'Pexels Media', icon: Film, component: PexelsBrowser, category: 'photos', badge: '3M+' },
  { id: 'pixabay', name: 'Pixabay', icon: Image, component: PixabayBrowser, category: 'photos', badge: '2.7M+' },
  { id: 'giphy', name: 'Stickers & GIFs', icon: Sparkles, component: GiphyStickerBrowser, category: 'photos' },
  
  // AI TOOLS
  { id: 'bg-remove', name: 'Remove Background', icon: Wand2, component: BackgroundRemover, category: 'ai', badge: 'AI' },
  { id: 'enhance', name: 'Photo Enhance', icon: Camera, component: PhotoEnhancer, category: 'ai' },
  { id: 'colors', name: 'Color Palettes', icon: Palette, component: ColorPaletteGenerator, category: 'ai' },
  
  // ELEMENTS
  { id: 'diecuts', name: 'Die Cuts', icon: Scissors, component: DieCutsBrowser, category: 'elements', badge: '100+' },
  { id: 'alphabets', name: 'Alphabets', icon: Type, component: AlphabetsBrowser, category: 'elements', badge: '55+' },
  { id: 'icons', name: 'Icons', icon: Shapes, component: IconsBrowserPro, category: 'elements', badge: '100+' },
  { id: 'clipart', name: 'Clip Art', icon: Sparkles, component: ClipArtBrowser, category: 'elements', badge: '100+' },
  { id: 'wordart', name: 'Word Art', icon: Type, component: WordArtGenerator, category: 'elements', badge: '40+' },
  
  // EMBELLISHMENTS
  { id: 'washi', name: 'Washi Tape', icon: Ribbon, component: WashiTapeBrowser, category: 'embellish', badge: '50+' },
  { id: 'tags', name: 'Tags & Labels', icon: Tag, component: TagsBrowser, category: 'embellish', badge: '50+' },
  { id: 'dates', name: 'Date Stamps', icon: Calendar, component: DateStampsBrowser, category: 'embellish', badge: '30+' },
  { id: 'quotes', name: 'Quotes', icon: Quote, component: QuotesBrowser, category: 'embellish', badge: '60+' },
  { id: 'journal', name: 'Journaling Cards', icon: Square, component: JournalingCardsBrowser, category: 'embellish', badge: '60+' },
  
  // FRAMES & BACKGROUNDS
  { id: 'borders', name: 'Page Borders', icon: Square, component: PageBordersBrowser, category: 'frames', badge: '80+' },
  { id: 'mats', name: 'Photo Mats', icon: Frame, component: PhotoMatsBrowser, category: 'frames', badge: '50+' },
  { id: 'textures', name: 'Textures', icon: Layers, component: TexturesBrowser, category: 'frames', badge: '50+' },
  { id: 'overlays', name: 'Overlays', icon: Layers, component: OverlaysBrowser, category: 'frames', badge: '35+' },
  
  // TEMPLATES & THEMES
  { id: 'layouts', name: 'Page Layouts', icon: Layout, component: TemplateLayoutEngine, category: 'templates', badge: '25+' },
  { id: 'themes', name: 'Theme Packs', icon: Palette, component: SeasonalThemesBrowser, category: 'templates', badge: '18' },
  
  // EXPORT & UTILITIES
  { id: 'print', name: 'Print Export', icon: Download, component: PrintExportModal, category: 'export' },
  { id: 'share', name: 'Social Share', icon: Share2, component: SocialShareModal, category: 'export' },
  { id: 'credits', name: 'Attributions', icon: FileCheck, component: AttributionTracker, category: 'export' },
];

// Category definitions
const CATEGORIES = [
  { id: 'photos', name: 'Photos & Media', icon: Image },
  { id: 'ai', name: 'AI Tools', icon: Wand2 },
  { id: 'elements', name: 'Elements', icon: Shapes },
  { id: 'embellish', name: 'Embellishments', icon: Sparkles },
  { id: 'frames', name: 'Frames & BGs', icon: Frame },
  { id: 'templates', name: 'Templates', icon: Layout },
  { id: 'export', name: 'Export', icon: Download },
];

interface SidebarNavigationProps {
  onElementAdd?: (element: any) => void;
}

export default function SidebarNavigation({ onElementAdd }: SidebarNavigationProps) {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string>('photos');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter items by search
  const filteredItems = NAV_ITEMS.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get active component
  const activeItem = NAV_ITEMS.find(item => item.id === activePanel);
  const ActiveComponent = activeItem?.component;

  return (
    <div className="flex h-full">
      {/* Main Navigation */}
      <div className="w-64 bg-white border-r flex flex-col">
        {/* Search */}
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex-1 overflow-y-auto">
          {searchQuery ? (
            // Search results
            <div className="p-2">
              {filteredItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActivePanel(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                      activePanel === item.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1 text-sm font-medium truncate">{item.name}</span>
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                );
              })}
            </div>
          ) : (
            // Categorized view
            CATEGORIES.map(category => {
              const CategoryIcon = category.icon;
              const categoryItems = NAV_ITEMS.filter(item => item.category === category.id);
              const isExpanded = expandedCategory === category.id;

              return (
                <div key={category.id} className="border-b last:border-b-0">
                  <button
                    onClick={() => setExpandedCategory(isExpanded ? '' : category.id)}
                    className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <CategoryIcon className="w-4 h-4 text-gray-500" />
                    <span className="flex-1 text-sm font-semibold text-gray-700 text-left">
                      {category.name}
                    </span>
                    <span className="text-xs text-gray-400">{categoryItems.length}</span>
                    <ChevronRight 
                      className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                    />
                  </button>

                  {isExpanded && (
                    <div className="pb-2">
                      {categoryItems.map(item => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setActivePanel(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors ${
                              activePanel === item.id
                                ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-500'
                                : 'hover:bg-gray-50 text-gray-600 border-l-2 border-transparent'
                            }`}
                          >
                            <Icon className="w-4 h-4 flex-shrink-0 ml-2" />
                            <span className="flex-1 text-sm truncate">{item.name}</span>
                            {item.badge && (
                              <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                                item.badge === 'AI' 
                                  ? 'bg-purple-100 text-purple-700' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {item.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Stats */}
        <div className="p-3 border-t bg-gray-50">
          <div className="text-center">
            <p className="text-xs font-medium text-gray-500">CR AudioViz AI</p>
            <p className="text-[10px] text-gray-400">9M+ Photos • 200K+ Videos</p>
          </div>
        </div>
      </div>

      {/* Active Panel */}
      {activePanel && ActiveComponent && (
        <div className="w-80 bg-white border-r flex flex-col">
          {/* Panel Header */}
          <div className="flex items-center justify-between p-3 border-b">
            <h3 className="font-semibold text-gray-900">{activeItem?.name}</h3>
            <button
              onClick={() => setActivePanel(null)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-hidden">
            <ActiveComponent 
              onAddToCanvas={onElementAdd}
              onSelectElement={onElementAdd}
            />
          </div>
        </div>
      )}
    </div>
  );
}

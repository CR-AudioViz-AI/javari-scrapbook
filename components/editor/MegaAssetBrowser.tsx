'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Grid, Type, Palette, Image, Layout, Sparkles, Star, Heart, Scissors, FileText, Gem, Wand2, Filter, X, Download, Plus, ChevronDown } from 'lucide-react';

// Asset type definitions
type AssetType = 'fonts' | 'patterns' | 'templates' | 'graphics' | 'overlays' | 'washi' | 'textures' | 'embellishments';

interface AssetCategory {
  id: string;
  name: string;
  count: number;
}

interface MegaAssetBrowserProps {
  onSelectAsset?: (asset: { type: AssetType; id: string; name: string; data: any }) => void;
  defaultTab?: AssetType;
}

// Tab configuration
const ASSET_TABS: { id: AssetType; name: string; icon: React.ComponentType<any>; apiEndpoint: string; description: string }[] = [
  { id: 'fonts', name: 'Fonts', icon: Type, apiEndpoint: '/api/mega-fonts', description: '500+ Google Fonts' },
  { id: 'patterns', name: 'Patterns', icon: Grid, apiEndpoint: '/api/mega-patterns', description: '200+ SVG Patterns' },
  { id: 'templates', name: 'Templates', icon: Layout, apiEndpoint: '/api/mega-templates', description: '200+ Page Layouts' },
  { id: 'graphics', name: 'Graphics', icon: Image, apiEndpoint: '/api/mega-graphics', description: '500+ Clipart' },
  { id: 'overlays', name: 'Overlays', icon: Sparkles, apiEndpoint: '/api/overlays', description: '50+ Photo Effects' },
  { id: 'washi', name: 'Washi Tape', icon: Scissors, apiEndpoint: '/api/washi', description: '50+ Tape Designs' },
  { id: 'textures', name: 'Textures', icon: FileText, apiEndpoint: '/api/textures', description: '80+ Paper Textures' },
  { id: 'embellishments', name: 'Embellishments', icon: Gem, apiEndpoint: '/api/embellishments', description: '60+ Decorations' },
];

// Quick color presets for patterns/graphics
const COLOR_PRESETS = [
  { name: 'Black', value: '#000000' },
  { name: 'Gray', value: '#6b7280' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Brown', value: '#a16207' },
  { name: 'Rose Gold', value: '#e8a598' },
];

export function MegaAssetBrowser({ onSelectAsset, defaultTab = 'fonts' }: MegaAssetBrowserProps) {
  const [activeTab, setActiveTab] = useState<AssetType>(defaultTab);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<AssetCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [assets, setAssets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [totalAssets, setTotalAssets] = useState<Record<AssetType, number>>({
    fonts: 500,
    patterns: 200,
    templates: 200,
    graphics: 500,
    overlays: 50,
    washi: 50,
    textures: 80,
    embellishments: 60,
  });

  // Fetch categories when tab changes
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const tab = ASSET_TABS.find(t => t.id === activeTab);
        if (!tab) return;

        const response = await fetch(tab.apiEndpoint);
        const data = await response.json();

        if (data.success) {
          setCategories(data.categories || []);
          if (data.totalFonts) setTotalAssets(prev => ({ ...prev, fonts: data.totalFonts }));
          if (data.totalPatterns) setTotalAssets(prev => ({ ...prev, patterns: data.totalPatterns }));
          if (data.totalTemplates) setTotalAssets(prev => ({ ...prev, templates: data.totalTemplates }));
          if (data.totalGraphics) setTotalAssets(prev => ({ ...prev, graphics: data.totalGraphics }));
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
    setSelectedCategory(null);
    setAssets([]);
    setSearchTerm('');
  }, [activeTab]);

  // Fetch assets when category changes or search
  const fetchAssets = useCallback(async (category?: string, search?: string) => {
    setIsLoading(true);
    try {
      const tab = ASSET_TABS.find(t => t.id === activeTab);
      if (!tab) return;

      let url = tab.apiEndpoint;
      const params = new URLSearchParams();
      
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      if (activeTab === 'patterns' || activeTab === 'graphics') {
        params.append('color', selectedColor);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        if (activeTab === 'fonts') {
          setAssets(data.fonts || data.results || []);
        } else if (activeTab === 'patterns') {
          setAssets(data.patterns || data.results || []);
        } else if (activeTab === 'templates') {
          setAssets(data.templates || data.results || []);
        } else if (activeTab === 'graphics') {
          setAssets(data.graphics || data.results || []);
        } else {
          setAssets(data.items || data.results || []);
        }
      }
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, selectedColor]);

  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    fetchAssets(categoryId);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSelectedCategory(null);
      fetchAssets(undefined, searchTerm);
    }
  };

  // Handle asset selection
  const handleAssetSelect = (asset: any) => {
    onSelectAsset?.({
      type: activeTab,
      id: asset.id || asset.name,
      name: asset.name,
      data: asset,
    });
  };

  // Render asset preview based on type
  const renderAssetPreview = (asset: any) => {
    switch (activeTab) {
      case 'fonts':
        return (
          <div 
            className="text-lg truncate"
            style={{ fontFamily: asset.name || asset }}
          >
            {asset.name || asset}
          </div>
        );
      
      case 'patterns':
      case 'graphics':
        return asset.dataUrl ? (
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("${asset.dataUrl}")`,
              backgroundRepeat: activeTab === 'patterns' ? 'repeat' : 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: activeTab === 'patterns' ? 'auto' : 'contain',
            }}
          />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: asset.svg }} className="w-full h-full flex items-center justify-center" />
        );
      
      case 'templates':
        return (
          <div className="text-center p-2">
            <Layout className="w-8 h-8 mx-auto mb-1 opacity-50" />
            <span className="text-xs">{asset.slots} slots</span>
          </div>
        );
      
      default:
        return (
          <div className="w-full h-full flex items-center justify-center">
            <Star className="w-8 h-8 opacity-30" />
          </div>
        );
    }
  };

  const activeTabConfig = ASSET_TABS.find(t => t.id === activeTab);

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Header */}
      <div className="p-3 border-b border-gray-700">
        <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-violet-400" />
          Mega Asset Library
        </h3>
        <p className="text-xs text-gray-400">
          {Object.values(totalAssets).reduce((a, b) => a + b, 0).toLocaleString()}+ free assets
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto p-2 gap-1 border-b border-gray-700 bg-gray-800/50">
        {ASSET_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 mb-1" />
              <span className="font-medium">{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Filters */}
      <div className="p-3 border-b border-gray-700 space-y-2">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activeTabConfig?.name.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-violet-500"
          />
        </form>

        {/* Color picker for patterns/graphics */}
        {(activeTab === 'patterns' || activeTab === 'graphics') && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Color:</span>
            <div className="flex gap-1 flex-wrap">
              {COLOR_PRESETS.slice(0, 8).map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => {
                    setSelectedColor(preset.value);
                    if (selectedCategory) fetchAssets(selectedCategory);
                  }}
                  className={`w-5 h-5 rounded-full border-2 ${
                    selectedColor === preset.value ? 'border-white' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: preset.value }}
                  title={preset.name}
                />
              ))}
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="w-5 h-5 rounded-full border border-gray-500 flex items-center justify-center text-xs"
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Category Pills */}
      {categories.length > 0 && !searchTerm && (
        <div className="p-2 border-b border-gray-700 flex overflow-x-auto gap-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      )}

      {/* Assets Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-violet-500 border-t-transparent" />
          </div>
        ) : assets.length > 0 ? (
          <div className={`grid gap-2 ${
            activeTab === 'fonts' ? 'grid-cols-1' : 'grid-cols-3'
          }`}>
            {assets.map((asset, idx) => (
              <button
                key={asset.id || idx}
                onClick={() => handleAssetSelect(asset)}
                className={`group relative rounded-lg overflow-hidden border-2 border-gray-700 hover:border-violet-500 transition-all ${
                  activeTab === 'fonts' ? 'p-3 text-left' : 'aspect-square'
                }`}
              >
                {renderAssetPreview(asset)}
                
                {/* Overlay with name */}
                {activeTab !== 'fonts' && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs truncate text-center">{asset.name}</p>
                  </div>
                )}

                {/* Add button */}
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : selectedCategory || searchTerm ? (
          <div className="text-center text-gray-500 py-8">
            <Image className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p>No assets found</p>
            <p className="text-xs mt-1">Try a different search or category</p>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <ChevronDown className="w-8 h-8 mx-auto mb-2 opacity-30 animate-bounce" />
            <p>Select a category above</p>
            <p className="text-xs mt-1">or search for specific assets</p>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-2 border-t border-gray-700 bg-gray-800/50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {activeTabConfig?.description}
          </span>
          <span className="text-violet-400">
            100% FREE
          </span>
        </div>
      </div>
    </div>
  );
}

export default MegaAssetBrowser;

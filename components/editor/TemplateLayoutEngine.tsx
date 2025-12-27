'use client';

import React, { useState, useMemo } from 'react';
import { Search, Layout, Grid, Rows, Columns, Square, LayoutGrid, Layers } from 'lucide-react';

// Layout categories with pre-defined templates
const LAYOUT_CATEGORIES = {
  'classic': {
    name: 'Classic',
    icon: Layout,
    layouts: [
      { id: 'single', name: 'Single Photo', slots: 1, grid: 'grid-cols-1' },
      { id: 'duo-h', name: 'Duo Horizontal', slots: 2, grid: 'grid-cols-2' },
      { id: 'duo-v', name: 'Duo Vertical', slots: 2, grid: 'grid-rows-2' },
      { id: 'trio-h', name: 'Trio Horizontal', slots: 3, grid: 'grid-cols-3' },
      { id: 'trio-v', name: 'Trio Vertical', slots: 3, grid: 'grid-rows-3' },
    ]
  },
  'grid': {
    name: 'Grid Layouts',
    icon: Grid,
    layouts: [
      { id: 'grid-2x2', name: '2x2 Grid', slots: 4, grid: 'grid-cols-2 grid-rows-2' },
      { id: 'grid-3x2', name: '3x2 Grid', slots: 6, grid: 'grid-cols-3 grid-rows-2' },
      { id: 'grid-2x3', name: '2x3 Grid', slots: 6, grid: 'grid-cols-2 grid-rows-3' },
      { id: 'grid-3x3', name: '3x3 Grid', slots: 9, grid: 'grid-cols-3 grid-rows-3' },
      { id: 'grid-4x3', name: '4x3 Grid', slots: 12, grid: 'grid-cols-4 grid-rows-3' },
    ]
  },
  'magazine': {
    name: 'Magazine',
    icon: Rows,
    layouts: [
      { id: 'hero-top', name: 'Hero Top', slots: 4, grid: 'magazine-hero-top' },
      { id: 'hero-side', name: 'Hero Side', slots: 4, grid: 'magazine-hero-side' },
      { id: 'feature', name: 'Feature Story', slots: 5, grid: 'magazine-feature' },
      { id: 'mosaic', name: 'Mosaic', slots: 6, grid: 'magazine-mosaic' },
      { id: 'timeline', name: 'Timeline', slots: 4, grid: 'magazine-timeline' },
    ]
  },
  'collage': {
    name: 'Collage',
    icon: Layers,
    layouts: [
      { id: 'scattered', name: 'Scattered', slots: 5, grid: 'collage-scattered' },
      { id: 'polaroid', name: 'Polaroid Stack', slots: 4, grid: 'collage-polaroid' },
      { id: 'overlap', name: 'Overlap', slots: 3, grid: 'collage-overlap' },
      { id: 'artistic', name: 'Artistic', slots: 6, grid: 'collage-artistic' },
      { id: 'memory-wall', name: 'Memory Wall', slots: 8, grid: 'collage-wall' },
    ]
  },
  'special': {
    name: 'Special',
    icon: Square,
    layouts: [
      { id: 'heart', name: 'Heart Shape', slots: 6, grid: 'special-heart' },
      { id: 'circle', name: 'Circle Frame', slots: 4, grid: 'special-circle' },
      { id: 'split', name: 'Split Screen', slots: 2, grid: 'special-split' },
      { id: 'story', name: 'Story Strip', slots: 4, grid: 'special-story' },
      { id: 'panorama', name: 'Panorama', slots: 3, grid: 'special-panorama' },
    ]
  }
};

const CATEGORIES = Object.entries(LAYOUT_CATEGORIES).map(([id, cat]) => ({
  id,
  ...cat
}));

interface TemplateLayoutEngineProps {
  onSelectLayout?: (layout: any) => void;
}

export default function TemplateLayoutEngine({ onSelectLayout }: TemplateLayoutEngineProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredLayouts = useMemo(() => {
    const allLayouts = CATEGORIES.flatMap(cat => 
      cat.layouts.map(layout => ({ ...layout, category: cat.id, categoryName: cat.name }))
    );

    return allLayouts.filter(layout => {
      const matchesSearch = searchQuery === '' || 
        layout.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || layout.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleLayoutClick = (layout: any) => {
    if (onSelectLayout) {
      onSelectLayout(layout);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-3 border-b bg-white">
        <h3 className="font-semibold text-gray-800 mb-2">Page Layouts</h3>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search layouts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="p-2 border-b overflow-x-auto">
        <div className="flex gap-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            All
          </button>
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Layout Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 gap-3">
          {filteredLayouts.map((layout) => (
            <button
              key={layout.id}
              onClick={() => handleLayoutClick(layout)}
              className="bg-white border rounded-lg p-3 hover:border-blue-400 hover:shadow-md transition-all group"
            >
              {/* Preview Box */}
              <div className="aspect-[4/3] bg-gray-100 rounded-md mb-2 flex items-center justify-center">
                <div className="w-3/4 h-3/4 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-2xl text-gray-400">{layout.slots}</span>
                </div>
              </div>
              
              {/* Layout Name */}
              <p className="text-xs font-medium text-gray-700 text-center truncate">
                {layout.name}
              </p>
              <p className="text-[10px] text-gray-400 text-center">
                {layout.slots} photo{layout.slots > 1 ? 's' : ''}
              </p>
            </button>
          ))}
        </div>

        {filteredLayouts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Layout className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No layouts found</p>
          </div>
        )}
      </div>
    </div>
  );
}

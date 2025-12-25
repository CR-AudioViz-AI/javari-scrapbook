// components/editor/AttributionTracker.tsx
// Attribution & License Tracker for Stock Assets
// Timestamp: Tuesday, December 24, 2025 – 3:55 PM Eastern Time
// CR AudioViz AI - "Your Story. Our Design"

'use client';

import React, { useState, useMemo } from 'react';
import { 
  FileCheck, 
  Search, 
  ExternalLink, 
  Copy, 
  Check, 
  Trash2,
  Image,
  Film,
  Music,
  Type,
  Download,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';

interface AttributionItem {
  id: string;
  assetType: 'photo' | 'video' | 'music' | 'font' | 'icon' | 'sticker';
  source: string;
  sourceUrl: string;
  creator: string;
  creatorUrl?: string;
  license: string;
  licenseUrl?: string;
  attributionRequired: boolean;
  attributionText: string;
  assetUrl: string;
  dateAdded: Date;
}

interface AttributionTrackerProps {
  attributions?: AttributionItem[];
  onRemove?: (id: string) => void;
  onExport?: (format: 'text' | 'html' | 'json') => void;
}

// Mock data for demonstration
const MOCK_ATTRIBUTIONS: AttributionItem[] = [
  {
    id: '1',
    assetType: 'photo',
    source: 'Unsplash',
    sourceUrl: 'https://unsplash.com',
    creator: 'John Doe',
    creatorUrl: 'https://unsplash.com/@johndoe',
    license: 'Unsplash License',
    licenseUrl: 'https://unsplash.com/license',
    attributionRequired: false,
    attributionText: 'Photo by John Doe on Unsplash',
    assetUrl: 'https://unsplash.com/photos/abc123',
    dateAdded: new Date('2025-12-24')
  },
  {
    id: '2',
    assetType: 'photo',
    source: 'Pexels',
    sourceUrl: 'https://pexels.com',
    creator: 'Jane Smith',
    creatorUrl: 'https://pexels.com/@janesmith',
    license: 'Pexels License',
    licenseUrl: 'https://pexels.com/license',
    attributionRequired: false,
    attributionText: 'Photo by Jane Smith from Pexels',
    assetUrl: 'https://pexels.com/photo/456',
    dateAdded: new Date('2025-12-24')
  },
  {
    id: '3',
    assetType: 'sticker',
    source: 'GIPHY',
    sourceUrl: 'https://giphy.com',
    creator: 'GIPHY Studios',
    license: 'GIPHY Terms',
    licenseUrl: 'https://giphy.com/terms',
    attributionRequired: true,
    attributionText: 'via GIPHY',
    assetUrl: 'https://giphy.com/stickers/xyz',
    dateAdded: new Date('2025-12-24')
  },
];

// Asset type icons
const ASSET_ICONS = {
  photo: Image,
  video: Film,
  music: Music,
  font: Type,
  icon: Image,
  sticker: Image,
};

// Source colors
const SOURCE_COLORS: Record<string, string> = {
  'Unsplash': '#000000',
  'Pexels': '#05A081',
  'Pixabay': '#2EC66D',
  'GIPHY': '#FF6666',
  'Flaticon': '#0E2F44',
  'Google Fonts': '#4285F4',
};

export default function AttributionTracker({ 
  attributions = MOCK_ATTRIBUTIONS, 
  onRemove, 
  onExport 
}: AttributionTrackerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter attributions
  const filteredAttributions = useMemo(() => {
    return attributions.filter(attr => {
      const matchesSearch = searchQuery === '' || 
        attr.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attr.source.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || attr.assetType === filterType;
      return matchesSearch && matchesType;
    });
  }, [attributions, searchQuery, filterType]);

  // Count by type
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: attributions.length };
    attributions.forEach(attr => {
      counts[attr.assetType] = (counts[attr.assetType] || 0) + 1;
    });
    return counts;
  }, [attributions]);

  // Copy attribution text
  const copyAttribution = async (item: AttributionItem) => {
    await navigator.clipboard.writeText(item.attributionText);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Generate full attribution list
  const generateAttributionList = (format: 'text' | 'html' | 'json') => {
    if (format === 'json') {
      return JSON.stringify(attributions, null, 2);
    }
    
    const requiredAttrs = attributions.filter(a => a.attributionRequired);
    const optionalAttrs = attributions.filter(a => !a.attributionRequired);
    
    if (format === 'html') {
      let html = '<h3>Image Credits</h3><ul>';
      [...requiredAttrs, ...optionalAttrs].forEach(attr => {
        html += `<li><a href="${attr.assetUrl}" target="_blank">${attr.attributionText}</a></li>`;
      });
      html += '</ul>';
      return html;
    }
    
    // Text format
    let text = 'IMAGE CREDITS\n============\n\n';
    if (requiredAttrs.length > 0) {
      text += 'Required Attributions:\n';
      requiredAttrs.forEach(attr => {
        text += `• ${attr.attributionText}\n`;
      });
      text += '\n';
    }
    if (optionalAttrs.length > 0) {
      text += 'Optional Attributions (appreciated):\n';
      optionalAttrs.forEach(attr => {
        text += `• ${attr.attributionText}\n`;
      });
    }
    return text;
  };

  // Export attributions
  const handleExport = (format: 'text' | 'html' | 'json') => {
    const content = generateAttributionList(format);
    const blob = new Blob([content], { 
      type: format === 'json' ? 'application/json' : 'text/plain' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attributions.${format === 'html' ? 'html' : format === 'json' ? 'json' : 'txt'}`;
    a.click();
    URL.revokeObjectURL(url);
    onExport?.(format);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg">
              <FileCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Attributions</h3>
              <p className="text-xs text-gray-500">{attributions.length} assets tracked</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search attributions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="p-2 border-b overflow-x-auto">
        <div className="flex gap-1">
          {['all', 'photo', 'video', 'sticker', 'font', 'icon'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filterType === type
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
              {typeCounts[type] ? ` (${typeCounts[type]})` : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Info Banner */}
      <div className="p-3 bg-blue-50 border-b">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700">
            Assets marked with <span className="font-semibold">Required</span> must be credited when publishing. 
            Others are optional but appreciated.
          </p>
        </div>
      </div>

      {/* Attribution List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {filteredAttributions.map(item => {
            const Icon = ASSET_ICONS[item.assetType];
            const sourceColor = SOURCE_COLORS[item.source] || '#6B7280';
            
            return (
              <div
                key={item.id}
                className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Asset Type Icon */}
                    <div 
                      className="p-2 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: `${sourceColor}15` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: sourceColor }} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span 
                          className="text-xs font-medium px-2 py-0.5 rounded"
                          style={{ 
                            backgroundColor: `${sourceColor}15`,
                            color: sourceColor 
                          }}
                        >
                          {item.source}
                        </span>
                        {item.attributionRequired ? (
                          <span className="flex items-center gap-1 text-xs text-amber-600">
                            <AlertCircle className="w-3 h-3" />
                            Required
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-green-600">
                            <CheckCircle className="w-3 h-3" />
                            Optional
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-900 mb-1">
                        {item.attributionText}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>by {item.creator}</span>
                        <span>•</span>
                        <a 
                          href={item.licenseUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {item.license}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => copyAttribution(item)}
                      className="p-1.5 hover:bg-gray-100 rounded"
                      title="Copy attribution"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    <a
                      href={item.assetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 hover:bg-gray-100 rounded"
                      title="View source"
                    >
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </a>
                    <button
                      onClick={() => onRemove?.(item.id)}
                      className="p-1.5 hover:bg-red-50 rounded"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAttributions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FileCheck className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No attributions found</p>
            <p className="text-xs mt-1">Assets you use will appear here</p>
          </div>
        )}
      </div>

      {/* Export Options */}
      <div className="p-4 border-t bg-gray-50">
        <p className="text-xs font-medium text-gray-500 mb-2">EXPORT CREDITS</p>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport('text')}
            className="flex-1 py-2 px-3 bg-white border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
          >
            <Download className="w-3 h-3" />
            Text
          </button>
          <button
            onClick={() => handleExport('html')}
            className="flex-1 py-2 px-3 bg-white border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
          >
            <Download className="w-3 h-3" />
            HTML
          </button>
          <button
            onClick={() => handleExport('json')}
            className="flex-1 py-2 px-3 bg-white border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
          >
            <Download className="w-3 h-3" />
            JSON
          </button>
        </div>
      </div>
    </div>
  );
}

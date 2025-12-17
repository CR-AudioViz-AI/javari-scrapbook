'use client';

import { useState, useEffect } from 'react';
import { Loader2, Check } from 'lucide-react';

interface Frame {
  id: string;
  name: string;
  category: string;
  description: string;
  preview: string;
}

interface FramesBrowserProps {
  currentFrame?: string;
  onSelectFrame: (frame: { id: string; name: string; svg: string; dataUrl: string }) => void;
}

const CATEGORIES = ['classic', 'modern', 'vintage', 'decorative', 'polaroid', 'fun'];

export default function FramesBrowser({ currentFrame, onSelectFrame }: FramesBrowserProps) {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [selectedFrame, setSelectedFrame] = useState(currentFrame || '');
  const [color, setColor] = useState('6366f1');
  const [accent, setAccent] = useState('ec4899');

  useEffect(() => {
    fetchFrames();
  }, [category, color, accent]);

  const fetchFrames = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      params.set('color', color);
      params.set('accent', accent);
      
      const res = await fetch(`/api/frames?${params}`);
      const data = await res.json();
      setFrames(data.frames || []);
    } catch (error) {
      console.error('Error fetching frames:', error);
    }
    setLoading(false);
  };

  const handleSelectFrame = async (frameId: string) => {
    try {
      const res = await fetch(`/api/frames?id=${frameId}&color=${color}&accent=${accent}`);
      const data = await res.json();
      if (data.frame) {
        setSelectedFrame(frameId);
        onSelectFrame({
          id: data.frame.id,
          name: data.frame.name,
          svg: data.frame.svg,
          dataUrl: data.frame.dataUrl
        });
      }
    } catch (error) {
      console.error('Error getting frame:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-4 border-b space-y-3">
        <h3 className="font-semibold text-lg">Photo Frames</h3>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory('')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
              category === '' ? 'bg-purple-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition ${
                category === cat ? 'bg-purple-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Color Pickers */}
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600">Primary:</label>
            <input
              type="color"
              value={`#${color}`}
              onChange={(e) => setColor(e.target.value.replace('#', ''))}
              className="w-8 h-8 rounded cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600">Accent:</label>
            <input
              type="color"
              value={`#${accent}`}
              onChange={(e) => setAccent(e.target.value.replace('#', ''))}
              className="w-8 h-8 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Frames Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
          </div>
        ) : frames.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No frames found</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {frames.map((frame) => (
              <button
                key={frame.id}
                onClick={() => handleSelectFrame(frame.id)}
                className={`relative aspect-[4/3] bg-gray-50 rounded-lg border-2 transition overflow-hidden ${
                  selectedFrame === frame.id
                    ? 'border-purple-600 ring-2 ring-purple-200'
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                <img
                  src={frame.preview}
                  alt={frame.name}
                  className="w-full h-full object-contain p-2"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-white/90 py-1.5 px-2">
                  <p className="text-xs font-medium truncate">{frame.name}</p>
                  <p className="text-[10px] text-gray-500 truncate">{frame.description}</p>
                </div>
                {selectedFrame === frame.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t bg-gray-50 text-xs text-gray-500 text-center">
        {frames.length} frames • Click to apply
      </div>
    </div>
  );
}

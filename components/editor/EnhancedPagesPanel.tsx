'use client';

// javari Scrapbook - Enhanced Pages Panel with Beautiful Page Creation
// Intuitive page management with templates and animations

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useScrapbookStore } from '@/lib/store';
import {
  Plus,
  Copy,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Layout,
  Grid3X3,
  Columns,
  Square,
  RectangleHorizontal,
  Check,
  Sparkles,
  Wand2,
  Image,
  FileText,
  Heart,
  Star,
  Book,
  X,
  Maximize2,
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const pageTemplates = [
  {
    id: 'blank',
    name: 'Blank',
    icon: Square,
    description: 'Empty canvas',
    layout: [],
    color: 'from-gray-400 to-gray-500',
  },
  {
    id: 'single-photo',
    name: 'Single Photo',
    icon: Image,
    description: 'One large photo',
    layout: [{ type: 'photo', x: 100, y: 100, w: 1000, h: 1000 }],
    color: 'from-blue-400 to-indigo-500',
  },
  {
    id: 'two-photos',
    name: 'Two Photos',
    icon: Columns,
    description: 'Side by side',
    layout: [
      { type: 'photo', x: 50, y: 200, w: 500, h: 800 },
      { type: 'photo', x: 650, y: 200, w: 500, h: 800 },
    ],
    color: 'from-green-400 to-emerald-500',
  },
  {
    id: 'grid-4',
    name: 'Grid of 4',
    icon: Grid3X3,
    description: '2×2 grid layout',
    layout: [
      { type: 'photo', x: 50, y: 50, w: 550, h: 550 },
      { type: 'photo', x: 600, y: 50, w: 550, h: 550 },
      { type: 'photo', x: 50, y: 600, w: 550, h: 550 },
      { type: 'photo', x: 600, y: 600, w: 550, h: 550 },
    ],
    color: 'from-purple-400 to-pink-500',
  },
  {
    id: 'title-page',
    name: 'Title Page',
    icon: FileText,
    description: 'Title & subtitle',
    layout: [{ type: 'text', x: 100, y: 400, w: 1000, h: 200, content: 'Your Title Here' }],
    color: 'from-orange-400 to-red-500',
  },
  {
    id: 'collage',
    name: 'Collage',
    icon: Layout,
    description: '5 photo collage',
    layout: [
      { type: 'photo', x: 50, y: 50, w: 700, h: 500 },
      { type: 'photo', x: 760, y: 50, w: 390, h: 245 },
      { type: 'photo', x: 760, y: 305, w: 390, h: 245 },
      { type: 'photo', x: 50, y: 560, w: 545, h: 590 },
      { type: 'photo', x: 605, y: 560, w: 545, h: 590 },
    ],
    color: 'from-cyan-400 to-blue-500',
  },
  {
    id: 'journal',
    name: 'Journal',
    icon: Book,
    description: 'Photo + notes',
    layout: [
      { type: 'photo', x: 50, y: 50, w: 700, h: 800 },
      { type: 'text', x: 800, y: 50, w: 350, h: 800, content: 'Write your story...' },
    ],
    color: 'from-amber-400 to-orange-500',
  },
  {
    id: 'featured',
    name: 'Featured',
    icon: Star,
    description: 'Hero + thumbnails',
    layout: [
      { type: 'photo', x: 50, y: 50, w: 1100, h: 700 },
      { type: 'photo', x: 50, y: 780, w: 350, h: 370 },
      { type: 'photo', x: 420, y: 780, w: 350, h: 370 },
      { type: 'photo', x: 790, y: 780, w: 360, h: 370 },
    ],
    color: 'from-rose-400 to-pink-500',
  },
];

const backgroundPresets = [
  { id: 'white', type: 'solid', color: '#ffffff', name: 'White' },
  { id: 'cream', type: 'solid', color: '#faf8f5', name: 'Cream' },
  { id: 'blush', type: 'solid', color: '#fce7f3', name: 'Blush' },
  { id: 'sage', type: 'solid', color: '#d1fae5', name: 'Sage' },
  { id: 'sky', type: 'solid', color: '#e0f2fe', name: 'Sky' },
  { id: 'lavender', type: 'solid', color: '#ede9fe', name: 'Lavender' },
  { id: 'gradient-sunset', type: 'gradient', colors: ['#fce7f3', '#fef3c7'], name: 'Sunset' },
  { id: 'gradient-ocean', type: 'gradient', colors: ['#e0f2fe', '#d1fae5'], name: 'Ocean' },
];

interface PageThumbnailProps {
  page: any;
  index: number;
  isActive: boolean;
  onClick: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

function PageThumbnail({ page, index, isActive, onClick, onDuplicate, onDelete }: PageThumbnailProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      whileHover={{ y: -4 }}
      className="relative group"
    >
      <button
        onClick={onClick}
        className={`relative w-24 h-28 rounded-xl overflow-hidden transition-all ${
          isActive
            ? 'ring-4 ring-purple-500 ring-offset-2 ring-offset-gray-100 dark:ring-offset-gray-900 shadow-xl'
            : 'ring-2 ring-gray-200 dark:ring-gray-700 hover:ring-purple-300 shadow-md hover:shadow-lg'
        }`}
      >
        {/* Page preview */}
        <div
          className="w-full h-full"
          style={{
            backgroundColor: page.background?.color || '#ffffff',
            backgroundImage: page.background?.gradient
              ? `linear-gradient(135deg, ${page.background.gradient.colors.map((c: any) => c.color).join(', ')})`
              : undefined,
          }}
        >
          {/* Mini element previews */}
          <div className="absolute inset-0 p-1">
            {page.elements.slice(0, 6).map((el: any, i: number) => (
              <div
                key={el.id}
                className="absolute bg-gray-300/50 rounded-sm"
                style={{
                  left: `${(el.position.x / page.width) * 100}%`,
                  top: `${(el.position.y / page.height) * 100}%`,
                  width: `${(el.size.width / page.width) * 100}%`,
                  height: `${(el.size.height / page.height) * 100}%`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Page number */}
        <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 text-white text-xs font-medium rounded">
          {index + 1}
        </div>

        {/* Active indicator */}
        {isActive && (
          <motion.div
            layoutId="active-page-indicator"
            className="absolute inset-0 border-2 border-purple-500 rounded-xl"
          />
        )}
      </button>

      {/* Hover actions */}
      <AnimatePresence>
        {!isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <button
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
              className="w-6 h-6 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
            >
              <MoreHorizontal className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Context menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            className="absolute top-0 right-0 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1 min-w-[140px]"
            onMouseLeave={() => setShowMenu(false)}
          >
            <button
              onClick={(e) => { e.stopPropagation(); onDuplicate(); setShowMenu(false); }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <Copy className="w-4 h-4" /> Duplicate
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); setShowMenu(false); }}
              className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function AddPageButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="w-24 h-28 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 flex flex-col items-center justify-center gap-2 transition-colors group"
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
        <Plus className="w-5 h-5 text-white" />
      </div>
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 group-hover:text-purple-500 transition-colors">
        Add Page
      </span>
    </motion.button>
  );
}

interface NewPageModalProps {
  onClose: () => void;
  onCreatePage: (template: string, background: any) => void;
}

function NewPageModal({ onClose, onCreatePage }: NewPageModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('blank');
  const [selectedBackground, setSelectedBackground] = useState('white');

  const handleCreate = () => {
    const bg = backgroundPresets.find((b) => b.id === selectedBackground);
    onCreatePage(selectedTemplate, bg);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="relative px-8 pt-8 pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Page</h2>
          </div>
          <p className="text-gray-500">Choose a layout and background for your new page</p>
        </div>

        {/* Templates */}
        <div className="px-8 pb-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Page Layout</h3>
          <div className="grid grid-cols-4 gap-3">
            {pageTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`relative p-3 rounded-xl border-2 transition-all text-left ${
                  selectedTemplate === template.id
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center mb-2`}>
                  <template.icon className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white text-xs">{template.name}</h4>
                <p className="text-[10px] text-gray-500 mt-0.5">{template.description}</p>
                {selectedTemplate === template.id && (
                  <motion.div
                    layoutId="template-check"
                    className="absolute top-2 right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 text-white" />
                  </motion.div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Backgrounds */}
        <div className="px-8 pb-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Background</h3>
          <div className="flex gap-3 flex-wrap">
            {backgroundPresets.map((bg) => (
              <button
                key={bg.id}
                onClick={() => setSelectedBackground(bg.id)}
                className={`relative w-12 h-12 rounded-xl border-2 transition-all ${
                  selectedBackground === bg.id
                    ? 'border-purple-500 ring-2 ring-purple-200 dark:ring-purple-800'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
                style={{
                  backgroundColor: bg.type === 'solid' ? bg.color : undefined,
                  backgroundImage: bg.type === 'gradient' ? `linear-gradient(135deg, ${bg.colors?.join(', ')})` : undefined,
                }}
                title={bg.name}
              >
                {selectedBackground === bg.id && (
                  <motion.div
                    layoutId="bg-check"
                    className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center"
                  >
                    <Check className="w-2.5 h-2.5 text-white" />
                  </motion.div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="px-8 pb-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Preview</h3>
          <div className="flex justify-center">
            <div
              className="w-40 h-40 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 relative overflow-hidden"
              style={{
                backgroundColor: backgroundPresets.find((b) => b.id === selectedBackground)?.color || '#fff',
                backgroundImage: backgroundPresets.find((b) => b.id === selectedBackground)?.type === 'gradient'
                  ? `linear-gradient(135deg, ${backgroundPresets.find((b) => b.id === selectedBackground)?.colors?.join(', ')})`
                  : undefined,
              }}
            >
              {/* Layout preview */}
              {pageTemplates.find((t) => t.id === selectedTemplate)?.layout.map((item: any, i: number) => (
                <div
                  key={i}
                  className={`absolute rounded-sm ${
                    item.type === 'photo' ? 'bg-gray-300/50' : 'bg-purple-300/50'
                  }`}
                  style={{
                    left: `${(item.x / 1200) * 100}%`,
                    top: `${(item.y / 1200) * 100}%`,
                    width: `${(item.w / 1200) * 100}%`,
                    height: `${(item.h / 1200) * 100}%`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-8 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Page
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function EnhancedPagesPanel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showNewPageModal, setShowNewPageModal] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const {
    scrapbook,
    currentPageIndex,
    setCurrentPage,
    addPage,
    duplicatePage,
    deletePage,
  } = useScrapbookStore();

  const pages = scrapbook?.pages || [];

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [pages.length]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 300);
    }
  };

  const handleCreatePage = (templateId: string, background: any) => {
    const template = pageTemplates.find((t) => t.id === templateId);
    // Add page with template layout
    addPage();
    // Could apply template layout here
  };

  return (
    <>
      <div className="h-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center px-4 gap-4">
        {/* Page counter & info */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3 py-1.5 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 rounded-lg">
            <span className="text-sm font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              Page {currentPageIndex + 1} of {pages.length}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Pages scroll area */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex-1 flex items-center gap-4 overflow-x-auto scrollbar-hide py-2 px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <AnimatePresence mode="popLayout">
            {pages.map((page, index) => (
              <PageThumbnail
                key={page.id}
                page={page}
                index={index}
                isActive={index === currentPageIndex}
                onClick={() => setCurrentPage(index)}
                onDuplicate={() => duplicatePage(index)}
                onDelete={() => pages.length > 1 && deletePage(index)}
              />
            ))}
          </AnimatePresence>

          <AddPageButton onClick={() => setShowNewPageModal(true)} />
        </div>

        {/* Navigation */}
        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Quick actions */}
        <div className="flex items-center gap-2 shrink-0 border-l border-gray-200 dark:border-gray-700 pl-4">
          <button
            onClick={() => setShowNewPageModal(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Add page with template"
          >
            <Wand2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => duplicatePage(currentPageIndex)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Duplicate current page"
          >
            <Copy className="w-5 h-5" />
          </button>
          <button
            onClick={() => {}}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Full screen preview"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* New Page Modal */}
      <AnimatePresence>
        {showNewPageModal && (
          <NewPageModal
            onClose={() => setShowNewPageModal(false)}
            onCreatePage={handleCreatePage}
          />
        )}
      </AnimatePresence>
    </>
  );
}
// Build trigger: 2025-12-14T18:23:25.597845

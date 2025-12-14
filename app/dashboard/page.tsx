'use client';

// CRAV Scrapbook - Beautiful Dashboard with Album Gallery
// World-class UI for managing scrapbooks

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Plus,
  Search,
  Grid3X3,
  List,
  Star,
  Clock,
  Folder,
  MoreHorizontal,
  Heart,
  Share2,
  Trash2,
  Copy,
  Edit3,
  Download,
  Eye,
  Sparkles,
  BookOpen,
  Image as ImageIcon,
  Calendar,
  Filter,
  SortAsc,
  ChevronDown,
  X,
  Check,
  Loader2,
} from 'lucide-react';

interface Scrapbook {
  id: string;
  title: string;
  description: string;
  coverImage: string | null;
  pageCount: number;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  isPublic: boolean;
  tags: string[];
  category: string;
}

// Demo data
const demoScrapbooks: Scrapbook[] = [
  {
    id: '1',
    title: 'Summer Vacation 2024',
    description: 'Memories from our beach trip',
    coverImage: null,
    pageCount: 12,
    createdAt: '2024-07-15',
    updatedAt: '2024-07-20',
    isFavorite: true,
    isPublic: false,
    tags: ['vacation', 'beach', 'family'],
    category: 'Travel',
  },
  {
    id: '2',
    title: "Emma's First Birthday",
    description: 'Celebrating our little one',
    coverImage: null,
    pageCount: 8,
    createdAt: '2024-06-01',
    updatedAt: '2024-06-05',
    isFavorite: true,
    isPublic: true,
    tags: ['birthday', 'baby', 'celebration'],
    category: 'Celebrations',
  },
  {
    id: '3',
    title: 'Wedding Memories',
    description: 'Our special day',
    coverImage: null,
    pageCount: 24,
    createdAt: '2024-03-10',
    updatedAt: '2024-03-15',
    isFavorite: false,
    isPublic: false,
    tags: ['wedding', 'love'],
    category: 'Love',
  },
];

const categories = [
  { name: 'All', icon: Grid3X3, count: 12 },
  { name: 'Favorites', icon: Star, count: 3 },
  { name: 'Recent', icon: Clock, count: 5 },
  { name: 'Travel', icon: Folder, count: 4 },
  { name: 'Celebrations', icon: Folder, count: 3 },
  { name: 'Family', icon: Folder, count: 2 },
  { name: 'Love', icon: Heart, count: 2 },
];

const coverGradients = [
  'from-pink-400 via-purple-400 to-indigo-400',
  'from-orange-400 via-red-400 to-pink-400',
  'from-green-400 via-teal-400 to-blue-400',
  'from-yellow-400 via-orange-400 to-red-400',
  'from-indigo-400 via-purple-400 to-pink-400',
  'from-cyan-400 via-blue-400 to-indigo-400',
];

function ScrapbookCard({ scrapbook, index, viewMode }: { scrapbook: Scrapbook; index: number; viewMode: 'grid' | 'list' }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const gradient = coverGradients[index % coverGradients.length];

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="group flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all"
      >
        <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">{scrapbook.title}</h3>
            {scrapbook.isFavorite && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
            {scrapbook.isPublic && <Eye className="w-4 h-4 text-green-500" />}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{scrapbook.description}</p>
          <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
            <span>{scrapbook.pageCount} pages</span>
            <span>Updated {new Date(scrapbook.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {scrapbook.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full">{tag}</span>
          ))}
        </div>
        <Link href={`/editor/${scrapbook.id}`} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
          Open
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 200 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <Link href={`/editor/${scrapbook.id}`}>
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300">
          {/* Cover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}>
            <div className="absolute inset-0 bg-black/5" />
            {/* Decorative elements */}
            <div className="absolute top-4 left-4 w-24 h-24 bg-white/20 rounded-full blur-2xl" />
            <div className="absolute bottom-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            {/* Book spine effect */}
            <div className="absolute left-0 top-0 bottom-0 w-4 bg-black/10" />
          </div>

          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <motion.div
              initial={false}
              animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0.8 }}
              className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-4 shadow-lg"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white truncate text-lg">{scrapbook.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">{scrapbook.description}</p>
                </div>
                {scrapbook.isFavorite && (
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 shrink-0" />
                )}
              </div>
              
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5" />
                    {scrapbook.pageCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(scrapbook.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium">
                  {scrapbook.category}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Hover actions */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-4 right-4 flex items-center gap-2"
              >
                <button
                  onClick={(e) => { e.preventDefault(); }}
                  className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  <Heart className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
                <button
                  onClick={(e) => { e.preventDefault(); setShowMenu(!showMenu); }}
                  className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Public badge */}
          {scrapbook.isPublic && (
            <div className="absolute top-4 left-4 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
              <Eye className="w-3 h-3" /> Public
            </div>
          )}
        </div>
      </Link>

      {/* Context menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute top-16 right-4 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 min-w-[180px]"
          >
            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3">
              <Edit3 className="w-4 h-4" /> Rename
            </button>
            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3">
              <Copy className="w-4 h-4" /> Duplicate
            </button>
            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3">
              <Share2 className="w-4 h-4" /> Share
            </button>
            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3">
              <Download className="w-4 h-4" /> Export PDF
            </button>
            <div className="my-2 border-t border-gray-200 dark:border-gray-700" />
            <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function EmptyState({ onCreateNew }: { onCreateNew: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20"
    >
      <div className="relative mb-8">
        <div className="w-32 h-32 bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 rounded-3xl flex items-center justify-center shadow-2xl">
          <BookOpen className="w-16 h-16 text-white" />
        </div>
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg"
        >
          <Sparkles className="w-6 h-6 text-white" />
        </motion.div>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Start Your First Scrapbook</h2>
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-8">
        Preserve your precious memories with beautiful digital scrapbooks. Add photos, stickers, and personal touches.
      </p>
      <button
        onClick={onCreateNew}
        className="px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-3"
      >
        <Plus className="w-6 h-6" />
        Create Your First Scrapbook
      </button>
    </motion.div>
  );
}

export default function Dashboard() {
  const [scrapbooks, setScrapbooks] = useState<Scrapbook[]>(demoScrapbooks);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showNewModal, setShowNewModal] = useState(false);
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'name'>('updated');

  const filteredScrapbooks = scrapbooks.filter((sb) => {
    const matchesSearch = sb.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sb.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sb.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeCategory === 'All') return matchesSearch;
    if (activeCategory === 'Favorites') return matchesSearch && sb.isFavorite;
    if (activeCategory === 'Recent') return matchesSearch;
    return matchesSearch && sb.category === activeCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                  CRAV Scrapbook
                </h1>
                <p className="text-xs text-gray-500">Your Story. Our Design.</p>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search scrapbooks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl border-0 focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
              
              <button
                onClick={() => setShowNewModal(true)}
                className="px-5 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New Scrapbook
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 shrink-0">
            <nav className="sticky top-28 space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    activeCategory === cat.name
                      ? 'bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 text-purple-600 dark:text-purple-400 font-semibold'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <cat.icon className="w-5 h-5" />
                  <span className="flex-1">{cat.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activeCategory === cat.name ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{activeCategory}</h2>
                <p className="text-sm text-gray-500">{filteredScrapbooks.length} scrapbooks</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                  <SortAsc className="w-4 h-4" />
                  Sort by: {sortBy}
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrapbooks grid/list */}
            {filteredScrapbooks.length === 0 ? (
              <EmptyState onCreateNew={() => setShowNewModal(true)} />
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredScrapbooks.map((scrapbook, index) => (
                  <ScrapbookCard key={scrapbook.id} scrapbook={scrapbook} index={index} viewMode="grid" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredScrapbooks.map((scrapbook, index) => (
                  <ScrapbookCard key={scrapbook.id} scrapbook={scrapbook} index={index} viewMode="list" />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* New Scrapbook Modal */}
      <AnimatePresence>
        {showNewModal && (
          <NewScrapbookModal onClose={() => setShowNewModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// New Scrapbook Creation Modal
function NewScrapbookModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState('12x12');
  const [isCreating, setIsCreating] = useState(false);

  const templates = [
    { id: 'blank', name: 'Blank Canvas', icon: '📄', description: 'Start from scratch', color: 'from-gray-400 to-gray-500' },
    { id: 'photo-album', name: 'Photo Album', icon: '📸', description: 'Classic photo layouts', color: 'from-blue-400 to-indigo-500' },
    { id: 'baby-book', name: 'Baby Book', icon: '👶', description: 'Milestones & memories', color: 'from-pink-400 to-rose-500' },
    { id: 'travel', name: 'Travel Journal', icon: '✈️', description: 'Adventure awaits', color: 'from-orange-400 to-amber-500' },
    { id: 'wedding', name: 'Wedding Album', icon: '💒', description: 'Your special day', color: 'from-purple-400 to-pink-500' },
    { id: 'graduation', name: 'Graduation', icon: '🎓', description: 'Celebrate achievements', color: 'from-green-400 to-emerald-500' },
    { id: 'birthday', name: 'Birthday Party', icon: '🎂', description: 'Party memories', color: 'from-yellow-400 to-orange-500' },
    { id: 'holiday', name: 'Holiday Album', icon: '🎄', description: 'Seasonal celebrations', color: 'from-red-400 to-rose-500' },
  ];

  const sizes = [
    { id: '8x8', name: '8×8 inch', description: 'Compact', pixels: '800×800' },
    { id: '12x12', name: '12×12 inch', description: 'Standard', pixels: '1200×1200', popular: true },
    { id: '8x10', name: '8×10 inch', description: 'Portrait', pixels: '800×1000' },
    { id: '11x8.5', name: '11×8.5 inch', description: 'Landscape', pixels: '1100×850' },
  ];

  const handleCreate = async () => {
    setIsCreating(true);
    await new Promise((r) => setTimeout(r, 1500));
    window.location.href = '/editor/new';
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
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="relative px-8 pt-8 pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Progress */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  step >= s
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}>
                  {step > s ? <Check className="w-4 h-4" /> : s}
                </div>
                {s < 3 && (
                  <div className={`flex-1 h-1 rounded ${step > s ? 'bg-gradient-to-r from-pink-500 to-purple-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {step === 1 && '✨ Choose a Template'}
            {step === 2 && '📐 Select Size'}
            {step === 3 && '📝 Name Your Scrapbook'}
          </h2>
          <p className="text-gray-500 mt-1">
            {step === 1 && 'Pick a starting point for your masterpiece'}
            {step === 2 && 'Choose the perfect dimensions'}
            {step === 3 && 'Give your scrapbook a memorable name'}
          </p>
        </div>

        {/* Content */}
        <div className="px-8 pb-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="templates"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-4 gap-4"
              >
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`relative p-4 rounded-2xl border-2 transition-all text-left ${
                      selectedTemplate === template.id
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center text-2xl mb-3`}>
                      {template.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{template.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{template.description}</p>
                    {selectedTemplate === template.id && (
                      <motion.div
                        layoutId="check"
                        className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </button>
                ))}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="sizes"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-2 gap-4"
              >
                {sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.id)}
                    className={`relative p-6 rounded-2xl border-2 transition-all text-left ${
                      selectedSize === size.id
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    {size.popular && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-semibold rounded-full">
                        Popular
                      </span>
                    )}
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white">{size.name}</h3>
                    <p className="text-gray-500 mt-1">{size.description}</p>
                    <p className="text-sm text-gray-400 mt-2">{size.pixels} px</p>
                    {selectedSize === size.id && (
                      <motion.div
                        layoutId="check"
                        className="absolute bottom-4 right-4 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </button>
                ))}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="name"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Scrapbook Name
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="My Amazing Scrapbook"
                    className="w-full px-4 py-4 text-lg border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:ring-0 bg-transparent"
                    autoFocus
                  />
                </div>

                {/* Preview */}
                <div className="bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 dark:from-pink-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-6">
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Preview</h4>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-24 bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 rounded-lg shadow-lg flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">{title || 'Untitled Scrapbook'}</h3>
                      <p className="text-sm text-gray-500">
                        {templates.find((t) => t.id === selectedTemplate)?.name} • {selectedSize} inch
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <button
            onClick={() => step > 1 && setStep(step - 1)}
            disabled={step === 1}
            className="px-6 py-3 text-gray-600 dark:text-gray-400 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            Back
          </button>
          <button
            onClick={() => {
              if (step < 3) setStep(step + 1);
              else handleCreate();
            }}
            disabled={(step === 1 && !selectedTemplate) || isCreating}
            className="px-8 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating...
              </>
            ) : step < 3 ? (
              'Continue'
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Create Scrapbook
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
// Last updated: 2025-12-14T18:21:04.935776

'use client';

// app/dashboard/page.tsx
// Complete scrapbook dashboard with gallery view

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Plus, Search, Grid, List, Filter, SortAsc, SortDesc,
  Heart, Eye, Users, Calendar, MoreVertical, Trash2, Copy,
  Share2, Download, Edit3, Star, Folder, Clock, TrendingUp,
  Sparkles, BookOpen, Image, Loader2, ChevronDown
} from 'lucide-react';

interface Scrapbook {
  id: string;
  title: string;
  description: string;
  coverImage: string | null;
  pageCount: number;
  isPublic: boolean;
  isFavorite: boolean;
  viewCount: number;
  likeCount: number;
  collaboratorCount: number;
  createdAt: string;
  updatedAt: string;
}

type ViewMode = 'grid' | 'list';
type SortBy = 'updated_at' | 'created_at' | 'title' | 'view_count';
type FilterBy = 'all' | 'favorites' | 'shared' | 'public';

export default function DashboardPage() {
  const [scrapbooks, setScrapbooks] = useState<Scrapbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('updated_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterBy, setFilterBy] = useState<FilterBy>('all');
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedScrapbook, setSelectedScrapbook] = useState<string | null>(null);

  useEffect(() => {
    fetchScrapbooks();
  }, [filterBy, sortBy, sortOrder]);

  const fetchScrapbooks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        filter: filterBy,
        sort: sortBy,
        order: sortOrder
      });
      const response = await fetch(`/api/scrapbooks?${params}`);
      const data = await response.json();
      setScrapbooks(data.scrapbooks || []);
    } catch (error) {
      console.error('Failed to fetch scrapbooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredScrapbooks = useMemo(() => {
    if (!search) return scrapbooks;
    const searchLower = search.toLowerCase();
    return scrapbooks.filter(s =>
      s.title.toLowerCase().includes(searchLower) ||
      s.description?.toLowerCase().includes(searchLower)
    );
  }, [scrapbooks, search]);

  const stats = useMemo(() => ({
    total: scrapbooks.length,
    totalPages: scrapbooks.reduce((sum, s) => sum + (s.pageCount || 0), 0),
    totalViews: scrapbooks.reduce((sum, s) => sum + (s.viewCount || 0), 0),
    public: scrapbooks.filter(s => s.isPublic).length
  }), [scrapbooks]);

  const deleteScrapbook = async (id: string) => {
    if (!confirm('Are you sure you want to delete this scrapbook?')) return;
    try {
      await fetch(`/api/scrapbooks/${id}`, { method: 'DELETE' });
      fetchScrapbooks();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const duplicateScrapbook = async (id: string) => {
    try {
      const response = await fetch(`/api/scrapbooks/${id}/duplicate`, { method: 'POST' });
      if (response.ok) {
        fetchScrapbooks();
      }
    } catch (error) {
      console.error('Failed to duplicate:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  javari Scrapbook
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/editor/new"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition"
              >
                <Plus className="w-5 h-5" />
                New Scrapbook
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-pink-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                <p className="text-sm text-gray-500">Scrapbooks</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Image className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalPages}</p>
                <p className="text-sm text-gray-500">Total Pages</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalViews}</p>
                <p className="text-sm text-gray-500">Total Views</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Share2 className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.public}</p>
                <p className="text-sm text-gray-500">Public</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search scrapbooks..."
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Filter */}
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as FilterBy)}
              className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm"
            >
              <option value="all">All Scrapbooks</option>
              <option value="favorites">Favorites</option>
              <option value="shared">Shared with Me</option>
              <option value="public">Public</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm"
            >
              <option value="updated_at">Last Modified</option>
              <option value="created_at">Date Created</option>
              <option value="title">Title</option>
              <option value="view_count">Most Viewed</option>
            </select>

            {/* Sort Order */}
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {sortOrder === 'desc' ? <SortDesc className="w-5 h-5" /> : <SortAsc className="w-5 h-5" />}
            </button>

            {/* View Toggle */}
            <div className="flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 ${viewMode === 'grid' ? 'bg-pink-500 text-white' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 ${viewMode === 'list' ? 'bg-pink-500 text-white' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrapbook Grid/List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
          </div>
        ) : filteredScrapbooks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No scrapbooks yet</h3>
            <p className="text-gray-500 mb-6">Create your first scrapbook and start preserving memories!</p>
            <Link
              href="/editor/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-medium hover:opacity-90"
            >
              <Plus className="w-5 h-5" />
              Create Your First Scrapbook
            </Link>
          </motion.div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredScrapbooks.map((scrapbook, index) => (
              <motion.div
                key={scrapbook.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <Link href={`/editor/${scrapbook.id}`}>
                  <div className="aspect-[4/3] bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 relative overflow-hidden">
                    {scrapbook.coverImage ? (
                      <img
                        src={scrapbook.coverImage}
                        alt={scrapbook.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-pink-300 dark:text-pink-700" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Link href={`/editor/${scrapbook.id}`}>
                      <h3 className="font-bold text-gray-900 dark:text-white hover:text-pink-500 transition line-clamp-1">
                        {scrapbook.title}
                      </h3>
                    </Link>
                    <div className="relative">
                      <button
                        onClick={() => setSelectedScrapbook(selectedScrapbook === scrapbook.id ? null : scrapbook.id)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      <AnimatePresence>
                        {selectedScrapbook === scrapbook.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute right-0 top-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 w-40 z-10"
                          >
                            <button
                              onClick={() => duplicateScrapbook(scrapbook.id)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                            >
                              <Copy className="w-4 h-4" /> Duplicate
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                              <Share2 className="w-4 h-4" /> Share
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                              <Download className="w-4 h-4" /> Export
                            </button>
                            <hr className="my-2 border-gray-200 dark:border-gray-700" />
                            <button
                              onClick={() => deleteScrapbook(scrapbook.id)}
                              className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{scrapbook.description || 'No description'}</p>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Image className="w-3 h-3" /> {scrapbook.pageCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {scrapbook.viewCount}
                      </span>
                      {scrapbook.collaboratorCount > 0 && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" /> {scrapbook.collaboratorCount}
                        </span>
                      )}
                    </div>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(scrapbook.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredScrapbooks.map((scrapbook, index) => (
              <motion.div
                key={scrapbook.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition"
              >
                <Link href={`/editor/${scrapbook.id}`} className="shrink-0">
                  <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 overflow-hidden">
                    {scrapbook.coverImage ? (
                      <img src={scrapbook.coverImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-pink-300" />
                      </div>
                    )}
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <Link href={`/editor/${scrapbook.id}`}>
                    <h3 className="font-bold text-gray-900 dark:text-white hover:text-pink-500">{scrapbook.title}</h3>
                  </Link>
                  <p className="text-sm text-gray-500 truncate">{scrapbook.description || 'No description'}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span>{scrapbook.pageCount} pages</span>
                    <span>{scrapbook.viewCount} views</span>
                    <span>Updated {new Date(scrapbook.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/editor/${scrapbook.id}`}
                    className="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-medium hover:bg-pink-600"
                  >
                    Open
                  </Link>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

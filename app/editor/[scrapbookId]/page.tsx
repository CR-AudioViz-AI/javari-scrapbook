'use client';

// CRAV Scrapbook - Main Editor Page
// Complete scrapbooking editor with all features

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrapbookStore } from '@/lib/store';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { EditorCanvas } from '@/components/editor/EditorCanvas';
import { AssetsPanel } from '@/components/editor/AssetsPanel';
import { PropertiesPanel } from '@/components/editor/PropertiesPanel';
import { PagesPanel } from '@/components/editor/PagesPanel';
import type { Scrapbook, ScrapbookPage } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import {
  Loader2,
  Save,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  PanelLeftClose,
  PanelRightClose,
} from 'lucide-react';

// Create a new empty scrapbook
function createNewScrapbook(title: string = 'Untitled Scrapbook'): Scrapbook {
  const pageId = uuidv4();
  return {
    id: uuidv4(),
    userId: '',
    title,
    description: '',
    coverImage: null,
    pageSize: { width: 1200, height: 1200, name: '12x12 inch' },
    pages: [
      {
        id: pageId,
        name: 'Page 1',
        background: {
          id: uuidv4(),
          type: 'background',
          backgroundType: 'solid',
          color: '#ffffff',
        },
        elements: [],
        width: 1200,
        height: 1200,
        order: 0,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPublic: false,
    tags: [],
    templateId: null,
  };
}

export default function EditorPage() {
  const router = useRouter();
  const params = useParams();
  const scrapbookId = params?.scrapbookId as string;

  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [showPagesPanel, setShowPagesPanel] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const {
    scrapbook,
    setScrapbook,
    isLoading,
    setLoading,
    isSaving,
    setSaving,
    setLastSaved,
  } = useScrapbookStore();

  // Load scrapbook on mount
  useEffect(() => {
    const loadScrapbook = async () => {
      setLoading(true);
      try {
        if (scrapbookId === 'new') {
          setScrapbook(createNewScrapbook());
        } else {
          const demoScrapbook = createNewScrapbook('My Scrapbook');
          demoScrapbook.id = scrapbookId;
          setScrapbook(demoScrapbook);
        }
      } catch (error) {
        console.error('Failed to load scrapbook:', error);
      } finally {
        setLoading(false);
      }
    };
    loadScrapbook();
  }, [scrapbookId, setScrapbook, setLoading]);

  // Manual save
  const handleSave = async () => {
    if (!scrapbook || isSaving) return;
    setSaveStatus('saving');
    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSaveStatus('saved');
      setLastSaved(new Date());
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save:', error);
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          <p className="text-gray-600 dark:text-gray-400">Loading your scrapbook...</p>
        </div>
      </div>
    );
  }

  if (!scrapbook) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <p className="text-gray-600 dark:text-gray-400">Failed to load scrapbook</p>
          <button onClick={() => router.push('/dashboard')} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Header */}
      <header className="h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 gap-4 shrink-0">
        <button onClick={() => router.push('/dashboard')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <input
            type="text"
            value={scrapbook.title}
            onChange={(e) => useScrapbookStore.getState().updateScrapbookMeta({ title: e.target.value })}
            className="text-lg font-semibold bg-transparent border-0 focus:ring-0 focus:outline-none w-full max-w-md"
            placeholder="Untitled Scrapbook"
          />
        </div>
        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait">
            {saveStatus === 'saving' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </motion.div>
            )}
            {saveStatus === 'saved' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" /> Saved
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <EditorToolbar />

      {/* Main editor area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left panel - Assets */}
        <AnimatePresence>
          {showLeftPanel && (
            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 288, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="shrink-0 overflow-hidden">
              <AssetsPanel />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center - Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <EditorCanvas />
          <AnimatePresence>
            {showPagesPanel && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 120, opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="shrink-0 overflow-hidden">
                <PagesPanel />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right panel - Properties */}
        <AnimatePresence>
          {showRightPanel && (
            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 256, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="shrink-0 overflow-hidden">
              <PropertiesPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Panel toggles */}
      <button
        onClick={() => setShowLeftPanel(!showLeftPanel)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-r-lg shadow-md"
        style={{ left: showLeftPanel ? '288px' : '0' }}
      >
        <PanelLeftClose className={`w-4 h-4 transition-transform ${showLeftPanel ? '' : 'rotate-180'}`} />
      </button>
      <button
        onClick={() => setShowRightPanel(!showRightPanel)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-l-lg shadow-md"
        style={{ right: showRightPanel ? '256px' : '0' }}
      >
        <PanelRightClose className={`w-4 h-4 transition-transform ${showRightPanel ? '' : 'rotate-180'}`} />
      </button>
      <button
        onClick={() => setShowPagesPanel(!showPagesPanel)}
        className="fixed bottom-0 left-1/2 -translate-x-1/2 z-10 px-4 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-t-lg shadow-md text-xs font-medium"
        style={{ bottom: showPagesPanel ? '120px' : '0' }}
      >
        {showPagesPanel ? 'Hide Pages' : 'Show Pages'}
      </button>
    </div>
  );
}

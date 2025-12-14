'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrapbookStore } from '@/lib/store';
import { Plus, Copy, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

export function PagesPanel() {
  const [contextMenu, setContextMenu] = useState<{ pageIndex: number; x: number; y: number } | null>(null);
  const { scrapbook, currentPageIndex, setCurrentPage, addPage, deletePage, duplicatePage, reorderPages } = useScrapbookStore();

  if (!scrapbook) return null;

  const handleContextMenu = (e: React.MouseEvent, pageIndex: number) => { e.preventDefault(); setContextMenu({ pageIndex, x: e.clientX, y: e.clientY }); };
  const closeContextMenu = () => setContextMenu(null);

  return (
    <div className="h-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex flex-col" onClick={closeContextMenu}>
      <div className="h-8 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
        <span className="text-xs font-medium text-gray-500">Pages ({scrapbook.pages.length})</span>
        <button onClick={() => addPage(currentPageIndex)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors" title="Add page"><Plus className="w-4 h-4" /></button>
      </div>
      <div className="flex-1 flex items-center px-4 gap-3 overflow-x-auto">
        <button onClick={() => setCurrentPage(Math.max(0, currentPageIndex - 1))} disabled={currentPageIndex === 0} className="shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><ChevronLeft className="w-4 h-4" /></button>
        <div className="flex items-center gap-3 py-2">
          <AnimatePresence mode="popLayout">
            {scrapbook.pages.map((page, index) => (
              <motion.div key={page.id} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="relative group">
                <motion.button onClick={() => setCurrentPage(index)} onContextMenu={(e) => handleContextMenu(e, index)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${currentPageIndex === index ? 'border-blue-500 shadow-lg' : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'}`}>
                  <div className="w-full h-full" style={{ backgroundColor: page.background.backgroundType === 'solid' ? page.background.color : '#ffffff', background: page.background.backgroundType === 'gradient' && page.background.gradient ? `linear-gradient(${page.background.gradient.angle || 0}deg, ${page.background.gradient.colors.map(c => c.color).join(', ')})` : undefined }}>
                    <div className="relative w-full h-full" style={{ transform: 'scale(0.05)', transformOrigin: 'top left' }}>
                      {page.elements.slice(0, 5).map((el) => (<div key={el.id} className="absolute bg-gray-300 dark:bg-gray-600 rounded" style={{ left: el.position.x * 0.05, top: el.position.y * 0.05, width: el.size.width * 0.05, height: el.size.height * 0.05 }} />))}
                    </div>
                  </div>
                  <span className="absolute bottom-0.5 right-0.5 text-[8px] font-bold bg-black/50 text-white px-1 rounded">{index + 1}</span>
                </motion.button>
                <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5">
                  <button onClick={(e) => { e.stopPropagation(); duplicatePage(index); }} className="p-1 bg-gray-800 text-white rounded-full hover:bg-gray-700" title="Duplicate page"><Copy className="w-3 h-3" /></button>
                  {scrapbook.pages.length > 1 && (<button onClick={(e) => { e.stopPropagation(); deletePage(index); }} className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600" title="Delete page"><Trash2 className="w-3 h-3" /></button>)}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => addPage()} className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center justify-center transition-colors"><Plus className="w-6 h-6 text-gray-400" /></motion.button>
        </div>
        <button onClick={() => setCurrentPage(Math.min(scrapbook.pages.length - 1, currentPageIndex + 1))} disabled={currentPageIndex === scrapbook.pages.length - 1} className="shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><ChevronRight className="w-4 h-4" /></button>
      </div>
      <AnimatePresence>
        {contextMenu && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 min-w-[160px]" style={{ left: contextMenu.x, top: contextMenu.y - 100 }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => { duplicatePage(contextMenu.pageIndex); closeContextMenu(); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"><Copy className="w-4 h-4" />Duplicate Page</button>
            <button onClick={() => { addPage(contextMenu.pageIndex); closeContextMenu(); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"><Plus className="w-4 h-4" />Add Page After</button>
            {scrapbook.pages.length > 1 && (<><div className="border-t border-gray-200 dark:border-gray-700 my-1" /><button onClick={() => { deletePage(contextMenu.pageIndex); closeContextMenu(); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="w-4 h-4" />Delete Page</button></>)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PagesPanel;

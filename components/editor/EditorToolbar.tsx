'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useScrapbookStore, createPhotoElement, createTextElement, createShapeElement } from '@/lib/store';
import { MousePointer2, Type, Square, Circle, Triangle, Star, Heart, Image, Hand, Undo2, Redo2, Copy, Clipboard, Trash2, Grid3X3, Ruler, Save, ArrowUpToLine, ArrowDownToLine, ArrowUp, ArrowDown, FlipHorizontal, FlipVertical, Lock, Unlock, Eye, EyeOff } from 'lucide-react';

interface ToolButtonProps { icon: React.ReactNode; label: string; active?: boolean; onClick: () => void; disabled?: boolean; }
function ToolButton({ icon, label, active, onClick, disabled }: ToolButtonProps) {
  return (
    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onClick} disabled={disabled}
      className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${active ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} title={label}>
      {icon}<span className="text-xs mt-1 hidden xl:block">{label}</span>
    </motion.button>
  );
}
function Divider() { return <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-1" />; }

export function EditorToolbar() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { editor, setActiveTool, toggleGrid, toggleRulers, undo, redo, copy, paste, deleteSelectedElements, addElement, updateElement, bringToFront, sendToBack, bringForward, sendBackward, getSelectedElements, getCurrentPage, isSaving } = useScrapbookStore();
  const currentPage = getCurrentPage();
  const selectedElements = getSelectedElements();
  const hasSelection = selectedElements.length > 0;
  const canUndo = editor.undoStack.length > 0;
  const canRedo = editor.redoStack.length > 0;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !currentPage) return;
    Array.from(files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        const img = new window.Image();
        img.onload = () => {
          const maxW = currentPage.width * 0.5, maxH = currentPage.height * 0.5;
          let w = img.width, h = img.height;
          if (w > maxW) { h = (maxW / w) * h; w = maxW; }
          if (h > maxH) { w = (maxH / h) * w; h = maxH; }
          addElement(createPhotoElement(src, { x: 50 + (index * 30), y: 50 + (index * 30) }, { width: w, height: h }));
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleAddText = () => { if (currentPage) { addElement(createTextElement('Double-click to edit', { x: currentPage.width / 2 - 100, y: currentPage.height / 2 - 25 })); setActiveTool('select'); } };
  const handleAddShape = (shapeType: 'rectangle' | 'circle' | 'triangle' | 'star' | 'heart') => { if (currentPage) { addElement(createShapeElement(shapeType, { x: currentPage.width / 2 - 50, y: currentPage.height / 2 - 50 }, { width: 100, height: 100 })); setActiveTool('select'); } };
  const handleToggleVisibility = () => { selectedElements.forEach(el => updateElement(el.id, { visible: !el.visible })); };
  const handleToggleLock = () => { selectedElements.forEach(el => updateElement(el.id, { locked: !el.locked })); };
  const handleFlip = (dir: 'horizontal' | 'vertical') => { selectedElements.forEach(el => updateElement(el.id, { transform: { ...el.transform, flipX: dir === 'horizontal' ? !el.transform.flipX : el.transform.flipX, flipY: dir === 'vertical' ? !el.transform.flipY : el.transform.flipY } })); };

  return (
    <div className="h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 gap-1">
      <div className="flex items-center gap-1">
        <ToolButton icon={<Save className="w-5 h-5" />} label="Save" onClick={() => {}} disabled={isSaving} />
      </div>
      <Divider />
      <div className="flex items-center gap-1">
        <ToolButton icon={<Undo2 className="w-5 h-5" />} label="Undo" onClick={undo} disabled={!canUndo} />
        <ToolButton icon={<Redo2 className="w-5 h-5" />} label="Redo" onClick={redo} disabled={!canRedo} />
      </div>
      <Divider />
      <div className="flex items-center gap-1">
        <ToolButton icon={<MousePointer2 className="w-5 h-5" />} label="Select" active={editor.activeTool === 'select'} onClick={() => setActiveTool('select')} />
        <ToolButton icon={<Hand className="w-5 h-5" />} label="Pan" active={editor.activeTool === 'pan'} onClick={() => setActiveTool('pan')} />
      </div>
      <Divider />
      <div className="flex items-center gap-1">
        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
        <ToolButton icon={<Image className="w-5 h-5" />} label="Photo" onClick={() => fileInputRef.current?.click()} />
        <ToolButton icon={<Type className="w-5 h-5" />} label="Text" onClick={handleAddText} />
        <div className="relative group">
          <ToolButton icon={<Square className="w-5 h-5" />} label="Shapes" onClick={() => handleAddShape('rectangle')} />
          <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-2 hidden group-hover:flex flex-col gap-1 z-50 min-w-[120px]">
            <button onClick={() => handleAddShape('rectangle')} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><Square className="w-4 h-4" /> Rectangle</button>
            <button onClick={() => handleAddShape('circle')} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><Circle className="w-4 h-4" /> Circle</button>
            <button onClick={() => handleAddShape('triangle')} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><Triangle className="w-4 h-4" /> Triangle</button>
            <button onClick={() => handleAddShape('star')} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><Star className="w-4 h-4" /> Star</button>
            <button onClick={() => handleAddShape('heart')} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><Heart className="w-4 h-4" /> Heart</button>
          </div>
        </div>
      </div>
      <Divider />
      <div className="flex items-center gap-1">
        <ToolButton icon={<Copy className="w-5 h-5" />} label="Copy" onClick={copy} disabled={!hasSelection} />
        <ToolButton icon={<Clipboard className="w-5 h-5" />} label="Paste" onClick={paste} disabled={!editor.clipboard} />
        <ToolButton icon={<Trash2 className="w-5 h-5" />} label="Delete" onClick={deleteSelectedElements} disabled={!hasSelection} />
      </div>
      <Divider />
      <div className="flex items-center gap-1">
        <ToolButton icon={<ArrowUpToLine className="w-5 h-5" />} label="Front" onClick={() => selectedElements.forEach(el => bringToFront(el.id))} disabled={!hasSelection} />
        <ToolButton icon={<ArrowDownToLine className="w-5 h-5" />} label="Back" onClick={() => selectedElements.forEach(el => sendToBack(el.id))} disabled={!hasSelection} />
        <ToolButton icon={<ArrowUp className="w-5 h-5" />} label="Forward" onClick={() => selectedElements.forEach(el => bringForward(el.id))} disabled={!hasSelection} />
        <ToolButton icon={<ArrowDown className="w-5 h-5" />} label="Backward" onClick={() => selectedElements.forEach(el => sendBackward(el.id))} disabled={!hasSelection} />
      </div>
      <Divider />
      <div className="flex items-center gap-1">
        <ToolButton icon={<FlipHorizontal className="w-5 h-5" />} label="Flip H" onClick={() => handleFlip('horizontal')} disabled={!hasSelection} />
        <ToolButton icon={<FlipVertical className="w-5 h-5" />} label="Flip V" onClick={() => handleFlip('vertical')} disabled={!hasSelection} />
        <ToolButton icon={selectedElements[0]?.locked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />} label="Lock" onClick={handleToggleLock} disabled={!hasSelection} />
        <ToolButton icon={selectedElements[0]?.visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />} label="Visible" onClick={handleToggleVisibility} disabled={!hasSelection} />
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-1">
        <ToolButton icon={<Grid3X3 className="w-5 h-5" />} label="Grid" active={editor.showGrid} onClick={toggleGrid} />
        <ToolButton icon={<Ruler className="w-5 h-5" />} label="Rulers" active={editor.showRulers} onClick={toggleRulers} />
      </div>
    </div>
  );
}

export default EditorToolbar;

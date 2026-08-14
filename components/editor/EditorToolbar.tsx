'use client';

// javari Scrapbook - Fixed Editor Toolbar
// Fixed: State subscription and photo upload functionality

import React, { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useScrapbookStore, createPhotoElement, createTextElement, createShapeElement } from '@/lib/store';
import { 
  MousePointer2, Type, Square, Circle, Triangle, Star, Heart, Image, Hand, 
  Undo2, Redo2, Copy, Clipboard, Trash2, Grid3X3, Ruler, Save, 
  ArrowUpToLine, ArrowDownToLine, ArrowUp, ArrowDown, 
  FlipHorizontal, FlipVertical, Lock, Unlock, Eye, EyeOff,
  AlertCircle
} from 'lucide-react';

interface ToolButtonProps { 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean; 
  onClick: () => void; 
  disabled?: boolean; 
}

function ToolButton({ icon, label, active, onClick, disabled }: ToolButtonProps) {
  return (
    <motion.button 
      whileHover={{ scale: disabled ? 1 : 1.05 }} 
      whileTap={{ scale: disabled ? 1 : 0.95 }} 
      onClick={onClick} 
      disabled={disabled}
      className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
        active ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} 
      title={label}
    >
      {icon}
      <span className="text-xs mt-1 hidden xl:block">{label}</span>
    </motion.button>
  );
}

function Divider() { 
  return <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-1" />; 
}

export function EditorToolbar() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // FIXED: Subscribe to scrapbook and currentPageIndex to trigger re-renders
  const { 
    scrapbook,
    currentPageIndex,
    editor, 
    setActiveTool, 
    toggleGrid, 
    toggleRulers, 
    undo, 
    redo, 
    copy, 
    paste, 
    deleteSelectedElements, 
    addElement, 
    updateElement, 
    bringToFront, 
    sendToBack, 
    bringForward, 
    sendBackward, 
    getSelectedElements, 
    getCurrentPage, 
    isSaving 
  } = useScrapbookStore();
  
  // Get current page - will now update when scrapbook/currentPageIndex changes
  const currentPage = getCurrentPage();
  const selectedElements = getSelectedElements();
  const hasSelection = selectedElements.length > 0;
  const canUndo = editor.undoStack.length > 0;
  const canRedo = editor.redoStack.length > 0;
  
  // Check if editor is ready (scrapbook loaded)
  const isEditorReady = !!scrapbook && !!currentPage;

  // FIXED: Photo upload handler with proper state access
  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    // Get fresh currentPage from store at execution time
    const page = useScrapbookStore.getState().getCurrentPage();
    
    console.log('[EditorToolbar] handlePhotoUpload called', { 
      filesCount: files?.length, 
      pageExists: !!page,
      pageId: page?.id 
    });
    
    if (!files || files.length === 0) {
      console.warn('[EditorToolbar] No files selected');
      return;
    }
    
    if (!page) {
      console.error('[EditorToolbar] No current page available');
      alert('Please wait for the editor to load before adding photos.');
      return;
    }
    
    Array.from(files).forEach((file, index) => {
      console.log(`[EditorToolbar] Processing file ${index + 1}:`, file.name, file.type, file.size);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        if (!src) {
          console.error('[EditorToolbar] Failed to read file');
          return;
        }
        
        const img = new window.Image();
        img.onload = () => {
          const maxW = page.width * 0.5;
          const maxH = page.height * 0.5;
          let w = img.width;
          let h = img.height;
          
          // Scale down if too large
          if (w > maxW) { h = (maxW / w) * h; w = maxW; }
          if (h > maxH) { w = (maxH / h) * w; h = maxH; }
          
          // Ensure minimum size
          w = Math.max(50, w);
          h = Math.max(50, h);
          
          console.log(`[EditorToolbar] Adding photo element:`, { 
            originalSize: { width: img.width, height: img.height },
            scaledSize: { width: w, height: h }
          });
          
          const elementId = addElement(createPhotoElement(
            src, 
            { x: 50 + (index * 30), y: 50 + (index * 30) }, 
            { width: w, height: h }
          ));
          
          console.log('[EditorToolbar] Photo element added:', elementId);
        };
        
        img.onerror = () => {
          console.error('[EditorToolbar] Failed to load image');
          alert('Failed to load image. Please try a different file.');
        };
        
        img.src = src;
      };
      
      reader.onerror = () => {
        console.error('[EditorToolbar] FileReader error');
        alert('Failed to read file. Please try again.');
      };
      
      reader.readAsDataURL(file);
    });
    
    // Reset input so same file can be selected again
    e.target.value = '';
  }, [addElement]);

  const handleAddText = useCallback(() => { 
    const page = useScrapbookStore.getState().getCurrentPage();
    if (page) { 
      addElement(createTextElement('Double-click to edit', { 
        x: page.width / 2 - 100, 
        y: page.height / 2 - 25 
      })); 
      setActiveTool('select'); 
    } else {
      alert('Please wait for the editor to load.');
    }
  }, [addElement, setActiveTool]);
  
  const handleAddShape = useCallback((shapeType: 'rectangle' | 'circle' | 'triangle' | 'star' | 'heart') => { 
    const page = useScrapbookStore.getState().getCurrentPage();
    if (page) { 
      addElement(createShapeElement(shapeType, { 
        x: page.width / 2 - 50, 
        y: page.height / 2 - 50 
      }, { width: 100, height: 100 })); 
      setActiveTool('select'); 
    } else {
      alert('Please wait for the editor to load.');
    }
  }, [addElement, setActiveTool]);
  
  const handleToggleVisibility = useCallback(() => { 
    selectedElements.forEach(el => updateElement(el.id, { visible: !el.visible })); 
  }, [selectedElements, updateElement]);
  
  const handleToggleLock = useCallback(() => { 
    selectedElements.forEach(el => updateElement(el.id, { locked: !el.locked })); 
  }, [selectedElements, updateElement]);
  
  const handleFlip = useCallback((dir: 'horizontal' | 'vertical') => { 
    selectedElements.forEach(el => updateElement(el.id, { 
      transform: { 
        ...el.transform, 
        flipX: dir === 'horizontal' ? !el.transform.flipX : el.transform.flipX, 
        flipY: dir === 'vertical' ? !el.transform.flipY : el.transform.flipY 
      } 
    })); 
  }, [selectedElements, updateElement]);

  const handlePhotoClick = useCallback(() => {
    console.log('[EditorToolbar] Photo button clicked, triggering file input');
    if (!isEditorReady) {
      alert('Please wait for the editor to load before adding photos.');
      return;
    }
    fileInputRef.current?.click();
  }, [isEditorReady]);

  return (
    <div className="h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 gap-1">
      {/* Editor not ready indicator */}
      {!isEditorReady && (
        <div className="flex items-center gap-2 text-amber-600 text-sm mr-2">
          <AlertCircle className="w-4 h-4" />
          <span>Loading...</span>
        </div>
      )}
      
      <div className="flex items-center gap-1">
        <ToolButton icon={<Save className="w-5 h-5" />} label="Save" onClick={() => {}} disabled={isSaving || !isEditorReady} />
      </div>
      <Divider />
      
      <div className="flex items-center gap-1">
        <ToolButton icon={<Undo2 className="w-5 h-5" />} label="Undo" onClick={undo} disabled={!canUndo || !isEditorReady} />
        <ToolButton icon={<Redo2 className="w-5 h-5" />} label="Redo" onClick={redo} disabled={!canRedo || !isEditorReady} />
      </div>
      <Divider />
      
      <div className="flex items-center gap-1">
        <ToolButton icon={<MousePointer2 className="w-5 h-5" />} label="Select" active={editor.activeTool === 'select'} onClick={() => setActiveTool('select')} disabled={!isEditorReady} />
        <ToolButton icon={<Hand className="w-5 h-5" />} label="Pan" active={editor.activeTool === 'pan'} onClick={() => setActiveTool('pan')} disabled={!isEditorReady} />
      </div>
      <Divider />
      
      <div className="flex items-center gap-1">
        {/* Hidden file input */}
        <input 
          ref={fileInputRef} 
          type="file" 
          accept="image/*" 
          multiple 
          onChange={handlePhotoUpload} 
          className="hidden" 
          aria-label="Upload photos"
        />
        <ToolButton 
          icon={<Image className="w-5 h-5" />} 
          label="Photo" 
          onClick={handlePhotoClick}
          disabled={!isEditorReady}
        />
        <ToolButton icon={<Type className="w-5 h-5" />} label="Text" onClick={handleAddText} disabled={!isEditorReady} />
        
        {/* Shapes dropdown */}
        <div className="relative group">
          <ToolButton icon={<Square className="w-5 h-5" />} label="Shapes" onClick={() => handleAddShape('rectangle')} disabled={!isEditorReady} />
          <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-2 hidden group-hover:flex flex-col gap-1 z-50 min-w-[120px]">
            <button onClick={() => handleAddShape('rectangle')} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm">
              <Square className="w-4 h-4" /> Rectangle
            </button>
            <button onClick={() => handleAddShape('circle')} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm">
              <Circle className="w-4 h-4" /> Circle
            </button>
            <button onClick={() => handleAddShape('triangle')} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm">
              <Triangle className="w-4 h-4" /> Triangle
            </button>
            <button onClick={() => handleAddShape('star')} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm">
              <Star className="w-4 h-4" /> Star
            </button>
            <button onClick={() => handleAddShape('heart')} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm">
              <Heart className="w-4 h-4" /> Heart
            </button>
          </div>
        </div>
      </div>
      <Divider />
      
      <div className="flex items-center gap-1">
        <ToolButton icon={<Copy className="w-5 h-5" />} label="Copy" onClick={copy} disabled={!hasSelection || !isEditorReady} />
        <ToolButton icon={<Clipboard className="w-5 h-5" />} label="Paste" onClick={paste} disabled={!editor.clipboard || !isEditorReady} />
        <ToolButton icon={<Trash2 className="w-5 h-5" />} label="Delete" onClick={deleteSelectedElements} disabled={!hasSelection || !isEditorReady} />
      </div>
      <Divider />
      
      <div className="flex items-center gap-1">
        <ToolButton icon={<ArrowUpToLine className="w-5 h-5" />} label="Front" onClick={() => selectedElements.forEach(el => bringToFront(el.id))} disabled={!hasSelection || !isEditorReady} />
        <ToolButton icon={<ArrowDownToLine className="w-5 h-5" />} label="Back" onClick={() => selectedElements.forEach(el => sendToBack(el.id))} disabled={!hasSelection || !isEditorReady} />
        <ToolButton icon={<ArrowUp className="w-5 h-5" />} label="Forward" onClick={() => selectedElements.forEach(el => bringForward(el.id))} disabled={!hasSelection || !isEditorReady} />
        <ToolButton icon={<ArrowDown className="w-5 h-5" />} label="Backward" onClick={() => selectedElements.forEach(el => sendBackward(el.id))} disabled={!hasSelection || !isEditorReady} />
      </div>
      <Divider />
      
      <div className="flex items-center gap-1">
        <ToolButton icon={<FlipHorizontal className="w-5 h-5" />} label="Flip H" onClick={() => handleFlip('horizontal')} disabled={!hasSelection || !isEditorReady} />
        <ToolButton icon={<FlipVertical className="w-5 h-5" />} label="Flip V" onClick={() => handleFlip('vertical')} disabled={!hasSelection || !isEditorReady} />
        <ToolButton 
          icon={selectedElements[0]?.locked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />} 
          label="Lock" 
          onClick={handleToggleLock} 
          disabled={!hasSelection || !isEditorReady} 
        />
        <ToolButton 
          icon={selectedElements[0]?.visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />} 
          label="Visible" 
          onClick={handleToggleVisibility} 
          disabled={!hasSelection || !isEditorReady} 
        />
      </div>
      
      <div className="flex-1" />
      
      <div className="flex items-center gap-1">
        <ToolButton icon={<Grid3X3 className="w-5 h-5" />} label="Grid" active={editor.showGrid} onClick={toggleGrid} disabled={!isEditorReady} />
        <ToolButton icon={<Ruler className="w-5 h-5" />} label="Rulers" active={editor.showRulers} onClick={toggleRulers} disabled={!isEditorReady} />
      </div>
    </div>
  );
}

export default EditorToolbar;

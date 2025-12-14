'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrapbookStore } from '@/lib/store';
import type { ScrapbookElement, Position } from '@/lib/types';

interface DragState {
  isDragging: boolean;
  elementId: string | null;
  startPos: Position;
  elementStartPos: Position;
}

interface ResizeState {
  isResizing: boolean;
  elementId: string | null;
  handle: string;
  startPos: Position;
  startSize: { width: number; height: number };
  elementStartPos: Position;
}

export function EditorCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false, elementId: null, startPos: { x: 0, y: 0 }, elementStartPos: { x: 0, y: 0 },
  });
  const [resizeState, setResizeState] = useState<ResizeState>({
    isResizing: false, elementId: null, handle: '', startPos: { x: 0, y: 0 }, startSize: { width: 0, height: 0 }, elementStartPos: { x: 0, y: 0 },
  });

  const { scrapbook, editor, getCurrentPage, selectElement, deselectAll, moveElement, resizeElement, updateElement, setZoom, setPanOffset } = useScrapbookStore();
  const currentPage = getCurrentPage();
  const zoom = editor.zoom;
  const panOffset = editor.panOffset;

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains('canvas-background')) deselectAll();
  }, [deselectAll]);

  const handleElementClick = useCallback((e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    selectElement(elementId, e.shiftKey);
  }, [selectElement]);

  const handleDragStart = useCallback((e: React.MouseEvent, element: ScrapbookElement) => {
    if (element.locked) return;
    e.preventDefault();
    e.stopPropagation();
    setDragState({ isDragging: true, elementId: element.id, startPos: { x: e.clientX, y: e.clientY }, elementStartPos: { ...element.position } });
    selectElement(element.id, e.shiftKey);
  }, [selectElement]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragState.isDragging && dragState.elementId) {
        const dx = (e.clientX - dragState.startPos.x) / zoom;
        const dy = (e.clientY - dragState.startPos.y) / zoom;
        let newX = dragState.elementStartPos.x + dx;
        let newY = dragState.elementStartPos.y + dy;
        if (editor.snapToGrid) {
          newX = Math.round(newX / editor.gridSize) * editor.gridSize;
          newY = Math.round(newY / editor.gridSize) * editor.gridSize;
        }
        moveElement(dragState.elementId, { x: newX, y: newY });
      }
      if (resizeState.isResizing && resizeState.elementId) {
        const dx = (e.clientX - resizeState.startPos.x) / zoom;
        const dy = (e.clientY - resizeState.startPos.y) / zoom;
        let newWidth = resizeState.startSize.width, newHeight = resizeState.startSize.height;
        let newX = resizeState.elementStartPos.x, newY = resizeState.elementStartPos.y;
        const handle = resizeState.handle;
        if (handle.includes('e')) newWidth = Math.max(20, resizeState.startSize.width + dx);
        if (handle.includes('w')) { const wd = Math.min(dx, resizeState.startSize.width - 20); newWidth = resizeState.startSize.width - wd; newX = resizeState.elementStartPos.x + wd; }
        if (handle.includes('s')) newHeight = Math.max(20, resizeState.startSize.height + dy);
        if (handle.includes('n')) { const hd = Math.min(dy, resizeState.startSize.height - 20); newHeight = resizeState.startSize.height - hd; newY = resizeState.elementStartPos.y + hd; }
        resizeElement(resizeState.elementId, { width: newWidth, height: newHeight });
        moveElement(resizeState.elementId, { x: newX, y: newY });
      }
    };
    const handleMouseUp = () => {
      setDragState(prev => ({ ...prev, isDragging: false, elementId: null }));
      setResizeState(prev => ({ ...prev, isResizing: false, elementId: null }));
    };
    if (dragState.isDragging || resizeState.isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => { document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseup', handleMouseUp); };
    }
  }, [dragState, resizeState, zoom, editor.snapToGrid, editor.gridSize, moveElement, resizeElement]);

  const handleResizeStart = useCallback((e: React.MouseEvent, element: ScrapbookElement, handle: string) => {
    if (element.locked) return;
    e.preventDefault();
    e.stopPropagation();
    setResizeState({ isResizing: true, elementId: element.id, handle, startPos: { x: e.clientX, y: e.clientY }, startSize: { ...element.size }, elementStartPos: { ...element.position } });
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) { e.preventDefault(); setZoom(zoom + (e.deltaY > 0 ? -0.1 : 0.1)); }
  }, [zoom, setZoom]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && editor.selectedElementIds.length > 0) { e.preventDefault(); useScrapbookStore.getState().deleteSelectedElements(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') useScrapbookStore.getState().copy();
      if ((e.ctrlKey || e.metaKey) && e.key === 'x') useScrapbookStore.getState().cut();
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') useScrapbookStore.getState().paste();
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); useScrapbookStore.getState().undo(); }
      if ((e.ctrlKey || e.metaKey) && ((e.key === 'z' && e.shiftKey) || e.key === 'y')) { e.preventDefault(); useScrapbookStore.getState().redo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') { e.preventDefault(); useScrapbookStore.getState().selectAll(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') { e.preventDefault(); useScrapbookStore.getState().duplicateSelectedElements(); }
      if (e.key === 'Escape') deselectAll();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editor.selectedElementIds, deselectAll]);

  if (!currentPage) return <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-900"><p className="text-gray-500">No page selected</p></div>;

  const renderElement = (element: ScrapbookElement) => {
    const isSelected = editor.selectedElementIds.includes(element.id);
    const style: React.CSSProperties = {
      position: 'absolute', left: element.position.x, top: element.position.y, width: element.size.width, height: element.size.height,
      transform: `rotate(${element.transform.rotation}deg) scaleX(${element.transform.flipX ? -1 : 1}) scaleY(${element.transform.flipY ? -1 : 1})`,
      opacity: element.visible ? element.opacity : 0.3, zIndex: element.zIndex, cursor: element.locked ? 'not-allowed' : 'move',
    };
    if (element.shadow.enabled) style.boxShadow = `${element.shadow.offsetX}px ${element.shadow.offsetY}px ${element.shadow.blur}px ${element.shadow.color}`;
    if (element.border.enabled) { style.border = `${element.border.width}px ${element.border.style} ${element.border.color}`; style.borderRadius = element.border.radius; }

    let content: React.ReactNode = null;
    switch (element.type) {
      case 'photo':
        const filter = `brightness(${element.filters.brightness}%) contrast(${element.filters.contrast}%) saturate(${element.filters.saturation}%) blur(${element.filters.blur}px) grayscale(${element.filters.grayscale}%) sepia(${element.filters.sepia}%)`;
        content = <img src={element.src} alt={element.name} className="w-full h-full object-cover" style={{ filter }} draggable={false} />;
        break;
      case 'text':
        content = <div className="w-full h-full overflow-hidden" style={{ fontFamily: element.fontFamily, fontSize: element.fontSize, fontWeight: element.fontWeight, fontStyle: element.fontStyle, textDecoration: element.textDecoration, textAlign: element.textAlign, lineHeight: element.lineHeight, letterSpacing: element.letterSpacing, color: element.color, backgroundColor: element.backgroundColor || 'transparent' }}>{element.content}</div>;
        break;
      case 'shape':
        if (element.shapeType === 'rectangle') content = <div className="w-full h-full" style={{ backgroundColor: element.fill, border: element.strokeWidth ? `${element.strokeWidth}px solid ${element.stroke}` : 'none' }} />;
        else if (element.shapeType === 'circle') content = <div className="w-full h-full rounded-full" style={{ backgroundColor: element.fill, border: element.strokeWidth ? `${element.strokeWidth}px solid ${element.stroke}` : 'none' }} />;
        else if (element.shapeType === 'triangle') content = <svg viewBox="0 0 100 100" className="w-full h-full"><polygon points="50,0 100,100 0,100" fill={element.fill} stroke={element.stroke} strokeWidth={element.strokeWidth} /></svg>;
        else if (element.shapeType === 'star') content = <svg viewBox="0 0 100 100" className="w-full h-full"><polygon points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35" fill={element.fill} stroke={element.stroke} strokeWidth={element.strokeWidth} /></svg>;
        else if (element.shapeType === 'heart') content = <svg viewBox="0 0 100 100" className="w-full h-full"><path d="M50,88 C20,60 0,40 0,25 C0,10 15,0 30,0 C40,0 48,8 50,12 C52,8 60,0 70,0 C85,0 100,10 100,25 C100,40 80,60 50,88Z" fill={element.fill} stroke={element.stroke} strokeWidth={element.strokeWidth} /></svg>;
        else content = <div className="w-full h-full" style={{ backgroundColor: element.fill }} />;
        break;
      case 'sticker':
        content = <img src={element.src} alt={element.name} className="w-full h-full object-contain" draggable={false} />;
        break;
      default:
        content = <div className="w-full h-full bg-gray-200" />;
    }

    return (
      <div key={element.id} style={style} onClick={(e) => handleElementClick(e, element.id)} onMouseDown={(e) => handleDragStart(e, element)} className={isSelected ? 'ring-2 ring-blue-500' : ''}>
        {content}
        {isSelected && !element.locked && (
          <>
            {['nw', 'ne', 'sw', 'se'].map(h => (
              <div key={h} className="absolute w-3 h-3 bg-white border-2 border-blue-500 rounded-full" style={{ left: h.includes('w') ? -6 : 'auto', right: h.includes('e') ? -6 : 'auto', top: h.includes('n') ? -6 : 'auto', bottom: h.includes('s') ? -6 : 'auto', cursor: `${h}-resize` }} onMouseDown={(e) => handleResizeStart(e, element, h)} />
            ))}
          </>
        )}
      </div>
    );
  };

  const renderBackground = () => {
    const bg = currentPage.background;
    const style: React.CSSProperties = { position: 'absolute', inset: 0 };
    if (bg.backgroundType === 'solid') style.backgroundColor = bg.color || '#ffffff';
    else if (bg.backgroundType === 'gradient' && bg.gradient) {
      const colors = bg.gradient.colors.map(c => `${c.color} ${c.position}%`).join(', ');
      style.background = bg.gradient.type === 'linear' ? `linear-gradient(${bg.gradient.angle || 0}deg, ${colors})` : `radial-gradient(circle, ${colors})`;
    }
    return <div className="canvas-background" style={style} />;
  };

  return (
    <div ref={canvasRef} className="flex-1 overflow-hidden bg-gray-200 dark:bg-gray-800 relative" onClick={handleCanvasClick} onWheel={handleWheel}>
      {editor.showGrid && <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)`, backgroundSize: `${editor.gridSize * zoom}px ${editor.gridSize * zoom}px`, backgroundPosition: `${panOffset.x}px ${panOffset.y}px` }} />}
      <div className="absolute" style={{ left: '50%', top: '50%', transform: `translate(-50%, -50%) translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`, transformOrigin: 'center center' }}>
        <div className="relative shadow-2xl" style={{ width: currentPage.width, height: currentPage.height, backgroundColor: '#fff' }}>
          {renderBackground()}
          <AnimatePresence>{[...currentPage.elements].sort((a, b) => a.zIndex - b.zIndex).map(el => renderElement(el))}</AnimatePresence>
        </div>
      </div>
      <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2">
        <button onClick={() => setZoom(zoom - 0.1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg></button>
        <span className="text-sm font-medium w-16 text-center">{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom(zoom + 0.1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg></button>
        <button onClick={() => setZoom(1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm">Fit</button>
      </div>
    </div>
  );
}

export default EditorCanvas;

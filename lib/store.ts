// javari Scrapbook - Zustand State Management Store
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type {
  Scrapbook,
  ScrapbookPage,
  ScrapbookElement,
  PhotoElement,
  TextElement,
  ShapeElement,
  StickerElement,
  BackgroundElement,
  Position,
  Size,
  Transform,
  Shadow,
  Border,
} from './types';

const defaultTransform: Transform = {
  rotation: 0,
  scaleX: 1,
  scaleY: 1,
  flipX: false,
  flipY: false,
};

const defaultShadow: Shadow = {
  enabled: false,
  color: 'rgba(0,0,0,0.3)',
  blur: 10,
  offsetX: 4,
  offsetY: 4,
};

const defaultBorder: Border = {
  enabled: false,
  color: '#000000',
  width: 2,
  style: 'solid',
  radius: 0,
};

interface EditorState {
  selectedElementIds: string[];
  activeTool: 'select' | 'text' | 'shape' | 'draw' | 'crop' | 'pan' | 'zoom';
  zoom: number;
  panOffset: Position;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  showRulers: boolean;
  clipboard: ScrapbookElement[] | null;
  undoStack: ScrapbookPage[][];
  redoStack: ScrapbookPage[][];
  maxUndoSteps: number;
}

interface ScrapbookStore {
  scrapbook: Scrapbook | null;
  currentPageIndex: number;
  editor: EditorState;
  isLoading: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  
  setScrapbook: (scrapbook: Scrapbook | null) => void;
  updateScrapbookMeta: (updates: Partial<Pick<Scrapbook, 'title' | 'description' | 'isPublic' | 'tags'>>) => void;
  setCurrentPage: (index: number) => void;
  addPage: (afterIndex?: number) => void;
  deletePage: (index: number) => void;
  duplicatePage: (index: number) => void;
  reorderPages: (fromIndex: number, toIndex: number) => void;
  updatePageBackground: (background: Partial<BackgroundElement>) => void;
  addElement: (element: Omit<ScrapbookElement, 'id' | 'zIndex'>) => string;
  updateElement: (id: string, updates: Partial<ScrapbookElement>) => void;
  deleteElement: (id: string) => void;
  deleteSelectedElements: () => void;
  duplicateElement: (id: string) => string | null;
  duplicateSelectedElements: () => void;
  selectElement: (id: string, addToSelection?: boolean) => void;
  selectElements: (ids: string[]) => void;
  deselectAll: () => void;
  selectAll: () => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  moveElement: (id: string, position: Position) => void;
  resizeElement: (id: string, size: Size) => void;
  rotateElement: (id: string, rotation: number) => void;
  copy: () => void;
  cut: () => void;
  paste: () => void;
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
  setActiveTool: (tool: EditorState['activeTool']) => void;
  setZoom: (zoom: number) => void;
  setPanOffset: (offset: Position) => void;
  toggleGrid: () => void;
  toggleSnapToGrid: () => void;
  toggleRulers: () => void;
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setLastSaved: (date: Date) => void;
  getCurrentPage: () => ScrapbookPage | null;
  getElement: (id: string) => ScrapbookElement | null;
  getSelectedElements: () => ScrapbookElement[];
}

export const useScrapbookStore = create<ScrapbookStore>((set, get) => ({
  scrapbook: null,
  currentPageIndex: 0,
  editor: {
    selectedElementIds: [],
    activeTool: 'select',
    zoom: 1,
    panOffset: { x: 0, y: 0 },
    showGrid: false,
    snapToGrid: true,
    gridSize: 20,
    showRulers: true,
    clipboard: null,
    undoStack: [],
    redoStack: [],
    maxUndoSteps: 50,
  },
  isLoading: false,
  isSaving: false,
  lastSaved: null,
  
  setScrapbook: (scrapbook) => set({ scrapbook, currentPageIndex: 0 }),
  
  updateScrapbookMeta: (updates) => set((state) => ({
    scrapbook: state.scrapbook ? { ...state.scrapbook, ...updates } : null,
  })),
  
  setCurrentPage: (index) => {
    const { scrapbook } = get();
    if (scrapbook && index >= 0 && index < scrapbook.pages.length) {
      set({ currentPageIndex: index, editor: { ...get().editor, selectedElementIds: [] } });
    }
  },
  
  addPage: (afterIndex) => {
    const { scrapbook, currentPageIndex } = get();
    if (!scrapbook) return;
    const insertIndex = afterIndex !== undefined ? afterIndex + 1 : scrapbook.pages.length;
    const newPage: ScrapbookPage = {
      id: uuidv4(),
      name: `Page ${scrapbook.pages.length + 1}`,
      background: { id: uuidv4(), type: 'background', backgroundType: 'solid', color: '#ffffff' },
      elements: [],
      width: scrapbook.pageSize.width,
      height: scrapbook.pageSize.height,
      order: insertIndex,
    };
    const newPages = [...scrapbook.pages];
    newPages.splice(insertIndex, 0, newPage);
    newPages.forEach((p, i) => p.order = i);
    set({ scrapbook: { ...scrapbook, pages: newPages }, currentPageIndex: insertIndex });
  },
  
  deletePage: (index) => {
    const { scrapbook } = get();
    if (!scrapbook || scrapbook.pages.length <= 1) return;
    const newPages = scrapbook.pages.filter((_, i) => i !== index);
    newPages.forEach((p, i) => p.order = i);
    set({ scrapbook: { ...scrapbook, pages: newPages }, currentPageIndex: Math.min(get().currentPageIndex, newPages.length - 1) });
  },
  
  duplicatePage: (index) => {
    const { scrapbook } = get();
    if (!scrapbook) return;
    const page = scrapbook.pages[index];
    const newPage: ScrapbookPage = {
      ...JSON.parse(JSON.stringify(page)),
      id: uuidv4(),
      name: `${page.name} (Copy)`,
      elements: page.elements.map(el => ({ ...el, id: uuidv4() })),
    };
    const newPages = [...scrapbook.pages];
    newPages.splice(index + 1, 0, newPage);
    newPages.forEach((p, i) => p.order = i);
    set({ scrapbook: { ...scrapbook, pages: newPages }, currentPageIndex: index + 1 });
  },
  
  reorderPages: (fromIndex, toIndex) => {
    const { scrapbook } = get();
    if (!scrapbook) return;
    const newPages = [...scrapbook.pages];
    const [moved] = newPages.splice(fromIndex, 1);
    newPages.splice(toIndex, 0, moved);
    newPages.forEach((p, i) => p.order = i);
    set({ scrapbook: { ...scrapbook, pages: newPages } });
  },
  
  updatePageBackground: (background) => {
    const { scrapbook, currentPageIndex } = get();
    if (!scrapbook) return;
    const newPages = [...scrapbook.pages];
    newPages[currentPageIndex] = {
      ...newPages[currentPageIndex],
      background: { ...newPages[currentPageIndex].background, ...background },
    };
    set({ scrapbook: { ...scrapbook, pages: newPages } });
  },
  
  addElement: (element) => {
    const { scrapbook, currentPageIndex } = get();
    if (!scrapbook) return '';
    const page = scrapbook.pages[currentPageIndex];
    const maxZ = page.elements.reduce((max, el) => Math.max(max, el.zIndex), 0);
    const newElement = { ...element, id: uuidv4(), zIndex: maxZ + 1 } as ScrapbookElement;
    const newPages = [...scrapbook.pages];
    newPages[currentPageIndex] = { ...page, elements: [...page.elements, newElement] };
    set({ scrapbook: { ...scrapbook, pages: newPages }, editor: { ...get().editor, selectedElementIds: [newElement.id] } });
    return newElement.id;
  },
  
  updateElement: (id, updates) => {
    const { scrapbook, currentPageIndex } = get();
    if (!scrapbook) return;
    const newPages = [...scrapbook.pages];
    const page = newPages[currentPageIndex];
    newPages[currentPageIndex] = {
      ...page,
      elements: page.elements.map(el => el.id === id ? { ...el, ...updates } as ScrapbookElement : el),
    };
    set({ scrapbook: { ...scrapbook, pages: newPages } });
  },
  
  deleteElement: (id) => {
    const { scrapbook, currentPageIndex, editor } = get();
    if (!scrapbook) return;
    const newPages = [...scrapbook.pages];
    newPages[currentPageIndex] = {
      ...newPages[currentPageIndex],
      elements: newPages[currentPageIndex].elements.filter(el => el.id !== id),
    };
    set({ scrapbook: { ...scrapbook, pages: newPages }, editor: { ...editor, selectedElementIds: editor.selectedElementIds.filter(i => i !== id) } });
  },
  
  deleteSelectedElements: () => {
    const { editor } = get();
    editor.selectedElementIds.forEach(id => get().deleteElement(id));
  },
  
  duplicateElement: (id) => {
    const el = get().getElement(id);
    if (!el) return null;
    const newEl = { ...JSON.parse(JSON.stringify(el)), position: { x: el.position.x + 20, y: el.position.y + 20 } };
    delete newEl.id; delete newEl.zIndex;
    return get().addElement(newEl);
  },
  
  duplicateSelectedElements: () => {
    const { editor } = get();
    const newIds: string[] = [];
    editor.selectedElementIds.forEach(id => {
      const newId = get().duplicateElement(id);
      if (newId) newIds.push(newId);
    });
    set({ editor: { ...get().editor, selectedElementIds: newIds } });
  },
  
  selectElement: (id, add = false) => {
    const { editor } = get();
    if (add) {
      const has = editor.selectedElementIds.includes(id);
      set({ editor: { ...editor, selectedElementIds: has ? editor.selectedElementIds.filter(i => i !== id) : [...editor.selectedElementIds, id] } });
    } else {
      set({ editor: { ...editor, selectedElementIds: [id] } });
    }
  },
  
  selectElements: (ids) => set({ editor: { ...get().editor, selectedElementIds: ids } }),
  deselectAll: () => set({ editor: { ...get().editor, selectedElementIds: [] } }),
  selectAll: () => {
    const page = get().getCurrentPage();
    if (page) set({ editor: { ...get().editor, selectedElementIds: page.elements.map(el => el.id) } });
  },
  
  bringToFront: (id) => {
    const page = get().getCurrentPage();
    if (!page) return;
    const maxZ = page.elements.reduce((max, el) => Math.max(max, el.zIndex), 0);
    get().updateElement(id, { zIndex: maxZ + 1 });
  },
  
  sendToBack: (id) => {
    const page = get().getCurrentPage();
    if (!page) return;
    const minZ = page.elements.reduce((min, el) => Math.min(min, el.zIndex), Infinity);
    get().updateElement(id, { zIndex: minZ - 1 });
  },
  
  bringForward: (id) => {
    const el = get().getElement(id);
    if (el) get().updateElement(id, { zIndex: el.zIndex + 1 });
  },
  
  sendBackward: (id) => {
    const el = get().getElement(id);
    if (el) get().updateElement(id, { zIndex: el.zIndex - 1 });
  },
  
  moveElement: (id, position) => get().updateElement(id, { position }),
  resizeElement: (id, size) => get().updateElement(id, { size }),
  rotateElement: (id, rotation) => {
    const el = get().getElement(id);
    if (el) get().updateElement(id, { transform: { ...el.transform, rotation } });
  },
  
  copy: () => {
    const els = get().getSelectedElements();
    if (els.length > 0) set({ editor: { ...get().editor, clipboard: JSON.parse(JSON.stringify(els)) } });
  },
  
  cut: () => { get().copy(); get().deleteSelectedElements(); },
  
  paste: () => {
    const { editor } = get();
    if (!editor.clipboard) return;
    const newIds: string[] = [];
    editor.clipboard.forEach(el => {
      const newEl = { ...el, position: { x: el.position.x + 20, y: el.position.y + 20 } };
      delete (newEl as any).id; delete (newEl as any).zIndex;
      newIds.push(get().addElement(newEl));
    });
    set({ editor: { ...get().editor, selectedElementIds: newIds } });
  },
  
  undo: () => {
    const { scrapbook, editor } = get();
    if (!scrapbook || editor.undoStack.length === 0) return;
    const current = JSON.parse(JSON.stringify(scrapbook.pages));
    const prev = editor.undoStack[editor.undoStack.length - 1];
    set({ scrapbook: { ...scrapbook, pages: prev }, editor: { ...editor, undoStack: editor.undoStack.slice(0, -1), redoStack: [...editor.redoStack, current], selectedElementIds: [] } });
  },
  
  redo: () => {
    const { scrapbook, editor } = get();
    if (!scrapbook || editor.redoStack.length === 0) return;
    const current = JSON.parse(JSON.stringify(scrapbook.pages));
    const next = editor.redoStack[editor.redoStack.length - 1];
    set({ scrapbook: { ...scrapbook, pages: next }, editor: { ...editor, redoStack: editor.redoStack.slice(0, -1), undoStack: [...editor.undoStack, current], selectedElementIds: [] } });
  },
  
  saveToHistory: () => {
    const { scrapbook, editor } = get();
    if (!scrapbook) return;
    const current = JSON.parse(JSON.stringify(scrapbook.pages));
    set({ editor: { ...editor, undoStack: [...editor.undoStack, current].slice(-editor.maxUndoSteps), redoStack: [] } });
  },
  
  setActiveTool: (tool) => set({ editor: { ...get().editor, activeTool: tool } }),
  setZoom: (zoom) => set({ editor: { ...get().editor, zoom: Math.max(0.1, Math.min(5, zoom)) } }),
  setPanOffset: (offset) => set({ editor: { ...get().editor, panOffset: offset } }),
  toggleGrid: () => set({ editor: { ...get().editor, showGrid: !get().editor.showGrid } }),
  toggleSnapToGrid: () => set({ editor: { ...get().editor, snapToGrid: !get().editor.snapToGrid } }),
  toggleRulers: () => set({ editor: { ...get().editor, showRulers: !get().editor.showRulers } }),
  setLoading: (loading) => set({ isLoading: loading }),
  setSaving: (saving) => set({ isSaving: saving }),
  setLastSaved: (date) => set({ lastSaved: date }),
  
  getCurrentPage: () => {
    const { scrapbook, currentPageIndex } = get();
    return scrapbook?.pages[currentPageIndex] ?? null;
  },
  
  getElement: (id) => {
    const page = get().getCurrentPage();
    return page?.elements.find(el => el.id === id) ?? null;
  },
  
  getSelectedElements: () => {
    const page = get().getCurrentPage();
    const { editor } = get();
    if (!page) return [];
    return page.elements.filter(el => editor.selectedElementIds.includes(el.id));
  },
}));

// Element factory functions
export const createPhotoElement = (src: string, position: Position, size: Size): Omit<PhotoElement, 'id' | 'zIndex'> => ({
  type: 'photo', name: 'Photo', position, size, transform: { ...defaultTransform }, opacity: 1, locked: false, visible: true,
  shadow: { ...defaultShadow }, border: { ...defaultBorder }, src, originalSrc: src,
  filters: { brightness: 100, contrast: 100, saturation: 100, blur: 0, grayscale: 0, sepia: 0, hue: 0 }, crop: null, mask: null, frame: null,
});

export const createTextElement = (content: string, position: Position): Omit<TextElement, 'id' | 'zIndex'> => ({
  type: 'text', name: 'Text', position, size: { width: 200, height: 50 }, transform: { ...defaultTransform }, opacity: 1, locked: false, visible: true,
  shadow: { ...defaultShadow }, border: { ...defaultBorder }, content, fontFamily: 'Inter', fontSize: 24, fontWeight: 400, fontStyle: 'normal',
  textDecoration: 'none', textAlign: 'left', lineHeight: 1.4, letterSpacing: 0, color: '#000000', backgroundColor: null, textShadow: null, curve: 0,
});

export const createShapeElement = (shapeType: ShapeElement['shapeType'], position: Position, size: Size): Omit<ShapeElement, 'id' | 'zIndex'> => ({
  type: 'shape', name: shapeType.charAt(0).toUpperCase() + shapeType.slice(1), position, size, transform: { ...defaultTransform }, opacity: 1, locked: false, visible: true,
  shadow: { ...defaultShadow }, border: { ...defaultBorder }, shapeType, fill: '#3b82f6', stroke: '#1d4ed8', strokeWidth: 0,
});

export const createStickerElement = (stickerId: string, src: string, category: string, position: Position, size: Size): Omit<StickerElement, 'id' | 'zIndex'> => ({
  type: 'sticker', name: 'Sticker', position, size, transform: { ...defaultTransform }, opacity: 1, locked: false, visible: true,
  shadow: { ...defaultShadow }, border: { ...defaultBorder }, stickerId, src, category,
});

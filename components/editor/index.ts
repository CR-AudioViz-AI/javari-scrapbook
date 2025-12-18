// components/editor/index.ts
// Export all editor components for easy importing
// Timestamp: Tuesday, December 17, 2025 – 9:45 PM Eastern Time

// Core Editor Components (with default exports)
export { default as EditorCanvas } from './EditorCanvas';
export { default as EditorToolbar } from './EditorToolbar';
export { default as PropertiesPanel } from './PropertiesPanel';
export { default as PagesPanel } from './PagesPanel';
export { default as AssetsPanel } from './AssetsPanel';
export { default as EnhancedAssetsPanel } from './EnhancedAssetsPanel';

// Components with named exports - re-export everything
export * from './EnhancedPagesPanel';
export * from './StockPhotoBrowser';
export * from './GiphyBrowser';
export * from './TemplateGallery';
export * from './AIEnhancePanel';
export * from './CollaborationPanel';
export * from './ExportModal';

// Creative Asset Browsers (default exports)
export { default as ShapesBrowser } from './ShapesBrowser';
export { default as StickersBrowser } from './StickersBrowser';
export { default as FiltersBrowser } from './FiltersBrowser';
export { default as FramesBrowser } from './FramesBrowser';
export { default as IconsBrowser } from './IconsBrowser';
export { default as GradientsBrowser } from './GradientsBrowser';

// Generators & Pickers (default exports)
export { default as QRCodeGenerator } from './QRCodeGenerator';
export { default as AvatarCreator } from './AvatarCreator';
export { default as CollageBuilder } from './CollageBuilder';
export { default as BackgroundPicker } from './BackgroundPicker';
export { default as PatternPicker } from './PatternPicker';
export { default as ColorPalettePicker } from './ColorPalettePicker';
export { default as TextEffectsPanel } from './TextEffectsPanel';
export { default as PremiumStore } from './PremiumStore';

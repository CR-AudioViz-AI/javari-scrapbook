// CRAV Scrapbook - Complete Type Definitions

export interface Position { x: number; y: number; }
export interface Size { width: number; height: number; }

export interface Transform {
  rotation: number;
  scaleX: number;
  scaleY: number;
  flipX: boolean;
  flipY: boolean;
}

export interface Shadow {
  enabled: boolean;
  color: string;
  blur: number;
  offsetX: number;
  offsetY: number;
}

export interface Border {
  enabled: boolean;
  color: string;
  width: number;
  style: 'solid' | 'dashed' | 'dotted' | 'double';
  radius: number;
}

export interface BaseElement {
  id: string;
  type: string;
  position: Position;
  size: Size;
  transform: Transform;
  opacity: number;
  locked: boolean;
  visible: boolean;
  zIndex: number;
  shadow: Shadow;
  border: Border;
  name: string;
}

export interface PhotoElement extends BaseElement {
  type: 'photo';
  src: string;
  originalSrc: string;
  filters: {
    brightness: number;
    contrast: number;
    saturation: number;
    blur: number;
    grayscale: number;
    sepia: number;
    hue: number;
  };
  crop: { x: number; y: number; width: number; height: number; } | null;
  mask: string | null;
  frame: string | null;
}

export interface TextElement extends BaseElement {
  type: 'text';
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline' | 'line-through';
  textAlign: 'left' | 'center' | 'right' | 'justify';
  lineHeight: number;
  letterSpacing: number;
  color: string;
  backgroundColor: string | null;
  textShadow: Shadow | null;
  curve: number;
}

export interface ShapeElement extends BaseElement {
  type: 'shape';
  shapeType: 'rectangle' | 'circle' | 'ellipse' | 'triangle' | 'star' | 'heart' | 'polygon' | 'custom';
  fill: string;
  stroke: string;
  strokeWidth: number;
  points?: number;
  innerRadius?: number;
  customPath?: string;
}

export interface StickerElement extends BaseElement {
  type: 'sticker';
  stickerId: string;
  src: string;
  category: string;
}

export interface FrameElement extends BaseElement {
  type: 'frame';
  frameId: string;
  src: string;
  category: string;
  innerPadding: number;
}

export interface BackgroundElement {
  id: string;
  type: 'background';
  backgroundType: 'solid' | 'gradient' | 'pattern' | 'image';
  color?: string;
  gradient?: {
    type: 'linear' | 'radial';
    colors: { color: string; position: number }[];
    angle?: number;
  };
  patternId?: string;
  imageSrc?: string;
  imageOpacity?: number;
  imageBlur?: number;
}

export type ScrapbookElement = PhotoElement | TextElement | ShapeElement | StickerElement | FrameElement;

export interface ScrapbookPage {
  id: string;
  name: string;
  background: BackgroundElement;
  elements: ScrapbookElement[];
  width: number;
  height: number;
  order: number;
}

export interface Scrapbook {
  id: string;
  userId: string;
  title: string;
  description: string;
  coverImage: string | null;
  pages: ScrapbookPage[];
  pageSize: { width: number; height: number; name: string; };
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  tags: string[];
  templateId: string | null;
}

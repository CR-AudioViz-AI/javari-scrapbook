// lib/scrapbook-mapping.ts
// Purpose: rebuild the editor's Scrapbook from GET /api/scrapbooks/[id].
// Date: 2026-09-10
//
// scrapbook_save() stores each element whole in `properties`, so loading is the
// inverse: the element is `properties`, with the columns the database owns
// (id, z-order) taken from the row. Nothing type-specific is lost.
//
// CR AudioViz AI, LLC · EIN 39-3646201
import { v4 as uuidv4 } from 'uuid';
import type { BackgroundElement, Scrapbook, ScrapbookElement, ScrapbookPage } from '@/lib/types';

interface ApiElement {
  id: string;
  z_index: number;
  properties: Record<string, unknown> | null;
}
interface ApiPage {
  id: string;
  name: string;
  order: number;
  background: unknown;
  width: number;
  height: number;
  elements: ApiElement[];
}
export interface ApiScrapbook {
  id: string;
  userId: string;
  title: string;
  description: string;
  coverImage: string | null;
  isPublic: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  pageSize: { width: number; height: number; name: string };
  pages: ApiPage[];
}

function isBackground(value: unknown): value is BackgroundElement {
  return typeof value === 'object' && value !== null && (value as { type?: unknown }).type === 'background';
}

function background(value: unknown): BackgroundElement {
  return isBackground(value)
    ? value
    : { id: uuidv4(), type: 'background', backgroundType: 'solid', color: '#ffffff' };
}

export function toEditorScrapbook(api: ApiScrapbook): Scrapbook {
  const pages: ScrapbookPage[] = api.pages.map((p, i) => ({
    id: p.id,
    name: p.name,
    order: typeof p.order === 'number' ? p.order : i,
    width: p.width,
    height: p.height,
    background: background(p.background),
    elements: p.elements
      .filter((e) => e.properties && typeof e.properties === 'object')
      .map((e) => ({ ...(e.properties as object), id: e.id, zIndex: e.z_index }) as ScrapbookElement),
  }));
  return {
    id: api.id,
    userId: api.userId,
    title: api.title,
    description: api.description ?? '',
    coverImage: api.coverImage,
    pages,
    pageSize: api.pageSize,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
    isPublic: api.isPublic,
    tags: Array.isArray(api.tags) ? api.tags : [],
    templateId: null,
  };
}

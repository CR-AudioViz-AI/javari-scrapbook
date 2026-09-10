// lib/api/scrapbook-dto.ts
// Purpose: turn database rows into the shapes the dashboard, viewer and editor read.
// Date: 2026-09-10
//
// The routes returned raw snake_case rows while every page read camelCase
// (pageCount, viewCount, isPublic, updatedAt), so a working query would still
// have rendered blank cards and "Invalid Date". One mapping, server-side.
//
// The detail DTO keeps BOTH shapes on purpose: the viewer reads scrapbook fields
// in camelCase but element rows raw (element_type, properties, z_index), and the
// editor rebuilds its own elements from `properties`. Changing the viewer's
// reads is a separate change; this keeps it working today.
//
// CR AudioViz AI, LLC · EIN 39-3646201

export interface ScrapbookRow {
  id: string;
  user_id: string;
  title: string;
  description: string;
  cover_image: string | null;
  page_width: number;
  page_height: number;
  page_size_name: string;
  is_public: boolean;
  tags: string[];
  view_count: number;
  like_count: number;
  created_at: string;
  updated_at: string;
}

export interface ElementRow {
  id: string;
  page_id: string;
  element_type: string;
  name: string;
  position: unknown;
  size: unknown;
  transform: unknown;
  opacity: number;
  z_index: number;
  locked: boolean;
  visible: boolean;
  shadow: unknown;
  border: unknown;
  properties: Record<string, unknown>;
}

export interface PageRow {
  id: string;
  scrapbook_id: string;
  name: string;
  page_order: number;
  background: unknown;
  width: number;
  height: number;
  elements?: ElementRow[];
}

export interface ScrapbookSummary {
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

export function toSummary(
  row: ScrapbookRow,
  pageCount: number,
  collaboratorCount: number,
): ScrapbookSummary {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    coverImage: row.cover_image,
    pageCount,
    isPublic: row.is_public,
    isFavorite: Array.isArray(row.tags) && row.tags.includes('favorite'),
    viewCount: row.view_count,
    likeCount: row.like_count,
    collaboratorCount,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toDetail(row: ScrapbookRow, pages: PageRow[]) {
  const orderedPages = [...pages]
    .sort((a, b) => a.page_order - b.page_order)
    .map((p) => ({
      ...p,
      order: p.page_order,
      elements: [...(p.elements ?? [])].sort((a, b) => a.z_index - b.z_index),
    }));
  return {
    ...row,
    userId: row.user_id,
    coverImage: row.cover_image,
    isPublic: row.is_public,
    viewCount: row.view_count,
    likeCount: row.like_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    pageSize: { width: row.page_width, height: row.page_height, name: row.page_size_name },
    pages: orderedPages,
  };
}

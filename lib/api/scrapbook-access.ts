// lib/api/scrapbook-access.ts
// Purpose: one definition of who may view or edit a scrapbook.
// Date: 2026-09-10
//
// Routes each re-derived this (or skipped it: autosave and duplicate checked
// nothing and ran on the service role). One function, used everywhere, so the
// rule cannot drift between routes.
//
// CR AudioViz AI, LLC · EIN 39-3646201
import type { SupabaseClient } from '@supabase/supabase-js';

export interface ScrapbookAccess {
  exists: boolean;
  ownerId: string | null;
  isPublic: boolean;
  isOwner: boolean;
  isCollaborator: boolean;
  canView: boolean;
  canEdit: boolean;
}

const NONE: ScrapbookAccess = {
  exists: false, ownerId: null, isPublic: false,
  isOwner: false, isCollaborator: false, canView: false, canEdit: false,
};

export async function scrapbookAccess(
  db: SupabaseClient,
  scrapbookId: string,
  userId: string | null,
): Promise<ScrapbookAccess> {
  const { data: book, error } = await db
    .from('scrapbooks')
    .select('id, user_id, is_public')
    .eq('id', scrapbookId)
    .maybeSingle();
  if (error) throw new Error(`scrapbook lookup failed: ${error.message}`);
  if (!book) return NONE;

  const isOwner = !!userId && book.user_id === userId;
  let role: string | null = null;
  if (userId && !isOwner) {
    const { data: collab, error: cErr } = await db
      .from('scrapbook_collaborators')
      .select('role')
      .eq('scrapbook_id', scrapbookId)
      .eq('user_id', userId)
      .maybeSingle();
    if (cErr) throw new Error(`collaborator lookup failed: ${cErr.message}`);
    role = collab?.role ?? null;
  }
  const isCollaborator = role !== null;
  return {
    exists: true,
    ownerId: book.user_id as string,
    isPublic: book.is_public === true,
    isOwner,
    isCollaborator,
    canView: isOwner || isCollaborator || book.is_public === true,
    canEdit: isOwner || role === 'editor',
  };
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function isUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID.test(value);
}

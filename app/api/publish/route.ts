// app/api/publish/route.ts
// Purpose: publish or unpublish a scrapbook the caller owns.
// Date: 2026-09-10 (full replacement; original 2026-03-14)
//
// What the previous version got wrong, found by the end-to-end test:
//   - wrote published_at, which did not exist (added by craudiovizai migration
//     2026-09-10-scrapbook-published-at) - every publish answered 500
//   - logged to javari_activity_log with columns that table does not have
//   - parsed the body with request.json() outside any guard, and read cookies()
//     it never used
//   - reported a PostgrestError as "Internal server error" with no log line
//
// Only the OWNER may publish: publishing changes who can see a person's memories,
// and an editor-collaborator should not be able to make them public.
//
// CR AudioViz AI, LLC · EIN 39-3646201
import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/api/require-user';
import { serviceClient } from '@/lib/api/service-client';
import { scrapbookAccess, isUuid } from '@/lib/api/scrapbook-access';
import { readBody } from '@/lib/api/body';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const NO_STORE = { 'Cache-Control': 'no-store' } as const;

export async function POST(request: Request): Promise<NextResponse> {
  const auth = await requireUser(request);
  if (!auth.ok) return auth.res;

  const parsed = await readBody<Record<string, unknown>>(request);
  if (!parsed.ok) return parsed.response as NextResponse;
  const b = parsed.body;

  if (!isUuid(b.scrapbookId)) {
    return NextResponse.json({ error: 'scrapbookId required' }, { status: 400, headers: NO_STORE });
  }
  if (typeof b.isPublic !== 'boolean') {
    return NextResponse.json({ error: 'isPublic must be true or false' }, { status: 400, headers: NO_STORE });
  }
  const scrapbookId = b.scrapbookId;

  try {
    const db = serviceClient();
    const access = await scrapbookAccess(db, scrapbookId, auth.userId);
    if (!access.exists || !access.isOwner) {
      return NextResponse.json({ error: 'Scrapbook not found or access denied' }, { status: 404, headers: NO_STORE });
    }

    const now = new Date().toISOString();
    const updates: Record<string, unknown> = { is_public: b.isPublic, updated_at: now };
    if (b.isPublic) updates.published_at = now;
    if (typeof b.title === 'string' && b.title.trim()) updates.title = b.title.trim().slice(0, 200);
    if (typeof b.description === 'string') updates.description = b.description.slice(0, 5000);
    if (Array.isArray(b.tags)) {
      updates.tags = b.tags.filter((t): t is string => typeof t === 'string').map((t) => t.slice(0, 50)).slice(0, 50);
    }

    const { data: updated, error } = await db
      .from('scrapbooks')
      .update(updates)
      .eq('id', scrapbookId)
      .eq('user_id', auth.userId)
      .select('id, title, is_public, published_at, updated_at')
      .single();
    if (error) throw new Error(error.message);

    return NextResponse.json({
      success: true,
      scrapbook: updated,
      message: b.isPublic ? 'Scrapbook published successfully' : 'Scrapbook unpublished',
    }, { headers: NO_STORE });
  } catch (e) {
    console.error(JSON.stringify({ level: 'ERROR', event: 'SCRAPBOOK_PUBLISH_FAILED', id: scrapbookId, message: e instanceof Error ? e.message : String(e) }));
    return NextResponse.json({ error: 'The request could not be completed.' }, { status: 500, headers: NO_STORE });
  }
}

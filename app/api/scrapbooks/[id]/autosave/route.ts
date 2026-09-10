// app/api/scrapbooks/[id]/autosave/route.ts
// Purpose: save the editor's whole document, atomically.
// Date: 2026-09-10 (full replacement)
//
// The previous version was an UNAUTHENTICATED service-role write: anyone could
// overwrite any scrapbook's title, pages and elements by UUID, and upserting a
// page id with a new scrapbook_id could move another user's page into theirs.
// Nothing called it - the editor faked its save - which is the only reason it
// never did damage.
//
// Now: the caller is verified, and the write is public.scrapbook_save(), which
// checks ownership inside the same transaction as the write and refuses ids that
// belong to another scrapbook. A new scrapbook is created on first save, owned
// by the caller.
//
// CR AudioViz AI, LLC · EIN 39-3646201
import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/api/require-user';
import { serviceClient } from '@/lib/api/service-client';
import { isUuid } from '@/lib/api/scrapbook-access';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const NO_STORE = { 'Cache-Control': 'no-store' } as const;
const MAX_BYTES = 4_000_000;

export async function POST(request: Request, { params }: { params: { id: string } }): Promise<NextResponse> {
  const auth = await requireUser(request);
  if (!auth.ok) return auth.res;
  if (!isUuid(params.id)) return NextResponse.json({ error: 'Invalid scrapbook id' }, { status: 400, headers: NO_STORE });

  const raw = await request.text().catch(() => '');
  if (raw.length > MAX_BYTES) {
    return NextResponse.json({ error: 'Scrapbook too large to save in one request' }, { status: 413, headers: NO_STORE });
  }
  let body: unknown;
  try { body = JSON.parse(raw); } catch {
    return NextResponse.json({ error: 'Body must be JSON' }, { status: 400, headers: NO_STORE });
  }
  const doc = (body as { scrapbook?: unknown } | null)?.scrapbook;
  if (!doc || typeof doc !== 'object' || (doc as { id?: unknown }).id !== params.id) {
    return NextResponse.json({ error: 'Body must be { scrapbook } with the id in the URL' }, { status: 400, headers: NO_STORE });
  }

  try {
    const { data, error } = await serviceClient().rpc('scrapbook_save', { p_user: auth.userId, p_doc: doc });
    if (error) {
      if (error.code === '42501') return NextResponse.json({ error: 'You cannot edit this scrapbook' }, { status: 403, headers: NO_STORE });
      if (error.code === '22023' || error.code === '22P02' || error.code === '54000') {
        return NextResponse.json({ error: 'The scrapbook could not be saved as sent', detail: error.message }, { status: 422, headers: NO_STORE });
      }
      throw error;
    }
    return NextResponse.json({ success: true, savedAt: data }, { headers: NO_STORE });
  } catch (e) {
    console.error(JSON.stringify({ level: 'ERROR', event: 'SCRAPBOOK_SAVE_FAILED', id: params.id, message: e instanceof Error ? e.message : String(e) }));
    return NextResponse.json({ error: 'The request could not be completed.' }, { status: 500, headers: NO_STORE });
  }
}

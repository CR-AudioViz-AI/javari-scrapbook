// app/api/scrapbooks/[id]/duplicate/route.ts
// Purpose: copy a scrapbook the caller may view into a new one they own.
// Date: 2026-09-10 (full replacement)
//
// The previous version was ungated: it copied ANY scrapbook by UUID - private
// ones included - returned the copy to the caller, and assigned it to a made-up
// "anon_xxxx" user id that is not a user.
//
// Now the caller must be signed in and allowed to view the source; the copy is
// theirs, private, written through scrapbook_save() with fresh ids.
//
// CR AudioViz AI, LLC · EIN 39-3646201
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { requireUser } from '@/lib/api/require-user';
import { serviceClient } from '@/lib/api/service-client';
import { scrapbookAccess, isUuid } from '@/lib/api/scrapbook-access';
import type { ElementRow, PageRow, ScrapbookRow } from '@/lib/api/scrapbook-dto';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const NO_STORE = { 'Cache-Control': 'no-store' } as const;

export async function POST(request: Request, { params }: { params: { id: string } }): Promise<NextResponse> {
  const auth = await requireUser(request);
  if (!auth.ok) return auth.res;
  if (!isUuid(params.id)) return NextResponse.json({ error: 'Invalid scrapbook id' }, { status: 400, headers: NO_STORE });

  try {
    const db = serviceClient();
    const access = await scrapbookAccess(db, params.id, auth.userId);
    // Not-found and not-allowed answer the same, so ids cannot be probed.
    if (!access.exists || !access.canView) {
      return NextResponse.json({ error: 'Scrapbook not found' }, { status: 404, headers: NO_STORE });
    }

    const { data, error } = await db
      .from('scrapbooks')
      .select('*, pages:scrapbook_pages(*, elements:scrapbook_elements(*))')
      .eq('id', params.id)
      .single();
    if (error) throw error;
    const src = data as ScrapbookRow & { pages: PageRow[] };

    const newId = uuidv4();
    const doc = {
      id: newId,
      title: `${src.title} (Copy)`.slice(0, 200),
      description: src.description,
      coverImage: src.cover_image,
      tags: (src.tags ?? []).filter((t) => t !== 'favorite'),
      pageSize: { width: src.page_width, height: src.page_height, name: src.page_size_name },
      pages: [...(src.pages ?? [])]
        .sort((a, b) => a.page_order - b.page_order)
        .map((p, i) => ({
          id: uuidv4(),
          name: p.name,
          order: i,
          width: p.width,
          height: p.height,
          background: p.background,
          elements: [...(p.elements ?? [])]
            .sort((a: ElementRow, b: ElementRow) => a.z_index - b.z_index)
            .map((e: ElementRow) => ({ ...e.properties, id: uuidv4(), type: e.element_type, zIndex: e.z_index })),
        })),
    };

    const { error: saveErr } = await db.rpc('scrapbook_save', { p_user: auth.userId, p_doc: doc });
    if (saveErr) throw saveErr;
    return NextResponse.json({ success: true, scrapbook: { id: newId, title: doc.title } }, { status: 201, headers: NO_STORE });
  } catch (e) {
    console.error(JSON.stringify({ level: 'ERROR', event: 'SCRAPBOOK_DUPLICATE_FAILED', id: params.id, message: e instanceof Error ? e.message : String(e) }));
    return NextResponse.json({ error: 'The request could not be completed.' }, { status: 500, headers: NO_STORE });
  }
}

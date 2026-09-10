// app/api/scrapbooks/route.ts
// Purpose: list the caller's scrapbooks (GET) and create a blank one (POST).
// Date: 2026-09-10 (full replacement)
//
// What the previous version got wrong:
//   - returned raw snake_case rows; the dashboard reads camelCase, so every card
//     would have rendered blank with "Invalid Date"
//   - interpolated ?search= straight into a PostgREST .or() filter string, which
//     lets a caller inject filter syntax; now escaped and bounded
//   - passed ?sort= through unvalidated; now an allow-list
//   - POST read templates from `templates`, which in this database is the LEGAL
//     documents table, and logged to javari_activity_log with columns that table
//     does not have
//
// CR AudioViz AI, LLC · EIN 39-3646201
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { requireUser } from '@/lib/api/require-user';
import { serviceClient } from '@/lib/api/service-client';
import { readBody } from '@/lib/api/body';
import { toSummary, type ScrapbookRow } from '@/lib/api/scrapbook-dto';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const NO_STORE = { 'Cache-Control': 'no-store' } as const;
const SORTS = new Set(['updated_at', 'created_at', 'title', 'view_count']);
const FILTERS = new Set(['all', 'favorites', 'shared', 'public']);

function fail(status: number, error: string): NextResponse {
  return NextResponse.json({ error }, { status, headers: NO_STORE });
}

/** Escape a user string for use inside a PostgREST ilike pattern. */
function ilikeTerm(raw: string): string {
  return raw.slice(0, 100).replace(/[%_\\,()*"]/g, (c) => `\\${c}`);
}

export async function GET(request: Request): Promise<NextResponse> {
  const auth = await requireUser(request);
  if (!auth.ok) return auth.res;

  const params = new URL(request.url).searchParams;
  const filter = FILTERS.has(params.get('filter') ?? '') ? (params.get('filter') as string) : 'all';
  const sort = SORTS.has(params.get('sort') ?? '') ? (params.get('sort') as string) : 'updated_at';
  const ascending = params.get('order') === 'asc';
  const limit = Math.min(Math.max(parseInt(params.get('limit') ?? '50', 10) || 50, 1), 100);
  const offset = Math.max(parseInt(params.get('offset') ?? '0', 10) || 0, 0);
  const search = (params.get('search') ?? '').trim();

  try {
    const db = serviceClient();

    let ids: string[] | null = null;
    if (filter === 'shared') {
      const { data, error } = await db.from('scrapbook_collaborators').select('scrapbook_id').eq('user_id', auth.userId);
      if (error) throw error;
      ids = (data ?? []).map((r: { scrapbook_id: string }) => r.scrapbook_id);
      if (ids.length === 0) return NextResponse.json({ scrapbooks: [], total: 0, limit, offset }, { headers: NO_STORE });
    }

    let query = db
      .from('scrapbooks')
      .select('*, pages:scrapbook_pages(count), collaborators:scrapbook_collaborators(count)', { count: 'exact' });
    query = ids ? query.in('id', ids) : query.eq('user_id', auth.userId);
    if (filter === 'favorites') query = query.contains('tags', ['favorite']);
    if (filter === 'public') query = query.eq('is_public', true);
    if (search) {
      const t = ilikeTerm(search);
      query = query.or(`title.ilike.*${t}*,description.ilike.*${t}*`);
    }
    const { data, error, count } = await query.order(sort, { ascending }).range(offset, offset + limit - 1);
    if (error) throw error;

    type Row = ScrapbookRow & { pages: { count: number }[]; collaborators: { count: number }[] };
    const scrapbooks = ((data ?? []) as Row[]).map((r) =>
      toSummary(r, r.pages?.[0]?.count ?? 0, r.collaborators?.[0]?.count ?? 0),
    );
    return NextResponse.json({ scrapbooks, total: count ?? scrapbooks.length, limit, offset }, { headers: NO_STORE });
  } catch (e) {
    console.error(JSON.stringify({ level: 'ERROR', event: 'SCRAPBOOK_LIST_FAILED', message: e instanceof Error ? e.message : String(e) }));
    return fail(500, 'The request could not be completed.');
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const auth = await requireUser(request);
  if (!auth.ok) return auth.res;

  const parsed = await readBody<Record<string, unknown>>(request);
  if (!parsed.ok) return parsed.response as NextResponse;
  const b = parsed.body;
  const title = typeof b.title === 'string' && b.title.trim() ? b.title.trim().slice(0, 200) : 'Untitled Scrapbook';
  const description = typeof b.description === 'string' ? b.description.slice(0, 5000) : '';
  const width = typeof b.pageWidth === 'number' ? b.pageWidth : 1200;
  const height = typeof b.pageHeight === 'number' ? b.pageHeight : 1600;
  const sizeName = typeof b.pageSizeName === 'string' ? b.pageSizeName.slice(0, 50) : '8x10';

  const id = uuidv4();
  const doc = {
    id, title, description,
    pageSize: { width, height, name: sizeName },
    pages: [{
      id: uuidv4(), name: 'Page 1', order: 0, width, height, elements: [],
      background: { id: uuidv4(), type: 'background', backgroundType: 'solid', color: '#ffffff' },
    }],
  };

  try {
    const db = serviceClient();
    const { error } = await db.rpc('scrapbook_save', { p_user: auth.userId, p_doc: doc });
    if (error) throw error;
    return NextResponse.json({ scrapbook: { id, title } }, { status: 201, headers: NO_STORE });
  } catch (e) {
    console.error(JSON.stringify({ level: 'ERROR', event: 'SCRAPBOOK_CREATE_FAILED', message: e instanceof Error ? e.message : String(e) }));
    return fail(500, 'The request could not be completed.');
  }
}

import { rateLimit } from '@/lib/api/rate-limit';
// app/api/unsplash/search/route.ts
// Unsplash photo search.
//
// 2026-09-07: attribution is now normalised into the response.
//
// Unsplash's API Guidelines require the photographer AND Unsplash to be credited
// and linked on every photo shown, with a utm_source on the links. The raw
// response carries what is needed but buries it in user.links.html, so a UI
// built against it can easily show a photo with no credit - which is both a
// guideline breach and, more simply, not crediting the person who took it.
//
// Each result now carries an `attribution` block the UI cannot miss.

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// Unsplash asks that links back carry this, so they can attribute traffic.
const UTM = 'utm_source=javari_scrapbook&utm_medium=referral';

interface UnsplashPhoto {
  id: string;
  urls?: Record<string, string>;
  links?: { html?: string; download_location?: string };
  user?: { name?: string; username?: string; links?: { html?: string } };
  alt_description?: string | null;
}

export async function GET(request: NextRequest) {
  const limited = rateLimit(request);
  if (limited) return limited;

  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') ?? searchParams.get('q') ?? '';
  const page = searchParams.get('page') ?? '1';
  const perPage = searchParams.get('per_page') ?? '30';

  if (!query.trim()) {
    return NextResponse.json(
      { error: 'A search term is required.', code: 'QUERY_REQUIRED' },
      { status: 400 },
    );
  }

  if (!UNSPLASH_ACCESS_KEY) {
    // 503, not 500: the service is unavailable, the request was not wrong. A UI
    // can then fall back to the providers that ARE configured instead of
    // treating this as a failure of the whole search.
    return NextResponse.json(
      { error: 'Unsplash is not configured.', code: 'PROVIDER_UNAVAILABLE', provider: 'unsplash' },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&orientation=squarish`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`, 'Accept-Version': 'v1' } },
    );

    if (!response.ok) {
      // Pass the provider's own meaning through rather than flattening
      // everything to 500. 403 from Unsplash means the hourly limit is spent,
      // and a demo application only gets fifty.
      const status = response.status === 403 ? 429 : 502;
      return NextResponse.json(
        {
          error: response.status === 403
            ? 'Unsplash hourly limit reached. Try another source.'
            : 'Unsplash could not be reached.',
          code: response.status === 403 ? 'RATE_LIMITED' : 'PROVIDER_ERROR',
          provider: 'unsplash',
        },
        { status },
      );
    }

    const data = await response.json() as { results?: UnsplashPhoto[]; total?: number };
    const results = (data.results ?? []).map(p => ({
      ...p,
      attribution: {
        photographer: p.user?.name ?? 'Unknown',
        photographer_url: p.user?.links?.html ? `${p.user.links.html}?${UTM}` : null,
        source: 'Unsplash',
        source_url: `https://unsplash.com/?${UTM}`,
        photo_url: p.links?.html ? `${p.links.html}?${UTM}` : null,
        // Call /api/unsplash/download with this when the user actually USES the
        // photo. Unsplash requires it and it is how photographers see reach.
        download_location: p.links?.download_location ?? null,
        required: true,
      },
    }));

    return NextResponse.json({ ...data, results, provider: 'unsplash' });
  } catch {
    return NextResponse.json(
      { error: 'Unsplash could not be reached.', code: 'PROVIDER_ERROR', provider: 'unsplash' },
      { status: 502 },
    );
  }
}

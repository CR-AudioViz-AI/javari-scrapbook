// lib/api/authed-fetch.ts
// Purpose: client fetch that attaches the caller's Supabase access token.
// Date: 2026-09-10
//
// Every scrapbook route that touches a user's data calls requireUser(), which
// reads ONLY the Authorization header - sessions live in localStorage here, not
// cookies. Nothing on the client sent that header, so the dashboard, publish,
// export, upload, collaborate and comments all answered 401 to every user.
// Every client call to this app's own /api must go through authedFetch().
//
// Where the token comes from is decided in lib/auth/access-token.ts, so the same
// call works standalone and when this app is embedded in craudiovizai.com.
//
// CR AudioViz AI, LLC · EIN 39-3646201
'use client';

import { getAccessToken } from '@/lib/auth/access-token';

export async function authedFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers ?? {});
  if (!headers.has('Content-Type') && typeof init.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }
  const token = await getAccessToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return fetch(input, { ...init, headers });
}

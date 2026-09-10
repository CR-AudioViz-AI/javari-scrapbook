// lib/auth/access-token.ts
// Purpose: the single answer to "what is the current user's access token?"
// Date: 2026-09-10
//
// Standalone: the app's own supabase-js session (localStorage); getSession()
// refreshes it before expiry, so the token returned is current.
//
// Embedded in craudiovizai.com: the PLATFORM's session, obtained from the parent
// page through lib/embed/bridge.ts. One sign-in for the whole site, and no
// second session racing the first. See the bridge header for why only access
// tokens cross the frame.
//
// CR AudioViz AI, LLC · EIN 39-3646201
'use client';

import { createClient } from '@/lib/supabase/client';
import { isEmbedded, parentAccessToken } from '@/lib/embed/bridge';

export async function getAccessToken(): Promise<string | null> {
  if (isEmbedded()) return parentAccessToken();
  try {
    const { data } = await createClient().auth.getSession();
    return data.session?.access_token ?? null;
  } catch {
    return null;
  }
}

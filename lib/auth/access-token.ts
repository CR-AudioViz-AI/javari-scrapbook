// lib/auth/access-token.ts
// Purpose: the single answer to "what is the current user's access token?"
// Date: 2026-09-10
//
// Standalone, the session is the app's own supabase-js session (localStorage).
// supabase-js refreshes it before expiry inside getSession(), so the token
// returned here is current. The embedded path is added by the embed bridge.
//
// CR AudioViz AI, LLC · EIN 39-3646201
'use client';

import { createSupabaseBrowserClient } from '@/lib/supabase';

export async function getAccessToken(): Promise<string | null> {
  try {
    const { data } = await createSupabaseBrowserClient().auth.getSession();
    return data.session?.access_token ?? null;
  } catch {
    return null;
  }
}

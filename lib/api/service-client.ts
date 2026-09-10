// lib/api/service-client.ts
// Purpose: the service-role Supabase client for API routes.
// Date: 2026-09-10
//
// Each route carried its own copy of this. Identity NEVER comes from here -
// routes establish it with requireUser()/optionalUser() first. `cache: no-store`
// because Next's Data Cache otherwise serves stale Supabase reads.
//
// CR AudioViz AI, LLC · EIN 39-3646201
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { secretKey, supabaseUrl } from '@craudioviz/platform-sdk';

export function serviceClient(): SupabaseClient {
  return createClient(supabaseUrl(), secretKey(), {
    auth: { persistSession: false },
    global: { fetch: (u: RequestInfo | URL, o?: RequestInit) => fetch(u, { ...o, cache: 'no-store' }) },
  });
}

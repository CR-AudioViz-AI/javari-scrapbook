/**
 * CR AudioViz AI - Supabase Client
 * =================================
 * 
 * Universal database client for CR AudioViz AI apps.
 * For authentication, credits, and central services, use:
 * 
 *   import { CentralServices, CentralAuth, CentralCredits } from './central-services';
 * 
 * This client is for app-specific database operations only.
 * Auth, payments, and credits should ALWAYS go through central services.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createClient as canonicalBrowserClient } from '@/lib/supabase/client';
import { secretKey, publishableKey, supabaseUrl } from "@craudioviz/platform-sdk";

// Re-export admin utilities from central services
export { isAdmin, shouldChargeCredits, ADMIN_EMAILS, CentralServices } from './central-services';

// Centralized Supabase configuration
const SUPABASE_URL = supabaseUrl();
const SUPABASE_ANON_KEY = publishableKey();

// Standard client for general use
// 2026-09-10: this was a full session client built at MODULE LOAD, so importing
// this file anywhere in the browser created a second GoTrueClient on the shared
// storage key ("Multiple GoTrueClient instances detected"). It is a data client
// only: no session, no refresh, its own storage key. Sessions belong to
// lib/supabase/client.ts alone.
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, storageKey: 'sb-scrapbook-data-client' },
});


export function createSupabaseBrowserClient(): SupabaseClient {
  // 2026-09-10: this built a SECOND browser client beside lib/supabase/client.ts.
  // Both used the same localStorage key, so two instances raced every token
  // refresh - the duplicate-module defect class. There is now one client.
  if (typeof window === 'undefined') {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return canonicalBrowserClient();
}

// Server client for API routes
export function createSupabaseServerClient(): SupabaseClient {
  const serviceKey = secretKey();
  if (!serviceKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY not set, using anon key');
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return createClient(SUPABASE_URL, serviceKey);
}

export { SUPABASE_URL, SUPABASE_ANON_KEY };
export default supabase;

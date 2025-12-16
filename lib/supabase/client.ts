// lib/supabase/client.ts
// Connects to CR AudioViz AI CENTRAL Supabase instance
// All apps share ONE database for unified user experience

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// CENTRAL SUPABASE - Same as craudiovizai.com
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kteobfyferrukqeolofj.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Browser client for client components
export function createBrowserClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Server client with service role (for API routes)
export function createServerClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;
  return createClient(SUPABASE_URL, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Singleton for browser (prevents multiple instances)
let browserClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (typeof window === 'undefined') {
    return createServerClient();
  }
  
  if (!browserClient) {
    browserClient = createBrowserClient();
  }
  return browserClient;
}

// Export for convenience
export const supabase = typeof window !== 'undefined' 
  ? createBrowserClient() 
  : createServerClient();

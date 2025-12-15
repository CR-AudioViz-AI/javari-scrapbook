// lib/supabase/client.ts
// Supabase client configuration

import { createClient } from '@supabase/supabase-js';

// Browser client for client components
export function createBrowserSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Server client with service role (for API routes)
export function createServerSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}

// Singleton for browser
let browserClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (typeof window === 'undefined') {
    return createServerSupabaseClient();
  }
  
  if (!browserClient) {
    browserClient = createBrowserSupabaseClient();
  }
  return browserClient;
}

// Database types
export type Database = {
  public: {
    Tables: {
      scrapbooks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          cover_image: string | null;
          page_width: number;
          page_height: number;
          page_size_name: string | null;
          is_public: boolean;
          is_template: boolean;
          template_category: string | null;
          tags: string[];
          view_count: number;
          like_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['scrapbooks']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['scrapbooks']['Insert']>;
      };
      scrapbook_pages: {
        Row: {
          id: string;
          scrapbook_id: string;
          name: string;
          page_order: number;
          background: any;
          width: number;
          height: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['scrapbook_pages']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['scrapbook_pages']['Insert']>;
      };
      scrapbook_elements: {
        Row: {
          id: string;
          page_id: string;
          element_type: string;
          name: string;
          position: { x: number; y: number };
          size: { width: number; height: number };
          transform: any;
          opacity: number;
          z_index: number;
          locked: boolean;
          visible: boolean;
          shadow: any;
          border: any;
          properties: any;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['scrapbook_elements']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['scrapbook_elements']['Insert']>;
      };
      user_uploads: {
        Row: {
          id: string;
          user_id: string;
          file_name: string;
          file_url: string;
          file_type: string;
          file_size: number | null;
          thumbnail_url: string | null;
          metadata: any;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_uploads']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['user_uploads']['Insert']>;
      };
      scrapbook_collaborators: {
        Row: {
          id: string;
          scrapbook_id: string;
          user_id: string;
          role: 'owner' | 'editor' | 'viewer';
          invited_by: string | null;
          invited_at: string;
          accepted_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['scrapbook_collaborators']['Row'], 'id' | 'invited_at'>;
        Update: Partial<Database['public']['Tables']['scrapbook_collaborators']['Insert']>;
      };
      scrapbook_comments: {
        Row: {
          id: string;
          scrapbook_id: string;
          page_id: string | null;
          user_id: string;
          content: string;
          position: { x: number; y: number } | null;
          resolved: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['scrapbook_comments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['scrapbook_comments']['Insert']>;
      };
      scrapbook_likes: {
        Row: {
          id: string;
          scrapbook_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['scrapbook_likes']['Row'], 'id' | 'created_at'>;
        Update: never;
      };
    };
  };
};

import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export const createBrowserClient = () => {
  return createClientComponentClient()
}

export const createServerClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient({ cookies: () => cookieStore })
}

// Service role client for admin operations
export const createServiceClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

export type Database = {
  public: {
    Tables: {
      scrapbooks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          cover_image: string | null
          template_id: string | null
          is_public: boolean
          page_count: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['scrapbooks']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['scrapbooks']['Insert']>
      }
      scrapbook_pages: {
        Row: {
          id: string
          scrapbook_id: string
          page_number: number
          background: any
          elements: any[]
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['scrapbook_pages']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['scrapbook_pages']['Insert']>
      }
      templates: {
        Row: {
          id: string
          name: string
          category: string
          thumbnail: string
          layout: any
          is_premium: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['templates']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['templates']['Insert']>
      }
      embellishments: {
        Row: {
          id: string
          name: string
          category: string
          image_url: string
          is_premium: boolean
          tags: string[]
        }
        Insert: Omit<Database['public']['Tables']['embellishments']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['embellishments']['Insert']>
      }
      user_photos: {
        Row: {
          id: string
          user_id: string
          url: string
          thumbnail_url: string
          filename: string
          size: number
          uploaded_at: string
        }
        Insert: Omit<Database['public']['Tables']['user_photos']['Row'], 'id' | 'uploaded_at'>
        Update: Partial<Database['public']['Tables']['user_photos']['Insert']>
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          display_name: string
          avatar_url: string | null
          bio: string | null
          subscription_tier: string
          storage_used: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['user_profiles']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['user_profiles']['Insert']>
      }
    }
  }
}

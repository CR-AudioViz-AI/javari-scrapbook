// app/creator/[username]/page.tsx
// CR AudioViz AI - Javari Scrapbook Creator Profile
// Public profile page for scrapbook creators
// Created: 2026-03-14

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Book, Heart, Eye, Calendar, ArrowLeft, ExternalLink } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface Props {
  params: { username: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `${params.username} — Javari Scrapbook Creator`,
    description: `Browse scrapbooks created by ${params.username} on the CR AudioViz AI platform.`,
  }
}

export default async function CreatorProfilePage({ params }: Props) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          try { cookieStore.set({ name, value, ...options }) } catch {}
        },
        remove(name: string, options: CookieOptions) {
          try { cookieStore.set({ name, value: '', ...options }) } catch {}
        },
      },
    }
  )

  // Fetch creator profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .or(`username.eq.${params.username},display_name.ilike.${params.username}`)
    .single()

  if (!profile) {
    notFound()
  }

  // Fetch their public scrapbooks
  const { data: scrapbooks } = await supabase
    .from('scrapbooks')
    .select('id, title, description, cover_image, view_count, like_count, created_at, updated_at')
    .eq('user_id', profile.id)
    .eq('is_public', true)
    .order('updated_at', { ascending: false })
    .limit(24)

  const totalViews = scrapbooks?.reduce((sum, s) => sum + (s.view_count || 0), 0) || 0
  const totalLikes = scrapbooks?.reduce((sum, s) => sum + (s.like_count || 0), 0) || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Javari Scrapbook</span>
          </Link>
          <Link href="/dashboard" className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:opacity-90">
            Start Creating
          </Link>
        </div>
      </nav>

      {/* Profile Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              {(profile.display_name || profile.username || 'C').charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.display_name || profile.username || params.username}
              </h1>
              {profile.bio && <p className="text-gray-600 mt-1">{profile.bio}</p>}
              <div className="flex items-center gap-6 mt-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Book className="w-4 h-4" />
                  {scrapbooks?.length || 0} scrapbooks
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {totalViews.toLocaleString()} views
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {totalLikes.toLocaleString()} likes
                </span>
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-pink-600 hover:text-pink-700">
                    <ExternalLink className="w-4 h-4" />
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrapbooks Grid */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {!scrapbooks || scrapbooks.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Book className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No public scrapbooks yet.</p>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Published Scrapbooks ({scrapbooks.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {scrapbooks.map((s) => (
                <Link key={s.id} href={`/view/${s.id}`}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                  <div className="aspect-[4/3] bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                    {s.cover_image ? (
                      <img src={s.cover_image} alt={s.title} className="w-full h-full object-cover" />
                    ) : (
                      <Book className="w-10 h-10 text-pink-300" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 truncate group-hover:text-pink-600 transition-colors">
                      {s.title}
                    </h3>
                    {s.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{s.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />{s.view_count || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />{s.like_count || 0}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// app/layout.tsx — Javari Scrapbook
// CR AudioViz AI · EIN: 39-3646201
//
// 2026-09-07: ONE header and ONE footer, both the platform's.
//
// This file previously stacked three bars: the SDK's BrandedHeader (a thin strip
// with a logo and a Log In link - NOT the site header), a hand-rolled dark strip
// with the app name and a "Free to Start" button, and a hand-rolled copyright
// footer. app/page.tsx added a fourth, a fixed pink nav that covered them all.
// Four different chromes on one page.
//
// PlatformHeader and PlatformFooter are the real ones, ported into the SDK from
// the core so this app renders exactly what craudiovizai.com renders. Their
// hrefs are absolute, so they lead back to the platform from this domain.
//
// globals.css must stay imported. Next emits a stylesheet link only for CSS
// reachable from the module graph; without it this site served raw HTML for
// months while every build passed.
import './globals.css'
import { PlatformHeader, PlatformFooter } from '@craudioviz/platform-sdk'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Javari Scrapbook',
  description: 'AI-powered digital scrapbooking — organize memories, create stories.',
  openGraph: {
    title: 'Javari Scrapbook',
    description: 'AI-powered digital scrapbooking — organize memories, create stories.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {/* WCAG 2.4.1. Hidden until focused - it exists for people not using a
            mouse, and appears the moment they tab. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-black focus:outline focus:outline-2"
        >
          Skip to main content
        </a>

        <PlatformHeader />
        <main id="main">{children}</main>
        <PlatformFooter />
      </body>
    </html>
  )
}

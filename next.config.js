/** @type {import('next').NextConfig} */
const nextConfig = {
      async headers() {
        // Production: the platform's own origins only. Preview builds also allow
        // this team's *.vercel.app previews so the embed can be verified before it
        // ships; that wider list never reaches a production deployment.
        const FRAME_ANCESTORS = [
          "'self'",
          'https://craudiovizai.com', 'https://www.craudiovizai.com',
          'https://javariscrapbook.com', 'https://www.javariscrapbook.com',
          ...(process.env.VERCEL_ENV === 'preview' ? ['https://*.vercel.app'] : []),
        ].join(' ');
        // 2026-09-02: added after an ecosystem sweep found 58 of 60 live sites with
        // no CSP and weak or absent HSTS. This project had no headers() at all.
        //
        // HSTS is enforced immediately - it only tells the browser to refuse
        // plaintext, so there is nothing for it to break. CSP ships REPORT-ONLY
        // first: a policy that blocks a script the app needs takes the app down,
        // and it graduates to enforcing once the violation reports are quiet.
        return [
          {
            source: '/:path*',
            headers: [
              // 2026-09-10: ENFORCED, and the only thing that decides who may frame
              // this app. craudiovizai.com shows it inside /apps/scrapbook, so the
              // platform's origins may; nobody else may (clickjacking). X-Frame-Options
              // DENY was removed because it cannot allow-list, and a browser that
              // honours it would refuse the platform too.
              { key: 'Content-Security-Policy', value: `frame-ancestors ${FRAME_ANCESTORS}` },
              { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
              { key: 'Content-Security-Policy-Report-Only', value: `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://*.paypal.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://*.paypal.com; frame-src 'self' https://js.stripe.com https://*.paypal.com; frame-ancestors ${FRAME_ANCESTORS}; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests` },
              { key: 'X-Content-Type-Options', value: 'nosniff' },
              { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
              { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
            ],
          },
        ];
      },

  // 2026-08-29: required for @craudioviz/platform-sdk. The SDK ships raw
  // TypeScript and Next does not run node_modules through SWC by default, so
  // any import carrying a `type` re-export fails the build without this.
  transpilePackages: ["@craudioviz/platform-sdk"],
  // 2026-09-10: lib/embed/bridge.ts accepts core PREVIEW parents only on preview
  // builds. Pinned here at build time rather than relying on Vercel's optional
  // automatic exposure of system variables.
  env: { NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV ?? 'development' },
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.cloudflare.com' },
    ],
  },
};

module.exports = nextConfig;

'use client';
// app/auth/callback/page.tsx
// Purpose: finish OAuth sign-in (Google and others) in the browser.
// Date: 2026-09-10 (replaces app/auth/callback/route.ts)
//
// The previous callback was a SERVER route exchanging the code with the
// @supabase/ssr cookie client. This app uses PKCE with the verifier stored in
// the browser's localStorage, which a server route cannot read - so the exchange
// could not succeed and OAuth sign-in could never complete. The @supabase/ssr
// cookie client is also forbidden on this platform (chunked cookies corrupt).
//
// The canonical browser client (lib/supabase/client.ts) has detectSessionInUrl:
// constructing it on this page exchanges ?code= using the stored verifier. This
// page waits for that, then sends the user on. Only a same-site relative `next`
// is honoured, so the callback cannot be used as an open redirect.
//
// CR AudioViz AI, LLC · EIN 39-3646201
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function safeNext(raw: string | null): string {
  return raw && raw.startsWith('/') && !raw.startsWith('//') ? raw : '/dashboard';
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const [failed, setFailed] = useState<string | null>(null);

  useEffect(() => {
    let done = false;
    const params = new URLSearchParams(window.location.search);
    const next = safeNext(params.get('next'));
    const oauthError = params.get('error_description') ?? params.get('error');
    if (oauthError) { setFailed(oauthError); return; }

    const supabase = createClient();
    const finish = (ok: boolean) => {
      if (done) return;
      done = true;
      if (ok) router.replace(next);
      else setFailed('We could not complete sign-in. Please try again.');
    };
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => { if (session) finish(true); });
    supabase.auth.getSession()
      .then(({ data }) => { if (data.session) finish(true); })
      .catch(() => finish(false));
    const timer = window.setTimeout(() => finish(false), 10000);
    return () => { sub.subscription.unsubscribe(); window.clearTimeout(timer); };
  }, [router]);

  return (
    <main id="main" className="min-h-screen flex items-center justify-center p-6">
      {failed ? (
        <div role="alert" className="text-center max-w-md">
          <p className="text-gray-800 mb-4">{failed}</p>
          <a href="/login" className="text-pink-600 underline font-medium">Back to sign in</a>
        </div>
      ) : (
        <p className="text-gray-600" aria-live="polite">Signing you in…</p>
      )}
    </main>
  );
}

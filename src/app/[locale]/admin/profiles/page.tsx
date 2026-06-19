import { setRequestLocale } from 'next-intl/server';
import { listSubmissions, profileStoreEnabled, type Submission } from '@/lib/profile-store';

// Founder view of what customers have submitted (feedback) and uploaded
// (connections), per customer. Sits under /admin so it is behind the same Basic
// Auth gate as the HR dashboard. Read only.
export const dynamic = 'force-dynamic';

export default async function ProfilesPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const subs = await listSubmissions();
  const bySlug = new Map<string, Submission[]>();
  for (const s of subs) {
    const arr = bySlug.get(s.slug) ?? [];
    arr.push(s);
    bySlug.set(s.slug, arr);
  }

  return (
    <main className="mx-auto max-w-4xl p-6 font-sans text-stone-900">
      <h1 className="text-2xl font-bold">Customer profiles</h1>
      <p className="mt-1 text-sm text-stone-500">Feedback and uploaded connections per customer.</p>

      {!profileStoreEnabled && (
        <p className="mt-4 rounded-lg bg-amber-100 p-3 text-sm text-amber-900">
          Supabase is not configured yet. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel and run the schema SQL, then submissions will appear here.
        </p>
      )}
      {profileStoreEnabled && subs.length === 0 && <p className="mt-4 text-sm text-stone-500">No submissions yet.</p>}

      {[...bySlug.entries()].map(([slug, items]) => (
        <section key={slug} className="mt-6 rounded-xl border border-stone-200 p-4">
          <h2 className="font-semibold">
            <a className="text-amber-700 underline" href={`/${locale}/c/${slug}`}>/c/{slug}</a>
            <span className="ml-2 text-xs font-normal text-stone-400">{items.length} entries</span>
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {items.map((s) => {
              const p = (s.payload ?? {}) as { rating?: number; text?: string; count?: number };
              return (
                <li key={s.id} className="rounded-lg bg-stone-50 p-3">
                  <div className="text-xs text-stone-400">
                    {new Date(s.created_at).toLocaleString()} · <span className="font-semibold text-stone-600">{s.kind}</span>
                  </div>
                  {s.kind === 'feedback' ? (
                    <div className="mt-1">
                      <span className="font-semibold">{p.rating ? `${p.rating}/5` : 'no rating'}</span>
                      {p.text ? ` · ${p.text}` : ' · (no comment)'}
                    </div>
                  ) : (
                    <div className="mt-1">{p.count ?? 0} connections uploaded (full list in Supabase)</div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </main>
  );
}

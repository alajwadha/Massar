// Server-only. Stores per-customer profile submissions (feedback + uploaded
// connections) in Supabase via its REST API. Env-gated: with no keys it no-ops,
// so the app still builds and runs before Supabase is configured. NEVER import
// this from a client component; it uses the service-role key.

const BASE = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const profileStoreEnabled = Boolean(BASE && KEY);

export type SubmissionKind = 'feedback' | 'connections';
export type Submission = {
  id: number;
  slug: string;
  kind: SubmissionKind;
  payload: unknown;
  created_at: string;
};

function authHeaders(extra?: Record<string, string>): Record<string, string> {
  return {
    apikey: KEY as string,
    Authorization: `Bearer ${KEY}`,
    'Content-Type': 'application/json',
    ...extra,
  };
}

// Append one submission (a feedback entry or an uploaded connections snapshot).
export async function saveSubmission(slug: string, kind: SubmissionKind, payload: unknown): Promise<boolean> {
  if (!profileStoreEnabled) return false;
  try {
    const res = await fetch(`${BASE}/rest/v1/submissions`, {
      method: 'POST',
      headers: authHeaders({ Prefer: 'return=minimal' }),
      body: JSON.stringify({ slug, kind, payload }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Read submissions for the founder admin view (newest first). Optionally by slug.
export async function listSubmissions(slug?: string): Promise<Submission[]> {
  if (!profileStoreEnabled) return [];
  try {
    const q = slug
      ? `?slug=eq.${encodeURIComponent(slug)}&order=created_at.desc`
      : `?order=created_at.desc&limit=1000`;
    const res = await fetch(`${BASE}/rest/v1/submissions${q}`, { headers: authHeaders(), cache: 'no-store' });
    return res.ok ? ((await res.json()) as Submission[]) : [];
  } catch {
    return [];
  }
}

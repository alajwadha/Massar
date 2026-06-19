import { NextResponse } from 'next/server';
import { getPlan } from '@/lib/app-data';
import { saveSubmission, type SubmissionKind } from '@/lib/profile-store';

// One small endpoint for both feedback and uploaded connections: the customer's
// browser POSTs { slug, kind, payload } and it is appended to their profile.
// Not behind admin auth (the customer is on their own /c/<slug>); the slug must
// match a real plan, and the payload is size-capped to limit abuse.
export async function POST(req: Request) {
  let body: { slug?: string; kind?: string; payload?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { slug, kind, payload } = body;
  if (!slug || !getPlan(slug)) return NextResponse.json({ ok: false }, { status: 400 });
  if (kind !== 'feedback' && kind !== 'connections') return NextResponse.json({ ok: false }, { status: 400 });
  if (JSON.stringify(payload ?? null).length > 800_000) return NextResponse.json({ ok: false }, { status: 413 });

  const ok = await saveSubmission(slug, kind as SubmissionKind, payload ?? null);
  return NextResponse.json({ ok });
}

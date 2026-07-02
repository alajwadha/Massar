import { NextRequest, NextResponse } from 'next/server';

// Funnel events sink (PIPELINE.md §10). Until Supabase lands, events are logged
// as one-line JSON and read in the Vercel deployment logs (filter "[track]").
// Deliberately anonymous: slug + event + tiny metadata only, so nothing here is
// ever sensitive. Payloads are size-capped and shallow-validated, not trusted.
const EVENTS = new Set([
  'plan_opened',
  'tab_visited',
  'csv_uploaded',
  'cv_issue_fixed',
  'cert_toggled',
  'outreach_status',
  'template_copied',
]);

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    const raw = await req.text();
    if (raw.length > 1024) return NextResponse.json({ ok: false }, { status: 413 });
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const b = body as { slug?: unknown; event?: unknown };
  if (typeof b.slug !== 'string' || typeof b.event !== 'string' || !EVENTS.has(b.event)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  console.log('[track]', JSON.stringify({ at: new Date().toISOString(), ...(body as object) }));
  return NextResponse.json({ ok: true });
}

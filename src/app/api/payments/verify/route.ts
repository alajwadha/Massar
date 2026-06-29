import { NextRequest, NextResponse } from 'next/server';

// Server-side verification: never trust the client's "status" param. We re-fetch
// the payment from Moyasar with the secret key and confirm it is actually paid.
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  const secret = process.env.MOYASAR_SECRET_KEY;

  if (!id) return NextResponse.json({ ok: false, error: 'missing_id' }, { status: 400 });
  if (!secret) return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 });

  try {
    const res = await fetch(`https://api.moyasar.com/v1/payments/${id}`, {
      headers: { Authorization: `Basic ${Buffer.from(`${secret}:`).toString('base64')}` },
      cache: 'no-store',
    });
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: `moyasar_${res.status}` }, { status: 502 });
    }
    const p = await res.json();
    const paid = p.status === 'paid';
    // TODO (Phase 1, once Supabase is wired): on `paid`, record the payment row
    // and unlock the buyer's plan, then redirect into onboarding.
    return NextResponse.json({
      ok: paid,
      status: p.status,
      amount: p.amount,
      currency: p.currency,
      description: p.description,
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'network' }, { status: 502 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getPlan } from '@/lib/plans';

// Server-side verification: never trust the client's "status" param. We re-fetch
// the payment from Moyasar with the secret key and confirm it is actually paid —
// AND that it was paid for the exact amount/currency of the plan being unlocked.
// Without the amount check, a buyer could craft a cheap Moyasar payment of their
// own and replay its id into the callback to unlock a more expensive plan.
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  const planParam = req.nextUrl.searchParams.get('plan');
  const secret = process.env.MOYASAR_SECRET_KEY;

  if (!id) return NextResponse.json({ ok: false, error: 'missing_id' }, { status: 400 });
  if (!secret) return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 });

  // The plan the buyer claims to be unlocking. We verify the captured payment
  // matches its price, so a tampered/replayed `plan` can't unlock anything.
  const plan = getPlan(planParam ?? undefined);

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
    const amountOk = p.amount === plan.amountHalalas;
    const currencyOk = p.currency === 'SAR';
    const ok = paid && amountOk && currencyOk;

    // TODO (once a DB is wired): on `ok`, record the payment row keyed by `id`
    // (idempotent — guard against replaying the same paid id), unlock `plan.id`
    // for the buyer, then redirect into onboarding.
    return NextResponse.json({
      ok,
      status: p.status,
      plan: plan.id,
      amount: p.amount,
      currency: p.currency,
      description: p.description,
      // Surface why a genuinely-paid payment was still rejected, to ease
      // debugging without collapsing it into a generic failure.
      ...(paid && !ok ? { error: 'plan_mismatch' } : {}),
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'network' }, { status: 502 });
  }
}

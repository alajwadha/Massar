'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Link } from '@/i18n/routing';

const btnPrimary =
  'inline-flex h-12 items-center justify-center rounded-full bg-brand-600 px-7 text-base font-medium text-white shadow-soft transition-colors duration-200 hover:bg-brand-700';
const btnSecondary =
  'inline-flex h-12 items-center justify-center rounded-full border border-line bg-canvas-raised px-7 text-base font-medium text-ink transition-colors duration-200 hover:border-ink/20';

type State = 'loading' | 'paid' | 'failed';

export function PaymentResult({
  paymentId,
  labels,
}: {
  paymentId: string | undefined;
  labels: {
    verifying: string;
    paidTitle: string;
    paidBody: string;
    failedTitle: string;
    failedBody: string;
    startNow: string;
    retry: string;
  };
}) {
  const [state, setState] = useState<State>('loading');

  useEffect(() => {
    if (!paymentId) {
      setState('failed');
      return;
    }
    fetch(`/api/payments/verify?id=${encodeURIComponent(paymentId)}`)
      .then((r) => r.json())
      .then((d) => setState(d.ok ? 'paid' : 'failed'))
      .catch(() => setState('failed'));
  }, [paymentId]);

  if (state === 'loading') {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-ink-soft">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
        <p>{labels.verifying}</p>
      </div>
    );
  }

  if (state === 'paid') {
    return (
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 className="h-14 w-14 text-brand-600" />
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight">{labels.paidTitle}</h1>
        <p className="mt-2 max-w-md text-ink-soft">{labels.paidBody}</p>
        <Link href="/app" className={`mt-6 ${btnPrimary}`}>{labels.startNow}</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center">
      <XCircle className="h-14 w-14 text-red-500" />
      <h1 className="mt-4 text-2xl font-extrabold tracking-tight">{labels.failedTitle}</h1>
      <p className="mt-2 max-w-md text-ink-soft">{labels.failedBody}</p>
      <Link href="/#pricing" className={`mt-6 ${btnSecondary}`}>{labels.retry}</Link>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { PILL, GHOST, Serif } from '@/components/marketing/shared';
import { cn } from '@/lib/utils';

const btnPrimary = cn('inline-flex h-12 items-center justify-center rounded-full px-7 text-base font-semibold transition-colors', PILL);
const btnSecondary = cn('inline-flex h-12 items-center justify-center rounded-full px-7 text-base font-medium transition-colors', GHOST);

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
      <div className="flex flex-col items-center gap-3 py-10 text-stone-500 dark:text-stone-400">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600 dark:text-amber-300" />
        <p>{labels.verifying}</p>
      </div>
    );
  }

  if (state === 'paid') {
    return (
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 className="h-14 w-14 text-amber-600 dark:text-amber-300" />
        <Serif className="mt-5 block text-3xl tracking-tight">{labels.paidTitle}</Serif>
        <p className="mt-3 max-w-md text-lg leading-relaxed text-stone-600 dark:text-stone-300">{labels.paidBody}</p>
        <Link href="/app" className={`mt-7 ${btnPrimary}`}>{labels.startNow}</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center">
      <XCircle className="h-14 w-14 text-red-500" />
      <Serif className="mt-5 block text-3xl tracking-tight">{labels.failedTitle}</Serif>
      <p className="mt-3 max-w-md text-lg leading-relaxed text-stone-600 dark:text-stone-300">{labels.failedBody}</p>
      <Link href="/#pricing" className={`mt-7 ${btnSecondary}`}>{labels.retry}</Link>
    </div>
  );
}

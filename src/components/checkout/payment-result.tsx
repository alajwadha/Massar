'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Loader2, MessageCircle, Mail } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { PILL, GHOST, SOFT, Serif } from '@/components/marketing/shared';
import { cn } from '@/lib/utils';

const btnPrimary = cn('inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-base font-semibold transition-colors', PILL);
const btnSecondary = cn('inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-base font-medium transition-colors', GHOST);

type State = 'loading' | 'paid' | 'failed';

export function PaymentResult({
  paymentId,
  planId,
  planLabel,
  locale,
  contact,
  labels,
}: {
  paymentId: string | undefined;
  planId: string;
  planLabel: string;
  locale: 'ar' | 'en';
  contact: { email: string; whatsapp: string };
  labels: {
    verifying: string;
    paidTitle: string;
    paidBody: string;
    failedTitle: string;
    failedBody: string;
    retry: string;
    refLabel: string;
    sendWhatsapp: string;
    sendEmail: string;
    intakeHint: string;
  };
}) {
  const [state, setState] = useState<State>('loading');

  useEffect(() => {
    if (!paymentId) {
      setState('failed');
      return;
    }
    fetch(`/api/payments/verify?id=${encodeURIComponent(paymentId)}&plan=${encodeURIComponent(planId)}`)
      .then((r) => r.json())
      .then((d) => setState(d.ok ? 'paid' : 'failed'))
      .catch(() => setState('failed'));
  }, [paymentId, planId]);

  if (state === 'loading') {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-stone-500 dark:text-stone-400">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600 dark:text-amber-300" />
        <p>{labels.verifying}</p>
      </div>
    );
  }

  if (state === 'paid') {
    const ref = paymentId ?? '';
    // Prefilled handoff: the buyer sends their CV straight to us (manual onboarding),
    // carrying their plan + payment reference so we can tie it to them.
    const msg =
      locale === 'ar'
        ? `السلام عليكم، اشتركت في مسار. الباقة: ${planLabel}، ورقم العملية: ${ref}. أبغى أرسل لكم سيرتي عشان تبنون خطتي.`
        : `Hi, I just subscribed to Masaar. Plan: ${planLabel}, reference: ${ref}. I'd like to send my CV so you can build my plan.`;
    const subject = locale === 'ar' ? `اشتراك مسار · ${planLabel}` : `Masaar subscription · ${planLabel}`;
    const waHref = contact.whatsapp ? `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(msg)}` : '';
    const mailHref = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(msg)}`;

    return (
      <div className="flex w-full max-w-md flex-col items-center text-center">
        <CheckCircle2 className="h-14 w-14 text-amber-600 dark:text-amber-300" />
        <Serif className="mt-5 block text-3xl tracking-tight">{labels.paidTitle}</Serif>
        <p className="mt-3 text-lg leading-relaxed text-stone-600 dark:text-stone-300">{labels.paidBody}</p>

        {ref ? (
          <span className={cn('mt-4 rounded-full px-3 py-1 text-[12px] font-medium tabular-nums', SOFT)}>
            {labels.refLabel}: {ref}
          </span>
        ) : null}

        <div className="mt-7 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          {waHref ? (
            <a href={waHref} target="_blank" rel="noopener noreferrer" className={btnPrimary}>
              <MessageCircle className="h-5 w-5" />
              {labels.sendWhatsapp}
            </a>
          ) : null}
          <a href={mailHref} className={waHref ? btnSecondary : btnPrimary}>
            <Mail className="h-5 w-5" />
            {labels.sendEmail}
          </a>
        </div>

        <p className="mt-5 text-sm text-stone-500 dark:text-stone-400">{labels.intakeHint}</p>
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

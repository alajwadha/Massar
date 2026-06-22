import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { PaymentResult } from '@/components/checkout/payment-result';
import { PAGE, Serif, Grain } from '@/components/marketing/shared';
import { cn } from '@/lib/utils';

export default async function CheckoutSuccessPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { id?: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'checkout' });

  return (
    <div className={cn(PAGE, 'relative overflow-clip')}>
      <Grain />

      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -start-24 -top-24 h-[30rem] w-[30rem] rounded-full bg-amber-300/25 blur-[120px] dark:bg-amber-500/[0.12]" />
        <div className="absolute -end-28 bottom-0 h-[30rem] w-[30rem] rounded-full bg-orange-200/25 blur-[130px] dark:bg-amber-600/[0.10]" />
      </div>

      <header className="relative z-10 border-b border-stone-200/70 dark:border-white/10">
        <div className="mx-auto flex h-16 max-w-5xl items-center px-5 sm:px-8">
          <Link href="/" className="flex items-baseline gap-2">
            <Serif className="text-2xl tracking-tight">{locale === 'ar' ? 'مسار' : 'Masaar'}</Serif>
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid max-w-5xl place-items-center px-5 py-20 sm:px-8">
        <PaymentResult
          paymentId={searchParams.id}
          labels={{
            verifying: t('verifying'),
            paidTitle: t('paidTitle'),
            paidBody: t('paidBody'),
            failedTitle: t('failedTitle'),
            failedBody: t('failedBody'),
            startNow: t('startNow'),
            retry: t('retry'),
          }}
        />
      </main>
    </div>
  );
}

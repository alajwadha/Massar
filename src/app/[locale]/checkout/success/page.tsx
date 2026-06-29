import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { PaymentResult } from '@/components/checkout/payment-result';

export default async function CheckoutSuccessPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { id?: string; plan?: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'checkout' });

  return (
    <div className="min-h-dvh bg-canvas">
      <header className="border-b border-line/70">
        <div className="container-page flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-600 text-white font-extrabold">م</span>
            <span className="text-lg font-extrabold tracking-tight">مسار</span>
          </Link>
        </div>
      </header>
      <main className="container-page grid place-items-center py-20">
        <PaymentResult
          paymentId={searchParams.id}
          plan={searchParams.plan}
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

import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ArrowRight, Check } from 'lucide-react';
import { getPlan } from '@/lib/plans';
import { CheckoutForm } from '@/components/checkout/checkout-form';

export default async function CheckoutPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { plan?: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'checkout' });
  const tp = await getTranslations({ locale, namespace: 'pricing' });
  const plan = getPlan(searchParams.plan);
  const planName = plan.id === 'pro' ? tp('pro') : tp('starter');

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const callbackUrl = `${siteUrl}/${locale}/checkout/success?plan=${plan.id}`;
  const publishableKey = process.env.MOYASAR_PUBLISHABLE_KEY ?? '';

  const features = [
    tp('feature_score'),
    `${plan.id === 'pro' ? 5 : 2} ${tp('feature_paths')}`,
    `${plan.id === 'pro' ? 40 : 10} ${tp('feature_targets')}`,
    tp('feature_roadmap'),
  ];

  return (
    <div className="min-h-dvh bg-canvas">
      <header className="border-b border-line/70">
        <div className="container-page flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-600 text-white font-extrabold">م</span>
            <span className="text-lg font-extrabold tracking-tight">مسار</span>
          </Link>
          <Link href="/#pricing" className="text-sm text-ink-soft transition-colors hover:text-ink">
            {t('back')}
          </Link>
        </div>
      </header>

      <main className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_1.1fr] lg:py-16">
        {/* Order summary */}
        <div className="lg:order-2">
          <div className="rounded-3xl border border-line bg-canvas-raised p-7 shadow-soft">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-700">
              {t('summary')}
            </span>
            <div className="mt-4 flex items-baseline justify-between">
              <h2 className="text-xl font-bold">{planName}</h2>
              <div className="text-end">
                <span className="text-3xl font-extrabold tabular-nums">{plan.priceSar}</span>
                <span className="ms-1 text-sm text-ink-muted">SAR</span>
              </div>
            </div>
            <p className="mt-1 text-sm text-ink-muted">{t('oneTime')}</p>
            <ul className="mt-5 space-y-3 border-t border-line pt-5">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700">
                    <Check className="h-3 w-3" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment */}
        <div className="lg:order-1">
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{t('title')}</h1>
          <p className="mt-2 text-ink-soft">{t('subtitle')}</p>
          <div className="mt-6">
            <CheckoutForm
              planId={plan.id}
              amountHalalas={plan.amountHalalas}
              publishableKey={publishableKey}
              callbackUrl={callbackUrl}
              description={`Masaar — ${planName}`}
              locale={locale}
              labels={{
                secure: t('secure'),
                notConfigured: t('notConfigured'),
                notConfiguredHint: t('notConfiguredHint'),
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

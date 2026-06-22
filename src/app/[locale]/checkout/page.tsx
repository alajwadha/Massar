import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Check } from 'lucide-react';
import { getPlan } from '@/lib/plans';
import { CheckoutForm } from '@/components/checkout/checkout-form';
import { PAGE, CARD, EDGE, SOFT, ACCENT, Serif, Eyebrow, Grain, PRICING, pick, type Loc } from '@/components/marketing/shared';
import { cn } from '@/lib/utils';

export default async function CheckoutPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { plan?: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'checkout' });
  const loc = locale as Loc;
  const plan = getPlan(searchParams.plan);
  const tier = PRICING.find((p) => p.id === plan.id) ?? PRICING[PRICING.length - 1];
  const planName = pick(tier.name, loc);
  const features = tier.features.map((f) => pick(f, loc));

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const callbackUrl = `${siteUrl}/${locale}/checkout/success?plan=${plan.id}`;
  const publishableKey = process.env.MOYASAR_PUBLISHABLE_KEY ?? '';

  return (
    <div className={cn(PAGE, 'relative overflow-clip')}>
      <Grain />

      {/* ambient liquid glass wash, same warm palette as the landing */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -start-24 -top-24 h-[30rem] w-[30rem] rounded-full bg-amber-300/25 blur-[120px] dark:bg-amber-500/[0.12]" />
        <div className="absolute -end-28 top-1/3 h-[32rem] w-[32rem] rounded-full bg-orange-200/25 blur-[130px] dark:bg-amber-600/[0.10]" />
      </div>

      <header className="relative z-10 border-b border-stone-200/70 dark:border-white/10">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-baseline gap-2">
            <Serif className="text-2xl tracking-tight">{locale === 'ar' ? 'مسار' : 'Masaar'}</Serif>
          </Link>
          <Link href="/#pricing" className="text-sm text-stone-500 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-white">
            {t('back')}
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid max-w-5xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:py-16">
        {/* Order summary */}
        <div className="lg:order-2">
          <div className={cn(CARD, EDGE, 'p-7')}>
            <Eyebrow>{t('summary')}</Eyebrow>
            <div className="mt-4 flex items-baseline justify-between gap-3">
              <Serif className="text-2xl">{planName}</Serif>
              <div className="flex items-baseline gap-1.5">
                <Serif className="text-4xl leading-none">{plan.priceSar}</Serif>
                <span className="text-sm font-medium text-stone-500 dark:text-stone-400">{locale === 'ar' ? 'ريال' : 'SAR'}</span>
              </div>
            </div>
            <div className="mt-2">
              <span className={cn('rounded-full px-2.5 py-0.5 text-[12px] font-medium', SOFT)}>{t('oneTime')}</span>
            </div>
            <ul className="mt-6 space-y-3 border-t border-stone-200/70 pt-6 dark:border-white/10">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[14px] text-stone-700 dark:text-stone-200">
                  <Check className={cn('mt-0.5 h-4 w-4 shrink-0', ACCENT)} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment */}
        <div className="lg:order-1">
          <Serif className="block text-3xl tracking-tight sm:text-4xl">{t('title')}</Serif>
          <p className="mt-3 text-lg leading-relaxed text-stone-600 dark:text-stone-300">{t('subtitle')}</p>
          <div className="mt-7">
            <CheckoutForm
              planId={plan.id}
              amountHalalas={plan.amountHalalas}
              publishableKey={publishableKey}
              callbackUrl={callbackUrl}
              description={`${locale === 'ar' ? 'مسار' : 'Masaar'} · ${planName}`}
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

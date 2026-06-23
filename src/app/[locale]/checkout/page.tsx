import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Check } from 'lucide-react';
import { getPlan } from '@/lib/plans';
import { CheckoutForm } from '@/components/checkout/checkout-form';
import { PAGE, CARD, EDGE, ACCENT, NOISE, PRICING, PROMO, pick } from '@/lib/marketing-data';
import { cn } from '@/lib/utils';

const SERIF = 'font-serif font-normal';
type Loc = 'ar' | 'en';

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
      {/* film grain + ambient liquid glass wash, same warm palette as the landing */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 opacity-[0.035] mix-blend-multiply dark:opacity-[0.06] dark:mix-blend-screen" style={{ backgroundImage: NOISE }} />
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -start-24 -top-24 h-[30rem] w-[30rem] rounded-full bg-amber-300/25 blur-[120px] dark:bg-amber-500/[0.12]" />
        <div className="absolute -end-28 top-1/3 h-[32rem] w-[32rem] rounded-full bg-orange-200/25 blur-[130px] dark:bg-amber-600/[0.10]" />
      </div>

      <header className="relative z-10 border-b border-stone-200/70 dark:border-white/10">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-baseline gap-2">
            <span className={cn(SERIF, 'text-2xl tracking-tight')}>{locale === 'ar' ? 'مسار' : 'Masaar'}</span>
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
            <div className="flex items-center justify-between gap-2">
              <div className="text-[11px] font-bold text-stone-500 dark:text-stone-400">{t('summary')}</div>
              {tier.oldPrice ? <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-300">{pick(PROMO, loc)}</span> : null}
            </div>
            <div className="mt-4 flex items-start justify-between gap-3">
              <span className={cn(SERIF, 'text-2xl')}>{planName}</span>
              <div className="text-end">
                <div className="flex flex-wrap items-baseline justify-end gap-x-2 gap-y-1">
                  <span className={cn(SERIF, 'text-4xl leading-none')}>{plan.priceSar}</span>
                  <span className="text-sm font-medium text-stone-500 dark:text-stone-400">{locale === 'ar' ? 'ريال' : 'SAR'}</span>
                  {tier.oldPrice ? <span className="rounded-full bg-amber-600 px-2 py-0.5 text-[11px] font-bold text-white dark:bg-amber-500 dark:text-stone-900">{locale === 'ar' ? `خصم ${Math.round((1 - tier.price / tier.oldPrice) * 100)}%` : `${Math.round((1 - tier.price / tier.oldPrice) * 100)}% off`}</span> : null}
                </div>
                {tier.oldPrice ? <div className="mt-1.5 text-sm text-stone-400 dark:text-stone-500">{locale === 'ar' ? 'بدلاً من ' : 'instead of '}<span className="line-through">{tier.oldPrice} {locale === 'ar' ? 'ريال' : 'SAR'}</span></div> : null}
              </div>
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
          <span className={cn(SERIF, 'block text-3xl tracking-tight sm:text-4xl')}>{t('title')}</span>
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

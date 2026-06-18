'use client';

/* =============================================================================
   Landing version D, "Split screen". A calm, premium, two column product site.
   On desktop the LEFT half is sticky and full height: wordmark, a large serif
   headline, a few tight value props, the primary CTA, and one quiet trust line.
   The RIGHT half scrolls through a short captioned tour of the real product,
   then a compact pricing block. On mobile it all stacks into a single column.
============================================================================= */

import {
  ArrowUpRight,
  Check,
  Gauge,
  Users,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';
import {
  PAGE,
  CARD,
  SOFT,
  GHOST,
  PILL,
  ACCENT,
  EASE,
  Serif,
  Eyebrow,
  Grain,
  ThemeToggle,
  LangToggle,
  ScoreCard,
  ContactsCard,
  StudyCard,
  TARGET_COMPANIES,
  PRICING,
  pick,
  type Loc,
} from '@/components/marketing/shared';

/* ------------------------------------------------------------------- copy -- */

const T = {
  nav: {
    tour: { ar: 'الجولة', en: 'Tour' },
    pricing: { ar: 'الأسعار', en: 'Pricing' },
  },
  cta: { ar: 'ابدأ الآن', en: 'Get started' },
  seePricing: { ar: 'الأسعار', en: 'Pricing' },

  eyebrow: { ar: 'لوظيفة جديدة أو ترقية', en: 'For a new job or a promotion' },
  title: { ar: 'سيرتك، وقد صارت خطة.', en: 'Your CV, turned into a plan.' },
  lede: {
    ar: 'مسار يقرأ سيرتك ويعطيك درجة صادقة لكل دور ومستوى، خطة شهادات يعوّض هدف نصفها، والأشخاص الصحيحين للتواصل معهم. عربي أولًا وثنائي اللغة، فاتح وداكن، ودفعة واحدة عبر ميسر.',
    en: 'Masaar reads your CV and gives you an honest score for every role and level, a certifications plan Hadaf reimburses half of, and the right people to reach. Arabic first and bilingual, light and dark, one payment via Moyasar.',
  },
  trust: { ar: 'مبني للأدوار في', en: 'Built for roles at' },
  note: { ar: 'بدون اشتراك. تفتح لوحتك فورًا.', en: 'No subscription. Your dashboard unlocks instantly.' },

  // right column captions, one tight line above each exhibit
  tourEyebrow: { ar: 'جولة في المنتج', en: 'A tour of the product' },
  capScore: {
    ar: 'درجة تنافسية لكل مستوى من مبتدئ إلى قيادي، متحفظة عمدًا، مع ما الذي يرفعها بالضبط.',
    en: 'A competitiveness score for every level from Entry to Director, deliberately conservative, with exactly what raises it.',
  },
  capContacts: {
    ar: 'شبكتك على لينكدإن تُحلّل في متصفحك وحده وتُرتّب إلى مقدّمات دافئة، إضافة إلى 1,209 جهة موارد بشرية في قاعدتنا. الرسائل بصوتك، ترسلها أنت.',
    en: 'Your LinkedIn connections parsed privately in your browser and ranked into warm introductions, plus 1,209 HR contacts in our database. Outreach in your voice, that you send yourself.',
  },
  capStudy: {
    ar: 'وأبعد من الوظيفة: برامج الدراسات العليا حسب مجالك مع أهلية منحة رواد، وعشرات صفحات التوظيف السعودية بأيام مهنية مؤرخة وبرامج مثل تمهير.',
    en: 'Beyond the next job: graduate programs by field with Pioneers scholarship eligibility, dozens of Saudi career pages with dated career days and programs like Tamheer.',
  },

  priceEyebrow: { ar: 'سعر واحد، مرة واحدة', en: 'One price, one time' },
  priceTitle: { ar: 'ادفع مرة، خطتك للأبد.', en: 'Pay once, your plan is yours.' },
  perOnce: { ar: 'ريال، مرة واحدة', en: 'SAR, one time' },
  popular: { ar: 'الأكثر اختيارًا', en: 'Most chosen' },
  choose: { ar: 'اختر', en: 'Choose' },
  rights: { ar: 'كل الحقوق محفوظة.', en: 'All rights reserved.' },
};

const VALUE: { icon: typeof Gauge; t: { ar: string; en: string } }[] = [
  { icon: Gauge, t: { ar: 'درجة صادقة لكل دور ومستوى', en: 'An honest score for every role and level' } },
  { icon: GraduationCap, t: { ar: 'خطة شهادات يعوّض هدف نحو 50٪ منها', en: 'A certifications plan Hadaf reimburses about 50 percent of' } },
  { icon: Users, t: { ar: 'شبكتك وقاعدتنا، مقدّمات دافئة', en: 'Your network and our database, warm introductions' } },
  { icon: ShieldCheck, t: { ar: 'خصوصية أولًا، سيرتك تبقى لك', en: 'Privacy first, your CV stays yours' } },
];

const checkoutPro = { pathname: '/checkout', query: { plan: 'pro' } } as const;

/* ------------------------------------------------------------- primitives -- */

function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** One right column exhibit: a tight caption above a real product card. */
function Exhibit({
  n,
  caption,
  locale,
  children,
}: {
  n: string;
  caption: { ar: string; en: string };
  locale: Loc;
  children: React.ReactNode;
}) {
  return (
    <Reveal className="flex flex-col">
      <div className="flex items-baseline gap-3">
        <Serif className={cn('text-2xl leading-none', ACCENT)}>{n}</Serif>
        <p className="max-w-md text-pretty text-sm leading-relaxed text-stone-600 dark:text-stone-300">{pick(caption, locale)}</p>
      </div>
      <div className="mt-4">{children}</div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------- page -- */

export default function MarketingD({ locale }: { locale: Loc }) {
  const wordmark = locale === 'ar' ? 'مسار' : 'Masaar';

  return (
    <div className={cn(PAGE, 'relative overflow-clip')}>
      <Grain />

      {/* header */}
      <header className="sticky top-0 z-40 border-b border-stone-200/60 bg-[#f7f6f2]/80 backdrop-blur-md dark:border-white/10 dark:bg-[#0a0a0b]/80">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Serif className="text-2xl">{wordmark}</Serif>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-stone-500 dark:text-stone-400 md:flex">
            <a href="#tour" className="transition-colors hover:text-stone-900 dark:hover:text-white">{pick(T.nav.tour, locale)}</a>
            <a href="#pricing" className="transition-colors hover:text-stone-900 dark:hover:text-white">{pick(T.nav.pricing, locale)}</a>
          </nav>
          <div className="flex items-center gap-2">
            <LangToggle locale={locale} />
            <ThemeToggle />
            <Link
              href={checkoutPro}
              className={cn('hidden h-9 items-center rounded-full px-4 text-sm font-semibold transition-colors sm:inline-flex', PILL)}
            >
              {pick(T.cta, locale)}
            </Link>
          </div>
        </div>
      </header>

      {/* split body: left sticky, right scroll */}
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
        {/* LEFT, sticky on desktop */}
        <div className="lg:sticky lg:top-16 lg:flex lg:h-[calc(100dvh-4rem)] lg:flex-col lg:justify-center lg:py-12">
          <div className="py-14 lg:py-0">
            <span className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium', SOFT)}>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              {pick(T.eyebrow, locale)}
            </span>

            <Serif className="mt-6 text-balance text-5xl leading-[1.04] sm:text-6xl">{pick(T.title, locale)}</Serif>

            <p className="mt-5 max-w-lg text-pretty text-base leading-relaxed text-stone-600 dark:text-stone-300 sm:text-lg">
              {pick(T.lede, locale)}
            </p>

            <ul className="mt-7 space-y-2.5">
              {VALUE.map((v) => {
                const Icon = v.icon;
                return (
                  <li key={v.t.en} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-[15px] leading-relaxed text-stone-700 dark:text-stone-200">{pick(v.t, locale)}</span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={checkoutPro}
                className={cn(
                  'group inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-base font-semibold transition-transform hover:scale-[1.02]',
                  PILL,
                )}
              >
                {pick(T.cta, locale)}
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:rotate-[-90deg]" />
              </Link>
              <a
                href="#pricing"
                className={cn('inline-flex h-12 items-center justify-center rounded-full px-6 text-base font-semibold transition-colors', GHOST)}
              >
                {pick(T.seePricing, locale)}
              </a>
            </div>

            <p className="mt-4 text-sm text-stone-500 dark:text-stone-400">{pick(T.note, locale)}</p>

            {/* quiet one line trust mention */}
            <div className="mt-10 border-t border-stone-200/70 pt-6 dark:border-white/10">
              <Eyebrow>{pick(T.trust, locale)}</Eyebrow>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-stone-400 dark:text-stone-500">
                {TARGET_COMPANIES.slice(0, 6).map((c) => (
                  <span key={c} className="text-sm font-semibold tracking-tight">{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT, scrolling tour then pricing */}
        <div id="tour" className="flex flex-col gap-12 pb-16 lg:py-16">
          <Reveal>
            <Eyebrow>{pick(T.tourEyebrow, locale)}</Eyebrow>
          </Reveal>

          <Exhibit n="01" caption={T.capScore} locale={locale}>
            <ScoreCard locale={locale} />
          </Exhibit>

          <Exhibit n="02" caption={T.capContacts} locale={locale}>
            <ContactsCard locale={locale} />
          </Exhibit>

          <Exhibit n="03" caption={T.capStudy} locale={locale}>
            <StudyCard locale={locale} />
          </Exhibit>

          {/* compact pricing block */}
          <Reveal className="scroll-mt-20">
            <div id="pricing" className="scroll-mt-20">
              <Eyebrow>{pick(T.priceEyebrow, locale)}</Eyebrow>
              <Serif className="mt-2 text-balance text-3xl leading-[1.1] sm:text-4xl">{pick(T.priceTitle, locale)}</Serif>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {PRICING.map((tier) => (
                <div
                  key={tier.id}
                  className={cn(
                    CARD,
                    'flex flex-col p-6',
                    tier.popular && 'ring-1 ring-amber-500/30',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      {pick(tier.name, locale)}
                    </div>
                    {tier.popular ? (
                      <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                        {pick(T.popular, locale)}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-3 flex items-baseline gap-1.5">
                    <Serif className="text-4xl leading-none">{tier.price}</Serif>
                    <span className="text-xs text-stone-500 dark:text-stone-400">{pick(T.perOnce, locale)}</span>
                  </div>
                  <p className="mt-1.5 text-sm text-stone-500 dark:text-stone-400">{pick(tier.blurb, locale)}</p>

                  <ul className="mt-4 flex-1 space-y-2">
                    {tier.features.map((f) => (
                      <li key={f.en} className="flex items-start gap-2 text-[13px] text-stone-700 dark:text-stone-200">
                        <Check className={cn('mt-0.5 h-4 w-4 shrink-0', ACCENT)} />
                        <span>{pick(f, locale)}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={{ pathname: '/checkout', query: { plan: tier.id } }}
                    className={cn(
                      'mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold transition-transform hover:scale-[1.02]',
                      tier.popular ? PILL : GHOST,
                    )}
                  >
                    {pick(T.choose, locale)} {pick(tier.name, locale)}
                    <ArrowUpRight className="h-4 w-4 rtl:rotate-[-90deg]" />
                  </Link>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* footer */}
      <footer className="border-t border-stone-200/60 px-5 py-10 dark:border-white/10 sm:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-start">
          <div className="flex items-center gap-2">
            <Serif className="text-xl">{wordmark}</Serif>
            <span className="text-sm text-stone-400">Masaar</span>
          </div>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            © {new Date().getFullYear()} {wordmark}. {pick(T.rights, locale)}
          </p>
        </div>
      </footer>
    </div>
  );
}

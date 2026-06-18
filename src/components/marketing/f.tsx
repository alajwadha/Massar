'use client';

/* =============================================================================
   Landing version F, "Big type minimal". The most restrained, luxurious version.
   A luxury brand page, not a busy SaaS page: enormous serif statements, very few
   words, very generous whitespace. The hero is a single huge Serif line and one
   CTA. A small number of bold one line claims follow, each given lots of air and
   separated by hairline rules. Only two product previews in the whole page: the
   hero DashboardPreview and one ScoreCard later. Quiet pricing, a calm final CTA,
   and minimal motion, just gentle fades.
============================================================================= */

import { ArrowUpRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';
import {
  PAGE,
  PILL,
  GHOST,
  SOFT,
  ACCENT,
  EASE,
  Serif,
  Eyebrow,
  Grain,
  ThemeToggle,
  LangToggle,
  ScoreCard,
  DashboardPreview,
  TARGET_COMPANIES,
  PRICING,
  pick,
  type Loc,
} from '@/components/marketing/shared';

/* ------------------------------------------------------------------- copy -- */

const T = {
  nav: {
    score: { ar: 'الدرجة', en: 'Score' },
    pricing: { ar: 'السعر', en: 'Pricing' },
  },
  cta: { ar: 'ابدأ الآن', en: 'Begin' },
  seePrice: { ar: 'شاهد السعر', en: 'See pricing' },

  heroEyebrow: { ar: 'مسار · لوظيفة جديدة أو ترقية', en: 'Masaar · for a new job or a promotion' },
  heroTitle: { ar: 'كن معروفًا قبل أن تتقدّم.', en: 'Be known before you apply.' },
  heroSub: {
    ar: 'سيرتك تصبح خطة. دفعة واحدة، وتفتح لوحتك فورًا.',
    en: 'Your CV becomes a plan. One payment, your dashboard unlocks instantly.',
  },
  trusted: { ar: 'مبني للأدوار في', en: 'Built for roles at' },

  // a few bold one line claims, each on its own with lots of air
  claims: [
    {
      eyebrow: { ar: 'الدرجة', en: 'The score' },
      line: { ar: 'رقم واحد صادق لكل دور ومستوى.', en: 'One honest number, per role and level.' },
      note: {
        ar: 'من مبتدئ إلى قيادي، متحفظ عمدًا، ويريك بالضبط ما الذي يرفعه.',
        en: 'From Entry to Director, deliberately conservative, showing exactly what raises it.',
      },
    },
    {
      eyebrow: { ar: 'الخطة', en: 'The plan' },
      line: { ar: 'مسار يدفع هدف نصف طريقه.', en: 'A path Hadaf pays half of.' },
      note: {
        ar: 'مسارات مصمّمة من خلفيتك، وخارطة شهادات يعوّض صندوق هدف نحو 50٪ من تكلفتها.',
        en: 'Paths shaped from your background, and a certifications roadmap Hadaf reimburses about 50 percent of.',
      },
    },
    {
      eyebrow: { ar: 'الأشخاص', en: 'The people' },
      line: { ar: 'الوظائف تأتي من أشخاص.', en: 'Jobs come from people.' },
      note: {
        ar: 'شبكتك تُحلّل في متصفحك وحده وتُرتّب إلى مقدّمات دافئة، إضافة إلى قاعدتنا من 1,209 جهة موارد بشرية. رسائل بصوتك، ترسلها أنت.',
        en: 'Your network parsed privately in your browser and ranked into warm introductions, plus our 1,209 HR contacts. Outreach in your voice, that you send yourself.',
      },
    },
    {
      eyebrow: { ar: 'وأبعد', en: 'And beyond' },
      line: { ar: 'الدراسة والفرص، مؤرخة.', en: 'Study and opportunities, dated.' },
      note: {
        ar: 'برامج عليا مع أهلية منحة رواد لأفضل 30 جامعة، وحوالي 60 صفحة توظيف سعودية بأيام مهنية مؤرخة وتمهير.',
        en: 'Graduate programs with Pioneers eligibility for the top 30, and around 60 Saudi career pages with dated career days and Tamheer.',
      },
    },
  ],

  exhibitEyebrow: { ar: 'درجتك الحقيقية', en: 'Your real score' },
  exhibitLine: { ar: 'اعرف رقمك قبل أن يقرأه أحد سواك.', en: 'Know your number before anyone else reads it.' },

  priceEyebrow: { ar: 'السعر', en: 'Pricing' },
  priceTitle: { ar: 'ادفع مرة. خطتك لك.', en: 'Pay once. Your plan is yours.' },
  priceSub: {
    ar: 'دفعة واحدة عبر ميسر. لا اشتراك، عربي أولًا وثنائي اللغة، بالوضعين الفاتح والداكن.',
    en: 'One payment via Moyasar. No subscription, Arabic first and bilingual, in light and dark.',
  },
  perOnce: { ar: 'ريال، مرة واحدة', en: 'SAR, one time' },
  popular: { ar: 'الأكثر اختيارًا', en: 'Most chosen' },
  choose: { ar: 'اختر', en: 'Choose' },

  finalTitle: { ar: 'سيرتك جاهزة لخطة.', en: 'Your CV is ready for a plan.' },
  finalSub: { ar: 'وظيفة جديدة أو ترقية، في دقائق.', en: 'A new job or a promotion, in minutes.' },
  rights: { ar: 'كل الحقوق محفوظة.', en: 'All rights reserved.' },
};

const checkoutPro = { pathname: '/checkout', query: { plan: 'pro' } } as const;

/* ------------------------------------------------------------- primitives -- */

/** The only motion in the page: a slow, gentle fade and lift. */
function Fade({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** A hairline rule, the only divider between statements. */
function Rule() {
  return <div aria-hidden className="mx-auto h-px w-full max-w-5xl bg-stone-900/10 dark:bg-white/10" />;
}

/* ------------------------------------------------------------------- page -- */

export default function MarketingF({ locale }: { locale: Loc }) {
  return (
    <div className={cn(PAGE, 'relative overflow-clip')}>
      <Grain />

      {/* header: serif wordmark, minimal nav, toggles, one primary CTA */}
      <header className="sticky top-0 z-40 border-b border-stone-200/50 bg-[#f7f6f2]/70 backdrop-blur-md dark:border-white/[0.07] dark:bg-[#0a0a0b]/70">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-6">
          <Link href="/" className="flex items-center">
            <Serif className="text-2xl tracking-tight">{locale === 'ar' ? 'مسار' : 'Masaar'}</Serif>
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-stone-500 dark:text-stone-400 md:flex">
            <a href="#score" className="transition-colors hover:text-stone-900 dark:hover:text-white">{pick(T.nav.score, locale)}</a>
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

      {/* hero: one enormous serif line and a single CTA, with vast whitespace */}
      <section className="mx-auto w-full max-w-5xl px-6 pt-28 pb-24 text-center sm:pt-36 sm:pb-32">
        <Fade className="flex flex-col items-center">
          <Eyebrow>{pick(T.heroEyebrow, locale)}</Eyebrow>
          <Serif className="mt-8 max-w-4xl text-balance text-6xl leading-[1.0] tracking-[-0.01em] sm:text-7xl md:text-8xl">
            {pick(T.heroTitle, locale)}
          </Serif>
          <p className="mt-8 max-w-md text-pretty text-lg text-stone-500 dark:text-stone-400">{pick(T.heroSub, locale)}</p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href={checkoutPro}
              className={cn('group inline-flex h-12 items-center gap-2 rounded-full px-8 text-base font-semibold transition-colors', PILL)}
            >
              {pick(T.cta, locale)}
              <ArrowUpRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:rotate-[-90deg]" />
            </Link>
            <a href="#pricing" className={cn('inline-flex h-12 items-center rounded-full px-6 text-base font-medium transition-colors', GHOST)}>
              {pick(T.seePrice, locale)}
            </a>
          </div>
        </Fade>

        {/* the single hero preview, the one and only product shot up here */}
        <Fade delay={0.15} className="mt-20 w-full">
          <DashboardPreview locale={locale} className="mx-auto max-w-3xl" />
        </Fade>

        {/* quiet social proof via target companies, no testimonials */}
        <Fade delay={0.25} className="mt-16">
          <Eyebrow>{pick(T.trusted, locale)}</Eyebrow>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-stone-400 dark:text-stone-500">
            {TARGET_COMPANIES.map((c) => (
              <span key={c} className="text-sm font-semibold tracking-tight">{c}</span>
            ))}
          </div>
        </Fade>
      </section>

      {/* bold one line claims, each with lots of breathing room, hairline ruled */}
      <section className="mx-auto w-full max-w-5xl px-6">
        {T.claims.map((claim, i) => (
          <div key={claim.eyebrow.en}>
            <Rule />
            <Fade className="py-24 text-center sm:py-32">
              <Eyebrow className={ACCENT}>{pick(claim.eyebrow, locale)}</Eyebrow>
              <Serif className="mx-auto mt-6 max-w-3xl text-balance text-4xl leading-[1.08] tracking-[-0.01em] sm:text-5xl md:text-6xl">
                {pick(claim.line, locale)}
              </Serif>
              <p className="mx-auto mt-6 max-w-xl text-pretty text-base text-stone-500 dark:text-stone-400 sm:text-lg">
                {pick(claim.note, locale)}
              </p>
            </Fade>
          </div>
        ))}
      </section>

      {/* the one quiet exhibit: a single ScoreCard, the second and last preview */}
      <section id="score" className="mx-auto w-full max-w-5xl px-6">
        <Rule />
        <div className="grid items-center gap-12 py-24 sm:py-32 md:grid-cols-2">
          <Fade className="text-center md:text-start">
            <Eyebrow className={ACCENT}>{pick(T.exhibitEyebrow, locale)}</Eyebrow>
            <Serif className="mt-6 text-balance text-4xl leading-[1.08] tracking-[-0.01em] sm:text-5xl">
              {pick(T.exhibitLine, locale)}
            </Serif>
          </Fade>
          <Fade delay={0.12}>
            <ScoreCard locale={locale} className="mx-auto max-w-sm" />
          </Fade>
        </div>
      </section>

      {/* quiet, refined pricing from PRICING */}
      <section id="pricing" className="mx-auto w-full max-w-5xl px-6">
        <Rule />
        <div className="py-24 sm:py-32">
          <Fade className="text-center">
            <Eyebrow>{pick(T.priceEyebrow, locale)}</Eyebrow>
            <Serif className="mt-6 text-balance text-4xl leading-[1.05] tracking-[-0.01em] sm:text-5xl">{pick(T.priceTitle, locale)}</Serif>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-base text-stone-500 dark:text-stone-400 sm:text-lg">{pick(T.priceSub, locale)}</p>
          </Fade>

          <div className="mx-auto mt-14 grid w-full max-w-3xl gap-5 sm:grid-cols-2">
            {PRICING.map((tier, i) => (
              <Fade key={tier.id} delay={i * 0.1} className="h-full">
                <div
                  className={cn(
                    'relative flex h-full flex-col rounded-[22px] border p-7 text-start transition-colors',
                    tier.popular
                      ? 'border-amber-500/40 bg-white/70 dark:bg-white/[0.04]'
                      : 'border-stone-200/80 bg-white/50 dark:border-white/[0.09] dark:bg-white/[0.02]',
                  )}
                >
                  {tier.popular ? (
                    <span className="absolute end-7 top-7 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[10.5px] font-semibold text-amber-700 dark:text-amber-300">
                      {pick(T.popular, locale)}
                    </span>
                  ) : null}
                  <div className="text-sm font-semibold uppercase tracking-wider text-stone-400">{pick(tier.name, locale)}</div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <Serif className="text-5xl leading-none">{tier.price}</Serif>
                    <span className="text-sm text-stone-400">{pick(T.perOnce, locale)}</span>
                  </div>
                  <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">{pick(tier.blurb, locale)}</p>
                  <ul className="mt-7 flex-1 space-y-3">
                    {tier.features.map((f) => (
                      <li key={f.en} className="flex items-start gap-2.5 text-sm text-stone-600 dark:text-stone-300">
                        <Check className={cn('mt-0.5 h-4 w-4 shrink-0', ACCENT)} />
                        <span>{pick(f, locale)}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={{ pathname: '/checkout', query: { plan: tier.id } }}
                    className={cn(
                      'mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full text-base font-semibold transition-colors',
                      tier.popular ? PILL : GHOST,
                    )}
                  >
                    {pick(T.choose, locale)} {pick(tier.name, locale)}
                    <ArrowUpRight className="h-4.5 w-4.5 rtl:rotate-[-90deg]" />
                  </Link>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* a calm final CTA */}
      <section className="mx-auto w-full max-w-5xl px-6">
        <Rule />
        <Fade className="py-28 text-center sm:py-36">
          <Serif className="mx-auto max-w-3xl text-balance text-5xl leading-[1.02] tracking-[-0.01em] sm:text-6xl md:text-7xl">
            {pick(T.finalTitle, locale)}
          </Serif>
          <p className="mx-auto mt-6 max-w-md text-pretty text-lg text-stone-500 dark:text-stone-400">{pick(T.finalSub, locale)}</p>
          <Link
            href={checkoutPro}
            className={cn('group mt-10 inline-flex h-13 items-center gap-2.5 rounded-full px-9 text-lg font-semibold transition-colors', PILL)}
          >
            {pick(T.cta, locale)}
            <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:rotate-[-90deg]" />
          </Link>
        </Fade>
      </section>

      {/* footer */}
      <footer className="border-t border-stone-200/50 px-6 py-10 dark:border-white/[0.07]">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-start">
          <Serif className="text-xl">{locale === 'ar' ? 'مسار' : 'Masaar'}</Serif>
          <p className="text-sm text-stone-400 dark:text-stone-500">
            © {new Date().getFullYear()} {locale === 'ar' ? 'مسار' : 'Masaar'}. {pick(T.rights, locale)}
          </p>
        </div>
      </footer>
    </div>
  );
}

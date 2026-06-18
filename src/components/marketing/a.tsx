'use client';

/* =============================================================================
   Landing version A. "The Editorial Dossier".
   A long form, light first, magazine style feature that happens to sell Masaar.
   Asymmetric wide column with a narrow margin column for notes and figures,
   hairline rules between numbered sections, generous serif display, amber only.
============================================================================= */

import {
  PAGE,
  CARD,
  INSET,
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
  PathsCard,
  ContactsCard,
  StudyCard,
  OpportunitiesCard,
  DashboardPreview,
  TARGET_COMPANIES,
  PRICING,
  STATS,
  pick,
  type Loc,
} from '@/components/marketing/shared';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';
import { ArrowUpRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';

/* ------------------------------------------------------------------- copy -- */

const T = {
  navWork: { ar: 'العمل', en: 'The work' },
  navPlan: { ar: 'الخطة', en: 'The plan' },
  navPricing: { ar: 'السعر', en: 'Pricing' },
  cta: { ar: 'ابدأ الآن', en: 'Get started' },
  ctaLive: { ar: 'شاهد المنتج', en: 'See the live product' },

  kicker: { ar: 'ملف مسار · سوق العمل السعودي', en: 'The Masaar dossier · the Saudi job market' },
  heroTitle: { ar: 'كن معروفًا قبل أن تتقدّم.', en: 'Be known before you apply.' },
  heroLede: {
    ar: 'معظم الوظائف الجيدة تُملأ عبر العلاقات، لا عبر نماذج التقديم. مسار يقرأ سيرتك الذاتية، يعطيك درجة تنافسية صريحة لكل دور ومستوى، ويرسم خطة هادئة من الشهادات والعلاقات حتى تصل إلى الشخص المناسب وأنت معروف.',
    en: 'Most good jobs are filled through people, not application forms. Masaar reads your CV, gives you an honest competitiveness score for each role and level, and lays out a calm plan of certifications and people so you reach the right person already known.',
  },
  figure01: { ar: 'الشكل ٠١ · لوحة التحكم الحقيقية، مباشرة', en: 'Figure 01 · the real dashboard, live' },

  s1: { ar: 'السوق الخفي', en: 'The hidden market' },
  s1body: {
    ar: 'التقديم البارد لعبة خاسرة. ترسل عشرات الطلبات فتُفلتر آليًا قبل أن يراها إنسان. الطريق الأقصر معروف منذ زمن: أن يعرفك أحدهم قبل أن تتقدّم. مسار يبني لك هذا الطريق بهدوء ومنهجية، خطوة تلو الأخرى، لوظيفة جديدة أو لترقية عند صاحب عملك الحالي.',
    en: 'Cold applications are a losing game. You send dozens, they are filtered automatically before a human reads them. The shorter route has always been known: be known before you apply. Masaar builds that route for you, quietly and methodically, step by step, whether for a new job or a promotion with your current employer.',
  },

  s2: { ar: 'درجتك الحقيقية', en: 'Your real score' },
  s2body: {
    ar: 'نقرأ سيرتك ونعطيك درجة من ١٠٠ لكل مستوى: مبتدئ، متوسط، خبير، قيادي. الدرجة محافظة عمدًا حتى تثق بها، وتُظهر بالضبط ما الذي يرفعها وبكم. لا إطراء، بل صورة صادقة وخطوات واضحة.',
    en: 'We read your CV and give you a score out of 100 for each level: Entry, Mid, Senior, Director. The score is deliberately conservative so you can trust it, and it shows exactly what raises it and by how much. No flattery, just an honest picture and clear steps.',
  },
  figScore: { ar: 'الشكل ٠٢ · بطاقة التنافسية', en: 'Figure 02 · the competitiveness card' },

  s3: { ar: 'الخطة', en: 'The plan' },
  s3body: {
    ar: 'من خلفيتك نرسم مسارات مهنية تناسبك، ولكل مسار خارطة شهادات مرتبة حسب الأثر. ونوضّح أي الشهادات يعيد صندوق هدف الحكومي نحو ٥٠٪ من كلفتها، حتى تستثمر وقتك ومالك حيث يهمّ فعلًا.',
    en: 'From your background we draw career paths that fit you, each with a certifications roadmap ordered by impact. We flag which certificates the government fund Hadaf reimburses about 50 percent of, so you invest your time and money where it truly counts.',
  },
  figPaths: { ar: 'الشكل ٠٣ · المسار والشهادات', en: 'Figure 03 · path and certifications' },

  s4: { ar: 'الناس', en: 'The people' },
  s4body: {
    ar: 'سطحان للتواصل. الأول جهات اتصالك على لينكدإن، تُحلَّل بسرية كاملة داخل متصفحك وحده وتُرتَّب إلى مقدّمات دافئة. والثاني قاعدتنا المحدّثة من ١٢٠٩ جهة من الموارد البشرية والتوظيف. نصوغ لك رسائل التواصل بصوتك أنت، وترسلها بنفسك، فتبقى أنت المتحكم.',
    en: 'Two contact surfaces. The first is your own LinkedIn connections, parsed privately inside your browser alone and ranked into warm introductions. The second is our maintained database of 1,209 HR and recruiting contacts. We draft your outreach messages in your own voice, and you send them yourself, so you stay in control.',
  },
  figPeople: { ar: 'الشكل ٠٤ · من تتواصل معه', en: 'Figure 04 · who to reach' },
  noteVoice: {
    ar: 'كل رسالة مكتوبة بصوتك، تراجعها وترسلها بنفسك. لا أتمتة، ولا إرسال نيابة عنك.',
    en: 'Every message is in your voice, reviewed and sent by you. No automation, nothing sent on your behalf.',
  },

  s5: { ar: 'الدراسة والفرص', en: 'Study and opportunities' },
  s5body: {
    ar: 'إن كان طريقك يمر بالدراسة، نعرض برامج الدراسات العليا حسب التخصص من العالمية إلى المتاحة، وأهليتك للمنح السعودية ومنها منحة رواد لأفضل ٣٠ جامعة، وخيارات الدراسة بدوام جزئي والمواعيد النهائية. وفي قسم الفرص: نحو ٦٠ صفحة توظيف لشركات سعودية مرتبة حسب القطاع، وأيام مهنية بتواريخها، ومهارات مطلوبة، وبرامج وطنية مثل تمهير.',
    en: 'If your route runs through study, we show graduate programs by field from world class to accessible, your eligibility for Saudi scholarships including the Pioneers scholarship for the top 30 universities, part time options, and deadlines. In Opportunities: around 60 Saudi company career pages grouped by sector, dated career days, in demand skills, and national programs like Tamheer.',
  },

  s6: { ar: 'السعر', en: 'Pricing' },
  s6body: {
    ar: 'دفعة واحدة، بلا اشتراك. تدفع مرة عبر ميسر بمدى أو آبل باي أو البطاقات، وتفتح لوحة التحكم فورًا.',
    en: 'One payment, no subscription. Pay once through Moyasar with mada, Apple Pay, or cards, and the dashboard unlocks instantly.',
  },
  oneTime: { ar: 'دفعة واحدة', en: 'one time' },
  most: { ar: 'الأكثر اختيارًا', en: 'Most chosen' },
  choose: { ar: 'اختر', en: 'Choose' },

  closeTitle: { ar: 'الطريقة الهادئة للوصول.', en: 'The calm way in.' },
  closeBody: {
    ar: 'انضم إلى محترفين يستهدفون صندوق الاستثمارات العامة وأرامكو ونيوم وغيرها. ابدأ بسيرتك كما هي اليوم.',
    en: 'Join professionals targeting PIF, Aramco, NEOM and more. Start with your CV exactly as it is today.',
  },
  footMade: { ar: 'عربي أولًا، بالكامل ثنائي اللغة.', en: 'Arabic first, fully bilingual.' },
  footRights: { ar: 'مسار. جميع الحقوق محفوظة.', en: 'Masaar. All rights reserved.' },
} as const;

const RULE = 'border-stone-200/70 dark:border-white/10';

/* --------------------------------------------------------------- helpers -- */

function Fade({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** A numbered dossier section heading: big serif index plus a short title. */
function SectionHead({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-baseline gap-4">
      <Serif className={cn('text-4xl leading-none sm:text-5xl', ACCENT)}>{n}</Serif>
      <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-400">/</span>
      <Serif className="text-2xl leading-none sm:text-3xl">{title}</Serif>
    </div>
  );
}

/** A figure caption, small italic serif. */
function Caption({ children }: { children: React.ReactNode }) {
  return <Serif className="mt-3 block text-sm italic text-stone-500 dark:text-stone-400">{children}</Serif>;
}

/** An inline editorial statistic: large serif number with a quiet caption. */
function FigureStat({ n, label }: { n: string; label: string }) {
  return (
    <div className="py-3">
      <Serif className="block text-5xl leading-none">{n}</Serif>
      <span className="mt-2 block text-[13px] leading-snug text-stone-500 dark:text-stone-400">{label}</span>
    </div>
  );
}

/** The asymmetric grid: a wide article column and a narrow margin column. */
function Spread({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('grid gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,1fr)_19rem]', className)}>{children}</div>;
}

/* ---------------------------------------------------------------- page -- */

export default function MarketingA({ locale }: { locale: Loc }) {
  const t = (k: keyof typeof T) => pick(T[k], locale);

  return (
    <div className={cn(PAGE, 'relative overflow-clip')}>
      <Grain />

      {/* ---------------------------------------------------------- header -- */}
      <header className={cn('sticky top-0 z-40 border-b bg-[#f7f6f2]/80 backdrop-blur-md dark:bg-[#0a0a0b]/80', RULE)}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          <Link href="/" className="flex items-baseline gap-2">
            <Serif className="text-2xl tracking-tight">{locale === 'ar' ? 'مسار' : 'Masaar'}</Serif>
            <span className={cn('hidden rounded-full px-2 py-0.5 text-[10px] font-semibold sm:block', SOFT)}>
              {locale === 'ar' ? 'ملف' : 'Dossier'}
            </span>
          </Link>
          <nav className="hidden items-center gap-7 text-[13px] text-stone-500 dark:text-stone-400 md:flex">
            <a href="#work" className="transition-colors hover:text-stone-900 dark:hover:text-white">{t('navWork')}</a>
            <a href="#plan" className="transition-colors hover:text-stone-900 dark:hover:text-white">{t('navPlan')}</a>
            <a href="#pricing" className="transition-colors hover:text-stone-900 dark:hover:text-white">{t('navPricing')}</a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LangToggle locale={locale} />
            <Link
              href={{ pathname: '/checkout', query: { plan: 'pro' } }}
              className={cn('hidden rounded-full px-4 py-2 text-[13px] font-semibold transition-colors sm:inline-flex', PILL)}
            >
              {t('cta')}
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">

        {/* -------------------------------------------------------- hero -- */}
        <section className="border-b py-16 sm:py-24" style={{}}>
          <Eyebrow>{t('kicker')}</Eyebrow>
          <Spread className="mt-7 items-end">
            <Fade>
              <h1 className="max-w-3xl">
                <Serif className="block text-5xl leading-[1.04] tracking-tight sm:text-7xl">{t('heroTitle')}</Serif>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-stone-600 dark:text-stone-300">{t('heroLede')}</p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href={{ pathname: '/checkout', query: { plan: 'pro' } }}
                  className={cn('inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors', PILL)}
                >
                  {t('cta')}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/c/ali-alajwad"
                  className={cn('inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors', GHOST)}
                >
                  {t('ctaLive')}
                </Link>
              </div>
            </Fade>

            {/* margin column: the lede figures, set quietly */}
            <Fade delay={0.1} className="lg:border-s lg:ps-10">
              <div className={cn('border-s-2 ps-4', ACCENT.replace('text-', 'border-'))}>
                <FigureStat n={STATS[0].n} label={pick(STATS[0].label, locale)} />
              </div>
              <FigureStat n={STATS[1].n} label={pick(STATS[1].label, locale)} />
            </Fade>
          </Spread>

          {/* Figure 01: the real dashboard */}
          <Fade delay={0.15} className="mt-14">
            <DashboardPreview locale={locale} />
            <Caption>{t('figure01')}</Caption>
          </Fade>
        </section>

        {/* ------------------------------------------- 01 hidden market -- */}
        <section className="border-b py-16 sm:py-20">
          <Fade>
            <SectionHead n="01" title={t('s1')} />
          </Fade>
          <Spread className="mt-8">
            <Fade>
              <p className="max-w-2xl text-xl leading-relaxed text-stone-700 first-letter:float-start first-letter:me-3 first-letter:font-serif first-letter:text-7xl first-letter:leading-[0.8] first-letter:text-stone-900 dark:text-stone-200 dark:first-letter:text-stone-100">
                {t('s1body')}
              </p>
            </Fade>
            <Fade delay={0.1} className="lg:border-s lg:ps-10">
              <Eyebrow>{locale === 'ar' ? 'يستهدفون' : 'Targeting'}</Eyebrow>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {TARGET_COMPANIES.map((c) => (
                  <span key={c} className={cn('rounded-full px-2.5 py-1 text-[12px] font-medium', SOFT)}>{c}</span>
                ))}
              </div>
            </Fade>
          </Spread>
        </section>

        {/* -------------------------------------------- 02 your score -- */}
        <section id="work" className="scroll-mt-24 border-b py-16 sm:py-20">
          <Fade>
            <SectionHead n="02" title={t('s2')} />
          </Fade>
          <Spread className="mt-8 items-start">
            <Fade>
              <p className="max-w-2xl text-lg leading-relaxed text-stone-600 dark:text-stone-300">{t('s2body')}</p>
              <div className="mt-8 max-w-md">
                <ScoreCard locale={locale} />
                <Caption>{t('figScore')}</Caption>
              </div>
            </Fade>
            <Fade delay={0.1} className="lg:border-s lg:ps-10">
              <FigureStat n={STATS[2].n} label={pick(STATS[2].label, locale)} />
            </Fade>
          </Spread>
        </section>

        {/* -------------------------------------------------- 03 plan -- */}
        <section id="plan" className="scroll-mt-24 border-b py-16 sm:py-20">
          <Fade>
            <SectionHead n="03" title={t('s3')} />
          </Fade>
          <Spread className="mt-8 items-start">
            <Fade>
              <p className="max-w-2xl text-lg leading-relaxed text-stone-600 dark:text-stone-300">{t('s3body')}</p>
            </Fade>
            <Fade delay={0.1} className="lg:row-span-2">
              <PathsCard locale={locale} />
              <Caption>{t('figPaths')}</Caption>
            </Fade>
          </Spread>
        </section>

        {/* ------------------------------------------------ 04 people -- */}
        <section className="border-b py-16 sm:py-20">
          <Fade>
            <SectionHead n="04" title={t('s4')} />
          </Fade>
          <Spread className="mt-8 items-start">
            <Fade>
              <p className="max-w-2xl text-lg leading-relaxed text-stone-600 dark:text-stone-300">{t('s4body')}</p>
              <div className={cn('mt-7 max-w-xl p-4', INSET)}>
                <Serif className="text-base italic leading-relaxed text-stone-600 dark:text-stone-300">
                  {t('noteVoice')}
                </Serif>
              </div>
            </Fade>
            <Fade delay={0.1}>
              <ContactsCard locale={locale} />
              <Caption>{t('figPeople')}</Caption>
            </Fade>
          </Spread>
        </section>

        {/* -------------------------------- 05 study and opportunities -- */}
        <section className="border-b py-16 sm:py-20">
          <Fade>
            <SectionHead n="05" title={t('s5')} />
          </Fade>
          <Fade delay={0.05}>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-stone-600 dark:text-stone-300">{t('s5body')}</p>
          </Fade>
          <Fade delay={0.1} className="mt-8 grid gap-5 sm:grid-cols-2">
            <div>
              <StudyCard locale={locale} />
              <Caption>{locale === 'ar' ? 'الشكل ٠٥أ · الدراسة' : 'Figure 05a · study'}</Caption>
            </div>
            <div>
              <OpportunitiesCard locale={locale} />
              <Caption>{locale === 'ar' ? 'الشكل ٠٥ب · الفرص' : 'Figure 05b · opportunities'}</Caption>
            </div>
          </Fade>
        </section>

        {/* ----------------------------------------------- 06 pricing -- */}
        <section id="pricing" className="scroll-mt-24 border-b py-16 sm:py-20">
          <Fade>
            <SectionHead n="06" title={t('s6')} />
          </Fade>
          <Fade delay={0.05}>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-stone-600 dark:text-stone-300">{t('s6body')}</p>
          </Fade>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {PRICING.map((tier, i) => (
              <Fade key={tier.id} delay={0.05 * i}>
                <div className={cn(CARD, 'flex h-full flex-col p-7')}>
                  <div className="flex items-baseline justify-between">
                    <Serif className="text-2xl">{pick(tier.name, locale)}</Serif>
                    {tier.popular ? (
                      <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                        {t('most')}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1.5 text-sm text-stone-500 dark:text-stone-400">{pick(tier.blurb, locale)}</p>
                  <div className="mt-6 flex items-baseline gap-2">
                    <Serif className="text-5xl leading-none">{tier.price}</Serif>
                    <span className="text-sm font-medium text-stone-500 dark:text-stone-400">
                      {locale === 'ar' ? 'ريال' : 'SAR'}
                    </span>
                    <span className={cn('ms-1 rounded-full px-2 py-0.5 text-[11px] font-medium', SOFT)}>{t('oneTime')}</span>
                  </div>
                  <ul className="mt-7 flex-1 space-y-3">
                    {tier.features.map((f) => (
                      <li key={f.en} className="flex items-start gap-2.5 text-[14px] text-stone-700 dark:text-stone-200">
                        <Check className={cn('mt-0.5 h-4 w-4 shrink-0', ACCENT)} />
                        <span>{pick(f, locale)}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={{ pathname: '/checkout', query: { plan: tier.id } }}
                    className={cn(
                      'mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors',
                      tier.popular ? PILL : GHOST,
                    )}
                  >
                    {t('choose')} {pick(tier.name, locale)}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </Fade>
            ))}
          </div>
        </section>

        {/* --------------------------------------------------- closing -- */}
        <section className="py-20 text-center sm:py-28">
          <Fade>
            <Eyebrow className="justify-center">{t('kicker')}</Eyebrow>
            <Serif className="mx-auto mt-6 block max-w-3xl text-4xl leading-[1.08] tracking-tight sm:text-6xl">
              {t('closeTitle')}
            </Serif>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-stone-600 dark:text-stone-300">{t('closeBody')}</p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={{ pathname: '/checkout', query: { plan: 'pro' } }}
                className={cn('inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-colors', PILL)}
              >
                {t('cta')}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/c/ali-alajwad"
                className={cn('inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium transition-colors', GHOST)}
              >
                {t('ctaLive')}
              </Link>
            </div>
          </Fade>
        </section>
      </main>

      {/* ---------------------------------------------------------- footer -- */}
      <footer className={cn('relative z-10 border-t', RULE)}>
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-10 text-sm text-stone-500 dark:text-stone-400 sm:flex-row sm:px-8">
          <div className="flex items-center gap-3">
            <Serif className="text-xl">{locale === 'ar' ? 'مسار' : 'Masaar'}</Serif>
            <span className="hidden h-4 w-px bg-stone-300/70 dark:bg-white/15 sm:block" />
            <span>{t('footMade')}</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/c/ali-alajwad" className="transition-colors hover:text-stone-900 dark:hover:text-white">
              {t('ctaLive')}
            </Link>
            <span>© {new Date().getFullYear()} {t('footRights')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

'use client';

/* =============================================================================
   Landing version H, "Question led".
   The page is built around the customer's real anxieties, each one set as a big
   serif question, then answered with a short, reassuring block and, where it
   fits, the matching product preview. Empathetic, direct, conversational. The
   voice does the work; previews appear only where they make the answer concrete.
   Light and dark, Arabic first, amber only, v4 "Atlas" tokens throughout.
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
  OpportunitiesCard,
  TARGET_COMPANIES,
  PRICING,
  STATS,
  pick,
  type Loc,
} from '@/components/marketing/shared';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';
import { ArrowUpRight, Check, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

/* ------------------------------------------------------------------- copy -- */

const T = {
  navWork: { ar: 'كيف يعمل', en: 'How it works' },
  navPlan: { ar: 'الخطة', en: 'The plan' },
  navPricing: { ar: 'السعر', en: 'Pricing' },
  cta: { ar: 'ابدأ الآن', en: 'Get started' },
  ctaPricing: { ar: 'شاهد السعر', en: 'See pricing' },

  kicker: { ar: 'مسار · سوق العمل السعودي', en: 'Masaar · the Saudi job market' },
  heroTitle: { ar: 'لنطرح الأسئلة التي تؤرقك فعلًا.', en: 'Let us answer what is actually keeping you up.' },
  heroLede: {
    ar: 'البحث عن وظيفة مرهق، ومليء بالشكوك. بدل وعود فارغة، نأخذ مخاوفك الحقيقية سؤالًا سؤالًا، ونجيب عن كلٍّ منها بصدق وبخطوة واضحة، لوظيفة جديدة أو لترقية عند صاحب عملك الحالي.',
    en: 'The job hunt is exhausting, and full of doubt. Instead of empty promises, we take your real worries one question at a time, and answer each one honestly with a clear next step, for a new job or a promotion with your current employer.',
  },

  // Q1 competitive
  q1: { ar: 'هل أنا منافس أصلًا؟', en: 'Am I even competitive?' },
  q1body: {
    ar: 'نقرأ سيرتك ونعطيك درجة صريحة من ١٠٠ لكل دور ولكل مستوى، من المبتدئ إلى القيادي. الدرجة محافظة عمدًا حتى تثق بها، وتُظهر بالضبط ما الذي يرفعها وبكم. لا إطراء، بل صورة صادقة تبدأ منها.',
    en: 'We read your CV and give you an honest score out of 100 for each role and each level, from Entry to Director. It is deliberately conservative so you can trust it, and it shows exactly what raises it and by how much. No flattery, just an honest picture to start from.',
  },
  q1note: { ar: 'محافظة عمدًا، حتى تكون درجة تثق بها.', en: 'Conservative on purpose, so it is a number you can trust.' },

  // Q2 contact
  q2: { ar: 'بمن أتواصل فعلًا؟', en: 'Who do I actually contact?' },
  q2body: {
    ar: 'سطحان للتواصل. الأول جهات اتصالك على لينكدإن، تُحلَّل بسرية تامة داخل متصفحك وحده وتُرتَّب إلى مقدّمات دافئة. والثاني قاعدتنا من ١٢٠٩ جهة من الموارد البشرية، يُفتح منها بحسب باقتك. نصوغ رسائل التواصل بصوتك أنت، وترسلها بنفسك.',
    en: 'Two contact surfaces. The first is your own LinkedIn connections, parsed privately inside your browser alone and ranked into warm introductions. The second is our database of 1,209 HR contacts, opened by your tier. We draft your outreach in your own voice, and you send it yourself.',
  },
  q2note: { ar: 'كل رسالة بصوتك، تراجعها وترسلها بنفسك. لا إرسال نيابة عنك.', en: 'Every message is in your voice, reviewed and sent by you. Nothing sent on your behalf.' },

  // Q3 online applications
  q3: { ar: 'هل التقديم أونلاين يجدي أصلًا؟', en: 'Does applying online even work?' },
  q3body: {
    ar: 'غالبًا لا. كثير من الوظائف الجيدة تُملأ عبر الترشيح والعلاقات قبل أن تُنشر، وما يُنشر تُفلتر سيره آليًا قبل أن يراها إنسان. لهذا نبنيها بالعكس: نوصلك بالأشخاص أولًا عبر قاعدتنا من جهات الموارد البشرية وشبكتك أنت، فتصبح اسمًا معروفًا، لا طلبًا في كومة.',
    en: 'Often it does not. Many good jobs are filled through referrals and people before they are ever posted, and what is posted gets auto filtered before a human looks. So we build it in reverse: we connect you to people first, through our HR database and your own network, so you become a known name, not a form in a pile.',
  },

  // Q4 plan
  q4: { ar: 'ما هي خطتي بالضبط؟', en: 'What exactly is my plan?' },
  q4body: {
    ar: 'من خلفيتك نرسم مسارات مهنية تناسبك، ولكل مسار خارطة شهادات مرتبة حسب الأثر. ونوضّح أيها يعيد صندوق هدف الحكومي نحو ٥٠٪ من كلفته، حتى تستثمر وقتك ومالك حيث يهمّ فعلًا. خطوات واضحة، لا تخمين.',
    en: 'From your background we draw career paths that fit you, each with a certifications roadmap ordered by impact. We flag which ones the government fund Hadaf reimburses about 50 percent of, so you invest your time and money where it truly counts. Clear steps, no guessing.',
  },
  q4note: { ar: 'هدف يعيد نحو ٥٠٪ من كلفة الشهادات المؤهَّلة.', en: 'Hadaf reimburses about 50 percent of eligible certificate costs.' },

  // Q5 study and opportunities
  q5: { ar: 'وماذا لو احتجت الدراسة أو فرصًا أكثر؟', en: 'What if I need study, or more openings?' },
  q5studyTitle: { ar: 'الدراسة', en: 'Study' },
  q5studyBody: {
    ar: 'برامج الدراسات العليا حسب التخصص، أهليتك للمنح السعودية ومنها منحة رواد لأفضل ٣٠ جامعة، خيارات الدوام الجزئي في السعودية، والمواعيد النهائية.',
    en: 'Graduate programs by field, your eligibility for Saudi scholarships including the Pioneers scholarship for the top 30 universities, part time options inside Saudi, and deadlines.',
  },
  q5oppTitle: { ar: 'الفرص', en: 'Opportunities' },
  q5oppBody: {
    ar: 'نحو ٦٠ صفحة توظيف لشركات سعودية مرتبة حسب القطاع، أيام مهنية بتواريخها، مهارات مطلوبة، وبرامج وطنية مثل تمهير.',
    en: 'Around 60 Saudi company career pages grouped by sector, dated career days, in demand skills, and national programs like Tamheer.',
  },

  // Q6 pricing
  q6: { ar: 'وكم يكلّفني هذا؟', en: 'And what will this cost me?' },
  q6body: {
    ar: 'دفعة واحدة، بلا اشتراك. تدفع مرة عبر ميسر بمدى أو آبل باي أو البطاقات، وتفتح لوحة التحكم فورًا. الأساسية ١٩٩ ريال، والاحترافية ٤٩٩ ريال.',
    en: 'One payment, no subscription. Pay once through Moyasar with mada, Apple Pay, or cards, and the dashboard unlocks instantly. Starter is 199 SAR, Pro is 499 SAR.',
  },
  oneTime: { ar: 'دفعة واحدة', en: 'one time' },
  most: { ar: 'الأكثر اختيارًا', en: 'Most chosen' },
  choose: { ar: 'اختر', en: 'Choose' },

  trustedBy: { ar: 'محترفون يستهدفون', en: 'Professionals targeting' },

  closeTitle: { ar: 'فلنبدأ من سؤالك أنت.', en: 'Let us start with your question.' },
  closeBody: {
    ar: 'ابدأ بسيرتك كما هي اليوم، ودع كل سؤال يلقى جوابه الصريح وخطوته التالية. النتيجة وظيفة جديدة أو ترقية.',
    en: 'Start with your CV exactly as it is today, and let every question meet its honest answer and next step. The result is a new job or a promotion.',
  },
  footMade: { ar: 'عربي أولًا، بالكامل ثنائي اللغة.', en: 'Arabic first, fully bilingual.' },
  footRights: { ar: 'مسار. جميع الحقوق محفوظة.', en: 'Masaar. All rights reserved.' },
} as const;

const RULE = 'border-stone-200/70 dark:border-white/10';

/* --------------------------------------------------------------- helpers -- */

function Fade({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-90px' }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** A small index badge that prefixes each question, keeping the rhythm calm. */
function Ask({ n }: { n: string }) {
  return (
    <span className={cn('inline-grid h-9 w-9 place-items-center rounded-full text-[13px] font-semibold tabular-nums', SOFT)}>
      {n}
    </span>
  );
}

/** A short reassuring footnote under an answer, amber bordered. */
function Reassure({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 flex items-start gap-2.5 border-s-2 border-amber-500/60 ps-3.5">
      <ShieldCheck className={cn('mt-0.5 h-4 w-4 shrink-0', ACCENT)} />
      <Serif className="text-[15px] italic leading-relaxed text-stone-600 dark:text-stone-300">{children}</Serif>
    </div>
  );
}

/* ---------------------------------------------------------------- page -- */

export default function MarketingH({ locale }: { locale: Loc }) {
  const t = (k: keyof typeof T) => pick(T[k], locale);

  return (
    <div className={cn(PAGE, 'relative overflow-clip')}>
      <Grain />

      {/* ---------------------------------------------------------- header -- */}
      <header className={cn('sticky top-0 z-40 border-b bg-[#f7f6f2]/80 backdrop-blur-md dark:bg-[#0a0a0b]/80', RULE)}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5 sm:px-8">
          <Link href="/" className="flex items-baseline gap-2">
            <Serif className="text-2xl tracking-tight">{locale === 'ar' ? 'مسار' : 'Masaar'}</Serif>
          </Link>
          <nav className="hidden items-center gap-7 text-[13px] text-stone-500 dark:text-stone-400 md:flex">
            <a href="#how" className="transition-colors hover:text-stone-900 dark:hover:text-white">{t('navWork')}</a>
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

      <main className="relative z-10 mx-auto max-w-5xl px-5 sm:px-8">

        {/* -------------------------------------------------------- hero -- */}
        <section className="border-b py-16 text-center sm:py-24">
          <Fade>
            <Eyebrow className="justify-center">{t('kicker')}</Eyebrow>
            <h1 className="mx-auto mt-6 max-w-3xl">
              <Serif className="block text-4xl leading-[1.08] tracking-tight sm:text-6xl">{t('heroTitle')}</Serif>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-stone-600 dark:text-stone-300">{t('heroLede')}</p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={{ pathname: '/checkout', query: { plan: 'pro' } }}
                className={cn('inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors', PILL)}
              >
                {t('cta')}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <a
                href="#pricing"
                className={cn('inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors', GHOST)}
              >
                {t('ctaPricing')}
              </a>
            </div>
          </Fade>
        </section>

        {/* ---------------------------------- Q1 am I competitive (ScoreCard) -- */}
        <section id="how" className="scroll-mt-24 border-b py-16 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <Fade>
              <div className="flex items-center gap-3">
                <Ask n="01" />
                <Serif className="text-3xl leading-[1.1] tracking-tight sm:text-4xl">{t('q1')}</Serif>
              </div>
              <p className="mt-6 text-lg leading-relaxed text-stone-600 dark:text-stone-300">{t('q1body')}</p>
              <Reassure>{t('q1note')}</Reassure>
            </Fade>
            <Fade delay={0.1}>
              <ScoreCard locale={locale} />
            </Fade>
          </div>
        </section>

        {/* ------------------------------------ Q2 who to contact (ContactsCard) -- */}
        <section className="border-b py-16 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <Fade delay={0.1} className="lg:order-2">
              <ContactsCard locale={locale} />
            </Fade>
            <Fade className="lg:order-1">
              <div className="flex items-center gap-3">
                <Ask n="02" />
                <Serif className="text-3xl leading-[1.1] tracking-tight sm:text-4xl">{t('q2')}</Serif>
              </div>
              <p className="mt-6 text-lg leading-relaxed text-stone-600 dark:text-stone-300">{t('q2body')}</p>
              <Reassure>{t('q2note')}</Reassure>
            </Fade>
          </div>
        </section>

        {/* ----------------------------- Q3 does online apply work (copy only) -- */}
        <section className="border-b py-16 sm:py-20">
          <Fade>
            <div className="flex items-center gap-3">
              <Ask n="03" />
              <Serif className="text-3xl leading-[1.1] tracking-tight sm:text-4xl">{t('q3')}</Serif>
            </div>
          </Fade>
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-12">
            <Fade>
              <p className="max-w-2xl text-lg leading-relaxed text-stone-600 dark:text-stone-300">{t('q3body')}</p>
            </Fade>
            <Fade delay={0.1} className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {STATS.map((s) => (
                <div key={s.n} className={cn('p-4', INSET)}>
                  <Serif className="block text-4xl leading-none">{s.n}</Serif>
                  <span className="mt-2 block text-[13px] leading-snug text-stone-500 dark:text-stone-400">{pick(s.label, locale)}</span>
                </div>
              ))}
            </Fade>
          </div>
        </section>

        {/* ----------------------------------------- Q4 my plan (PathsCard) -- */}
        <section id="plan" className="scroll-mt-24 border-b py-16 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <Fade>
              <div className="flex items-center gap-3">
                <Ask n="04" />
                <Serif className="text-3xl leading-[1.1] tracking-tight sm:text-4xl">{t('q4')}</Serif>
              </div>
              <p className="mt-6 text-lg leading-relaxed text-stone-600 dark:text-stone-300">{t('q4body')}</p>
              <Reassure>{t('q4note')}</Reassure>
            </Fade>
            <Fade delay={0.1}>
              <PathsCard locale={locale} />
            </Fade>
          </div>
        </section>

        {/* ------------------------- Q5 study and opportunities (OpportunitiesCard) -- */}
        <section className="border-b py-16 sm:py-20">
          <Fade>
            <div className="flex items-center gap-3">
              <Ask n="05" />
              <Serif className="text-3xl leading-[1.1] tracking-tight sm:text-4xl">{t('q5')}</Serif>
            </div>
          </Fade>
          <div className="mt-8 grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
            <Fade className="space-y-5">
              <div>
                <Eyebrow>{t('q5studyTitle')}</Eyebrow>
                <p className="mt-2 text-[15px] leading-relaxed text-stone-600 dark:text-stone-300">{t('q5studyBody')}</p>
              </div>
              <div>
                <Eyebrow>{t('q5oppTitle')}</Eyebrow>
                <p className="mt-2 text-[15px] leading-relaxed text-stone-600 dark:text-stone-300">{t('q5oppBody')}</p>
              </div>
            </Fade>
            <Fade delay={0.1}>
              <OpportunitiesCard locale={locale} />
            </Fade>
          </div>
        </section>

        {/* ----------------------------------------------- Q6 pricing -- */}
        <section id="pricing" className="scroll-mt-24 border-b py-16 sm:py-20">
          <Fade>
            <div className="flex items-center gap-3">
              <Ask n="06" />
              <Serif className="text-3xl leading-[1.1] tracking-tight sm:text-4xl">{t('q6')}</Serif>
            </div>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-stone-600 dark:text-stone-300">{t('q6body')}</p>
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
                    <span className="text-sm font-medium text-stone-500 dark:text-stone-400">{locale === 'ar' ? 'ريال' : 'SAR'}</span>
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

        {/* ----------------------------------------- social proof + close -- */}
        <section className="py-20 text-center sm:py-28">
          <Fade>
            <Eyebrow className="justify-center">{t('trustedBy')}</Eyebrow>
            <div className="mx-auto mt-5 flex max-w-2xl flex-wrap justify-center gap-1.5">
              {TARGET_COMPANIES.map((c) => (
                <span key={c} className={cn('rounded-full px-2.5 py-1 text-[12px] font-medium', SOFT)}>{c}</span>
              ))}
            </div>
            <Serif className="mx-auto mt-10 block max-w-3xl text-4xl leading-[1.08] tracking-tight sm:text-6xl">
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
              <a
                href="#pricing"
                className={cn('inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium transition-colors', GHOST)}
              >
                {t('ctaPricing')}
              </a>
            </div>
          </Fade>
        </section>
      </main>

      {/* ---------------------------------------------------------- footer -- */}
      <footer className={cn('relative z-10 border-t', RULE)}>
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-5 py-10 text-sm text-stone-500 dark:text-stone-400 sm:flex-row sm:px-8">
          <div className="flex items-center gap-3">
            <Serif className="text-xl">{locale === 'ar' ? 'مسار' : 'Masaar'}</Serif>
            <span className="hidden h-4 w-px bg-stone-300/70 dark:bg-white/15 sm:block" />
            <span>{t('footMade')}</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#pricing" className="transition-colors hover:text-stone-900 dark:hover:text-white">{t('ctaPricing')}</a>
            <span>© {new Date().getFullYear()} {t('footRights')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

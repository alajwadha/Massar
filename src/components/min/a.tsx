'use client';

/* =============================================================================
   Minimal A, "One calm scroll".
   A standalone minimalist customer dashboard that still covers EVERY page of the
   full product, only minimized: the CV score (Home), the career Path with its next
   certification, the people to reach (ranked network + our HR list), Study
   (graduate programs), and Opportunities (companies, a career day, skills).
   No tabs. A single narrow centered column, every page a small stacked Card,
   visible at once, calm and generous. Real live data and hooks, fully functional:
   the level pills update the score live and the contact icons link out.
   Runs INSIDE <PlanProvider> and <DashboardState> (supplied by the route).
============================================================================= */

import { motion } from 'framer-motion';
import {
  GraduationCap,
  Linkedin,
  CalendarDays,
  BadgeCheck,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import {
  PAGE,
  CARD,
  EDGE,
  INSET,
  PILL,
  SOFT,
  ACCENT,
  EASE,
  Serif,
  Eyebrow,
  Grain,
  ThemeToggle,
  LangToggle,
  pick,
  type Loc,
} from '@/components/marketing/shared';
import { usePlan } from '@/components/app/plan-context';
import { useProgress, useNetwork } from '@/components/app/dashboard-state';
import { ProgressRing } from '@/components/app/ui';
import {
  rankConnections,
  planTargets,
  scaledAdd,
  LEVELS,
  gradPrograms,
  companyPortals,
  companyIndustries,
  careerDays,
  skills,
  type Contact,
} from '@/lib/app-data';
import { cn } from '@/lib/utils';

/* ---------------------------------------------------------------- helpers -- */

// Stay inside the allowed imports: link to the contact's real profile when the DB
// or the uploaded CSV gave us one, otherwise fall back to a LinkedIn people search.
function profileUrl(c: Contact): string {
  if (c.linkedin) return c.linkedin;
  const q = encodeURIComponent(`${c.name.en} ${c.company.en}`.trim());
  return `https://www.linkedin.com/search/results/people/?keywords=${q}`;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '؟';
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
}

const TIER_LABEL: Record<string, { ar: string; en: string }> = {
  high: { ar: 'عالمي المستوى', en: 'World class' },
  respected: { ar: 'مرموقة', en: 'Respected' },
  solid: { ar: 'قوية', en: 'Solid' },
  accessible: { ar: 'متاحة', en: 'Accessible' },
};

// One gentle fade per stacked section as the column scrolls into view.
function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: EASE, delay }}
    >
      {children}
    </motion.section>
  );
}

/* ------------------------------------------------------------------ main -- */

export default function MinimalA({ locale }: { locale: Loc }) {
  const plan = usePlan();
  const { level, setLevel, certsDone, activePathId } = useProgress();
  const { network } = useNetwork();

  const activePath =
    plan.paths.find((p) => p.id === (activePathId ?? plan.primaryPath.id)) ?? plan.primaryPath;

  const score = activePath.scoreByLevel[level];

  // The next certification to do: the current one if open, else the first not-done.
  const nextCert =
    activePath.certs.find((c) => !certsDone[c.name.en] && c.status === 'current') ??
    activePath.certs.find((c) => !certsDone[c.name.en]);

  // Done count from the live state, capped at the journey total for a calm "X of Y".
  const doneCount = Math.min(
    activePath.certs.filter((c) => certsDone[c.name.en]).length,
    plan.journey.certsTotal,
  );

  // People to reach: the ranked network if uploaded, else our HR list. Top 3.
  const people = rankConnections(network ?? plan.hrContacts, planTargets(plan)).slice(0, 3);

  // Study: graduate programs for the active path's primary field, top 2.
  const field = activePath.gradFields[0];
  const programs = (gradPrograms[field] ?? []).slice(0, 2);

  // Opportunities: a handful of company names for the customer's own sectors.
  const myIndustries = companyIndustries.filter((ind) => plan.sectors.includes(ind.sector));
  const companyNames = myIndustries
    .flatMap((ind) => companyPortals.filter((c) => c.industry === ind.id))
    .slice(0, 6);

  // One dated career day that fits the active field (fall back to the first).
  const dayForField =
    careerDays.find((d) => d.fields.includes(field) || d.fields.includes('all')) ?? careerDays[0];

  const someSkills = skills.slice(0, 5);

  const ready =
    locale === 'ar'
      ? `جاهز لمستوى ${pick(LEVELS.find((l) => l.id === level)!.label, 'ar')}`
      : `Ready for ${pick(LEVELS.find((l) => l.id === level)!.label, 'en')} level`;

  return (
    <div className={cn(PAGE, 'relative')}>
      <Grain />

      {/* compact sticky header */}
      <header className="sticky top-0 z-20 border-b border-stone-200/70 bg-[#f7f6f2]/80 backdrop-blur-md dark:border-white/[0.07] dark:bg-[#0a0a0b]/80">
        <div className="mx-auto flex max-w-lg items-center justify-between px-5 py-3.5">
          <Serif className="text-xl">{locale === 'ar' ? 'مسار' : 'Masaar'}</Serif>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LangToggle locale={locale} />
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-lg space-y-4 px-5 pb-20 pt-6">
        {/* a quiet welcome line */}
        <div className="px-1">
          <Eyebrow>{locale === 'ar' ? 'لوحتك' : 'Your dashboard'}</Eyebrow>
          <h1 className="mt-1.5">
            <Serif className="text-[26px] leading-tight">
              {locale === 'ar' ? 'خطتك المهنية، بهدوء' : 'Your career plan, calmly'}
            </Serif>
          </h1>
        </div>

        {/* 1) THE SCORE (Home) ---------------------------------------------- */}
        <Section>
          <div className={cn(CARD, EDGE, 'p-5')}>
            <Eyebrow>{locale === 'ar' ? 'درجة تنافسية سيرتك' : 'CV competitiveness'}</Eyebrow>
            <div className="mt-3 flex items-center gap-4">
              <div className={ACCENT}>
                <ProgressRing value={score} size={104} stroke={6} color="currentColor" track="rgba(120,113,108,0.18)">
                  <Serif className="text-3xl leading-none text-stone-900 dark:text-stone-100">{score}</Serif>
                </ProgressRing>
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm text-stone-500 dark:text-stone-400">{pick(activePath.name, locale)}</div>
                <div className={cn('mt-0.5 text-sm font-semibold', ACCENT)}>{ready}</div>
                <p className="mt-1 text-[12px] leading-relaxed text-stone-400 dark:text-stone-500">
                  {locale === 'ar' ? 'درجتك تتغيّر حسب المستوى الذي تستهدفه' : 'Your score changes with the level you aim for'}
                </p>
              </div>
            </div>

            {/* level pills: live, drive setLevel and the score above */}
            <div className="mt-4 inline-flex flex-wrap gap-1.5">
              {LEVELS.map((lv) => {
                const on = lv.id === level;
                return (
                  <button
                    key={lv.id}
                    type="button"
                    onClick={() => setLevel(lv.id)}
                    aria-pressed={on}
                    className={cn(
                      'rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors',
                      on ? PILL : cn(SOFT, 'hover:text-stone-900 dark:hover:text-white'),
                    )}
                  >
                    {pick(lv.label, locale)}
                  </button>
                );
              })}
            </div>
          </div>
        </Section>

        {/* 2) YOUR PATH + NEXT STEP (Path) ---------------------------------- */}
        <Section delay={0.04}>
          <div className={cn(CARD, EDGE, 'p-5')}>
            <Eyebrow>{locale === 'ar' ? 'مسارك وخطوتك التالية' : 'Your path and next step'}</Eyebrow>
            <div className="mt-1.5 flex items-center justify-between gap-3">
              <Serif className="text-xl leading-snug">{pick(activePath.name, locale)}</Serif>
              <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums', SOFT)}>
                {locale === 'ar'
                  ? `${doneCount} من ${plan.journey.certsTotal} شهادات`
                  : `${doneCount} of ${plan.journey.certsTotal} certs`}
              </span>
            </div>

            {nextCert ? (
              <div className={cn(INSET, 'mt-4 flex items-center gap-3 p-3')}>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300">
                  <BadgeCheck className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[10.5px] font-semibold uppercase tracking-wider text-stone-400">
                    {locale === 'ar' ? 'شهادتك الحالية' : 'Your current certification'}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="truncate text-[14px] font-medium text-stone-800 dark:text-stone-100">{pick(nextCert.name, locale)}</span>
                    {nextCert.hadaf ? (
                      <span className="shrink-0 rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                        {locale === 'ar' ? 'يدعمها هدف' : 'Hadaf'}
                      </span>
                    ) : null}
                  </div>
                </div>
                <span className={cn('shrink-0 text-[13px] font-bold tabular-nums', ACCENT)}>
                  +{scaledAdd(nextCert.scoreAdd, level)}
                </span>
              </div>
            ) : (
              <div className={cn(INSET, 'mt-4 p-3 text-[13px] text-stone-500 dark:text-stone-400')}>
                {locale === 'ar' ? 'أنجزت كل شهادات هذا المسار 🎉' : 'You finished every certification on this path 🎉'}
              </div>
            )}
          </div>
        </Section>

        {/* 3) PEOPLE TO REACH (Contacts) ----------------------------------- */}
        <Section delay={0.08}>
          <div className={cn(CARD, EDGE, 'p-5')}>
            <Eyebrow>{locale === 'ar' ? 'مع من تتواصل' : 'People to reach'}</Eyebrow>
            <div className="mt-1 text-[13px] text-stone-500 dark:text-stone-400">
              {network
                ? locale === 'ar'
                  ? 'من شبكتك، مرتّبون حسب القرب من أهدافك'
                  : 'From your network, ranked by fit'
                : locale === 'ar'
                  ? 'من قاعدة الموارد البشرية لدينا'
                  : 'From our HR database'}
            </div>
            <div className="mt-4 space-y-2">
              {people.map(({ contact, reason }) => (
                <div key={contact.id} className={cn(INSET, 'flex items-center gap-3 p-2.5')}>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-stone-900/[0.06] text-[11px] font-bold text-stone-500 dark:bg-white/[0.07] dark:text-stone-300">
                    {initials(contact.name.en || contact.name.ar)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-medium text-stone-800 dark:text-stone-100">{pick(contact.name, locale)}</div>
                    <div className="truncate text-[11.5px] text-stone-500 dark:text-stone-400">
                      {[pick(contact.role, locale), pick(contact.company, locale)].filter(Boolean).join(locale === 'ar' ? ' · ' : ' · ')}
                    </div>
                    <div className={cn('mt-0.5 text-[10.5px] font-semibold', ACCENT)}>{pick(reason, locale)}</div>
                  </div>
                  <a
                    href={profileUrl(contact)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={locale === 'ar' ? 'لينكدإن' : 'LinkedIn'}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-stone-400 transition-colors hover:bg-stone-900/[0.05] hover:text-blue-600 dark:hover:bg-white/[0.07] dark:hover:text-blue-300"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* 4) STUDY (graduate programs) ------------------------------------ */}
        <Section delay={0.12}>
          <div className={cn(CARD, EDGE, 'p-5')}>
            <Eyebrow>{locale === 'ar' ? 'الدراسات العليا' : 'Graduate study'}</Eyebrow>
            <div className="mt-4 space-y-2.5">
              {programs.map((p) => {
                const tier = TIER_LABEL[p.tier] ?? TIER_LABEL.solid;
                return (
                  <div key={p.uni.en} className={cn(INSET, 'flex items-start gap-3 p-3')}>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300">
                      <GraduationCap className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <Serif className="text-[15px] leading-tight">{pick(p.uni, locale)}</Serif>
                      <div className="truncate text-[12px] text-stone-500 dark:text-stone-400">{pick(p.program, locale)}</div>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        <span className={cn('rounded-full px-2 py-0.5 text-[10.5px] font-medium', SOFT)}>{pick(tier, locale)}</span>
                        {p.top30 ? (
                          <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10.5px] font-semibold text-amber-700 dark:text-amber-300">
                            {locale === 'ar' ? 'منحة رواد' : 'Pioneers'}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Section>

        {/* 5) OPPORTUNITIES (companies, a career day, skills) -------------- */}
        <Section delay={0.16}>
          <div className={cn(CARD, EDGE, 'p-5')}>
            <Eyebrow>{locale === 'ar' ? 'الفرص' : 'Opportunities'}</Eyebrow>

            <div className="mt-3 text-[10.5px] font-semibold uppercase tracking-wider text-stone-400">
              {locale === 'ar' ? 'شركات في مجالك' : 'Companies in your fields'}
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {companyNames.map((c) => (
                <a
                  key={c.name.en}
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-medium transition-colors',
                    SOFT,
                    'hover:text-stone-900 dark:hover:text-white',
                  )}
                >
                  {pick(c.name, locale)}
                  <ArrowUpRight className="h-3 w-3 opacity-50" />
                </a>
              ))}
            </div>

            {dayForField ? (
              <a
                href={dayForField.link}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(INSET, 'mt-3 flex items-center gap-2.5 p-3 transition-colors hover:border-amber-500/40')}
              >
                <CalendarDays className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-300" />
                <span className="text-[13px] font-medium text-stone-800 dark:text-stone-100">{pick(dayForField.title, locale)}</span>
                <span className="truncate text-[12px] text-stone-400">
                  · {pick(dayForField.when, locale)} · {pick(dayForField.city, locale)}
                </span>
                <ArrowUpRight className="ms-auto h-3.5 w-3.5 shrink-0 text-stone-400" />
              </a>
            ) : null}

            <div className="mt-4 flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-stone-400">
              <Sparkles className="h-3 w-3" />
              {locale === 'ar' ? 'مهارات تستحق البناء' : 'Skills worth building'}
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {someSkills.map((sk) => (
                <span key={sk.name.en} className={cn('rounded-full px-2.5 py-1 text-[12px] font-medium', SOFT)}>
                  {pick(sk.name, locale)}
                </span>
              ))}
            </div>
          </div>
        </Section>

        {/* a calm closing line */}
        <p className="px-1 pt-1 text-center text-[11px] text-stone-400 dark:text-stone-500">
          {locale === 'ar' ? 'تأكد من التفاصيل قبل أي خطوة، فمستقبلك يهمّنا.' : 'Double-check the details before you act, your future matters to us.'}
        </p>
      </main>
    </div>
  );
}

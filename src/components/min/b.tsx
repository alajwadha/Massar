'use client';

/* =============================================================================
   Minimal B "Tiny tab bar". A compact, app-like rendering of the whole product:
   one segmented control with five tiny tabs (Score, Path, People, Study,
   Opportunities) and a single calm panel that shows the selected page in its
   smallest genuinely useful form. Fully wired to the live plan and client state
   (level pills move the score, tab state is local, contact and apply links work).
   v4 "Atlas" tokens only, amber accent, bilingual via locale, light and dark.
============================================================================= */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gauge,
  Route,
  Users,
  GraduationCap,
  Compass,
  Check,
  TrendingUp,
  Linkedin,
  Building2,
  CalendarDays,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import {
  PAGE,
  CARD,
  EDGE,
  INSET,
  PILL,
  GHOST,
  SOFT,
  ACCENT,
  SPRING,
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
import { ProgressRing, Counter } from '@/components/app/ui';
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
} from '@/lib/app-data';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';

/* ----------------------------------------------------------------- tabs -- */

type TabId = 'score' | 'path' | 'people' | 'study' | 'opps';

const TABS: { id: TabId; icon: typeof Gauge; label: Record<Loc, string> }[] = [
  { id: 'score', icon: Gauge, label: { ar: 'الدرجة', en: 'Score' } },
  { id: 'path', icon: Route, label: { ar: 'المسار', en: 'Path' } },
  { id: 'people', icon: Users, label: { ar: 'الشبكة', en: 'People' } },
  { id: 'study', icon: GraduationCap, label: { ar: 'الدراسة', en: 'Study' } },
  { id: 'opps', icon: Compass, label: { ar: 'الفرص', en: 'Apply' } },
];

const TIER_LABEL: Record<string, Record<Loc, string>> = {
  high: { ar: 'عالي المستوى', en: 'Top tier' },
  respected: { ar: 'مرموقة', en: 'Respected' },
  solid: { ar: 'قوية', en: 'Solid' },
  accessible: { ar: 'في المتناول', en: 'Accessible' },
};

/* ----------------------------------------------------------- shared bits -- */

function PanelHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div>
      <Eyebrow>{eyebrow}</Eyebrow>
      <div className="mt-1.5">
        <Serif className="text-xl leading-tight text-stone-900 dark:text-stone-50">{title}</Serif>
      </div>
      {sub ? <p className="mt-1 text-[13px] text-stone-500 dark:text-stone-400">{sub}</p> : null}
    </div>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '؟';
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
}

/* ------------------------------------------------------------ Score panel -- */

function ScorePanel({ locale }: { locale: Loc }) {
  const plan = usePlan();
  const { level, setLevel, certsDone, activePathId } = useProgress();
  const activePath = plan.paths.find((p) => p.id === (activePathId ?? plan.primaryPath.id)) ?? plan.primaryPath;
  const score = activePath.scoreByLevel[level];
  const levelLabel = (LEVELS.find((l) => l.id === level) ?? LEVELS[0]).label[locale];
  const certsTotal = activePath.certs.length;
  const doneCount = activePath.certs.filter((c) => certsDone[c.name.en] || c.status === 'done').length;

  // The cheapest next win, so the one line stays actionable rather than decorative.
  const next = activePath.certs.find((c) => !(certsDone[c.name.en] || c.status === 'done'));

  return (
    <div className="flex flex-col items-center text-center">
      <div className="text-amber-600 dark:text-amber-400">
        <ProgressRing value={score} size={124} stroke={7} color="currentColor" track="rgba(120,113,108,0.18)">
          <div className="leading-none">
            <Serif className="block text-5xl tracking-tight text-stone-900 dark:text-stone-50">
              <Counter to={score} />
            </Serif>
            <div className="mt-0.5 text-[10px] font-medium text-stone-500 dark:text-stone-400">/ 100</div>
          </div>
        </ProgressRing>
      </div>

      <div className={cn('mt-4 text-sm font-semibold', ACCENT)}>
        {locale === 'ar' ? `جاهز لمستوى ${levelLabel}` : `Ready for ${levelLabel}`}
      </div>
      <div className="mt-0.5 text-[13px] text-stone-500 dark:text-stone-400">{activePath.name[locale]}</div>

      {/* Level pills move the score live */}
      <div className="mt-4 inline-flex rounded-full border border-stone-200/80 bg-stone-50/80 p-0.5 dark:border-white/10 dark:bg-white/[0.05]">
        {LEVELS.map((lv) => {
          const on = level === lv.id;
          return (
            <button
              key={lv.id}
              type="button"
              onClick={() => setLevel(lv.id)}
              className={cn(
                'relative rounded-full px-2.5 py-1.5 text-[11px] font-bold transition-colors',
                on ? 'text-white dark:text-stone-900' : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white',
              )}
            >
              {on && <motion.span layoutId="minB-level" className="absolute inset-0 -z-10 rounded-full bg-stone-900 dark:bg-stone-100" transition={SPRING} />}
              {lv.label[locale]}
            </button>
          );
        })}
      </div>

      <div className={cn(INSET, 'mt-4 w-full px-3 py-2.5 text-start')}>
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
            {locale === 'ar' ? 'الشهادات' : 'Certifications'}
          </span>
          <span className="text-[12px] font-semibold tabular-nums text-stone-600 dark:text-stone-300">{doneCount}/{certsTotal}</span>
        </div>
        {next ? (
          <div className="mt-1.5 flex items-center gap-1.5 text-[13px] text-stone-600 dark:text-stone-300">
            <TrendingUp className={cn('h-3.5 w-3.5 shrink-0', ACCENT)} />
            <span className="min-w-0 flex-1 truncate">
              {locale === 'ar' ? 'التالي: ' : 'Next: '}
              {next.name[locale]}
            </span>
            <span className={cn('shrink-0 font-bold tabular-nums', ACCENT)}>+{scaledAdd(next.scoreAdd, level)}</span>
          </div>
        ) : (
          <div className="mt-1.5 text-[13px] text-stone-600 dark:text-stone-300">
            {locale === 'ar' ? 'أكملت كل الشهادات في هذا المسار' : 'Every certification on this path is done'}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- Path panel -- */

function PathPanel({ locale }: { locale: Loc }) {
  const plan = usePlan();
  const { level, certsDone, activePathId, setActivePath } = useProgress();
  const activePath = plan.paths.find((p) => p.id === (activePathId ?? plan.primaryPath.id)) ?? plan.primaryPath;

  return (
    <div>
      <PanelHead
        eyebrow={locale === 'ar' ? 'مسارك المهني' : 'Your career path'}
        title={activePath.name[locale]}
        sub={activePath.roles[locale]}
      />

      {/* Switch the active path; this also drives the Score tab */}
      {plan.paths.length > 1 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {plan.paths.map((p) => {
            const on = p.id === activePath.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActivePath(p.id)}
                className={cn(
                  'rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors',
                  on ? PILL : cn(GHOST),
                )}
              >
                {p.name[locale]}
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="mt-4 space-y-2.5">
        {activePath.certs.map((ct) => {
          const done = certsDone[ct.name.en] || ct.status === 'done';
          const current = !done && ct.status === 'current';
          return (
            <div key={ct.name.en} className="flex items-center gap-3">
              <span
                className={cn(
                  'grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px]',
                  done && 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900',
                  current && 'border-2 border-amber-500 text-amber-600 dark:text-amber-300',
                  !done && !current && cn(SOFT),
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : null}
              </span>
              <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                <span className="truncate text-[13px] text-stone-700 dark:text-stone-200">{ct.name[locale]}</span>
                <span className="flex shrink-0 items-center gap-1.5">
                  {ct.hadaf ? (
                    <span className="rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                      {locale === 'ar' ? 'هدف' : 'Hadaf'}
                    </span>
                  ) : null}
                  <span className="text-[12px] font-semibold tabular-nums text-stone-400">+{scaledAdd(ct.scoreAdd, level)}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- People panel -- */

function PeoplePanel({ locale }: { locale: Loc }) {
  const plan = usePlan();
  const { network } = useNetwork();
  const source = network ?? plan.hrContacts;
  const people = rankConnections(source, planTargets(plan)).slice(0, 4);

  return (
    <div>
      <PanelHead
        eyebrow={locale === 'ar' ? 'مع من تتواصل' : 'Who to reach'}
        title={locale === 'ar' ? 'أقرب جهات اتصالك' : 'Your warmest intros'}
        sub={network ? (locale === 'ar' ? 'من شبكتك' : 'From your network') : (locale === 'ar' ? 'من قاعدة الموارد البشرية' : 'From our HR database')}
      />

      <div className="mt-4 space-y-2">
        {people.length === 0 ? (
          <div className={cn(INSET, 'px-3 py-4 text-center text-[13px] text-stone-500 dark:text-stone-400')}>
            {locale === 'ar' ? 'ارفع شبكتك على لينكدإن لترتيب أقرب جهات الاتصال' : 'Upload your LinkedIn network to rank your warmest intros'}
          </div>
        ) : (
          people.map(({ contact, reason, kind }) => {
            const q = encodeURIComponent(`${contact.name.en} ${contact.company.en}`.trim());
            const href = contact.linkedin || `https://www.linkedin.com/search/results/people/?keywords=${q}`;
            const warm = kind === 'top';
            return (
              <a
                key={contact.id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(INSET, 'flex items-center gap-3 p-2.5 transition-colors hover:border-stone-300 dark:hover:border-white/20')}
              >
                <span
                  className={cn(
                    'grid h-9 w-9 shrink-0 place-items-center rounded-full text-[11px] font-bold',
                    warm ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300' : cn(SOFT),
                  )}
                >
                  {initials(contact.name[locale])}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium text-stone-800 dark:text-stone-100">{contact.name[locale]}</div>
                  <div className="truncate text-[11px] text-stone-500 dark:text-stone-400">
                    {[contact.role[locale], contact.company[locale]].filter(Boolean).join(' · ')}
                  </div>
                </div>
                <span className="flex shrink-0 items-center gap-1.5">
                  {warm ? (
                    <span className="hidden rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300 sm:inline">
                      {pick(reason, locale)}
                    </span>
                  ) : null}
                  <Linkedin className="h-4 w-4 text-stone-400" />
                </span>
              </a>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ Study panel -- */

function StudyPanel({ locale }: { locale: Loc }) {
  const plan = usePlan();
  const { activePathId } = useProgress();
  const activePath = plan.paths.find((p) => p.id === (activePathId ?? plan.primaryPath.id)) ?? plan.primaryPath;
  const field = activePath.gradFields[0];
  const programs = (gradPrograms[field] ?? []).slice(0, 2);

  return (
    <div>
      <PanelHead
        eyebrow={locale === 'ar' ? 'الدراسات العليا' : 'Graduate study'}
        title={locale === 'ar' ? 'برامج تناسب مسارك' : 'Programs that fit your path'}
        sub={locale === 'ar' ? 'برامج الدوام الكامل في الخارج' : 'Full time programs abroad'}
      />

      <div className="mt-4 space-y-2.5">
        {programs.map((p) => (
          <a
            key={p.uni.en + p.program.en}
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(INSET, 'block p-3 transition-colors hover:border-stone-300 dark:hover:border-white/20')}
          >
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300">
                <GraduationCap className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <Serif className="truncate text-base text-stone-900 dark:text-stone-50">{p.uni[locale]}</Serif>
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-stone-400" />
                </div>
                <div className="truncate text-[12px] text-stone-500 dark:text-stone-400">{p.program[locale]}</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-medium', SOFT)}>
                    {(TIER_LABEL[p.tier] ?? TIER_LABEL.solid)[locale]}
                  </span>
                  {p.top30 ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                      <Sparkles className="h-3 w-3" />
                      {locale === 'ar' ? 'منحة رواد' : 'Pioneers'}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------ Opportunities panel -- */

function OppsPanel({ locale }: { locale: Loc }) {
  const plan = usePlan();

  // Companies for the customer's CV-derived sectors, deduped and capped small.
  const inds = companyIndustries.filter((ind) => plan.sectors.includes(ind.sector));
  const indIds = inds.map((i) => i.id);
  const seen = new Set<string>();
  const companies = companyPortals
    .filter((c) => indIds.includes(c.industry))
    .filter((c) => {
      if (seen.has(c.name.en)) return false;
      seen.add(c.name.en);
      return true;
    })
    .slice(0, 8);
  const fallback = companyPortals.slice(0, 8);
  const cos = companies.length ? companies : fallback;

  const day = careerDays[0];
  const someSkills = skills.slice(0, 5);

  return (
    <div>
      <PanelHead
        eyebrow={locale === 'ar' ? 'الفرص' : 'Opportunities'}
        title={locale === 'ar' ? 'أين تتقدّم' : 'Where to apply'}
      />

      <div className="mt-4 text-[11px] font-bold uppercase tracking-wider text-stone-400">
        {locale === 'ar' ? 'صفحات التوظيف' : 'Company careers'}
      </div>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {cos.map((c) => (
          <a
            key={c.name.en}
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn('rounded-full px-2.5 py-1 text-[12px] font-medium transition-colors', SOFT, 'hover:text-stone-900 dark:hover:text-white')}
          >
            {c.name[locale]}
          </a>
        ))}
      </div>

      {day ? (
        <a
          href={day.link}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(INSET, 'mt-3 flex items-center gap-2.5 p-2.5 transition-colors hover:border-stone-300 dark:hover:border-white/20')}
        >
          <CalendarDays className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-300" />
          <span className="text-[13px] font-medium text-stone-700 dark:text-stone-200">{day.title[locale]}</span>
          <span className="truncate text-[12px] text-stone-400">· {day.when[locale]} · {day.city[locale]}</span>
          <ArrowUpRight className="ms-auto h-3.5 w-3.5 shrink-0 text-stone-400" />
        </a>
      ) : null}

      <div className="mt-3 text-[11px] font-bold uppercase tracking-wider text-stone-400">
        {locale === 'ar' ? 'مهارات مطلوبة' : 'In demand skills'}
      </div>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {someSkills.map((s) => (
          <span key={s.name.en} className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-medium', SOFT)}>
            <Building2 className="h-3 w-3 text-stone-400" />
            {s.name[locale]}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ shell -- */

export default function MinimalB({ locale }: { locale: Loc }) {
  const plan = usePlan();
  const [tab, setTab] = useState<TabId>('score');

  return (
    <div className={cn(PAGE, 'relative')}>
      <Grain />

      {/* Compact sticky header */}
      <header className="sticky top-0 z-20 border-b border-stone-200/70 bg-[#f7f6f2]/85 backdrop-blur-md dark:border-white/[0.07] dark:bg-[#0a0a0b]/85">
        <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-baseline gap-1.5">
            <Serif className="text-xl tracking-tight text-stone-900 dark:text-stone-50">{locale === 'ar' ? 'مسار' : 'Masaar'}</Serif>
            <span className={cn('text-[10px] font-bold uppercase tracking-[0.18em]', ACCENT)}>{locale === 'ar' ? 'مصغّر' : 'mini'}</span>
          </Link>
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <LangToggle locale={locale} />
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-md px-4 pb-12 pt-5">
        {/* Greeting */}
        <div className="mb-4">
          <Eyebrow>{locale === 'ar' ? 'لوحتك' : 'Your dashboard'}</Eyebrow>
          <div className="mt-1">
            <Serif className="text-2xl tracking-tight text-stone-900 dark:text-stone-50">
              {plan.profile.name[locale]}
            </Serif>
          </div>
          <p className="mt-0.5 truncate text-[13px] text-stone-500 dark:text-stone-400">{plan.profile.headline[locale]}</p>
        </div>

        {/* The tiny tab bar: one rounded pill row */}
        <div className="flex rounded-full border border-stone-200/80 bg-stone-50/80 p-1 dark:border-white/10 dark:bg-white/[0.05]">
          {TABS.map((t) => {
            const on = tab === t.id;
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                aria-pressed={on}
                className={cn(
                  'relative flex flex-1 items-center justify-center gap-1 rounded-full px-1 py-2 text-[11px] font-bold transition-colors',
                  on ? 'text-white dark:text-stone-900' : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white',
                )}
              >
                {on && <motion.span layoutId="minB-tab" className="absolute inset-0 -z-10 rounded-full bg-stone-900 dark:bg-stone-100" transition={SPRING} />}
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{t.label[locale]}</span>
              </button>
            );
          })}
        </div>

        {/* One tight panel, gentle fade/slide on switch */}
        <div className={cn(CARD, EDGE, 'mt-4 p-5')}>
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: EASE }}
            >
              {tab === 'score' && <ScorePanel locale={locale} />}
              {tab === 'path' && <PathPanel locale={locale} />}
              {tab === 'people' && <PeoplePanel locale={locale} />}
              {tab === 'study' && <StudyPanel locale={locale} />}
              {tab === 'opps' && <OppsPanel locale={locale} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Quiet footer line to the full dashboard */}
        <div className="mt-4 text-center">
          <Link
            href={`/c/${plan.slug}`}
            className={cn('inline-flex items-center gap-1 text-[12px] font-medium text-stone-500 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-white')}
          >
            {locale === 'ar' ? 'افتح اللوحة الكاملة' : 'Open the full dashboard'}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </main>
    </div>
  );
}

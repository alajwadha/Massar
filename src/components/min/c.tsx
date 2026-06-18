'use client';

/* =============================================================================
   Minimal C, the "Accordion". One calm column of five collapsible rows, one per
   page (Score, Path, People, Study, Opportunities). Every row is collapsed to a
   single summary line (icon, name, a key number or hint) until tapped, then it
   expands to the minimized content for that page. Score opens by default. Same v4
   "Atlas" tokens as the real dashboard, amber-only accent, bilingual via locale,
   fully functional: the level pills move the live score, the contact links work.
============================================================================= */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gauge,
  Route,
  Users,
  GraduationCap,
  Compass,
  ChevronDown,
  Check,
  Linkedin,
  CalendarDays,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import {
  PAGE,
  CARD,
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
  linkedinUrl,
  type Level,
} from '@/lib/app-data';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';

/* -------------------------------------------------------------------- row -- */

function Row({
  icon: Icon,
  name,
  summary,
  open,
  onToggle,
  children,
}: {
  icon: typeof Gauge;
  name: string;
  summary: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={cn(CARD, 'overflow-hidden')}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-start transition-colors hover:bg-stone-900/[0.02] dark:hover:bg-white/[0.03]"
      >
        <span
          className={cn(
            'grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors',
            open ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300' : SOFT,
          )}
        >
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <span className="flex-1 truncate text-[15px] font-medium text-stone-800 dark:text-stone-100">{name}</span>
        <span className={cn('truncate text-[13px] font-medium tabular-nums', open ? 'text-stone-400 dark:text-stone-500' : ACCENT)}>
          {summary}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3, ease: EASE }} className="shrink-0 text-stone-400">
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.34, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="border-t border-stone-200/70 px-4 py-4 dark:border-white/[0.07]">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------- score -- */

function ScoreRing({ value }: { value: number }) {
  const tone = value >= 75 ? '#0E9F6E' : value >= 55 ? '#D97706' : '#0284C7';
  return (
    <ProgressRing value={value} size={104} stroke={9} color={tone} track="rgba(120,113,108,0.16)">
      <div className="leading-none">
        <Serif className="text-3xl">
          <Counter to={value} />
        </Serif>
        <div className="mt-0.5 text-[10px] font-medium text-stone-400">/ 100</div>
      </div>
    </ProgressRing>
  );
}

/* -------------------------------------------------------------------- main -- */

export default function MinimalC({ locale }: { locale: Loc }) {
  const ar = locale === 'ar';
  const plan = usePlan();
  const { level, setLevel, activePathId } = useProgress();
  const { network } = useNetwork();

  const activePath = plan.paths.find((p) => p.id === (activePathId ?? plan.primaryPath.id)) ?? plan.primaryPath;
  const score = activePath.scoreByLevel[level];
  const levelLabel = LEVELS.find((l) => l.id === level) ?? LEVELS[0];

  // Path: the next certificate (first not done), and a compact ordered list.
  const nextCert = activePath.certs.find((c) => c.status === 'current') ?? activePath.certs.find((c) => c.status !== 'done');

  // People: the warmest intros from the uploaded network (or HR fallback).
  const people = rankConnections(network ?? plan.hrContacts, planTargets(plan)).slice(0, 3);
  const reachable = (network ?? plan.hrContacts).length;

  // Study: the active path's primary field, top programs.
  const field = activePath.gradFields[0];
  const programs = (gradPrograms[field] ?? []).slice(0, 2);
  const topUni = programs[0];

  // Opportunities: companies in the customer's sectors + a career day + skills.
  const myIndustries = companyIndustries.filter((ind) => plan.sectors.includes(ind.sector));
  const companies = myIndustries
    .flatMap((ind) => companyPortals.filter((c) => c.industry === ind.id))
    .slice(0, 8);
  const allOpenings = myIndustries.flatMap((ind) => companyPortals.filter((c) => c.industry === ind.id)).length;
  const day = careerDays.find((d) => d.fields.includes(field) || d.fields.includes('all')) ?? careerDays[0];
  const topSkills = skills.slice(0, 6);

  // Which single row is open. Score starts expanded; tapping another closes this.
  const [open, setOpen] = useState<string>('score');
  const toggle = (id: string) => setOpen((cur) => (cur === id ? '' : id));

  const tierTone: Record<string, string> = {
    high: ar ? 'الأقوى' : 'Top',
    respected: ar ? 'مرموقة' : 'Respected',
    solid: ar ? 'متينة' : 'Solid',
    accessible: ar ? 'في المتناول' : 'Accessible',
  };

  return (
    <div className={cn(PAGE, 'relative')}>
      <Grain />

      {/* compact sticky header */}
      <header className="sticky top-0 z-30 border-b border-stone-200/70 bg-[#f7f6f2]/85 backdrop-blur-md dark:border-white/[0.07] dark:bg-[#0a0a0b]/85">
        <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
          <Serif className="text-xl tracking-tight">{ar ? 'مسار' : 'Masaar'}</Serif>
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <LangToggle locale={locale} />
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-xl px-4 pb-16 pt-6">
        <div className="mb-5">
          <Eyebrow>{ar ? 'لوحتك' : 'Your dashboard'}</Eyebrow>
          <h1 className="mt-1.5 text-[22px] leading-tight text-stone-800 dark:text-stone-100">
            {ar ? 'أهلًا ' : 'Welcome, '}
            <Serif className="text-amber-700 dark:text-amber-300">{pick(plan.profile.name, locale)}</Serif>
          </h1>
          <p className="mt-1 text-[13px] text-stone-500 dark:text-stone-400">
            {ar ? 'افتح أي قسم لرؤية تفاصيله. كل شيء في مكان واحد.' : 'Open any section to see its detail. Everything in one place.'}
          </p>
        </div>

        <div className="space-y-2.5">
          {/* ------------------------------------------------------------ Score */}
          <Row
            icon={Gauge}
            name={ar ? 'الدرجة' : 'Score'}
            summary={<span>{score} / 100</span>}
            open={open === 'score'}
            onToggle={() => toggle('score')}
          >
            <div className="flex items-center gap-4">
              <ScoreRing value={score} />
              <div className="min-w-0">
                <div className="text-[13px] text-stone-500 dark:text-stone-400">{pick(activePath.name, locale)}</div>
                <div className={cn('mt-0.5 text-[13px] font-semibold', ACCENT)}>
                  {ar ? `تنافسيتك لمستوى ${levelLabel.label.ar}` : `Your edge at ${levelLabel.label.en} level`}
                </div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {LEVELS.map((l) => {
                    const on = l.id === level;
                    return (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => setLevel(l.id as Level)}
                        aria-pressed={on}
                        className={cn('rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors', on ? PILL : SOFT)}
                      >
                        {pick(l.label, locale)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <Link
              href="/app"
              className="mt-3.5 flex items-center justify-between rounded-xl px-1 text-[12px] font-medium text-stone-400 transition-colors hover:text-amber-700 dark:hover:text-amber-300"
            >
              <span>{ar ? 'راجع ما يرفع درجتك' : 'See what raises your score'}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Row>

          {/* ------------------------------------------------------------- Path */}
          <Row
            icon={Route}
            name={ar ? 'مسارك' : 'Path'}
            summary={nextCert ? <span className="truncate">{pick(nextCert.name, locale)}</span> : <Check className="h-4 w-4" />}
            open={open === 'path'}
            onToggle={() => toggle('path')}
          >
            <div className="mb-3">
              <Serif className="text-lg">{pick(activePath.name, locale)}</Serif>
              <div className="text-[12px] text-stone-500 dark:text-stone-400">{pick(activePath.roles, locale)}</div>
            </div>
            <div className="space-y-2.5">
              {activePath.certs.map((ct) => {
                const add = scaledAdd(ct.scoreAdd, level);
                return (
                  <div key={ct.name.en} className="flex items-center gap-3">
                    <span
                      className={cn(
                        'grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px]',
                        ct.status === 'done' && 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900',
                        ct.status === 'current' && 'border-2 border-amber-500 text-amber-600 dark:text-amber-300',
                        ct.status === 'future' && SOFT,
                      )}
                    >
                      {ct.status === 'done' ? <Check className="h-3.5 w-3.5" /> : null}
                    </span>
                    <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                      <span className="truncate text-[13px] text-stone-700 dark:text-stone-200">{pick(ct.name, locale)}</span>
                      <span className="flex shrink-0 items-center gap-1.5">
                        {ct.hadaf ? (
                          <span className="rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                            {ar ? 'هدف' : 'Hadaf'}
                          </span>
                        ) : null}
                        <span className="text-[12px] font-semibold tabular-nums text-stone-400">
                          {ct.status === 'done' ? <Check className="h-3 w-3" /> : `+${add}`}
                        </span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Row>

          {/* ----------------------------------------------------------- People */}
          <Row
            icon={Users}
            name={ar ? 'جهات للتواصل' : 'People'}
            summary={<span>{ar ? `${reachable} جهة` : `${reachable} to reach`}</span>}
            open={open === 'people'}
            onToggle={() => toggle('people')}
          >
            <div className="mb-3 text-[12px] text-stone-500 dark:text-stone-400">
              {network
                ? ar
                  ? 'أقرب 3 جهات من شبكتك'
                  : 'Your 3 warmest intros'
                : ar
                  ? 'أقرب 3 جهات من قاعدة الموارد البشرية'
                  : '3 from our HR database'}
            </div>
            <div className="space-y-2">
              {people.map(({ contact }) => (
                <a
                  key={contact.id}
                  href={linkedinUrl(contact)}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(INSET, 'flex items-center gap-3 p-2.5 transition-colors hover:border-amber-500/40')}
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-500/15 text-[12px] font-semibold text-amber-700 dark:text-amber-300">
                    {pick(contact.name, locale).slice(0, 1)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-medium text-stone-800 dark:text-stone-100">{pick(contact.name, locale)}</div>
                    <div className="truncate text-[11px] text-stone-500 dark:text-stone-400">
                      {pick(contact.role, locale)}
                      {contact.company.en ? ` · ${pick(contact.company, locale)}` : ''}
                    </div>
                  </div>
                  <Linkedin className="h-4 w-4 shrink-0 text-stone-400" />
                </a>
              ))}
            </div>
            <Link
              href="/app"
              className="mt-3 flex items-center justify-between rounded-xl px-1 text-[12px] font-medium text-stone-400 transition-colors hover:text-amber-700 dark:hover:text-amber-300"
            >
              <span>{ar ? 'افتح كل جهات الاتصال والرسائل' : 'Open all contacts and messages'}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Row>

          {/* ------------------------------------------------------------ Study */}
          <Row
            icon={GraduationCap}
            name={ar ? 'الدراسة' : 'Study'}
            summary={topUni ? <span className="truncate">{pick(topUni.uni, locale)}</span> : null}
            open={open === 'study'}
            onToggle={() => toggle('study')}
          >
            <div className="space-y-2">
              {programs.map((p) => (
                <a
                  key={p.uni.en}
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(INSET, 'block p-3 transition-colors hover:border-amber-500/40')}
                >
                  <div className="flex items-center justify-between gap-2">
                    <Serif className="truncate text-[15px]">{pick(p.uni, locale)}</Serif>
                    {p.top30 ? (
                      <span className="shrink-0 rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                        {ar ? 'منحة رواد' : 'Pioneers'}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-0.5 flex items-center justify-between gap-2 text-[12px] text-stone-500 dark:text-stone-400">
                    <span className="truncate">{pick(p.program, locale)}</span>
                    <span className={cn('shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium', SOFT)}>{tierTone[p.tier]}</span>
                  </div>
                </a>
              ))}
            </div>
            <Link
              href="/app"
              className="mt-3 flex items-center justify-between rounded-xl px-1 text-[12px] font-medium text-stone-400 transition-colors hover:text-amber-700 dark:hover:text-amber-300"
            >
              <span>{ar ? 'كل البرامج والمنح والقبول' : 'All programs, funding and admissions'}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Row>

          {/* ---------------------------------------------------- Opportunities */}
          <Row
            icon={Compass}
            name={ar ? 'الفرص' : 'Opportunities'}
            summary={<span>{ar ? `${allOpenings} جهة` : `${allOpenings} employers`}</span>}
            open={open === 'opps'}
            onToggle={() => toggle('opps')}
          >
            <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
              {ar ? 'شركات في مجالك' : 'Employers in your field'}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {companies.map((c) => (
                <a
                  key={c.name.en}
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  className={cn('rounded-full px-2.5 py-1 text-[12px] font-medium transition-colors hover:bg-amber-500/15 hover:text-amber-700 dark:hover:text-amber-300', SOFT)}
                >
                  {pick(c.name, locale)}
                </a>
              ))}
            </div>

            {day ? (
              <a
                href={day.link}
                target="_blank"
                rel="noreferrer"
                className={cn(INSET, 'mt-3 flex items-center gap-2.5 p-2.5 transition-colors hover:border-amber-500/40')}
              >
                <CalendarDays className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-300" />
                <span className="truncate text-[13px] text-stone-700 dark:text-stone-200">{pick(day.title, locale)}</span>
                <span className="ms-auto shrink-0 text-[11px] text-stone-400">
                  {pick(day.when, locale)} · {pick(day.city, locale)}
                </span>
              </a>
            ) : null}

            <div className="mb-1.5 mt-3 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
              {ar ? 'مهارات تستحق الإضافة' : 'Skills worth adding'}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {topSkills.map((s) => (
                <a
                  key={s.name.en}
                  href={s.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-stone-300/70 px-2.5 py-1 text-[12px] text-stone-500 transition-colors hover:border-amber-500/40 hover:text-amber-700 dark:border-white/10 dark:text-stone-300 dark:hover:text-amber-300"
                >
                  <Sparkles className="h-3 w-3" />
                  {pick(s.name, locale)}
                </a>
              ))}
            </div>
          </Row>
        </div>

        <p className="mt-6 text-center text-[11px] text-stone-400">
          {ar ? 'مسار · لوحتك المهنية في صفحة واحدة' : 'Masaar · your career, one page'}
        </p>
      </main>
    </div>
  );
}

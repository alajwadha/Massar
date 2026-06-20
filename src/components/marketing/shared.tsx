'use client';

/* =============================================================================
   Marketing foundation. Shared v4 "Atlas" design tokens, theme + language
   toggles, and faithful inline PRODUCT PREVIEWS (the "preview of our work"):
   crisp, themeable React mocks of the real dashboard so the marketing pages can
   show the product in both light and dark without screenshots. The three landing
   versions (a, b, c) each compose these very differently.
============================================================================= */

import { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  Check,
  TrendingUp,
  Linkedin,
  BadgeCheck,
  CalendarDays,
  Building2,
  GraduationCap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, usePathname } from '@/i18n/routing';
import type { Loc } from '@/lib/app-data';

export type { Loc };

/* ------------------------------------------------------------------ tokens -- */

export const SPRING = { type: 'spring', stiffness: 420, damping: 34, mass: 0.8 } as const;
export const EASE = [0.16, 1, 0.3, 1] as const;

export const PAGE = 'min-h-dvh bg-[#f7f6f2] text-stone-900 antialiased dark:bg-[#0a0a0b] dark:text-stone-100';

export const CARD =
  'relative overflow-hidden rounded-[22px] border border-stone-200/80 bg-white/85 shadow-[0_1px_2px_rgba(28,25,23,0.04),0_24px_60px_-34px_rgba(28,25,23,0.30)] backdrop-blur-sm dark:border-white/[0.09] dark:bg-[#161619] dark:shadow-[0_22px_55px_-32px_rgba(0,0,0,0.9)]';
export const EDGE =
  'before:pointer-events-none before:absolute before:inset-x-5 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-stone-900/10 before:to-transparent dark:before:via-white/20';
export const INSET = 'rounded-2xl border border-stone-200/70 bg-stone-50/70 dark:border-white/[0.07] dark:bg-white/[0.035]';
export const PILL = 'bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white';
export const GHOST =
  'border border-stone-300/70 bg-white/60 text-stone-500 hover:border-stone-400 hover:text-stone-900 dark:border-white/10 dark:bg-white/[0.05] dark:text-stone-300 dark:hover:border-white/25 dark:hover:text-white';
export const SOFT = 'bg-stone-900/[0.05] text-stone-600 dark:bg-white/[0.07] dark:text-stone-300';
export const ACCENT = 'text-amber-700 dark:text-amber-300';

export const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const pick = (s: { ar: string; en: string }, l: Loc) => s[l];

/* -------------------------------------------------------------- primitives -- */

export function Serif({ className, children }: { className?: string; children: React.ReactNode }) {
  return <span className={cn('font-serif font-normal', className)}>{children}</span>;
}

export function Eyebrow({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('text-[10.5px] font-semibold uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400', className)}>
      {children}
    </div>
  );
}

export function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.035] mix-blend-multiply dark:opacity-[0.06] dark:mix-blend-screen"
      style={{ backgroundImage: NOISE }}
    />
  );
}

/* ---------------------------------------------------------------- toggles -- */

function Sun() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}
function Moon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    let initial = document.documentElement.classList.contains('dark');
    try {
      const saved = localStorage.getItem('masaar:theme');
      if (saved) initial = saved === 'dark';
    } catch {
      /* ignore */
    }
    document.documentElement.classList.toggle('dark', initial);
    setDark(initial);
  }, []);
  const toggle = () => {
    const next = !dark;
    const root = document.documentElement;
    root.classList.add('theme-anim');
    window.setTimeout(() => root.classList.remove('theme-anim'), 800);
    setDark(next);
    root.classList.toggle('dark', next);
    try {
      localStorage.setItem('masaar:theme', next ? 'dark' : 'light');
    } catch {
      /* ignore */
    }
  };
  return (
    <button type="button" onClick={toggle} aria-label="Toggle dark mode" className={cn('grid h-9 w-9 place-items-center rounded-full transition-colors', GHOST)}>
      {dark ? <Sun /> : <Moon />}
    </button>
  );
}

export function LangToggle({ locale }: { locale: Loc }) {
  const pathname = usePathname();
  const other: Loc = locale === 'ar' ? 'en' : 'ar';
  return (
    <Link
      href={pathname}
      locale={other}
      aria-label="Switch language"
      className={cn('grid h-9 min-w-9 place-items-center rounded-full px-2 text-xs font-semibold transition-colors', GHOST)}
    >
      {locale === 'ar' ? 'EN' : 'ع'}
    </Link>
  );
}

/* ----------------------------------------------------------- product mocks -- */

export function MiniRing({ value = 96, size = 104 }: { value?: number; size?: number }) {
  const stroke = 7;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - value / 100);
  return (
    <div className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-stone-200 dark:stroke-white/10" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          className="stroke-amber-500"
          strokeDasharray={c}
          strokeDashoffset={off}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <Serif className="text-3xl leading-none">{value}</Serif>
      </div>
    </div>
  );
}

const LVL = [
  { ar: 'مبتدئ', en: 'Entry', on: true },
  { ar: 'متوسط', en: 'Mid', on: false },
  { ar: 'خبير', en: 'Senior', on: false },
  { ar: 'قيادي', en: 'Director', on: false },
];

/** The signature proof: the per role, per level CV competitiveness score. */
export function ScoreCard({ locale, className }: { locale: Loc; className?: string }) {
  const raises = [
    { ar: 'عيد صياغة إنجازاتك بلغة مالية', en: 'Reframe bullets for finance', d: '+6' },
    { ar: 'كمّل شهادة FMVA', en: 'Complete FMVA', d: '+8' },
    { ar: 'كمّل CFA المستوى الأول', en: 'Complete CFA Level 1', d: '+15' },
  ];
  return (
    <div className={cn(CARD, EDGE, 'p-5', className)}>
      <Eyebrow>{locale === 'ar' ? 'تنافسية السيرة' : 'CV competitiveness'}</Eyebrow>
      <div className="mt-3 flex items-center gap-4">
        <MiniRing value={96} />
        <div className="min-w-0">
          <div className="text-sm text-stone-500 dark:text-stone-400">{locale === 'ar' ? 'محلل استثمار الطاقة' : 'Energy Investment Analyst'}</div>
          <div className={cn('mt-0.5 text-sm font-semibold', ACCENT)}>{locale === 'ar' ? 'جاهز لمستوى المبتدئ' : 'Ready for Entry level'}</div>
          <div className="mt-2 flex flex-wrap gap-1">
            {LVL.map((l) => (
              <span
                key={l.en}
                className={cn(
                  'rounded-full px-2 py-0.5 text-[11px] font-medium',
                  l.on ? PILL : SOFT,
                )}
              >
                {pick(l, locale)}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-1.5">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">{locale === 'ar' ? 'وش يرفعها' : 'What raises it'}</div>
        {raises.map((rr) => (
          <div key={rr.en} className={cn(INSET, 'flex items-center justify-between px-3 py-1.5 text-[13px]')}>
            <span className="truncate text-stone-600 dark:text-stone-300">{pick(rr, locale)}</span>
            <span className={cn('font-semibold tabular-nums', ACCENT)}>{rr.d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const CERTS = [
  { ar: 'إكسل وSQL للتحليل', en: 'Excel & SQL for analysis', s: '+5', st: 'done' as const },
  { ar: 'تمويل المناخ · كابسارك', en: 'Climate Finance · KAPSARC', s: '+7', st: 'done' as const },
  { ar: 'النمذجة المالية FMVA', en: 'Financial Modeling (FMVA)', s: '+8', st: 'current' as const, hadaf: true },
  { ar: 'CFA المستوى الأول', en: 'CFA Level 1', s: '+15', st: 'future' as const },
];

/** A career path with its ordered certifications timeline and Hadaf flag. */
export function PathsCard({ locale, className }: { locale: Loc; className?: string }) {
  return (
    <div className={cn(CARD, EDGE, 'p-5', className)}>
      <Eyebrow>{locale === 'ar' ? 'مسارك المهني' : 'Your career path'}</Eyebrow>
      <div className="mt-1.5">
        <Serif className="text-xl">{locale === 'ar' ? 'الاستثمار والاستراتيجية في الطاقة' : 'Energy Investment & Strategy'}</Serif>
      </div>
      <div className="mt-4 space-y-3">
        {CERTS.map((ct) => (
          <div key={ct.en} className="flex items-center gap-3">
            <span
              className={cn(
                'grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px]',
                ct.st === 'done' && 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900',
                ct.st === 'current' && 'border-2 border-amber-500 text-amber-600 dark:text-amber-300',
                ct.st === 'future' && cn(SOFT),
              )}
            >
              {ct.st === 'done' ? <Check className="h-3.5 w-3.5" /> : null}
            </span>
            <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
              <span className="truncate text-[13px] text-stone-700 dark:text-stone-200">{pick(ct, locale)}</span>
              <span className="flex shrink-0 items-center gap-1.5">
                {ct.hadaf ? (
                  <span className="rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                    {locale === 'ar' ? 'هدف ٥٠٪' : 'Hadaf 50%'}
                  </span>
                ) : null}
                <span className="text-[12px] font-semibold tabular-nums text-stone-400">{ct.s}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** The two contact surfaces: the customer's own ranked network + our HR database. */
export function ContactsCard({ locale, className }: { locale: Loc; className?: string }) {
  const people = [
    { init: { ar: 'ع', en: 'A' }, name: { ar: 'عبدالله المالكي', en: 'Abdullah Al-Malki' }, role: { ar: 'مدير محفظة · الصندوق', en: 'Portfolio Director · PIF' }, tag: { ar: 'تقدر توصله', en: 'In your network' }, warm: true, net: true },
    { init: { ar: 'س', en: 'S' }, name: { ar: 'سارة القحطاني', en: 'Sara Al-Qahtani' }, role: { ar: 'أخصائية توظيف أولى · نيوم', en: 'Senior Recruiter · NEOM' }, tag: { ar: 'موارد بشرية', en: 'HR' }, warm: false, net: false },
    { init: { ar: 'ف', en: 'F' }, name: { ar: 'فهد العتيبي', en: 'Fahad Al-Otaibi' }, role: { ar: 'مدير توظيف · أرامكو', en: 'Hiring Manager · Aramco' }, tag: { ar: 'جديد', en: 'New' }, warm: false, net: false },
  ];
  return (
    <div className={cn(CARD, EDGE, 'flex flex-col p-5', className)}>
      <div className="flex items-center justify-between gap-2">
        <Eyebrow>{locale === 'ar' ? 'مع من تتواصل' : 'Who to reach'}</Eyebrow>
        <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', SOFT)}>{locale === 'ar' ? 'شبكتك + قاعدتنا' : 'Network + database'}</span>
      </div>
      <div className="mt-3 space-y-2">
        {people.map((p) => (
          <div key={p.name.en} className={cn(INSET, 'flex items-center gap-2.5 p-2')}>
            <span
              className={cn(
                'grid h-8 w-8 shrink-0 place-items-center rounded-full text-[12px] font-bold',
                p.warm ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300' : 'bg-stone-900/[0.06] text-stone-600 dark:bg-white/[0.08] dark:text-stone-300',
              )}
            >
              {pick(p.init, locale)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12.5px] font-semibold text-stone-800 dark:text-stone-100">{pick(p.name, locale)}</div>
              <div className="truncate text-[11px] text-stone-500 dark:text-stone-400">{pick(p.role, locale)}</div>
            </div>
            {p.net ? <Linkedin className="h-3.5 w-3.5 shrink-0 text-stone-400" /> : null}
            <span
              className={cn(
                'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold',
                p.warm ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300' : SOFT,
              )}
            >
              {pick(p.tag, locale)}
            </span>
          </div>
        ))}
      </div>
      <div className={cn(INSET, 'mt-2.5 flex items-center gap-2 p-2.5')}>
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300">
          <BadgeCheck className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1 truncate text-[11.5px] text-stone-600 dark:text-stone-300">
          {locale === 'ar' ? 'رسالة تعريف جاهزة بصوتك' : 'A ready intro message in your voice'}
        </span>
        <span className={cn('shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold', PILL)}>{locale === 'ar' ? 'نسخ' : 'Copy'}</span>
      </div>
    </div>
  );
}

/** Graduate study with Saudi scholarship eligibility. */
export function StudyCard({ locale, className }: { locale: Loc; className?: string }) {
  return (
    <div className={cn(CARD, EDGE, 'p-5', className)}>
      <Eyebrow>{locale === 'ar' ? 'الدراسات العليا' : 'Graduate study'}</Eyebrow>
      <div className="mt-3 flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300">
          <GraduationCap className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <Serif className="text-lg">{locale === 'ar' ? 'ماجستير تمويل الطاقة' : 'MSc Energy Finance'}</Serif>
          <div className="text-[13px] text-stone-500 dark:text-stone-400">Imperial College London</div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-medium', SOFT)}>{locale === 'ar' ? 'عالمي المستوى' : 'World class'}</span>
        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
          {locale === 'ar' ? 'منحة رواد' : 'Pioneers scholarship'}
        </span>
        <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-medium', SOFT)}>{locale === 'ar' ? 'الموعد: ديسمبر' : 'Deadline: December'}</span>
      </div>
    </div>
  );
}

/** Where to apply: company career pages by sector + dated career days. */
export function OpportunitiesCard({ locale, className }: { locale: Loc; className?: string }) {
  const cos = ['PIF', 'KAPSARC', 'ACWA Power', 'Sanabil', 'NEOM'];
  return (
    <div className={cn(CARD, EDGE, 'p-5', className)}>
      <Eyebrow>{locale === 'ar' ? 'الفرص' : 'Opportunities'}</Eyebrow>
      <div className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-stone-400">{locale === 'ar' ? 'صفحات التوظيف' : 'Company career pages'}</div>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {cos.map((c) => (
          <span key={c} className={cn('rounded-full px-2.5 py-1 text-[12px] font-medium', SOFT)}>{c}</span>
        ))}
      </div>
      <div className={cn(INSET, 'mt-3 flex items-center gap-2.5 p-2.5')}>
        <CalendarDays className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-300" />
        <span className="text-[13px] text-stone-700 dark:text-stone-200">24 Fintech</span>
        <span className="text-[12px] text-stone-400">· {locale === 'ar' ? 'سبتمبر 2026 · الرياض' : 'September 2026 · Riyadh'}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ browser frame -- */

export function BrowserFrame({ url = 'massar-sigma.vercel.app', children, className }: { url?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('overflow-hidden rounded-2xl border border-stone-200/80 bg-white/70 shadow-[0_30px_80px_-40px_rgba(28,25,23,0.5)] backdrop-blur dark:border-white/10 dark:bg-[#0f0f12]', className)}>
      <div className="flex items-center gap-2 border-b border-stone-200/70 px-3 py-2 dark:border-white/10">
        <span className="h-2.5 w-2.5 rounded-full bg-stone-300 dark:bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-stone-300 dark:bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-stone-300 dark:bg-white/15" />
        <span className={cn('mx-auto truncate rounded-md px-3 py-0.5 text-[11px] text-stone-400', SOFT)}>{url}</span>
      </div>
      <div className="p-3 sm:p-4">{children}</div>
    </div>
  );
}

/** A full dashboard exhibit: a browser frame around a compact bento of the product. */
export function DashboardPreview({ locale, className }: { locale: Loc; className?: string }) {
  return (
    <BrowserFrame className={className}>
      <div className="grid gap-3 sm:grid-cols-2">
        <ScoreCard locale={locale} className="sm:col-span-2" />
        <PathsCard locale={locale} />
        <ContactsCard locale={locale} />
      </div>
    </BrowserFrame>
  );
}

/* -------------------------------------------------------------------- data -- */

export const TARGET_COMPANIES = ['PIF', 'Aramco', 'NEOM', 'KAPSARC', 'SABIC', 'ACWA Power', 'stc', 'McKinsey', 'Sanabil', 'Ministry of Energy'];

export const PRICING: {
  id: 'starter' | 'pro';
  name: { ar: string; en: string };
  price: number;
  blurb: { ar: string; en: string };
  popular?: boolean;
  features: { ar: string; en: string }[];
}[] = [
  {
    id: 'starter',
    name: { ar: 'الأساسية', en: 'Starter' },
    price: 199,
    blurb: { ar: 'ابدأ بثقة', en: 'Start with confidence' },
    features: [
      { ar: '3 مسارات مهنية', en: '3 career paths' },
      { ar: 'درجة تنافسية لكل مستوى', en: 'Per level competitiveness score' },
      { ar: '150 جهة اتصال + 150 من الموارد البشرية', en: '150 connections + 150 HR contacts' },
      { ar: 'خارطة شهادات هدف', en: 'Hadaf certifications roadmap' },
    ],
  },
  {
    id: 'pro',
    name: { ar: 'الاحترافية', en: 'Pro' },
    price: 350,
    blurb: { ar: 'تغطية أوسع وأهداف أكثر', en: 'Wider coverage, more targets' },
    popular: true,
    features: [
      { ar: '5 مسارات مهنية', en: '5 career paths' },
      { ar: '300 جهة اتصال + 300 من الموارد البشرية', en: '300 connections + 300 HR contacts' },
      { ar: 'صفحتا الدراسة والفرص', en: 'The Study and Opportunities pages' },
      { ar: 'كل ميزات الأساسية', en: 'Everything in Starter' },
    ],
  },
];

export const STATS: { n: string; label: { ar: string; en: string } }[] = [
  { n: '250+', label: { ar: 'طلب بدون رد حقيقي', en: 'applications with no real reply' } },
  { n: '75%', label: { ar: 'من السير تتفلتر آليًا قبل ما يشوفها بشر', en: 'of CVs auto filtered before a human looks' } },
  { n: '1,209', label: { ar: 'جهة موارد بشرية في قاعدتنا', en: 'HR contacts in our database' } },
];

export { pick };

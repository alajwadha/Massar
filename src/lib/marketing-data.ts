// Pure marketing design tokens, the pick() helper, and the pricing/stats data.
// This module has NO 'use client' and no React hooks, so it is safe to import from
// BOTH the client marketing components (via components/marketing/shared, which
// re-exports everything here) AND from Server Components such as the checkout pages.
// Importing data/functions from a 'use client' module into a Server Component turns
// them into client references and throws at runtime ("call find() from the server"),
// which is why these live here.

import type { Loc } from '@/lib/app-data';

export const SPRING = { type: 'spring', stiffness: 420, damping: 34, mass: 0.8 } as const;
export const EASE = [0.16, 1, 0.3, 1] as const;

export const PAGE = 'min-h-dvh bg-[#f7f6f2] text-stone-900 antialiased dark:bg-[#0a0a0b] dark:text-stone-100';

// Liquid glass: a frosted, translucent panel with a top sheen, soft ring and deep
// shadow. It reads as glass over the ambient color wash behind the page.
export const CARD =
  'relative overflow-hidden rounded-[22px] border border-white/70 bg-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_2px_6px_rgba(28,25,23,0.05),0_28px_64px_-32px_rgba(28,25,23,0.40)] backdrop-blur-2xl ring-1 ring-stone-900/[0.04] dark:border-white/[0.12] dark:bg-white/[0.07] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_28px_60px_-32px_rgba(0,0,0,0.92)] dark:ring-white/[0.05]';
export const EDGE =
  'before:pointer-events-none before:absolute before:inset-x-5 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/70 before:to-transparent dark:before:via-white/25';
export const INSET = 'rounded-2xl border border-white/60 bg-white/45 backdrop-blur-md dark:border-white/[0.08] dark:bg-white/[0.05]';
export const PILL = 'bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white';
export const GHOST =
  'border border-stone-300/70 bg-white/60 backdrop-blur-md text-stone-500 hover:border-stone-400 hover:text-stone-900 dark:border-white/10 dark:bg-white/[0.06] dark:text-stone-300 dark:hover:border-white/25 dark:hover:text-white';
export const SOFT = 'bg-stone-900/[0.05] text-stone-600 dark:bg-white/[0.07] dark:text-stone-300';
export const ACCENT = 'text-amber-700 dark:text-amber-300';

export const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export const pick = (s: { ar: string; en: string }, l: Loc) => s[l];

/* -------------------------------------------------------------------- data -- */

export const TARGET_COMPANIES = ['Aramco', 'stc', 'NEOM', 'PIF', 'SNB', 'noon', 'Qiddiya', 'Almarai', 'Saudia', 'Mobily'];

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
    blurb: { ar: 'بداية قوية', en: 'A strong start' },
    features: [
      { ar: '3 مسارات مهنية تناسب خلفيتك', en: '3 career paths matched to your background' },
      { ar: 'درجة تنافسية صريحة لكل مستوى', en: 'An honest competitiveness score per level' },
      { ar: 'خارطة شهادات هدف بترتيب الأثر', en: 'A Hadaf certifications roadmap, ordered by impact' },
      { ar: '150 جهة من شبكتك + 150 من مسؤولي التوظيف', en: '150 from your network + 150 recruiters' },
      { ar: 'رسائل جاهزة وروابط مباشرة لحساباتهم', en: 'Ready messages and direct links to their profiles' },
    ],
  },
  {
    id: 'pro',
    name: { ar: 'الاحترافية', en: 'Pro' },
    price: 349,
    blurb: { ar: 'تغطية أوسع وأبواب أكثر', en: 'Wider coverage, more doors' },
    popular: true,
    features: [
      { ar: 'كل شي في الأساسية وزيادة', en: 'Everything in Starter, and more' },
      { ar: '5 مسارات مهنية كاملة', en: '5 full career paths' },
      { ar: '300 جهة من شبكتك + 300 من مسؤولي التوظيف', en: '300 from your network + 300 recruiters' },
      { ar: 'صفحة الدراسات العليا وأهلية الابتعاث', en: 'A graduate study page with scholarship eligibility' },
      { ar: 'صفحة المصادر: بوابات وشركات وأيام مهنية', en: 'A resources page: portals, companies and career days' },
      { ar: 'رسائل جاهزة وروابط مباشرة لحساباتهم', en: 'Ready messages and direct links to their profiles' },
    ],
  },
];

export const STATS: { n: string; label: { ar: string; en: string } }[] = [
  { n: '250+', label: { ar: 'طلب بدون رد حقيقي', en: 'applications with no real reply' } },
  { n: '75%', label: { ar: 'من السير تتفلتر آليًا قبل ما يشوفها بشر', en: 'of CVs auto filtered before a human looks' } },
  { n: '1,209', label: { ar: 'جهة موارد بشرية في قاعدتنا', en: 'HR contacts in our database' } },
];

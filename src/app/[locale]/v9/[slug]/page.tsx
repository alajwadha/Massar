import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Instrument_Serif } from 'next/font/google';
import type { Viewport } from 'next';
import { PlanProvider } from '@/components/app/plan-context';
import { V9 } from '@/components/v9/v9';
import { getPlan, plans } from '@/lib/app-data';
import { withHr } from '@/lib/hr-db';

// v9: a bold free-reimagining of the customer dashboard, forked from v2 so it keeps
// the Safari/a11y/score-gauge engineering. Built via the v9/v10 design loop; the
// live /c page is untouched.
export const viewport: Viewport = { width: 'device-width', initialScale: 1, maximumScale: 5, viewportFit: 'cover' };

const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' });

export function generateStaticParams() {
  return Object.keys(plans).map((slug) => ({ slug }));
}

export default function V9Page({ params: { locale, slug } }: { params: { locale: string; slug: string } }) {
  setRequestLocale(locale);
  const plan = getPlan(slug);
  if (!plan) notFound();
  return (
    <div className={serif.variable}>
      <PlanProvider plan={withHr(plan)}>
        <V9 />
      </PlanProvider>
    </div>
  );
}

import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Instrument_Serif } from 'next/font/google';
import { PlanProvider } from '@/components/app/plan-context';
import { V4 } from '@/components/v4/v4';
import { getPlan, plans } from '@/lib/app-data';
import { withHr } from '@/lib/hr-db';

// v4 "Atlas": an editorial bento take on the same CustomerPlan, at its own link.
// v1 (/c), v2 (/studio), v3 (/glass) are untouched; all four share the data layer.
// The Instrument Serif display face is loaded here and exposed as --font-serif on a
// wrapper, so it is scoped to v4 and never affects the other designs.
const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

export function generateStaticParams() {
  return Object.keys(plans).map((slug) => ({ slug }));
}

export default function V4Page({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(locale);
  const plan = getPlan(slug);
  if (!plan) notFound();

  return (
    <div className={serif.variable}>
      <PlanProvider plan={withHr(plan)}>
        <V4 />
      </PlanProvider>
    </div>
  );
}

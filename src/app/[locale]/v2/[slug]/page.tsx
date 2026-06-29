import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Instrument_Serif } from 'next/font/google';
import { PlanProvider } from '@/components/app/plan-context';
import { V2 } from '@/components/v2/v2';
import { getPlan, plans } from '@/lib/app-data';
import type { Viewport } from 'next';
import { withHr } from '@/lib/hr-db';

// v2 sets viewport-fit cover so env(safe-area-inset-*) actually resolves on notched
// iPhones. Scoped to /v2 only, so the live /c v4 page keeps its default viewport.
export const viewport: Viewport = { width: 'device-width', initialScale: 1, maximumScale: 5, viewportFit: 'cover' };

// v2: an elevated, iPhone-Safari-first iteration of the customer dashboard, cloned
// from v4 so the design-improvement loop can polish it in isolation. The live
// /c/<slug> page keeps rendering v4 and is never touched until v2 is promoted.
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

export default function V2Page({
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
        <V2 />
      </PlanProvider>
    </div>
  );
}

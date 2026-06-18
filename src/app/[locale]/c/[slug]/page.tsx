import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Instrument_Serif } from 'next/font/google';
import { PlanProvider } from '@/components/app/plan-context';
import { V4 } from '@/components/v4/v4';
import { getPlan, plans } from '@/lib/app-data';
import { withHr } from '@/lib/hr-db';

// Each customer's private link, now serving the approved v4 "Atlas" design as the
// main product. The slug selects one CustomerPlan and the page renders only that
// person's data, so customers stay fully separated. Unknown slugs 404. v4 is also
// reachable at /v4/<slug> (alias). The Instrument Serif display face is loaded here
// and scoped via --font-serif so it never affects other pages.
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

export default function CustomerPlanPage({
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

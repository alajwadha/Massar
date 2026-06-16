import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { PlanProvider } from '@/components/app/plan-context';
import { Studio } from '@/components/studio/studio';
import { getPlan, plans } from '@/lib/app-data';
import { withHr } from '@/lib/hr-db';

// v2: a from-scratch, dark-first modern dashboard for the same CustomerPlan, at its
// own link. v1 (/c/<slug>) is untouched. Reuses the data + state layer entirely.
export function generateStaticParams() {
  return Object.keys(plans).map((slug) => ({ slug }));
}

export default function StudioPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(locale);
  const plan = getPlan(slug);
  if (!plan) notFound();

  return (
    <PlanProvider plan={withHr(plan)}>
      <Studio />
    </PlanProvider>
  );
}

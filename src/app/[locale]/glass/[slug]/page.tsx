import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { PlanProvider } from '@/components/app/plan-context';
import { Glass3 } from '@/components/glass/glass';
import { getPlan, plans } from '@/lib/app-data';
import { withHr } from '@/lib/hr-db';

// v3: a minimalist Apple-style liquid-glass take on the same CustomerPlan, at its
// own link. v1 (/c) and v2 (/studio) are untouched; all three share the data layer.
export function generateStaticParams() {
  return Object.keys(plans).map((slug) => ({ slug }));
}

export default function GlassPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(locale);
  const plan = getPlan(slug);
  if (!plan) notFound();

  return (
    <PlanProvider plan={withHr(plan)}>
      <Glass3 />
    </PlanProvider>
  );
}

import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Dashboard } from '@/components/app/dashboard';
import { PlanProvider } from '@/components/app/plan-context';
import { AppShell } from '@/components/app/app-shell';
import { getPlan, plans } from '@/lib/app-data';
import { withHr } from '@/lib/hr-db';

// Each customer's private link. The slug selects one CustomerPlan and the whole
// dashboard renders only that person's data, so customers are fully separated
// from one another. Unknown slugs 404. (Later the plan is fetched from the DB.)
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
    <AppShell homeHref={`/c/${slug}`}>
      <PlanProvider plan={withHr(plan)}>
        <Dashboard />
      </PlanProvider>
    </AppShell>
  );
}

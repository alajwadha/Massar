import { setRequestLocale } from 'next-intl/server';
import { Dashboard } from '@/components/app/dashboard';
import { PlanProvider } from '@/components/app/plan-context';
import { aliPlan } from '@/lib/app-data';

// Public demo of the product. It renders the first real CustomerPlan (Ali's) as
// the showcase. Each real customer gets their own isolated copy at /c/<slug>.
export default function AppHome({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  return (
    <PlanProvider plan={aliPlan}>
      <Dashboard />
    </PlanProvider>
  );
}

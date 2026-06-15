import { setRequestLocale } from 'next-intl/server';
import { Dashboard } from '@/components/app/dashboard';

// The product: the customer's personalised career-plan dashboard (paths,
// certifications with Hadaf reimbursement, target contacts, outreach messages,
// and a progress tracker). Demo data lives in src/lib/app-data.ts.
export default function AppHome({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  return <Dashboard />;
}

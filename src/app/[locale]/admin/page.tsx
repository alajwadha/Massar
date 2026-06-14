import { setRequestLocale } from 'next-intl/server';
import { loadHrContacts, computeStats } from '@/lib/hr-data';
import { HrDashboard } from '@/components/admin/hr-dashboard';

export default function AdminHrPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const contacts = loadHrContacts();
  const stats = computeStats(contacts);
  return <HrDashboard contacts={contacts} stats={stats} locale={locale} />;
}

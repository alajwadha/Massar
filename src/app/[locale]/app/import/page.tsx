import { redirect } from 'next/navigation';

// The LinkedIn-network import now lives inline in the Contacts → Connections
// empty state (client-side CSV parsing). Keep this route as a redirect so any
// older link still lands on the working flow.
export default function ImportPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  redirect(`/${locale}/app`);
}

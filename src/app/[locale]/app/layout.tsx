import { setRequestLocale } from 'next-intl/server';
import { AppShell } from '@/components/app/app-shell';

// Public demo dashboard chrome. Per-customer pages live at /c/<slug> and reuse
// the same AppShell. Auth gating is a later phase; this is the chrome the
// customer sees once inside.
export default function AppLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  setRequestLocale(locale);
  return <AppShell homeHref="/app">{children}</AppShell>;
}

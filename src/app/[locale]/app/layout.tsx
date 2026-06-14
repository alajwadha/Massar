import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { LocaleSwitcher } from '@/components/locale-switcher';

// Dashboard shell. Auth gating is added in Phase 1 (step 2); for now this is the
// app chrome the customer sees once inside.
export default function AppLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  setRequestLocale(locale);

  return (
    <div className="min-h-dvh bg-canvas">
      <header className="sticky top-0 z-50 border-b border-line/70 bg-canvas/80 backdrop-blur-md">
        <div className="container-page flex h-16 items-center justify-between">
          <Link href="/app" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-600 text-white font-extrabold">
              م
            </span>
            <span className="text-lg font-extrabold tracking-tight">مسار</span>
          </Link>
          <LocaleSwitcher />
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}

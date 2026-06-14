import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { LocaleSwitcher } from '@/components/locale-switcher';

// Internal admin shell. Auth gating (admin-only) is added with Supabase in
// Phase 1; for now this is the founder-facing data view.
export default function AdminLayout({
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
          <Link href="/admin" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-ink text-white font-extrabold">
              م
            </span>
            <span className="text-sm font-bold tracking-tight">
              {locale === 'ar' ? 'مسار · الإدارة' : 'Masaar · Admin'}
            </span>
          </Link>
          <LocaleSwitcher />
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}

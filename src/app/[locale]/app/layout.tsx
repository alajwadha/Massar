import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { LocaleSwitcher } from '@/components/locale-switcher';

// Dashboard shell with a liquid-glass ambient backdrop. Auth gating is added in
// Phase 1; for now this is the chrome the customer sees once inside.
export default function AppLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  setRequestLocale(locale);

  return (
    <div className="relative min-h-dvh bg-canvas">
      {/* Liquid-glass ambient backdrop: soft color blobs for the glass to refract. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -end-24 h-[28rem] w-[28rem] rounded-full bg-brand-400/25 blur-3xl" />
        <div className="absolute top-1/3 -start-28 h-[26rem] w-[26rem] rounded-full bg-sky-300/25 blur-3xl" />
        <div className="absolute -bottom-24 end-1/4 h-[24rem] w-[24rem] rounded-full bg-violet-300/20 blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/40 bg-white/50 backdrop-blur-xl backdrop-saturate-150">
        <div className="container-page flex h-16 items-center justify-between">
          <Link href="/app" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-600 text-white font-extrabold shadow-soft">
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

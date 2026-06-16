import { type ReactNode } from 'react';
import { Link } from '@/i18n/routing';
import { LocaleSwitcher } from '@/components/locale-switcher';

// The liquid-glass dashboard chrome (ambient backdrop + sticky header), shared by
// the public demo at /app and every customer page at /c/<slug>. `homeHref` keeps
// the logo pointing back at the page the visitor is actually on.
export function AppShell({ children, homeHref = '/app' }: { children: ReactNode; homeHref?: string }) {
  return (
    <div className="relative min-h-dvh bg-canvas">
      {/* Liquid-glass aurora backdrop: a colorful base for the glass to refract. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-canvas to-sky-50" />
        <div className="absolute -top-24 -end-20 h-[34rem] w-[34rem] rounded-full bg-brand-400/40 blur-[110px]" />
        <div className="absolute top-1/4 -start-24 h-[30rem] w-[30rem] rounded-full bg-sky-400/30 blur-[110px]" />
        <div className="absolute bottom-0 start-1/3 h-[30rem] w-[30rem] rounded-full bg-violet-400/25 blur-[110px]" />
        <div className="absolute top-1/2 end-1/4 h-[24rem] w-[24rem] rounded-full bg-amber-300/30 blur-[110px]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/40 bg-white/40 backdrop-blur-2xl backdrop-saturate-[1.8]">
        <div className="container-page flex h-16 items-center justify-between">
          <Link href={homeHref} className="flex items-center gap-2">
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

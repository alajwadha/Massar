import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Users, FileText, Gauge, ArrowRight } from 'lucide-react';

// Minimal dashboard index. Real cards (score, roadmap, targets) are wired in
// Phase 1 once data exists; for now it routes to the connections import guide.
export default async function AppHome({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'import' });

  return (
    <div className="container-page py-10 sm:py-14">
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">مسار</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/app/import"
          className="group rounded-2xl border border-line bg-canvas-raised p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
        >
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-700 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
            <Users className="h-5 w-5" />
          </div>
          <h2 className="mt-4 flex items-center gap-1.5 text-lg font-bold">
            {t('eyebrow')}
            <ArrowRight className="h-4 w-4 text-ink-muted transition-transform duration-200 group-hover:translate-x-1 ltr:rotate-180 ltr:group-hover:-translate-x-1" />
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{t('subtitle')}</p>
        </Link>

        <div className="rounded-2xl border border-line bg-canvas-raised p-6 opacity-60">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-ink/5 text-ink-muted">
            <Gauge className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-ink-soft">CV Score</h2>
          <p className="mt-1.5 text-sm text-ink-muted">Soon</p>
        </div>

        <div className="rounded-2xl border border-line bg-canvas-raised p-6 opacity-60">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-ink/5 text-ink-muted">
            <FileText className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-ink-soft">CV &amp; Roadmap</h2>
          <p className="mt-1.5 text-sm text-ink-muted">Soon</p>
        </div>
      </div>
    </div>
  );
}

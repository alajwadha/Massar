'use client';

import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line/70 bg-canvas py-10">
      <div className="container-page flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-600 text-sm font-extrabold text-white">
            م
          </span>
          <span className="text-sm text-ink-soft">{t('tagline')}</span>
        </div>
        <p className="text-xs text-ink-muted">
          © {year} مسار · {t('rights')}
        </p>
      </div>
    </footer>
  );
}

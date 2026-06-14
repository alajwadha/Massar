'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { LocaleSwitcher } from '@/components/locale-switcher';

export function Header() {
  const t = useTranslations('nav');

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 border-b border-line/70 bg-canvas/80 backdrop-blur-md"
    >
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-600 text-white font-extrabold">
            م
          </span>
          <span className="text-lg font-extrabold tracking-tight">مسار</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <a href="#features" className="text-sm text-ink-soft transition-colors hover:text-ink">
            {t('features')}
          </a>
          <a href="#score" className="text-sm text-ink-soft transition-colors hover:text-ink">
            {t('score')}
          </a>
          <a href="#pricing" className="text-sm text-ink-soft transition-colors hover:text-ink">
            {t('pricing')}
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <Button size="md" className="hidden sm:inline-flex">
            {t('start')}
          </Button>
        </div>
      </div>
    </motion.header>
  );
}

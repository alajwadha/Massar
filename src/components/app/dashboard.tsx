'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Compass, GraduationCap, Users, Send, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { profile, ui, type Loc } from '@/lib/app-data';
import { OverviewSection } from './overview';
import { PathsSection } from './paths';
import { CertificationsSection } from './certifications';
import { ContactsSection } from './contacts';
import { MessagesSection } from './messages';
import { TrackerSection } from './tracker';

export type TabId = 'overview' | 'paths' | 'certs' | 'contacts' | 'messages' | 'tracker';

const EASE = [0.16, 1, 0.3, 1] as const;

const TABS = [
  { id: 'overview', Icon: LayoutDashboard },
  { id: 'paths', Icon: Compass },
  { id: 'certs', Icon: GraduationCap },
  { id: 'contacts', Icon: Users },
  { id: 'messages', Icon: Send },
  { id: 'tracker', Icon: Activity },
] as const;

export function Dashboard() {
  const locale = useLocale() as Loc;
  const [tab, setTab] = useState<TabId>('overview');

  // Tabs are deep-linkable via the URL hash (e.g. /app#contacts) so a section
  // can be shared or linked to directly.
  useEffect(() => {
    const h = window.location.hash.slice(1);
    if (TABS.some((t) => t.id === h)) setTab(h as TabId);
  }, []);

  const select = (id: TabId) => {
    setTab(id);
    if (typeof window !== 'undefined') window.history.replaceState(null, '', `#${id}`);
  };

  return (
    <div className="container-page py-6 sm:py-8">
      {/* Welcome band */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-lg font-extrabold text-white shadow-soft">
            {profile.name[locale].charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-ink-muted">{ui.shell.greeting[locale]} 👋</div>
            <div className="truncate text-lg font-extrabold tracking-tight">{profile.name[locale]}</div>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span className="rounded-full bg-brand-600 px-2.5 py-1 text-[11px] font-bold text-white">
            {ui.shell.plan[locale]}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-ink-muted">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500" />
            {ui.shell.demoBadge[locale]}
          </span>
        </div>
      </div>

      {/* Sticky section nav */}
      <div className="sticky top-16 z-40 -mx-5 mt-6 border-b border-line bg-canvas/85 px-5 backdrop-blur-md sm:-mx-8 sm:px-8">
        <div className="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => select(t.id)}
                className={cn(
                  'relative flex shrink-0 items-center gap-2 px-3.5 py-3.5 text-sm font-semibold transition-colors',
                  active ? 'text-brand-700' : 'text-ink-muted hover:text-ink',
                )}
              >
                <t.Icon className="h-4 w-4" />
                <span>{ui.nav[t.id][locale]}</span>
                {active && (
                  <motion.span
                    layoutId="app-tab-underline"
                    className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand-600"
                    transition={{ duration: 0.3, ease: EASE }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Section content */}
      <div className="py-7">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            {tab === 'overview' && <OverviewSection locale={locale} onNavigate={select} />}
            {tab === 'paths' && <PathsSection locale={locale} />}
            {tab === 'certs' && <CertificationsSection locale={locale} />}
            {tab === 'contacts' && <ContactsSection locale={locale} />}
            {tab === 'messages' && <MessagesSection locale={locale} />}
            {tab === 'tracker' && <TrackerSection locale={locale} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

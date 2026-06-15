'use client';

import { Sparkles, ArrowLeft, GraduationCap, BadgeCheck } from 'lucide-react';
import { journey, contacts, financeCerts, ui, type Loc } from '@/lib/app-data';
import { ProgressRing, Counter, SectionHeading, Stagger, StaggerItem } from './ui';
import { ContactCard } from './contacts';
import type { TabId } from './dashboard';

export function OverviewSection({
  locale,
  onNavigate,
}: {
  locale: Loc;
  onNavigate: (id: TabId) => void;
}) {
  const priority = contacts.filter((c) => c.priority).slice(0, 3);
  const current = financeCerts.find((c) => c.status === 'current');

  return (
    <div>
      <SectionHeading
        eyebrow={ui.overview.eyebrow[locale]}
        title={ui.overview.title[locale]}
      />

      {/* Career journey hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 p-6 text-white shadow-lift sm:p-7">
        <div aria-hidden className="pointer-events-none absolute -end-16 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -start-10 h-52 w-52 rounded-full bg-brand-400/20 blur-2xl" />
        <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
          <ProgressRing value={journey.percent} color="#ffffff" track="rgba(255,255,255,0.22)">
            <div className="leading-none">
              <Counter to={journey.percent} suffix="%" className="text-3xl font-extrabold" />
              <div className="mt-1 text-[10px] font-medium text-white/75">
                {ui.overview.journeyLabel[locale]}
              </div>
            </div>
          </ProgressRing>

          <div className="w-full flex-1">
            <div className="text-sm font-semibold text-white/90">{ui.shell.journey[locale]}</div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div>
                <div className="text-2xl font-extrabold">
                  <Counter to={journey.certsDone} suffix={`/${journey.certsTotal}`} />
                </div>
                <div className="mt-0.5 text-[11px] text-white/75">{ui.overview.certsLabel[locale]}</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold">
                  <Counter to={journey.messagesSent} />
                </div>
                <div className="mt-0.5 text-[11px] text-white/75">{ui.overview.sentLabel[locale]}</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold">
                  <Counter to={journey.replies} />
                </div>
                <div className="mt-0.5 text-[11px] text-white/75">{ui.overview.repliesLabel[locale]}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's move */}
      <div className="mt-4 flex items-start gap-3 rounded-2xl border border-brand-100 bg-brand-50/70 p-4">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-brand-600 shadow-soft">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-brand-700">{ui.overview.tipTitle[locale]}</h4>
          <p className="mt-0.5 text-[13px] leading-relaxed text-ink-soft">{ui.overview.tip[locale]}</p>
        </div>
      </div>

      {/* Current certification */}
      {current && (
        <button
          type="button"
          onClick={() => onNavigate('certs')}
          className="group mt-4 flex w-full items-center gap-4 rounded-2xl border border-line bg-canvas-raised p-4 text-start shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
        >
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
              {ui.overview.nextCert[locale]}
            </div>
            <div className="mt-0.5 truncate font-bold">{current.name}</div>
            {current.hadafNote && (
              <div className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-brand-700">
                <BadgeCheck className="h-3.5 w-3.5" />
                {current.hadafNote[locale]}
              </div>
            )}
          </div>
          <ArrowLeft className="h-5 w-5 shrink-0 text-ink-muted transition-transform group-hover:-translate-x-1 ltr:rotate-180 ltr:group-hover:translate-x-1" />
        </button>
      )}

      {/* Today's actions */}
      <div className="mt-8 mb-4 flex items-end justify-between gap-3">
        <div>
          <h3 className="text-lg font-extrabold tracking-tight">{ui.overview.actionsTitle[locale]}</h3>
          <p className="mt-0.5 text-sm text-ink-muted">{ui.overview.actionsSub[locale]}</p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('contacts')}
          className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-900 sm:inline-flex"
        >
          {ui.overview.viewAll[locale]}
          <ArrowLeft className="h-4 w-4 ltr:rotate-180" />
        </button>
      </div>

      <Stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {priority.map((c) => (
          <StaggerItem key={c.id}>
            <ContactCard contact={c} locale={locale} />
          </StaggerItem>
        ))}
      </Stagger>

      <button
        type="button"
        onClick={() => onNavigate('contacts')}
        className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-line bg-canvas-raised py-3 text-sm font-semibold text-brand-700 shadow-soft hover:border-ink/20 sm:hidden"
      >
        {ui.overview.viewAll[locale]}
        <ArrowLeft className="h-4 w-4 ltr:rotate-180" />
      </button>
    </div>
  );
}

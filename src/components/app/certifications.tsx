'use client';

import { type ReactNode } from 'react';
import { Check, BadgeCheck, Wallet, Clock, Lightbulb, TrendingUp, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ui, type Cert, type Loc } from '@/lib/app-data';
import { SectionHeading, Stagger, StaggerItem } from './ui';

const BANNER_TITLE = {
  ar: (n: number, t: number) => `${n} من ${t} شهادات يدعمها هدف`,
  en: (n: number, t: number) => `${n} of ${t} certifications are Hadaf-supported`,
};

type DisplayStatus = Cert['status'];

function StatusChip({ status, locale }: { status: DisplayStatus; locale: Loc }) {
  const map = {
    done: { cls: 'bg-brand-50 text-brand-700', label: ui.certs.done[locale] },
    current: { cls: 'bg-brand-600 text-white', label: ui.certs.current[locale] },
    future: { cls: 'bg-ink/5 text-ink-muted', label: ui.certs.next[locale] },
  }[status];
  return <span className={cn('rounded-md px-2 py-0.5 text-[10px] font-bold', map.cls)}>{map.label}</span>;
}

function Tag({ tone, icon: Icon, children }: { tone: 'hadaf' | 'cost' | 'time'; icon: typeof Wallet; children: ReactNode }) {
  const cls = {
    hadaf: 'bg-brand-50 text-brand-700',
    cost: 'bg-amber-50 text-amber-700',
    time: 'border border-white/60 bg-white/40 text-ink-muted',
  }[tone];
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold', cls)}>
      <Icon className="h-3 w-3" />
      {children}
    </span>
  );
}

function Dot({ status }: { status: DisplayStatus }) {
  return (
    <span className="absolute start-0 top-4 grid h-8 w-8 place-items-center rounded-full border-4 border-canvas">
      {status === 'done' && (
        <span className="grid h-full w-full place-items-center rounded-full bg-brand-600 text-white">
          <Check className="h-4 w-4" strokeWidth={3} />
        </span>
      )}
      {status === 'current' && (
        <span className="relative grid h-full w-full place-items-center rounded-full bg-brand-600">
          <span className="absolute inset-0 animate-ping rounded-full bg-brand-400 opacity-60" />
          <span className="relative h-2 w-2 rounded-full bg-white" />
        </span>
      )}
      {status === 'future' && <span className="h-full w-full rounded-full border-2 border-line bg-white/70" />}
    </span>
  );
}

function CertCard({
  cert,
  locale,
  display,
  done,
  onToggle,
}: {
  cert: Cert;
  locale: Loc;
  display: DisplayStatus;
  done: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={cn(
        'glass rounded-2xl p-4',
        display === 'current' && 'ring-1 ring-brand-200',
        display === 'future' && 'opacity-80',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="font-extrabold">{cert.name[locale]}</h3>
          <StatusChip status={display} locale={locale} />
        </div>
        <span className="inline-flex shrink-0 items-baseline gap-1 rounded-lg bg-brand-600 px-2 py-1 text-white">
          <span className="text-sm font-extrabold tabular-nums">+{cert.scoreAdd}</span>
          <span className="text-[9px] font-semibold opacity-90">{ui.certs.scoreAdd[locale]}</span>
        </span>
      </div>

      <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">{cert.desc[locale]}</p>

      <div className="mt-2.5 flex items-start gap-1.5">
        <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" />
        <p className="text-[12.5px] leading-relaxed">
          <span className="font-semibold text-ink">{ui.certs.gain[locale]}: </span>
          <span className="text-ink-soft">{cert.gain[locale]}</span>
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {cert.hadaf && (
          <Tag tone="hadaf" icon={BadgeCheck}>
            {ui.certs.hadaf[locale]}
          </Tag>
        )}
        <Tag tone="cost" icon={Wallet}>
          {cert.cost[locale]}
        </Tag>
        <Tag tone="time" icon={Clock}>
          {cert.duration[locale]}
        </Tag>
      </div>

      {cert.hadafNote && display !== 'done' && (
        <div className="mt-3 rounded-xl bg-brand-50/80 px-3 py-2 text-xs font-semibold text-brand-700">
          {cert.hadafNote[locale]}
        </div>
      )}

      {cert.why && (
        <div className="mt-3 flex items-start gap-2 border-t border-white/40 pt-3">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <p className="text-xs leading-relaxed text-ink-soft">
            <span className="font-bold text-ink">{ui.certs.whyNow[locale]} </span>
            {cert.why[locale]}
          </p>
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <a
          href={cert.official}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/60 bg-white/40 px-3 py-2.5 text-[13px] font-semibold text-ink-soft transition-colors hover:text-ink"
        >
          <ExternalLink className="h-4 w-4" />
          {ui.certs.official[locale]}
        </a>
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            'flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-[13px] font-bold transition-colors',
            done ? 'bg-brand-600 text-white hover:bg-brand-700' : 'border border-white/60 bg-white/40 text-ink-soft hover:text-ink',
          )}
        >
          <Check className="h-4 w-4" />
          {done ? ui.certs.markedDone[locale] : ui.certs.markDone[locale]}
        </button>
      </div>
    </div>
  );
}

function CertRow({ cert, locale, done, onToggle }: { cert: Cert; locale: Loc; done: boolean; onToggle: () => void }) {
  const display: DisplayStatus = done ? 'done' : cert.status === 'done' ? 'future' : cert.status;
  return (
    <div className="relative ps-11">
      <Dot status={display} />
      <CertCard cert={cert} locale={locale} display={display} done={done} onToggle={onToggle} />
    </div>
  );
}

export function CertificationsSection({
  certs,
  locale,
  doneNames,
  onToggle,
}: {
  certs: Cert[];
  locale: Loc;
  doneNames: Set<string>;
  onToggle: (name: string) => void;
}) {
  const total = certs.length;
  const supported = certs.filter((c) => c.hadaf).length;

  return (
    <div>
      <SectionHeading title={ui.certs.title[locale]} sub={ui.certs.sub[locale]} />

      {supported > 0 && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-brand-100 bg-brand-50/70 p-4 backdrop-blur-sm">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-600 text-white shadow-soft">
            <BadgeCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-brand-700">{BANNER_TITLE[locale](supported, total)}</div>
            <div className="mt-0.5 text-xs text-ink-soft">{ui.certs.bannerSub[locale]}</div>
          </div>
        </div>
      )}

      <div className="relative">
        <div className="absolute bottom-4 top-4 start-[15px] w-0.5 bg-black/10" aria-hidden />
        <Stagger className="space-y-3">
          {certs.map((cert) => (
            <StaggerItem key={cert.name.en}>
              <CertRow cert={cert} locale={locale} done={doneNames.has(cert.name.en)} onToggle={() => onToggle(cert.name.en)} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </div>
  );
}

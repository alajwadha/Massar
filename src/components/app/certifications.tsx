'use client';

import { type ReactNode } from 'react';
import { Check, BadgeCheck, Wallet, Clock, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ui, type Cert, type Loc } from '@/lib/app-data';
import { SectionHeading, Stagger, StaggerItem } from './ui';

const BANNER_TITLE = {
  ar: (n: number, t: number) => `${n} من ${t} شهادات يدعمها هدف`,
  en: (n: number, t: number) => `${n} of ${t} certifications are Hadaf-supported`,
};

function StatusChip({ status, locale }: { status: Cert['status']; locale: Loc }) {
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

function Dot({ status }: { status: Cert['status'] }) {
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

function CertCard({ cert, locale }: { cert: Cert; locale: Loc }) {
  return (
    <div
      className={cn(
        'glass rounded-2xl p-4',
        cert.status === 'current' && 'ring-1 ring-brand-200',
        cert.status === 'future' && 'opacity-80',
      )}
    >
      <div className="flex items-center gap-2">
        <h3 className="font-extrabold" dir="ltr">{cert.name}</h3>
        <StatusChip status={cert.status} locale={locale} />
      </div>
      <p className="mt-1 text-[13px] text-ink-soft">{cert.desc[locale]}</p>

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

      {cert.hadafNote && cert.status !== 'done' && (
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
    </div>
  );
}

export function CertificationsSection({ certs, locale }: { certs: Cert[]; locale: Loc }) {
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
            <StaggerItem key={cert.name} className="relative ps-11">
              <Dot status={cert.status} />
              <CertCard cert={cert} locale={locale} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </div>
  );
}

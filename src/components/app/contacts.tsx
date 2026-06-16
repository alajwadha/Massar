'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Search,
  Users,
  Building2,
  Copy,
  Check,
  Shuffle,
  Linkedin,
  Crown,
  Sparkles,
  User,
  Upload,
  Network,
  Smartphone,
  Laptop,
  Info,
  X,
  Languages,
  PenLine,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  fillTemplate,
  linkedinUrl,
  rankConnections,
  planTargets,
  SECTOR_LABELS,
  TIER_LABELS,
  TIER_CAP,
  ui,
  type Contact,
  type ContactStatus,
  type CompanyTier,
  type Loc,
  type PickKind,
} from '@/lib/app-data';
import { usePlan } from './plan-context';
import { useNetwork, useProgress } from './dashboard-state';
import { Avatar, SectionHeading, Stagger, StaggerItem } from './ui';

const KIND: Record<PickKind, { cls: string; Icon: typeof Crown; key: 'kindTop' | 'kindMid' | 'kindCommon' }> = {
  top: { cls: 'bg-brand-50 text-brand-700', Icon: Crown, key: 'kindTop' },
  mid: { cls: 'bg-amber-50 text-amber-700', Icon: User, key: 'kindMid' },
  common: { cls: 'bg-violet-50 text-violet-700', Icon: Sparkles, key: 'kindCommon' },
};

// Manual outreach states shown as explicit buttons (default = New / none active).
const STATUS_BTNS: { key: ContactStatus; sk: 'status_sent' | 'status_replied' | 'status_followup'; active: string }[] = [
  { key: 'sent', sk: 'status_sent', active: 'bg-brand-600 text-white' },
  { key: 'replied', sk: 'status_replied', active: 'bg-sky-600 text-white' },
  { key: 'followup', sk: 'status_followup', active: 'bg-rose-600 text-white' },
];

export function ConnectionCard({
  contact: c,
  locale,
  kind,
  reason,
}: {
  contact: Contact;
  locale: Loc;
  kind?: PickKind;
  reason?: string;
}) {
  const { templates } = usePlan();
  const { statuses, setStatus } = useProgress();
  const [tpl, setTpl] = useState(0);
  const [copied, setCopied] = useState(false);
  const [msgLang, setMsgLang] = useState<Loc>(locale);

  const status = statuses[c.id] ?? c.status;
  const template = templates[tpl % templates.length];
  const message = fillTemplate(template.preview[msgLang], c, msgLang);
  const isRecruiter = Boolean(c.sector);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
    } catch {
      /* clipboard may be blocked; visual confirmation still fires */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const toggleStatus = (s: ContactStatus) => setStatus(c.id, status === s ? 'new' : s);

  return (
    <div
      className={cn(
        'glass glass-edge flex h-full flex-col rounded-2xl p-4 transition-shadow duration-300 hover:shadow-lift',
        kind === 'top' && 'ring-1 ring-brand-200',
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar initials={c.name[locale].charAt(0)} companyKey={c.companyKey} seed={c.company.en} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-[15px] font-bold leading-tight">{c.name[locale]}</h3>
            {isRecruiter && (
              <span className="shrink-0 rounded-full bg-sky-50/80 px-2 py-0.5 text-[10px] font-bold text-sky-700 ring-1 ring-inset ring-sky-100">
                {ui.contacts.recruiter[locale]}
              </span>
            )}
          </div>
          <p className="mt-1 truncate text-[13px] text-ink-soft">{c.role[locale]}</p>
          <p className="mt-0.5 truncate text-xs font-semibold text-brand-700">{c.company[locale]}</p>
        </div>
      </div>

      {/* HR category tags */}
      {isRecruiter && (c.sector || c.companyTier) && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {c.sector && SECTOR_LABELS[c.sector] && (
            <span className="rounded-md bg-ink/5 px-2 py-0.5 text-[10.5px] font-semibold text-ink-soft">
              {SECTOR_LABELS[c.sector][locale]}
            </span>
          )}
          {c.companyTier && (
            <span className="rounded-md bg-ink/5 px-2 py-0.5 text-[10.5px] font-semibold text-ink-muted">
              {TIER_LABELS[c.companyTier][locale]}
            </span>
          )}
        </div>
      )}

      {/* Why this connection (ranked from the uploaded network) */}
      {kind && reason && (
        <div className={cn('mt-3 flex items-start gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px]', KIND[kind].cls)}>
          {(() => {
            const I = KIND[kind].Icon;
            return <I className="mt-0.5 h-3 w-3 shrink-0" />;
          })()}
          <span>
            <span className="font-bold">{ui.paths[KIND[kind].key][locale]}</span> · {reason}
          </span>
        </div>
      )}

      {/* Manual status buttons */}
      <div className="mt-3 border-t border-white/40 pt-3">
        <div className="flex items-center gap-1.5">
          {STATUS_BTNS.map((b) => {
            const on = status === b.key;
            return (
              <button
                key={b.key}
                type="button"
                onClick={() => toggleStatus(b.key)}
                className={cn(
                  'flex-1 rounded-lg px-2 py-1.5 text-[11px] font-bold transition-colors',
                  on ? b.active : 'bg-white/50 text-ink-soft hover:text-ink',
                )}
              >
                {ui.contacts[b.sk][locale]}
              </button>
            );
          })}
        </div>
        <p className="mt-1.5 text-[10px] text-ink-muted">{ui.contacts.statusHint[locale]}</p>
      </div>

      {/* Advisory + ready message */}
      <div className="mt-3 flex-1">
        <div className="mb-1.5 flex items-start gap-1.5 rounded-lg bg-amber-50/70 px-2.5 py-1.5 text-[11px] leading-relaxed text-amber-800">
          <PenLine className="mt-0.5 h-3 w-3 shrink-0" />
          <span>{ui.contacts.handwrite[locale]}</span>
        </div>
        <div className="rounded-xl border border-white/50 bg-white/40 p-3">
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-ink-muted">
              {ui.contacts.messagePreview[locale]} · {template.title[locale]}
            </span>
            <button
              type="button"
              onClick={() => setMsgLang((l) => (l === 'ar' ? 'en' : 'ar'))}
              title={ui.contacts.msgLangHint[locale]}
              className="inline-flex items-center gap-1 rounded-md border border-white/60 bg-white/50 px-1.5 py-0.5 text-[10px] font-bold text-ink-soft transition-colors hover:text-ink"
            >
              <Languages className="h-3 w-3" />
              {msgLang === 'ar' ? 'EN' : 'ع'}
            </button>
          </div>
          <p
            dir={msgLang === 'ar' ? 'rtl' : 'ltr'}
            className="line-clamp-3 text-[12.5px] leading-relaxed text-ink-soft"
          >
            {message}
          </p>
        </div>
      </div>

      <div className="mt-2.5 flex gap-2">
        <button
          type="button"
          onClick={copy}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-[13px] font-bold transition-colors',
            copied ? 'bg-brand-50 text-brand-700' : 'bg-brand-600 text-white hover:bg-brand-700',
          )}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? ui.contacts.copied[locale] : ui.contacts.copy[locale]}
        </button>
        <button
          type="button"
          onClick={() => setTpl((i) => i + 1)}
          aria-label={ui.contacts.shuffle[locale]}
          title={ui.contacts.shuffle[locale]}
          className="grid w-11 shrink-0 place-items-center rounded-xl border border-white/60 bg-white/40 text-ink-soft transition-colors hover:text-ink"
        >
          <Shuffle className="h-4 w-4" />
        </button>
        <a
          href={linkedinUrl(c)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ui.contacts.linkedin[locale]}
          title={ui.contacts.linkedin[locale]}
          className="grid w-11 shrink-0 place-items-center rounded-xl border border-white/60 bg-white/40 text-[#0A66C2] transition-colors hover:bg-white/70"
        >
          <Linkedin className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

/* ------------------------------------------------------- network CSV panel -- */

function Steps({ title, Icon, steps }: { title: string; Icon: typeof Smartphone; steps: readonly string[] }) {
  return (
    <div className="rounded-xl border border-white/50 bg-white/40 p-3.5">
      <div className="flex items-center gap-2 text-sm font-bold">
        <Icon className="h-4 w-4 text-brand-600" />
        {title}
      </div>
      <ol className="mt-2.5 space-y-2">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-2 text-[12.5px] leading-relaxed text-ink-soft">
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-600 text-[11px] font-bold text-white tabular-nums">
              {i + 1}
            </span>
            <span className="flex-1">{s}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function NetworkPanel({
  locale,
  count,
  onFile,
  onClear,
}: {
  locale: Loc;
  count: number | null; // null = nothing uploaded yet
  onFile: (file: File) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const Picker = (
    <input
      ref={inputRef}
      type="file"
      accept=".csv,text/csv"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) onFile(file);
        e.target.value = '';
      }}
    />
  );

  if (count !== null) {
    return (
      <div className="glass mt-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-600 text-white shadow-soft">
            <Network className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="font-bold">{ui.network.matched[locale](count)}</div>
            <div className="text-[12.5px] text-ink-soft">
              {count > 0 ? ui.network.ranked[locale] : ui.network.none[locale]}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/40 px-3.5 py-1.5 text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
        >
          <X className="h-4 w-4" />
          {ui.network.clear[locale]}
        </button>
        {Picker}
      </div>
    );
  }

  return (
    <div className="glass mt-3 overflow-hidden rounded-3xl p-5">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft">
          <Network className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-extrabold tracking-tight">{ui.network.title[locale]}</h3>
          <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">{ui.network.body[locale]}</p>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50/70 px-3 py-2.5">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        <p className="text-[12.5px] font-semibold leading-relaxed text-amber-800">{ui.network.note[locale]}</p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Steps title={ui.network.howPhone[locale]} Icon={Smartphone} steps={ui.network.phoneSteps[locale]} />
        <Steps title={ui.network.howLaptop[locale]} Icon={Laptop} steps={ui.network.laptopSteps[locale]} />
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 px-4 py-3 text-sm font-bold text-white shadow-soft transition-colors hover:bg-brand-700"
      >
        <Upload className="h-4 w-4" />
        {ui.network.upload[locale]}
      </button>
      {Picker}
    </div>
  );
}

/* ------------------------------------------------------------ contacts page -- */

type Part = 'connections' | 'hr';

function Chips<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <span className="shrink-0 text-xs font-semibold text-ink-muted">{label}:</span>
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={cn(
            'shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors',
            value === opt.id ? 'border-ink bg-ink text-white' : 'border-white/60 bg-white/40 text-ink-soft hover:text-ink',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function ListFooter({ total, shown, onMore, locale }: { total: number; shown: number; onMore: () => void; locale: Loc }) {
  if (total <= shown) return null;
  const remaining = Math.min(24, total - shown);
  return (
    <div className="mt-5 flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={onMore}
        className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-soft transition-colors hover:bg-brand-700"
      >
        {ui.contacts.showMore[locale](remaining)}
      </button>
      <span className="text-[11px] text-ink-muted">{ui.contacts.showing[locale](Math.min(shown, total), total)}</span>
    </div>
  );
}

export function ContactsSection({ locale }: { locale: Loc }) {
  const plan = usePlan();
  const { network, setFromCsv, clear } = useNetwork();
  const [part, setPart] = useState<Part>('connections');
  const [query, setQuery] = useState('');
  const [hrSector, setHrSector] = useState<string>('all');
  const [hrTier, setHrTier] = useState<CompanyTier | 'all'>('all');
  const [shown, setShown] = useState(24); // render in pages; 100-300 cards at once is heavy

  // Reset the page size whenever the view or filters change.
  useEffect(() => setShown(24), [part, query, hrSector, hrTier, network]);

  const cap = TIER_CAP[plan.tier];

  const onFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setFromCsv(String(reader.result ?? ''));
    reader.readAsText(file);
  };

  // Connections: ranked from the uploaded network, capped at the tier.
  const rankedConnections = useMemo(() => {
    if (!network) return [];
    return rankConnections(network, planTargets(plan)).slice(0, cap);
  }, [network, plan, cap]);

  // HR facets present in this plan's recruiters.
  const hrSectors = useMemo(() => {
    const set = new Set(plan.hrContacts.map((c) => c.sector).filter(Boolean) as string[]);
    return Array.from(set);
  }, [plan.hrContacts]);
  const hrTiers = useMemo(() => {
    const set = new Set(plan.hrContacts.map((c) => c.companyTier).filter(Boolean) as CompanyTier[]);
    return Array.from(set);
  }, [plan.hrContacts]);

  const matchesQuery = (c: Contact) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      c.name.en.toLowerCase().includes(q) ||
      c.name.ar.includes(query) ||
      c.company.en.toLowerCase().includes(q) ||
      c.company.ar.includes(query) ||
      c.role.en.toLowerCase().includes(q)
    );
  };

  const hrFiltered = useMemo(
    () =>
      plan.hrContacts.filter(
        (c) =>
          (hrSector === 'all' || c.sector === hrSector) &&
          (hrTier === 'all' || c.companyTier === hrTier) &&
          matchesQuery(c),
      ),
    [plan.hrContacts, hrSector, hrTier, query],
  );

  const connFiltered = useMemo(
    () => rankedConnections.filter((r) => matchesQuery(r.contact)),
    [rankedConnections, query],
  );

  const parts: { id: Part; Icon: typeof Users; label: string; hint: string; badge: number | null }[] = [
    {
      id: 'connections',
      Icon: Users,
      label: ui.contacts.tabConnections[locale],
      hint: ui.contacts.connectionsHint[locale],
      badge: network ? rankedConnections.length : null,
    },
    { id: 'hr', Icon: Building2, label: ui.contacts.tabHr[locale], hint: ui.contacts.hrHint[locale], badge: plan.hrContacts.length },
  ];

  return (
    <div>
      <SectionHeading eyebrow={ui.contacts.eyebrow[locale]} title={ui.contacts.title[locale]} sub={ui.contacts.sub[locale]} />

      {/* Two-part toggle with count badges */}
      <div className="glass grid grid-cols-2 gap-1 rounded-2xl p-1">
        {parts.map((p) => {
          const active = part === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setPart(p.id)}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3.5 py-3 text-start transition-colors',
                active ? 'bg-brand-600 text-white shadow-soft' : 'text-ink-soft hover:bg-white/50',
              )}
            >
              <p.Icon className="h-5 w-5 shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className="text-sm font-bold leading-tight">{p.label}</span>
                  {p.badge !== null && (
                    <span
                      className={cn(
                        'rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums',
                        active ? 'bg-white/25 text-white' : 'bg-ink/10 text-ink-soft',
                      )}
                    >
                      {p.badge}
                    </span>
                  )}
                </span>
                <span className={cn('block truncate text-[11px]', active ? 'text-white/80' : 'text-ink-muted')}>
                  {p.hint}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* CONNECTIONS: driven entirely by the uploaded network */}
      {part === 'connections' && (
        <NetworkPanel locale={locale} count={network ? rankedConnections.length : null} onFile={onFile} onClear={clear} />
      )}

      {/* Search (shown once there is something to search) */}
      {(part === 'hr' || network) && (
        <div className="glass mt-3 flex items-center gap-2.5 rounded-2xl px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-ink-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={ui.contacts.search[locale]}
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
          />
        </div>
      )}

      {/* HR filters */}
      {part === 'hr' && (
        <div className="mt-3 space-y-2">
          <Chips
            label={ui.contacts.sector[locale]}
            value={hrSector}
            onChange={setHrSector}
            options={[
              { id: 'all', label: ui.contacts.allSectors[locale] },
              ...hrSectors.map((s) => ({ id: s, label: SECTOR_LABELS[s]?.[locale] ?? s })),
            ]}
          />
          <Chips
            label={ui.contacts.companySize[locale]}
            value={hrTier}
            onChange={setHrTier}
            options={[
              { id: 'all' as const, label: ui.contacts.allSizes[locale] },
              ...hrTiers.map((t) => ({ id: t, label: TIER_LABELS[t][locale] })),
            ]}
          />
        </div>
      )}

      {/* Lists (paginated; 100-300 cards at once is too heavy to render) */}
      {part === 'connections' &&
        network &&
        (connFiltered.length === 0 ? (
          <p className="mt-10 text-center text-sm text-ink-muted">{ui.contacts.empty[locale]}</p>
        ) : (
          <>
            <Stagger className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {connFiltered.slice(0, shown).map((r) => (
                <StaggerItem key={r.contact.id} className="h-full">
                  <ConnectionCard contact={r.contact} locale={locale} kind={r.kind} reason={r.reason[locale]} />
                </StaggerItem>
              ))}
            </Stagger>
            <ListFooter total={connFiltered.length} shown={shown} onMore={() => setShown((s) => s + 24)} locale={locale} />
          </>
        ))}

      {part === 'hr' &&
        (hrFiltered.length === 0 ? (
          <p className="mt-10 text-center text-sm text-ink-muted">{ui.contacts.empty[locale]}</p>
        ) : (
          <>
            <Stagger className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {hrFiltered.slice(0, shown).map((c) => (
                <StaggerItem key={c.id} className="h-full">
                  <ConnectionCard contact={c} locale={locale} />
                </StaggerItem>
              ))}
            </Stagger>
            <ListFooter total={hrFiltered.length} shown={shown} onMore={() => setShown((s) => s + 24)} locale={locale} />
          </>
        ))}
    </div>
  );
}

'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ExternalLink, Users, Building2, Layers, Target } from 'lucide-react';
import { TIER_LABELS, TOTAL_TARGET, type Tier } from '@/lib/sectors';
import type { HrContact, HrStats, SectorStat } from '@/lib/hr-data';
import { cn } from '@/lib/utils';

const ease = [0.16, 1, 0.3, 1] as const;

const tierColor: Record<string, string> = {
  giant: 'bg-ink/10 text-ink',
  large: 'bg-blue-50 text-blue-700',
  mid_market: 'bg-brand-50 text-brand-700',
  sme: 'bg-amber-50 text-amber-700',
  agency: 'bg-violet-50 text-violet-700',
};

export function HrDashboard({
  contacts,
  stats,
  locale,
}: {
  contacts: HrContact[];
  stats: HrStats;
  locale: string;
}) {
  const ar = locale === 'ar';
  const [query, setQuery] = useState('');
  const [sector, setSector] = useState<string>('all');
  const [tier, setTier] = useState<string>('all');

  const sectorName = (s: SectorStat) => (ar ? s.name_ar : s.name_en);
  const sectorNameBySlug = useMemo(
    () => Object.fromEntries(stats.sectors.map((s) => [s.slug, ar ? s.name_ar : s.name_en])),
    [stats.sectors, ar],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return contacts.filter((c) => {
      if (sector !== 'all' && c.sector !== sector) return false;
      if (tier !== 'all' && c.company_tier !== tier) return false;
      if (!q) return true;
      return (
        c.full_name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q)
      );
    });
  }, [contacts, query, sector, tier]);

  const pct = Math.round((stats.total / TOTAL_TARGET) * 100);

  const cards = [
    { icon: Users, label: ar ? 'إجمالي جهات HR' : 'Total HR contacts', value: stats.total.toLocaleString() },
    { icon: Building2, label: ar ? 'الشركات' : 'Companies', value: stats.companies.toLocaleString() },
    { icon: Layers, label: ar ? 'القطاعات المغطاة' : 'Sectors covered', value: `${stats.sectorsCovered} / 16` },
    { icon: Target, label: ar ? 'من هدف 3500' : 'of 3,500 goal', value: `${pct}%` },
  ];

  const byPriority = (p: 1 | 2 | 3) => stats.sectors.filter((s) => s.priority === p);
  const priorityLabel: Record<number, string> = ar
    ? { 1: 'أولوية ١', 2: 'أولوية ٢', 3: 'أولوية ٣' }
    : { 1: 'Priority 1', 2: 'Priority 2', 3: 'Priority 3' };

  return (
    <div className="container-page py-8 sm:py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          {ar ? 'قاعدة بيانات HR' : 'HR database'}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          {ar
            ? 'تقدّم جمع جهات اتصال الموارد البشرية حسب القطاع والحجم.'
            : 'Collection progress of HR contacts by sector and company size.'}
        </p>
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05, ease }}
            className="rounded-2xl border border-line bg-canvas-raised p-4 shadow-soft sm:p-5"
          >
            <c.icon className="h-5 w-5 text-brand-600" />
            <div className="mt-3 text-2xl font-extrabold tabular-nums sm:text-3xl">{c.value}</div>
            <div className="mt-0.5 text-xs text-ink-muted">{c.label}</div>
          </motion.div>
        ))}
      </div>

      {/* progress goal bar */}
      <div className="mt-5 rounded-2xl border border-line bg-canvas-raised p-5 shadow-soft">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">{ar ? 'التقدّم نحو الهدف' : 'Progress to goal'}</span>
          <span className="tabular-nums text-ink-muted">
            {stats.total.toLocaleString()} / {TOTAL_TARGET.toLocaleString()}
          </span>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-line">
          <motion.div
            className="h-full rounded-full bg-brand-600"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.9, ease }}
          />
        </div>
      </div>

      {/* tier distribution */}
      <div className="mt-5 flex flex-wrap gap-2">
        {(Object.keys(TIER_LABELS) as Tier[]).map((t) => (
          <span
            key={t}
            className={cn('rounded-full px-3 py-1.5 text-xs font-medium', tierColor[t])}
          >
            {ar ? TIER_LABELS[t].ar : TIER_LABELS[t].en}: {(stats.byTier[t] ?? 0).toLocaleString()}
          </span>
        ))}
      </div>

      {/* per-sector progress */}
      <div className="mt-8 space-y-6">
        {[1, 2, 3].map((p) => (
          <div key={p}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">
              {priorityLabel[p]}
            </h2>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {byPriority(p as 1 | 2 | 3).map((s) => {
                const sp = Math.min(100, Math.round((s.count / s.target) * 100));
                return (
                  <button
                    key={s.slug}
                    onClick={() => setSector(sector === s.slug ? 'all' : s.slug)}
                    className={cn(
                      'rounded-xl border bg-canvas-raised p-3.5 text-start transition-all duration-200',
                      sector === s.slug ? 'border-brand-400 shadow-soft' : 'border-line hover:border-ink/20',
                    )}
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{sectorName(s)}</span>
                      <span className="tabular-nums text-ink-muted">
                        {s.count}<span className="text-ink-muted/60"> / {s.target}</span>
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
                      <div className="h-full rounded-full bg-brand-500" style={{ width: `${sp}%` }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* filters */}
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted ltr:left-3 rtl:right-3" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={ar ? 'ابحث بالاسم أو الشركة أو المنصب…' : 'Search name, company, or title…'}
            className="h-11 w-full rounded-xl border border-line bg-canvas-raised text-sm outline-none transition-colors focus:border-brand-400 ltr:pl-9 ltr:pr-3 rtl:pr-9 rtl:pl-3"
          />
        </div>
        <select
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          className="h-11 rounded-xl border border-line bg-canvas-raised px-3 text-sm outline-none focus:border-brand-400"
        >
          <option value="all">{ar ? 'كل القطاعات' : 'All sectors'}</option>
          {stats.sectors.map((s) => (
            <option key={s.slug} value={s.slug}>{sectorName(s)}</option>
          ))}
        </select>
        <select
          value={tier}
          onChange={(e) => setTier(e.target.value)}
          className="h-11 rounded-xl border border-line bg-canvas-raised px-3 text-sm outline-none focus:border-brand-400"
        >
          <option value="all">{ar ? 'كل الأحجام' : 'All tiers'}</option>
          {(Object.keys(TIER_LABELS) as Tier[]).map((t) => (
            <option key={t} value={t}>{ar ? TIER_LABELS[t].ar : TIER_LABELS[t].en}</option>
          ))}
        </select>
      </div>

      <p className="mt-3 text-xs text-ink-muted">
        {ar ? `عرض ${filtered.length} من ${stats.total}` : `Showing ${filtered.length} of ${stats.total}`}
      </p>

      {/* table */}
      <div className="mt-3 overflow-hidden rounded-2xl border border-line bg-canvas-raised shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-start text-xs uppercase tracking-wider text-ink-muted">
                <th className="px-4 py-3 text-start font-medium">{ar ? 'الاسم' : 'Name'}</th>
                <th className="px-4 py-3 text-start font-medium">{ar ? 'المنصب' : 'Title'}</th>
                <th className="px-4 py-3 text-start font-medium">{ar ? 'الشركة' : 'Company'}</th>
                <th className="px-4 py-3 text-start font-medium">{ar ? 'القطاع' : 'Sector'}</th>
                <th className="px-4 py-3 text-start font-medium">{ar ? 'الحجم' : 'Tier'}</th>
                <th className="px-4 py-3 text-start font-medium">LinkedIn</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr
                  key={c.linkedin_url + i}
                  className="border-b border-line/60 transition-colors last:border-0 hover:bg-canvas"
                >
                  <td className="px-4 py-3 font-medium">{c.full_name}</td>
                  <td className="px-4 py-3 text-ink-soft">{c.title || '—'}</td>
                  <td className="px-4 py-3 text-ink-soft">{c.company}</td>
                  <td className="px-4 py-3">
                    <span className="whitespace-nowrap text-xs text-ink-muted">
                      {sectorNameBySlug[c.sector] ?? c.sector}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {c.company_tier && (
                      <span className={cn('rounded-md px-1.5 py-0.5 text-xs font-medium', tierColor[c.company_tier])}>
                        {ar ? TIER_LABELS[c.company_tier].ar : TIER_LABELS[c.company_tier].en}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={c.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-brand-700 transition-colors hover:text-brand-600"
                    >
                      {ar ? 'فتح' : 'Open'}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-ink-muted">
                    {ar ? 'لا نتائج' : 'No results'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-xs text-ink-muted">
        {ar
          ? 'المصدر: بحث ويب — غير مُتحقّق منه بعد. يُنصح بالتحقق قبل التواصل.'
          : 'Source: web search — unverified. Spot-check before outreach.'}
      </p>
    </div>
  );
}

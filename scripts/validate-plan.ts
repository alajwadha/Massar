#!/usr/bin/env tsx
// Masaar — deterministic plan validation (PIPELINE.md §1, §5 step 8, §10).
// Owns the MECHANICAL half of the gate so the three review agents spend their
// judgment on relevance, grounding, honesty, and voice instead of structure.
//
//   npm run validate:plan            # validate every registered plan
//   npm run validate:plan -- <slug>  # validate one plan
//
// Exit 0 = all checks pass. Exit 1 = findings printed, fix before the gate.

import {
  plans,
  SECTOR_LABELS,
  TIER_CAP,
  TIER_PATHS,
  type CustomerPlan,
} from '../src/lib/app-data';

type Finding = { slug: string; check: string; detail: string };
const findings: Finding[] = [];
const fail = (slug: string, check: string, detail: string) => findings.push({ slug, check, detail });

// An LS leaf must carry non-empty ar + en (and arF, when present, non-empty).
// Walk the whole plan; skip functions and non-objects.
function checkLS(slug: string, node: unknown, path: string, seen = new Set<object>()) {
  if (node === null || typeof node !== 'object') return;
  if (seen.has(node as object)) return;
  seen.add(node as object);
  const o = node as Record<string, unknown>;
  const hasAr = typeof o.ar === 'string';
  const hasEn = typeof o.en === 'string';
  if (hasAr || hasEn) {
    if (!hasAr || !(o.ar as string).trim()) fail(slug, 'bilingual', `${path}: Arabic missing or empty`);
    if (!hasEn || !(o.en as string).trim()) fail(slug, 'bilingual', `${path}: English missing or empty`);
    if ('arF' in o && o.arF !== undefined && (typeof o.arF !== 'string' || !o.arF.trim()))
      fail(slug, 'bilingual', `${path}: arF present but empty`);
    return; // an LS leaf; do not recurse into its strings
  }
  for (const [k, v] of Object.entries(o)) {
    if (typeof v === 'function') continue;
    checkLS(slug, v, `${path}.${k}`, seen);
  }
}

function checkPlan(key: string, plan: CustomerPlan) {
  const slug = plan.slug;

  // Registry + slug shape (name + random 6-char token; never a bare guessable name).
  if (key !== slug) fail(slug, 'registry', `registered under "${key}" but slug is "${slug}"`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) fail(slug, 'slug', 'slug must be lowercase kebab-case');
  if (!/-[a-z0-9]{6}$/.test(slug)) fail(slug, 'slug', 'slug must end with the random 6-char token (PIPELINE.md §5 step 7)');

  // Tier + sectors.
  if (!(plan.tier in TIER_PATHS)) fail(slug, 'tier', `unknown tier "${plan.tier}"`);
  if (!plan.sectors.length) fail(slug, 'sectors', 'sectors is empty');
  for (const s of plan.sectors) if (!(s in SECTOR_LABELS)) fail(slug, 'sectors', `unknown sector "${s}"`);

  // Profile.
  const g = (plan.profile as { gender?: string }).gender;
  if (g !== 'm' && g !== 'f') fail(slug, 'profile', 'profile.gender must be "m" or "f" (drives feminine copy)');

  // Paths: count, one primary, primaryPath matches, derived scores, certs.
  const cap = TIER_PATHS[plan.tier];
  if (!plan.paths.length) fail(slug, 'paths', 'no paths');
  if (plan.paths.length > cap) fail(slug, 'paths', `${plan.paths.length} paths exceeds the ${plan.tier} cap of ${cap}`);
  const ids = new Set<string>();
  for (const p of plan.paths) {
    if (ids.has(p.id)) fail(slug, 'paths', `duplicate path id "${p.id}"`);
    ids.add(p.id);
    for (const lvl of ['entry', 'mid', 'senior', 'director'] as const) {
      const v = p.scoreByLevel?.[lvl];
      if (typeof v !== 'number' || v < 0 || v > 100 || !Number.isFinite(v))
        fail(slug, 'scoring', `path "${p.id}" scoreByLevel.${lvl} is not a 0-100 number (must be DERIVED via withScore)`);
    }
    if (!p.scoreInput) fail(slug, 'scoring', `path "${p.id}" has no scoreInput (scores must derive from rubric inputs)`);
    if (!p.months || p.months <= 0) fail(slug, 'paths', `path "${p.id}" months must be > 0`);
    if (!p.targetCompanies?.length) fail(slug, 'paths', `path "${p.id}" has no targetCompanies (network ranking needs them)`);
    if (!p.gradFields?.length) fail(slug, 'paths', `path "${p.id}" has no gradFields (Study tab needs them)`);
    if (!p.certs?.length) fail(slug, 'certs', `path "${p.id}" has no certs`);
    for (const c of p.certs ?? []) {
      if (!/^https:\/\//.test(c.official)) fail(slug, 'links', `cert "${c.name?.en}" official link is not https: ${c.official}`);
      if (typeof c.scoreAdd !== 'number' || c.scoreAdd <= 0) fail(slug, 'certs', `cert "${c.name?.en}" scoreAdd must be a positive number`);
    }
  }
  const primaries = plan.paths.filter((p) => p.primary);
  if (primaries.length !== 1) fail(slug, 'paths', `exactly one primary path required, found ${primaries.length}`);
  if (primaries.length === 1 && plan.primaryPath?.id !== primaries[0].id)
    fail(slug, 'paths', `primaryPath ("${plan.primaryPath?.id}") does not match the primary:true path ("${primaries[0].id}")`);

  // Authored plans ship with empty contact arrays (filled at request/upload time).
  if (plan.connections.length) fail(slug, 'contacts', 'connections must be [] at authoring time (customer uploads their own)');
  if (plan.hrContacts.length) fail(slug, 'contacts', 'hrContacts must be [] at authoring time (page fills from hr-db)');

  // Journey sanity.
  const j = plan.journey;
  if (j.certsDone > j.certsTotal) fail(slug, 'journey', `certsDone (${j.certsDone}) > certsTotal (${j.certsTotal})`);
  if (j.percent < 0 || j.percent > 100) fail(slug, 'journey', `percent ${j.percent} out of range`);

  // Study majors (when authored): 3 majors, 4 universities each, ≥1 QS-top-30 per major.
  if (plan.studyMajors) {
    if (plan.studyMajors.length !== 3) fail(slug, 'study', `studyMajors must have exactly 3 majors, found ${plan.studyMajors.length}`);
    for (const m of plan.studyMajors) {
      if (m.programs.length !== 4) fail(slug, 'study', `major "${m.major?.en}" must list exactly 4 universities, found ${m.programs.length}`);
      if (!m.programs.some((p) => p.top30)) fail(slug, 'study', `major "${m.major?.en}" has no QS world top-30 (overall) option`);
      for (const p of m.programs) if (!/^https:\/\//.test(p.link)) fail(slug, 'links', `program "${p.uni?.en}" link is not https: ${p.link}`);
    }
  }

  // Bilingual completeness across the whole plan.
  checkLS(slug, plan, slug);

  // Templates present (outreach is a core promise).
  if (!plan.templates?.length) fail(slug, 'templates', 'no outreach templates');
}

// ---- run ----
const only = process.argv[2];
const entries = Object.entries(plans).filter(([k]) => !only || k === only);
if (only && !entries.length) {
  console.error(`✗ no plan registered under slug "${only}"`);
  process.exit(1);
}
for (const [key, plan] of entries) checkPlan(key, plan);

if (findings.length) {
  console.error(`✗ ${findings.length} finding(s) across ${entries.length} plan(s):\n`);
  for (const f of findings) console.error(`  [${f.slug}] ${f.check}: ${f.detail}`);
  console.error('\nFix everything above, re-run, then start the three agent gate (PIPELINE.md §1).');
  process.exit(1);
}
console.log(`✓ ${entries.length} plan(s) pass all deterministic checks (caps ${JSON.stringify(TIER_CAP)}).`);

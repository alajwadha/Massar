#!/usr/bin/env node
// Masaar — validate & normalize HR contacts before import.
// Reads a unified CSV, canonicalizes every LinkedIn URL into one consistent
// format, flags bad/missing/duplicate rows, and writes a clean file.
//
//   node scripts/validate-hr.mjs [input.csv] [output.csv]
//   (defaults: data/hr_contacts.csv -> data/hr_contacts.clean.csv)

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const INPUT = process.argv[2] ?? 'data/hr_contacts.csv';
const OUTPUT = process.argv[3] ?? 'data/hr_contacts.clean.csv';

const COLUMNS = ['full_name', 'linkedin_url', 'title', 'company', 'sector', 'company_tier', 'source'];

const SECTORS = new Set([
  'investment_finance', 'consulting', 'energy_petrochem', 'gigaprojects_realestate',
  'government', 'recruitment_agencies', 'telecom_it', 'tech_startups',
  'healthcare_pharma', 'manufacturing_mining', 'transport_logistics', 'retail_fmcg',
  'education_training', 'tourism_entertainment', 'insurance', 'aerospace_defense',
]);
const TIERS = new Set(['giant', 'large', 'mid_market', 'sme', 'agency']);

// --- tiny CSV parser (handles quoted fields, commas, escaped quotes) ---------
function parseCsv(text) {
  const rows = [];
  let field = '';
  let row = [];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field); field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); rows.push(row); field = ''; row = [];
    } else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.length && r.some((v) => v.trim() !== ''));
}

function csvCell(v) {
  const s = String(v ?? '');
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// --- LinkedIn URL canonicalization -------------------------------------------
// Accepts: linkedin.com/in/x, http://sa.linkedin.com/in/x?foo=bar, .../in/x/
// Returns: https://www.linkedin.com/in/x/   (or null if not a profile URL)
export function canonicalLinkedIn(raw) {
  if (!raw || !raw.trim()) return null;
  let s = raw.trim();
  if (!/^https?:\/\//i.test(s)) s = 'https://' + s;
  let url;
  try { url = new URL(s); } catch { return null; }
  const host = url.hostname.toLowerCase().replace(/^[a-z]{2}\./, ''); // strip sa./eg.
  if (host !== 'linkedin.com' && host !== 'www.linkedin.com') return null;
  const m = url.pathname.match(/\/in\/([^/]+)\/?$/i);
  if (!m) return null;
  const id = m[1].trim();
  if (!id || /\s/.test(id)) return null;
  return `https://www.linkedin.com/in/${id}/`;
}

// --- run ---------------------------------------------------------------------
if (!existsSync(INPUT)) {
  console.error(`✗ Input not found: ${INPUT}`);
  console.error(`  Create it from data/hr_contacts.template.csv`);
  process.exit(1);
}

const rows = parseCsv(readFileSync(INPUT, 'utf8'));
if (rows.length === 0) { console.error('✗ Empty file'); process.exit(1); }

const header = rows[0].map((h) => h.trim());
const missingCols = COLUMNS.filter((c) => !header.includes(c));
if (missingCols.length) {
  console.error(`✗ Missing columns: ${missingCols.join(', ')}`);
  console.error(`  Expected header: ${COLUMNS.join(',')}`);
  process.exit(1);
}
const idx = Object.fromEntries(COLUMNS.map((c) => [c, header.indexOf(c)]));

const clean = [];
const errors = [];
const seen = new Map(); // canonical url -> first row number
const bySector = {};
const byTier = {};
let placeholders = 0;

for (let r = 1; r < rows.length; r++) {
  const row = rows[r];
  const get = (c) => (row[idx[c]] ?? '').trim();
  const line = r + 1;
  const name = get('full_name');
  const rawUrl = get('linkedin_url');
  const sector = get('sector');
  const tier = get('company_tier');

  // skip obvious template placeholders silently
  if (name.includes('<') || rawUrl.includes('<')) { placeholders++; continue; }

  const problems = [];
  if (!name) problems.push('missing full_name');
  const url = canonicalLinkedIn(rawUrl);
  if (!url) problems.push(`bad linkedin_url "${rawUrl}"`);
  if (sector && !SECTORS.has(sector)) problems.push(`unknown sector "${sector}"`);
  if (tier && !TIERS.has(tier)) problems.push(`unknown company_tier "${tier}"`);

  if (problems.length) { errors.push(`  line ${line}: ${problems.join('; ')}`); continue; }

  if (seen.has(url)) { errors.push(`  line ${line}: duplicate of line ${seen.get(url)} (${url})`); continue; }
  seen.set(url, line);

  bySector[sector] = (bySector[sector] ?? 0) + 1;
  byTier[tier] = (byTier[tier] ?? 0) + 1;
  clean.push({ full_name: name, linkedin_url: url, title: get('title'),
    company: get('company'), sector, company_tier: tier, source: get('source') });
}

// write clean file
const out = [COLUMNS.join(',')];
for (const row of clean) out.push(COLUMNS.map((c) => csvCell(row[c])).join(','));
writeFileSync(OUTPUT, out.join('\n') + '\n');

// report
console.log(`\nMasaar — HR validation`);
console.log(`  input:        ${INPUT}`);
console.log(`  valid rows:   ${clean.length}`);
console.log(`  errors:       ${errors.length}`);
console.log(`  duplicates removed + bad rows skipped above`);
if (placeholders) console.log(`  template rows skipped: ${placeholders}`);
if (Object.keys(bySector).length) {
  console.log(`\n  by sector:`);
  for (const [k, v] of Object.entries(bySector).sort((a, b) => b[1] - a[1])) console.log(`    ${k.padEnd(26)} ${v}`);
  console.log(`  by tier:`);
  for (const [k, v] of Object.entries(byTier).sort((a, b) => b[1] - a[1])) console.log(`    ${k.padEnd(26)} ${v}`);
}
if (errors.length) { console.log(`\n  problems:`); console.log(errors.join('\n')); }
console.log(`\n→ clean file: ${OUTPUT}\n`);
process.exit(errors.length ? 2 : 0);

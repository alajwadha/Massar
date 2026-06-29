#!/usr/bin/env node
// Masaar — quick Moyasar API smoke test (test mode).
// Validates that your keys work end-to-end without touching the UI:
//   • with a PUBLISHABLE key (pk_test_…) it creates a 1.00 SAR test payment
//     using an official Moyasar test card and prints the result.
//   • with a SECRET key (sk_test_…) it can re-fetch any payment by id, exactly
//     like the server-side /api/payments/verify route does.
//
//   node scripts/test-moyasar.mjs                 # create a test payment (publishable key)
//   node scripts/test-moyasar.mjs <payment_id>    # verify a payment by id (secret key)
//
// Keys are read from the environment or .env.local — never hard-code them.
// NOTE: run this locally. It calls api.moyasar.com, which sandboxed CI/agent
// environments may block.

import { readFileSync, existsSync } from 'node:fs';

// --- load .env.local (minimal parser, no dependency) -------------------------
function loadEnv(file = '.env.local') {
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2].trim().replace(/^["']|["']$/g, '');
    if (!(key in process.env)) process.env[key] = val;
  }
}
loadEnv();

const PK = process.env.MOYASAR_PUBLISHABLE_KEY;
const SK = process.env.MOYASAR_SECRET_KEY;
const API = 'https://api.moyasar.com/v1/payments';
const auth = (key) => `Basic ${Buffer.from(`${key}:`).toString('base64')}`;

function show(p) {
  console.log(`  id:          ${p.id}`);
  console.log(`  status:      ${p.status}`);
  console.log(`  amount:      ${p.amount} halalas (${(p.amount / 100).toFixed(2)} ${p.currency})`);
  console.log(`  description: ${p.description ?? '—'}`);
  if (p.source?.transaction_url) console.log(`  3DS url:     ${p.source.transaction_url}`);
  if (p.source?.message) console.log(`  message:     ${p.source.message}`);
}

async function verifyById(id) {
  if (!SK) {
    console.error('✗ MOYASAR_SECRET_KEY not set — needed to fetch a payment by id.');
    process.exit(1);
  }
  console.log(`→ Fetching payment ${id} with secret key…\n`);
  const res = await fetch(`${API}/${id}`, { headers: { Authorization: auth(SK) } });
  const p = await res.json();
  if (!res.ok) {
    console.error(`✗ HTTP ${res.status}:`, p);
    process.exit(1);
  }
  show(p);
  console.log(`\n${p.status === 'paid' ? '✓ Payment is PAID.' : 'ℹ Payment is not paid (status above).'}`);
}

async function createTestPayment() {
  if (!PK) {
    console.error('✗ MOYASAR_PUBLISHABLE_KEY not set (in env or .env.local).');
    process.exit(1);
  }
  if (!PK.startsWith('pk_test_')) {
    console.error('✗ Refusing to run: key is not a pk_test_ key. This script is test-mode only.');
    process.exit(1);
  }
  console.log('→ Creating a 1.00 SAR test payment with a Moyasar test card…\n');
  const body = new URLSearchParams({
    amount: '100',
    currency: 'SAR',
    description: 'Masaar — API smoke test',
    callback_url: 'https://example.com/cb',
    'source[type]': 'creditcard',
    'source[name]': 'Test User',
    'source[number]': '4111111111111111', // official Moyasar test Visa
    'source[cvc]': '123',
    'source[month]': '12',
    'source[year]': '2030',
  });
  const res = await fetch(API, { method: 'POST', headers: { Authorization: auth(PK) }, body });
  const p = await res.json();
  if (!res.ok) {
    console.error(`✗ HTTP ${res.status} — key rejected or request invalid:\n`, p);
    process.exit(1);
  }
  show(p);
  console.log('\n✓ Publishable key is valid and the payment pipeline works.');
  console.log('  (Open the 3DS url above to complete the test charge in a browser.)');
}

const idArg = process.argv[2];
(idArg ? verifyById(idArg) : createTestPayment()).catch((e) => {
  console.error('✗ Network error:', e.message);
  console.error('  If you see ECONNREFUSED/403, your environment may block api.moyasar.com — run this locally.');
  process.exit(1);
});

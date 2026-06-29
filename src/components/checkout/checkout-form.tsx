'use client';

import { useEffect, useRef, useState } from 'react';
import { Lock, AlertTriangle } from 'lucide-react';

declare global {
  interface Window {
    Moyasar?: { init: (opts: Record<string, unknown>) => void };
  }
}

const MOYASAR_CSS = 'https://cdn.moyasar.com/mpf/1.15.0/moyasar.css';
const MOYASAR_JS = 'https://cdn.moyasar.com/mpf/1.15.0/moyasar.js';

function loadAsset(tag: 'link' | 'script', attrs: Record<string, string>): Promise<void> {
  return new Promise((resolve) => {
    const sel = tag === 'link' ? `link[href="${attrs.href}"]` : `script[src="${attrs.src}"]`;
    if (document.querySelector(sel)) return resolve();
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    if (tag === 'script') el.addEventListener('load', () => resolve());
    else resolve();
    document.head.appendChild(el);
  });
}

const INPUT =
  'w-full rounded-xl border border-stone-300/80 bg-white/70 px-4 py-3 text-[15px] text-stone-900 outline-none transition-colors placeholder:text-stone-400 focus:border-stone-400 dark:border-white/15 dark:bg-white/[0.06] dark:text-stone-100 dark:placeholder:text-stone-500';

export function CheckoutForm({
  planId,
  amountHalalas,
  publishableKey,
  callbackUrl,
  description,
  locale,
  labels,
}: {
  planId: string;
  amountHalalas: number;
  publishableKey: string;
  callbackUrl: string;
  description: string;
  locale: string;
  labels: {
    secure: string;
    notConfigured: string;
    notConfiguredHint: string;
    contactTitle: string;
    contactHint: string;
    nameLabel: string;
    emailLabel: string;
    phoneLabel: string;
    continue: string;
    fillAll: string;
  };
}) {
  const initialized = useRef(false);
  const [ready, setReady] = useState(false);
  const [started, setStarted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [err, setErr] = useState('');

  // Initialise the Moyasar form only after we have the buyer's contact details,
  // so we can attach them (+ the plan) to the payment metadata. That makes every
  // payment tie back to a reachable person in the Moyasar dashboard.
  useEffect(() => {
    if (!started || !publishableKey || initialized.current) return;
    initialized.current = true;
    (async () => {
      await loadAsset('link', { rel: 'stylesheet', href: MOYASAR_CSS });
      await loadAsset('script', { src: MOYASAR_JS });
      if (!window.Moyasar) return;
      window.Moyasar.init({
        element: '.mysr-form',
        amount: amountHalalas,
        currency: 'SAR',
        description,
        publishable_api_key: publishableKey,
        callback_url: callbackUrl,
        language: locale === 'ar' ? 'ar' : 'en',
        methods: ['creditcard', 'stcpay'],
        metadata: { plan: planId, name: name.trim(), email: email.trim(), phone: phone.trim() },
      });
      setReady(true);
    })();
  }, [started, publishableKey, amountHalalas, callbackUrl, description, locale, planId, name, email, phone]);

  if (!publishableKey) {
    return (
      <div className="rounded-2xl border border-amber-300/70 bg-amber-50/80 p-5 backdrop-blur dark:border-amber-400/25 dark:bg-amber-400/10">
        <div className="flex items-center gap-2 font-semibold text-amber-800 dark:text-amber-200">
          <AlertTriangle className="h-5 w-5" />
          {labels.notConfigured}
        </div>
        <p className="mt-2 text-sm text-amber-800/80 dark:text-amber-200/80">{labels.notConfiguredHint}</p>
      </div>
    );
  }

  // Step 1: collect contact details before showing the payment form.
  if (!started) {
    const submit = () => {
      const okName = name.trim().length > 1;
      const okEmail = /^\S+@\S+\.\S+$/.test(email.trim());
      const okPhone = phone.replace(/\D/g, '').length >= 9;
      if (!okName || !okEmail || !okPhone) {
        setErr(labels.fillAll);
        return;
      }
      setErr('');
      setStarted(true);
    };
    return (
      <div className="space-y-3">
        <div>
          <div className="text-[15px] font-bold text-stone-800 dark:text-stone-100">{labels.contactTitle}</div>
          <p className="mt-1 text-[13px] text-stone-500 dark:text-stone-400">{labels.contactHint}</p>
        </div>
        <input className={INPUT} value={name} onChange={(e) => setName(e.target.value)} placeholder={labels.nameLabel} autoComplete="name" />
        <input className={INPUT} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={labels.emailLabel} autoComplete="email" dir="ltr" />
        <input className={INPUT} type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={labels.phoneLabel} autoComplete="tel" dir="ltr" />
        {err ? <p className="text-[13px] font-medium text-red-600 dark:text-red-400">{err}</p> : null}
        <button
          type="button"
          onClick={submit}
          className="mt-1 inline-flex h-12 w-full items-center justify-center rounded-full bg-stone-900 text-[15px] font-semibold text-white transition-colors hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
        >
          {labels.continue}
        </button>
        <p className="flex items-center justify-center gap-1.5 pt-1 text-xs text-stone-500 dark:text-stone-400">
          <Lock className="h-3.5 w-3.5" /> {labels.secure}
        </p>
      </div>
    );
  }

  // Step 2: the Moyasar hosted payment form.
  return (
    <div>
      <div className="mysr-form" />
      {!ready && <div className="h-40 animate-pulse rounded-2xl bg-stone-200/70 dark:bg-white/10" aria-hidden />}
      <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
        <Lock className="h-3.5 w-3.5" /> {labels.secure}
      </p>
    </div>
  );
}

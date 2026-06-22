'use client';

import { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Lock, AlertTriangle } from 'lucide-react';

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
  labels: { secure: string; notConfigured: string; notConfiguredHint: string };
}) {
  const initialized = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!publishableKey || initialized.current) return;
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
      });
      setReady(true);
    })();
  }, [publishableKey, amountHalalas, callbackUrl, description, locale]);

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

  return (
    <div>
      <div className="mysr-form" />
      {!ready && (
        <div className="h-40 animate-pulse rounded-2xl bg-stone-200/70 dark:bg-white/10" aria-hidden />
      )}
      <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
        <Lock className="h-3.5 w-3.5" /> {labels.secure}
      </p>
    </div>
  );
}

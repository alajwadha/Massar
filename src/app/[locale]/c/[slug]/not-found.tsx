'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';

// Shown when a /c/<slug> link points at no plan (wrong, expired, or revoked link).
// It never reveals any customer data, just a clean dead end.
export default function CustomerNotFound() {
  const ar = useLocale() === 'ar';
  return (
    <div className="grid min-h-dvh place-items-center bg-canvas px-6 text-center">
      <div className="max-w-md">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-600 text-2xl font-extrabold text-white shadow-soft">
          م
        </div>
        <h1 className="mt-5 text-2xl font-extrabold tracking-tight">
          {ar ? 'هذا الرابط غير موجود' : 'This link does not exist'}
        </h1>
        <p className="mt-2 leading-relaxed text-ink-soft">
          {ar
            ? 'تأكّد من الرابط الذي وصلك، أو تواصل معنا للحصول على رابطك الخاص بخطتك.'
            : 'Check the link you were sent, or contact us to get your own private plan link.'}
        </p>
        <Link
          href="/app"
          className="mt-6 inline-flex rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-soft transition-colors hover:bg-brand-700"
        >
          {ar ? 'استعراض العرض التوضيحي' : 'View the demo'}
        </Link>
      </div>
    </div>
  );
}

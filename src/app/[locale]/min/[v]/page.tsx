import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Instrument_Serif } from 'next/font/google';
import { PlanProvider } from '@/components/app/plan-context';
import { MinPreview } from '@/components/min/preview';
import { getPlan } from '@/lib/app-data';
import { withHr } from '@/lib/hr-db';
import type { Loc } from '@/lib/app-data';

// Five minimalist all-pages dashboard variants at /<locale>/min/<a|b|c|d|e>, each
// previewed with Ali's plan and the real client state. Pick a winner and it becomes
// the customer dashboard's minimal mode. Instrument Serif scoped via --font-serif.
const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const VS = ['a', 'b', 'c', 'd', 'e'];

export function generateStaticParams() {
  return VS.map((v) => ({ v }));
}

export default function MinPage({
  params: { locale, v },
}: {
  params: { locale: string; v: string };
}) {
  setRequestLocale(locale);
  if (!VS.includes(v)) notFound();
  const plan = getPlan('ali-alajwad-kxggkx');
  if (!plan) notFound();
  return (
    <div className={serif.variable}>
      <PlanProvider plan={withHr(plan)}>
        <MinPreview v={v} locale={locale as Loc} />
      </PlanProvider>
    </div>
  );
}

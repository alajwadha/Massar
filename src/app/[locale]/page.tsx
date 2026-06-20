import { setRequestLocale } from 'next-intl/server';
import MarketingH from '@/components/marketing/h';
import type { Loc } from '@/lib/app-data';

// The root landing is the "Question led" H design (warm, liquid glass, Arabic first).
export default function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  return <MarketingH locale={locale as Loc} />;
}

import { setRequestLocale } from 'next-intl/server';
import { ImportGuide } from '@/components/app/import-guide';

export default function ImportPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  return <ImportGuide />;
}

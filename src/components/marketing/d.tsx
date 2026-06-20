'use client';

/* =============================================================================
   Landing version D. Same "Bold Pitch" design as version C (it reuses CDesign),
   but with a warm, human Saudi voice (voice 2) instead of the confident, premium
   voice (voice 1) on /m/c. Both share one design so we compare copy, not layout.
============================================================================= */

import { ScanLine, Route, Users, Sparkles, ShieldCheck, GraduationCap } from 'lucide-react';
import { CDesign, type CCopy } from './c';
import type { Loc } from '@/components/marketing/shared';

// Voice 2: warm and human (natural Saudi, clean).
const COPY_D: CCopy = {
  nav: {
    how: { ar: 'كيف يعمل', en: 'How it works' },
    pricing: { ar: 'الأسعار', en: 'Pricing' },
    product: { ar: 'المنتج', en: 'Product' },
  },
  cta: { ar: 'ابدأ الآن', en: 'Get started' },
  heroEyebrow: { ar: 'لوظيفة جديدة أو ترقية', en: 'For a new job or a promotion' },
  heroTitle: { ar: 'خلّ عنك التخمين، وابدأ بخطة.', en: 'Stop guessing. Start a plan.' },
  heroSub: {
    ar: 'سيرتك تصير خطة واضحة: درجة صادقة، وشهادات يدفع هدف نصّها، والأشخاص المناسبون للتواصل معهم، مع رسائل جاهزة بأسلوبك. دفعة وحدة، وتفتح لك لوحتك على طول.',
    en: 'Your CV becomes a real plan: an honest score, certifications Hadaf covers half of, and the right people to reach, with messages ready in your voice. One payment, instant access.',
  },
  heroNote: { ar: 'بدون اشتراك. عربي أولًا، وثنائي اللغة بالكامل.', en: 'No subscription. Arabic first, fully bilingual.' },
  trusted: { ar: 'مبني لوظائف في', en: 'Built for roles at' },

  scoreboardEyebrow: { ar: 'المشكلة بالأرقام', en: 'The problem in numbers' },
  scoreboardTitle: { ar: 'التقديم بدون خطة ما يوصّلك.', en: 'Applying without a plan gets you nowhere.' },
  scoreboardSub: { ar: 'كذا يصير البحث عن وظيفة بدون خطة.', en: 'This is what a job search with no plan looks like.' },

  scoreEyebrow: { ar: 'درجتك الحقيقية', en: 'Your real score' },
  scoreTitle: { ar: 'اعرف موقعك قبل ما تقدّم.', en: 'Know where you stand before you apply.' },
  scoreSub: {
    ar: 'درجة تنافسية لكل دور ولكل مستوى، من مبتدئ إلى قيادي، صادقة ومتحفظة، وتوريك بالضبط وش يرفعها.',
    en: 'A competitiveness score for every role and level, from Entry to Director, honest and conservative, showing you exactly what raises it.',
  },

  planEyebrow: { ar: 'خطتك', en: 'Your plan' },
  planTitle: { ar: 'هدف يدفع لك نص الطريق.', en: 'Hadaf covers half the way.' },
  planSub: {
    ar: 'مسارات مهنية مبنية على خلفيتك، وخارطة شهادات مرتبة حسب الأثر، ونوضّح لك أي شهادة يعوّض هدف نص تكلفتها.',
    en: 'Career paths built on your background, and a certifications roadmap ordered by impact, showing which ones Hadaf covers about half of.',
  },

  peopleEyebrow: { ar: 'الناس', en: 'The people' },
  peopleTitle: { ar: 'الوظائف تجي من ناس.', en: 'Jobs come from people.' },
  peopleSub: {
    ar: 'نرتّب لك شبكتك على لينكدإن ونطلّع أقرب الناس لأهدافك، مع قاعدتنا اللي فيها 1,209 جهة موارد بشرية وتوظيف. رسائل جاهزة بأسلوبك، وإنت اللي ترسلها. نحفظ ملفك بأمان، وما نشاركه، وتقدر تحذفه وقت ما تبي.',
    en: 'We rank your LinkedIn network into the people closest to your goals, plus our database of 1,209 HR and recruiter contacts. Messages ready in your voice, sent by you. Your file is stored securely, never shared, and you can delete it anytime.',
  },

  studyEyebrow: { ar: 'الدراسة والفرص', en: 'Study and opportunities' },
  studyTitle: { ar: 'وأبعد من وظيفتك الجاية.', en: 'And beyond your next job.' },
  studySub: {
    ar: 'برامج دراسات عليا حسب مجالك مع أهلية منحة رواد، وعشرات صفحات التوظيف السعودية حسب القطاع، مع أيام مهنية بمواعيدها وبرامج مثل تمهير.',
    en: 'Graduate programs by field with Pioneers eligibility, and dozens of Saudi career pages by sector, with dated career days and programs like Tamheer.',
  },

  scoreStat: { ar: 'لكل دور ومستوى', en: 'Per role and level' },
  scoreStatSub: {
    ar: 'من مبتدئ إلى قيادي، رقم واحد متحفظ يقول لك وين تقف بالضبط ووش يرفعه.',
    en: 'From Entry to Director, one conservative number that shows exactly where you stand and what raises it.',
  },
  scoreLine: { ar: 'اعرف رقمك قبل أي أحد.', en: 'Know your number before anyone else.' },

  planStat: { ar: '٥٠٪', en: '50%' },
  planStatSub: {
    ar: 'من تكلفة الشهادات المؤهلة يعوّضها هدف. نوضّح لك أيّها بالضبط، ونرتّبها حسب الأثر.',
    en: 'of eligible certification costs covered by Hadaf. We show you exactly which, ordered by impact.',
  },
  planLine: { ar: 'مسار يدفع لك نص الطريق لوظيفتك الجاية.', en: 'A path that covers half the way to your next role.' },

  peopleStat: { ar: '١٢٠٩', en: '1,209' },
  peopleStatSub: {
    ar: 'جهة موارد بشرية وتوظيف في قاعدتنا، مع شبكتك الخاصة. الوظائف تجي من ناس.',
    en: 'HR and recruiter contacts in our database, plus your own network. Jobs come from people.',
  },
  peopleLine: { ar: 'رسائل جاهزة بأسلوبك، وإنت اللي ترسلها.', en: 'Messages ready in your voice, sent by you.' },

  studyStatA: { ar: 'منحة رواد', en: 'Pioneers' },
  studyStatASub: { ar: 'برامج دراسات عليا حسب مجالك مع أهلية المنحة.', en: 'Graduate programs by field with scholarship eligibility.' },
  studyStatB: { ar: 'تمهير وأكثر', en: 'Tamheer and more' },
  studyStatBSub: { ar: 'عشرات صفحات التوظيف السعودية بأيام مهنية بمواعيدها.', en: 'Dozens of Saudi career pages with dated career days.' },
  studyLine: { ar: 'وأبعد من وظيفتك الجاية بكثير.', en: 'And far beyond your next job.' },

  howEyebrow: { ar: 'كيف يعمل', en: 'How it works' },
  howTitle: { ar: 'أربع خطوات وبس.', en: 'Four steps. That is it.' },
  howSub: { ar: 'من سيرتك إلى خطة تبدأ فيها اليوم.', en: 'From a CV to a plan you can start today.' },

  priceEyebrow: { ar: 'الأسعار', en: 'Pricing' },
  priceTitle: { ar: 'ادفع مرة وحدة، وخطتك تبقى لك.', en: 'Pay once. Your plan stays yours.' },
  priceSub: {
    ar: 'دفعة وحدة عبر ميسر: مدى وآبل باي والبطاقات. بدون اشتراك، وتفتح لك لوحتك على طول.',
    en: 'One payment via Moyasar: mada, Apple Pay and cards. No subscription, instant access.',
  },
  perOnce: { ar: 'ريال، مرة وحدة', en: 'SAR, one time' },
  popular: { ar: 'الأكثر اختيارًا', en: 'Most chosen' },
  choose: { ar: 'اختر', en: 'Choose' },

  finalTitle: { ar: 'سيرتك تستاهل خطة.', en: 'Your CV deserves a plan.' },
  finalSub: { ar: 'ابدأ الآن، وخذ درجتك ومسارك وناسك خلال دقائق.', en: 'Start now and get your score, your path and your people in minutes.' },
  rights: { ar: 'كل الحقوق محفوظة.', en: 'All rights reserved.' },
};

const STEPS_D: { icon: typeof ScanLine; t: { ar: string; en: string }; d: { ar: string; en: string } }[] = [
  {
    icon: ScanLine,
    t: { ar: 'ارفع سيرتك', en: 'Upload your CV' },
    d: { ar: 'دقيقة وحدة، وتفتح لك لوحتك على طول.', en: 'One minute, and your dashboard unlocks instantly.' },
  },
  {
    icon: Sparkles,
    t: { ar: 'اعرف درجتك', en: 'See your score' },
    d: { ar: 'لكل دور ومستوى، مع وش يرفعها.', en: 'Per role and level, with what raises it.' },
  },
  {
    icon: Route,
    t: { ar: 'اتبع خطتك', en: 'Follow your plan' },
    d: { ar: 'مسارات وشهادات يدفع هدف نصّها.', en: 'Paths and certifications Hadaf covers half of.' },
  },
  {
    icon: Users,
    t: { ar: 'تواصل', en: 'Reach out' },
    d: { ar: 'الأشخاص المناسبون، برسائل بأسلوبك.', en: 'The right people, in your own voice.' },
  },
];

const BANNER_D: { icon: typeof ShieldCheck; t: { ar: string; en: string } }[] = [
  { icon: ShieldCheck, t: { ar: 'خصوصية أولًا، ما نشارك بياناتك وتقدر تحذفها وقت ما تبي', en: 'Privacy first, we never share your data and you can delete it anytime' } },
  { icon: GraduationCap, t: { ar: 'أهلية منحة رواد لأفضل 30 جامعة', en: 'Pioneers eligibility for the top 30 universities' } },
  { icon: Users, t: { ar: '1,209 جهة موارد بشرية وتوظيف', en: '1,209 HR and recruiter contacts' } },
];

export default function MarketingD({ locale }: { locale: Loc }) {
  return <CDesign locale={locale} T={COPY_D} STEPS={STEPS_D} BANNER={BANNER_D} />;
}

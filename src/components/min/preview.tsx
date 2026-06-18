'use client';

// Wraps a chosen minimal-dashboard design in the same client state the real
// dashboard uses (PlanProvider is supplied by the route; this adds DashboardState),
// so each minimal design is fully functional in the /min/<v> preview.

import { usePlan } from '@/components/app/plan-context';
import { DashboardState } from '@/components/app/dashboard-state';
import type { Loc } from '@/lib/app-data';
import MinimalA from './a';
import MinimalB from './b';
import MinimalC from './c';
import MinimalD from './d';
import MinimalE from './e';

const MAP = { a: MinimalA, b: MinimalB, c: MinimalC, d: MinimalD, e: MinimalE } as const;

export function MinPreview({ v, locale }: { v: string; locale: Loc }) {
  const plan = usePlan();
  const initialCertsDone = plan.paths
    .flatMap((p) => p.certs)
    .filter((c) => c.status === 'done')
    .map((c) => c.name.en);
  const Comp = MAP[v as keyof typeof MAP] ?? MinimalA;
  return (
    <DashboardState slug={plan.slug} initialCertsDone={initialCertsDone}>
      <Comp locale={locale} />
    </DashboardState>
  );
}

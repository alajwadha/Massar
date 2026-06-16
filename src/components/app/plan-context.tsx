'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { CustomerPlan } from '@/lib/app-data';

// Holds the one CustomerPlan the dashboard is rendering. Every section reads it
// through usePlan(), so a customer at /c/<slug> only ever sees their own data.
const PlanContext = createContext<CustomerPlan | null>(null);

export function PlanProvider({ plan, children }: { plan: CustomerPlan; children: ReactNode }) {
  return <PlanContext.Provider value={plan}>{children}</PlanContext.Provider>;
}

export function usePlan(): CustomerPlan {
  const plan = useContext(PlanContext);
  if (!plan) throw new Error('usePlan must be used inside a <PlanProvider>');
  return plan;
}

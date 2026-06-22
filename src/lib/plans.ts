// Masaar plans. Prices in SAR; Moyasar charges in halalas (SAR * 100).
export type PlanId = 'starter' | 'pro';

export type Plan = {
  id: PlanId;
  priceSar: number;
  amountHalalas: number;
  popular?: boolean;
};

export const PLANS: Record<PlanId, Plan> = {
  // Launch discount for the first 50 customers (was 199 / 349).
  starter: { id: 'starter', priceSar: 99, amountHalalas: 9900 },
  pro: { id: 'pro', priceSar: 149, amountHalalas: 14900, popular: true },
};

export function getPlan(id: string | undefined): Plan {
  return id && id in PLANS ? PLANS[id as PlanId] : PLANS.pro;
}

// Masaar plans. Prices in SAR; Moyasar charges in halalas (SAR * 100).
export type PlanId = 'starter' | 'pro';

export type Plan = {
  id: PlanId;
  priceSar: number;
  amountHalalas: number;
  popular?: boolean;
};

export const PLANS: Record<PlanId, Plan> = {
  starter: { id: 'starter', priceSar: 199, amountHalalas: 19900 },
  pro: { id: 'pro', priceSar: 499, amountHalalas: 49900, popular: true },
};

export function getPlan(id: string | undefined): Plan {
  return id && id in PLANS ? PLANS[id as PlanId] : PLANS.pro;
}

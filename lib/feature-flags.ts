export type FeatureFlag =
  | "website"
  | "admin"
  | "appointments"
  | "inventory"
  | "prescriptions";

export type PlanTier = "plan1" | "plan2" | "plan3";

export const planFeatureMap: Record<PlanTier, FeatureFlag[]> = {
  plan1: ["website"],
  plan2: ["website", "admin", "appointments"],
  plan3: ["website", "admin", "appointments", "inventory", "prescriptions"],
};

export function resolveFeaturesForPlan(plan: PlanTier): Set<FeatureFlag> {
  return new Set(planFeatureMap[plan]);
}

export function hasFeature(plan: PlanTier, feature: FeatureFlag): boolean {
  return resolveFeaturesForPlan(plan).has(feature);
}

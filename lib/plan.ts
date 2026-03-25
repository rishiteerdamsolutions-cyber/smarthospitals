import { type PlanTier } from "@/lib/feature-flags";

export function parsePlan(value?: string): PlanTier {
  if (value === "plan1" || value === "plan2" || value === "plan3") {
    return value;
  }
  return "plan3";
}

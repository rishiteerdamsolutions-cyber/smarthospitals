import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const siteConfig = {
  name: "Smart Hospitals",
  description:
    "Complete hospital digital system for Tier 2 and Tier 3 healthcare providers.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};

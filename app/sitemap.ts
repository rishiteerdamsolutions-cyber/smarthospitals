import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");
  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/quotation`, lastModified: new Date() },
    { url: `${base}/crm`, lastModified: new Date() },
  ];
}

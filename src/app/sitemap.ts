import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { getPublicSiteConfig } from "@/lib/seo/site-config";
import { AREA_GUIDES } from "@/lib/area-guides";
import { supabase } from "@/lib/db/supabase-server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = getPublicSiteConfig();
  const base = site.url;
  const now = new Date();

  const staticPaths = ["", "/properties", "/contact", "/areas"];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      const loc =
        path === ""
          ? `${base}/${locale}`
          : `${base}/${locale}${path}`;
      entries.push({
        url: loc,
        lastModified: now,
        changeFrequency: path === "" ? "weekly" : "daily",
        priority: path === "" ? 1 : 0.8,
      });
    }

    for (const slug of Object.keys(AREA_GUIDES)) {
      entries.push({
        url: `${base}/${locale}/areas/${slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: site.primaryAreas.includes(slug) ? 0.75 : 0.6,
      });
    }
  }

  try {
    const { data: properties } = await supabase
      .from("properties")
      .select("slug, updated_at")
      .eq("status", "active");

    for (const p of properties ?? []) {
      for (const locale of locales) {
        entries.push({
          url: `${base}/${locale}/properties/${p.slug}`,
          lastModified: p.updated_at ? new Date(p.updated_at) : now,
          changeFrequency: "weekly",
          priority: 0.85,
        });
      }
    }
  } catch {
    // DB optional at build time
  }

  return entries;
}

import type { Locale } from "@/i18n/config";

/** Public marketing URL path for a locale and app path (path always starts with / or is /). */
export function localizedPublicPath(locale: Locale, path: string): string {
  const normalized = path === "/" ? "" : path;
  return `/${locale}${normalized}`;
}

export function localizedPublicUrl(
  siteUrl: string,
  locale: Locale,
  path: string
): string {
  const base = siteUrl.replace(/\/$/, "");
  return `${base}${localizedPublicPath(locale, path)}`;
}

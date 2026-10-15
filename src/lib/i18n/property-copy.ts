import type { Locale } from "@/i18n/config";

type PropertyRow = {
  title_en: string;
  title_th?: string | null;
  description_en?: string | null;
  description_th?: string | null;
  seo_title_en?: string | null;
  seo_title_th?: string | null;
  seo_description_en?: string | null;
  seo_description_th?: string | null;
};

/** Listing copy: Thai when available; Russian uses English until dedicated DB fields exist. */
export function propertyDisplayTitle(
  property: PropertyRow,
  locale: Locale
): string {
  if (locale === "th" && property.title_th) return property.title_th;
  return property.title_en;
}

export function propertyDisplayDescription(
  property: PropertyRow,
  locale: Locale
): string | null {
  if (locale === "th" && property.description_th) return property.description_th;
  return property.description_en ?? null;
}

export function propertySeoTitle(
  property: PropertyRow,
  locale: Locale
): string {
  if (locale === "th" && property.seo_title_th) return property.seo_title_th;
  if (property.seo_title_en) return property.seo_title_en;
  return propertyDisplayTitle(property, locale);
}

export function propertySeoDescription(
  property: PropertyRow,
  locale: Locale,
  fallback: string
): string {
  if (locale === "th" && property.seo_description_th) {
    return property.seo_description_th;
  }
  if (property.seo_description_en) return property.seo_description_en;
  const body = propertyDisplayDescription(property, locale);
  return body || fallback;
}

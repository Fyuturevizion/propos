import type { Locale } from "@/i18n/config";

type Guide = {
  name_en: string;
  name_th: string;
  name_ru?: string;
  tagline_en: string;
  tagline_th: string;
  tagline_ru?: string;
  description_en: string;
  description_th: string;
  description_ru?: string;
};

export function areaGuideName(guide: Guide, locale: Locale): string {
  if (locale === "th") return guide.name_th;
  if (locale === "ru") return guide.name_ru ?? guide.name_en;
  return guide.name_en;
}

export function areaGuideTagline(guide: Guide, locale: Locale): string {
  if (locale === "th") return guide.tagline_th;
  if (locale === "ru") return guide.tagline_ru ?? guide.tagline_en;
  return guide.tagline_en;
}

export function areaGuideDescription(guide: Guide, locale: Locale): string {
  if (locale === "th") return guide.description_th;
  if (locale === "ru") return guide.description_ru ?? guide.description_en;
  return guide.description_en;
}

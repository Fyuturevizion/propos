import { getTranslations } from "next-intl/server";
import { MapPin, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { AREA_GUIDES } from "@/lib/area-guides";
import {
  areaGuideDescription,
  areaGuideName,
  areaGuideTagline,
} from "@/lib/area-guide-locale";
import { isLocale, type Locale } from "@/i18n/config";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/json-ld";
import { getPublicSiteConfig } from "@/lib/seo/site-config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale: localeParam } = await params;
  const locale = (isLocale(localeParam) ? localeParam : "en") as Locale;
  const site = getPublicSiteConfig();
  const t = await getTranslations({ locale, namespace: "areasPage" });
  return buildPageMetadata({
    locale,
    path: "/areas",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function AreasIndexPage({ params }: Props) {
  const { locale: localeParam } = await params;
  const locale = (isLocale(localeParam) ? localeParam : "en") as Locale;
  const site = getPublicSiteConfig();
  const t = await getTranslations("areasPage");

  const slugs =
    site.brandId === "wnluxe"
      ? site.primaryAreas.filter((slug) => AREA_GUIDES[slug])
      : Object.keys(AREA_GUIDES);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("title"),
    itemListElement: slugs.map((slug, index) => {
      const guide = AREA_GUIDES[slug];
      const name = areaGuideName(guide, locale);
      return {
        "@type": "ListItem",
        position: index + 1,
        name,
        url: `${site.url}/${locale}/areas/${slug}`,
      };
    }),
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <JsonLd data={itemListJsonLd} />
      <div className="text-center">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>

      <ul className="mt-12 grid gap-6 md:grid-cols-2">
        {slugs.map((slug) => {
          const guide = AREA_GUIDES[slug];
          const name = areaGuideName(guide, locale);
          const tagline = areaGuideTagline(guide, locale);
          const blurb = areaGuideDescription(guide, locale);

          return (
            <li key={slug}>
              <Link
                href={`/areas/${slug}`}
                className="group flex h-full flex-col rounded-xl border p-6 transition hover:border-emerald-300 hover:bg-emerald-50/50"
              >
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <div>
                    <h2 className="text-lg font-semibold group-hover:text-emerald-800">
                      {name}
                    </h2>
                    <p className="text-sm text-emerald-700">{tagline}</p>
                  </div>
                </div>
                <p className="mt-3 flex-1 text-sm text-muted-foreground line-clamp-3">
                  {blurb}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-emerald-700">
                  {t("readGuide")}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

import type { Metadata } from "next";
import { locales, type Locale } from "@/i18n/config";
import { getPublicSiteConfig } from "./site-config";
import { localizedPublicPath, localizedPublicUrl } from "./locale-path";

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  locale?: string;
  image?: string;
  noIndex?: boolean;
};

export function buildPageMetadata(input: PageMetaInput): Metadata {
  const site = getPublicSiteConfig();
  const locale = (input.locale || "en") as Locale;
  const canonicalPath = localizedPublicPath(locale, input.path);
  const canonical = `${site.url}${canonicalPath}`;

  const title =
    input.title.includes(site.name) ? input.title : `${input.title} | ${site.name}`;

  return {
    title,
    description: input.description,
    alternates: {
      canonical,
      languages: Object.fromEntries(
        locales.map((code) => [
          code,
          localizedPublicUrl(site.url, code, input.path),
        ])
      ),
    },
    openGraph: {
      title,
      description: input.description,
      url: canonical,
      siteName: site.name,
      type: "website",
      locale:
        locale === "th"
          ? "th_TH"
          : locale === "ru"
            ? "ru_RU"
            : "en_US",
      images: input.image ? [{ url: input.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: input.description,
    },
    robots: input.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function rootMetadata(): Metadata {
  const site = getPublicSiteConfig();
  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} | ${site.tagline}`,
      template: `%s | ${site.name}`,
    },
    description: site.description,
    applicationName: site.name,
    keywords: [
      site.name,
      "Phuket real estate",
      "luxury villa Phuket",
      "Cherng Talay",
      "Pasak",
      "Bang Tao",
      "pool villa",
      "Thailand property",
    ],
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: site.name,
    },
    openGraph: {
      title: `${site.name} | ${site.tagline}`,
      description: site.description,
      siteName: site.name,
      type: "website",
    },
  };
}

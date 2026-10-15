import type { Metadata } from "next";
import { getPublicSiteConfig } from "./site-config";

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
  const locale = input.locale || "en";
  const canonicalPath =
    locale === "en" ? input.path : `/${locale}${input.path === "/" ? "" : input.path}`;
  const canonical = `${site.url}${canonicalPath === "/" ? "" : canonicalPath}`;

  const title =
    input.title.includes(site.name) ? input.title : `${input.title} | ${site.name}`;

  return {
    title,
    description: input.description,
    alternates: {
      canonical,
      languages: {
        en: `${site.url}${input.path === "/" ? "" : input.path}`,
        th: `${site.url}/th${input.path === "/" ? "" : input.path}`,
      },
    },
    openGraph: {
      title,
      description: input.description,
      url: canonical,
      siteName: site.name,
      type: "website",
      locale: locale === "th" ? "th_TH" : "en_US",
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

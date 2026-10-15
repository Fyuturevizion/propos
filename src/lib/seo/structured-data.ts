import { getPublicSiteConfig } from "./site-config";

export function organizationJsonLd() {
  const site = getPublicSiteConfig();
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: site.legalName,
    url: site.url,
    description: site.description,
    email: site.contactEmail,
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Phuket, Thailand",
    },
    sameAs: site.sameAs.length ? site.sameAs : undefined,
  };
}

export function webSiteJsonLd() {
  const site = getPublicSiteConfig();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
    inLanguage: ["en", "th"],
    potentialAction: {
      "@type": "SearchAction",
      target: `${site.url}/en/properties?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function faqPageJsonLd(
  items: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function realEstateListingJsonLd(property: {
  title: string;
  description?: string | null;
  slug: string;
  priceThb?: string | number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  areaDistrict?: string | null;
  images?: string[] | null;
  listingType?: string | null;
}) {
  const site = getPublicSiteConfig();
  const url = `${site.url}/en/properties/${property.slug}`;
  const images = (property.images || []).slice(0, 5).map((img) =>
    img.startsWith("http") || img.startsWith("/")
      ? img.startsWith("/")
        ? `${site.url}${img}`
        : img
      : `${site.url}${img}`
  );

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description || undefined,
    url,
    image: images.length ? images : undefined,
    offers: property.priceThb
      ? {
          "@type": "Offer",
          price: Number(property.priceThb),
          priceCurrency: "THB",
        }
      : undefined,
    address: property.areaDistrict
      ? {
          "@type": "PostalAddress",
          addressLocality: property.areaDistrict,
          addressRegion: "Phuket",
          addressCountry: "TH",
        }
      : undefined,
    numberOfRooms: property.bedrooms ?? undefined,
    numberOfBathroomsTotal: property.bathrooms ?? undefined,
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>
) {
  const site = getPublicSiteConfig();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
}

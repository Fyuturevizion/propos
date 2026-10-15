import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as "en" | "th")) {
    locale = routing.defaultLocale;
  }
  const base = (await import(`../messages/${locale}.json`)).default;
  let messages = base;

  if (
    process.env.NEXT_PUBLIC_BRAND_ID === "wnluxe" &&
    locale === "en"
  ) {
    try {
      const brand = (await import(`../messages/brands/wnluxe.en.json`))
        .default;
      messages = {
        ...base,
        ...brand,
        home: {
          ...base.home,
          ...brand.home,
          whyUs: { ...base.home.whyUs, ...brand.home.whyUs },
          trust: { ...base.home.trust, ...brand.home.trust },
        },
        properties: { ...base.properties, ...brand.properties },
        contact: { ...base.contact, ...brand.contact },
        areasPage: { ...base.areasPage, ...brand.areasPage },
      };
    } catch {
      // brand overlay optional
    }
  }

  return {
    locale,
    messages,
  };
});

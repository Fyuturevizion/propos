import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { isLocale, type Locale } from "./config";
import { loadAppMessages } from "@/lib/i18n/brand-messages";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !isLocale(locale)) {
    locale = routing.defaultLocale;
  }

  const messages = await loadAppMessages(locale as Locale);

  return {
    locale,
    messages,
  };
});

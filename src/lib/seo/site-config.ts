function trimEnv(key: string): string | undefined {
  const v = process.env[key];
  if (v == null) return undefined;
  const t = v.trim();
  return t === "" ? undefined : t;
}

export type PublicSiteConfig = {
  brandId: "wnluxe" | "propos";
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  url: string;
  logoLetter: string;
  /** Public enquiries address for UI/SEO; null when not configured (use contact form). */
  contactEmail: string | null;
  sameAs: string[];
  primaryAreas: string[];
};

/** WhatsApp click-to-chat URL from E.164 in NEXT_PUBLIC_WHATSAPP_E164, or null if unset/invalid. */
export function getWhatsappChatUrl(): string | null {
  const raw = trimEnv("NEXT_PUBLIC_WHATSAPP_E164");
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}`;
}

export type ResolvedContactChannels = {
  whatsappHref: string | null;
  lineHref: string | null;
  lineSubtitle: string | null;
  telegramHref: string | null;
  telegramSubtitle: string | null;
  emailAddress: string | null;
};

/**
 * Public marketing contact links. WN Luxe uses env only (no placeholder inboxes).
 * PropOS (TTT) keeps LINE/Telegram defaults when env is unset for backwards compatibility.
 */
export function getResolvedContactChannels(
  site: PublicSiteConfig
): ResolvedContactChannels {
  const isWnluxe = site.brandId === "wnluxe";
  const envLine = trimEnv("NEXT_PUBLIC_LINE_URL");
  const envTg = trimEnv("NEXT_PUBLIC_TELEGRAM_URL");
  const envLineHandle = trimEnv("NEXT_PUBLIC_LINE_HANDLE");
  const envTgHandle = trimEnv("NEXT_PUBLIC_TELEGRAM_HANDLE");

  const lineHref =
    envLine ?? (!isWnluxe ? "https://line.me/ti/p/@ttt-properties" : null);
  const lineSubtitle =
    envLineHandle ??
    (lineHref && lineHref.includes("line.me")
      ? `@${lineHref.split("/").pop()?.replace(/^@/, "") || "ttt-properties"}`
      : !isWnluxe
        ? "@ttt-properties"
        : null);

  const telegramHref =
    envTg ?? (!isWnluxe ? "https://t.me/TTT_Properties_Bot" : null);
  const telegramSubtitle =
    envTgHandle ??
    (telegramHref && telegramHref.includes("t.me/")
      ? `@${telegramHref.split("t.me/").pop()?.split("?")[0]?.replace(/^@/, "") || "TTT_Properties_Bot"}`
      : !isWnluxe
        ? "@TTT_Properties_Bot"
        : null);

  return {
    whatsappHref: getWhatsappChatUrl(),
    lineHref,
    lineSubtitle,
    telegramHref,
    telegramSubtitle,
    emailAddress: site.contactEmail,
  };
}

export function getPublicSiteConfig(): PublicSiteConfig {
  const isWnluxe = process.env.NEXT_PUBLIC_BRAND_ID === "wnluxe";
  const url = (process.env.NEXT_PUBLIC_APP_URL || "https://wnluxe.com").replace(
    /\/$/,
    ""
  );

  const envEmail = trimEnv("NEXT_PUBLIC_CONTACT_EMAIL");
  const contactEmail = envEmail ?? (!isWnluxe ? "hello@tttproperties.com" : null);

  if (isWnluxe) {
    return {
      brandId: "wnluxe",
      name: "WN LUXE Estates",
      legalName: "WN LUXE Estates",
      tagline: "Phuket Real Estate",
      description:
        "Luxury villas and homes for sale and rent in Phuket, with local guidance in English, Thai, and Russian.",
      url,
      logoLetter: "W",
      contactEmail,
      sameAs: ["https://www.thewynnphuket.com"],
      primaryAreas: ["cherngtalay", "laguna", "bangtao", "pasak"],
    };
  }

  return {
    brandId: "propos",
    name: "TTT Properties",
    legalName: "TTT Properties",
    tagline: "Phuket real estate",
    description:
      "TTT Properties is a Phuket real estate partner for villas, condos, and land, with local guidance in English and Thai.",
    url: url === "https://wnluxe.com" ? "https://tttproperties.com" : url,
    logoLetter: "T",
    contactEmail,
    sameAs: [],
    primaryAreas: ["bangtao", "surin", "kata", "cherngtalay", "rawai"],
  };
}

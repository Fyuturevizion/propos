export type PublicSiteConfig = {
  brandId: "wnluxe" | "propos";
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  url: string;
  logoLetter: string;
  contactEmail: string;
  sameAs: string[];
  primaryAreas: string[];
};

export function getPublicSiteConfig(): PublicSiteConfig {
  const isWnluxe = process.env.NEXT_PUBLIC_BRAND_ID === "wnluxe";
  const url = (process.env.NEXT_PUBLIC_APP_URL || "https://wnluxe.com").replace(
    /\/$/,
    ""
  );

  if (isWnluxe) {
    return {
      brandId: "wnluxe",
      name: "WN Luxe",
      legalName: "WN Luxe Phuket",
      tagline: "Luxury pool villas in Pasak and Cherng Talay",
      description:
        "WN Luxe helps buyers and renters find luxury pool villas near Bang Tao and Laguna in Phuket, with clear advice in English, Thai, and Russian.",
      url,
      logoLetter: "W",
      contactEmail: "hello@wnluxe.com",
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
    contactEmail: "hello@tttproperties.com",
    sameAs: [],
    primaryAreas: ["bangtao", "surin", "kata", "cherngtalay", "rawai"],
  };
}

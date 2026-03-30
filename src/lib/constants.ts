export const PHUKET_AREAS = [
  { slug: "bangtao", name_en: "Bang Tao", name_th: "บางเทา" },
  { slug: "surin", name_en: "Surin", name_th: "สุรินทร์" },
  { slug: "rawai", name_en: "Rawai", name_th: "ราไวย์" },
  { slug: "kamala", name_en: "Kamala", name_th: "กมลา" },
  { slug: "kata", name_en: "Kata", name_th: "กะตะ" },
  { slug: "karon", name_en: "Karon", name_th: "กะรน" },
  { slug: "cherngtalay", name_en: "Cherng Talay", name_th: "เชิงทะเล" },
  { slug: "sisunthon", name_en: "Si Sunthon", name_th: "ศรีสุนทร" },
  { slug: "thalang", name_en: "Thalang", name_th: "ถลาง" },
  { slug: "patong", name_en: "Patong", name_th: "ป่าตอง" },
  { slug: "naiharn", name_en: "Nai Harn", name_th: "ในหาน" },
  { slug: "laguna", name_en: "Laguna", name_th: "ลากูน่า" },
  { slug: "phukettown", name_en: "Phuket Town", name_th: "เมืองภูเก็ต" },
] as const;

export const PROPERTY_TYPES = [
  "villa",
  "condo",
  "land",
  "townhouse",
  "apartment",
] as const;

export const LISTING_TYPES = ["sale", "rent", "sale_rent"] as const;

export const LEAD_STATUSES = [
  "new",
  "qualified",
  "viewing",
  "offer",
  "negotiation",
  "closed_won",
  "closed_lost",
] as const;

export const LEAD_SCORES = ["hot", "warm", "cold"] as const;

export const PLATFORMS = [
  "website",
  "whatsapp",
  "telegram",
  "line",
  "email",
] as const;

export const OWNERSHIP_TYPES = ["freehold", "leasehold", "company"] as const;

export type PhuketArea = (typeof PHUKET_AREAS)[number];
export type PropertyType = (typeof PROPERTY_TYPES)[number];
export type ListingType = (typeof LISTING_TYPES)[number];
export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type LeadScore = (typeof LEAD_SCORES)[number];
export type Platform = (typeof PLATFORMS)[number];
export type OwnershipType = (typeof OWNERSHIP_TYPES)[number];

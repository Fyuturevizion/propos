import { wnluxeBrand } from "./wnluxe";

export type BrandId = "propos" | "wnluxe";

const brands = {
  propos: {
    id: "propos" as const,
    name: "PropOS",
    googleDriveFolderId: "",
  },
  wnluxe: wnluxeBrand,
};

export function getBrandId(): BrandId {
  const raw = process.env.NEXT_PUBLIC_BRAND_ID?.toLowerCase();
  if (raw === "wnluxe") return "wnluxe";
  return "propos";
}

export function getActiveBrand() {
  return brands[getBrandId()];
}

export { wnluxeBrand };

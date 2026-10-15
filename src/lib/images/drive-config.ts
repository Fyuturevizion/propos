import { getActiveBrand, getBrandId, wnluxeBrand } from "@/lib/brands";
import { extractGoogleDriveFolderId } from "./google-drive";

/** Resolved WN Luxe / brand Drive folder id for listing photo import */
export function resolveDriveFolderId(): string {
  const brand = getActiveBrand();
  const candidates = [
    process.env.WNLUXE_DRIVE_PHOTOS_ROOT_ID,
    process.env.WNLUXE_GOOGLE_DRIVE_FOLDER_ID,
    process.env.NEXT_PUBLIC_WNLUXE_GOOGLE_DRIVE_FOLDER_ID,
    brand.googleDriveFolderId,
    process.env.WNLUXE_GOOGLE_DRIVE_FOLDER_URL,
    process.env.NEXT_PUBLIC_WNLUXE_GOOGLE_DRIVE_FOLDER_URL,
    getBrandId() === "wnluxe" ? wnluxeBrand.googleDriveFolderUrl : "",
  ].filter(Boolean) as string[];

  for (const raw of candidates) {
    const id = extractGoogleDriveFolderId(raw);
    if (id) return id;
  }

  return "";
}

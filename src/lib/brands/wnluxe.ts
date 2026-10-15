/**
 * WN Luxe — The Wynn luxury villas (Pasak / Cherng Talay).
 * Listing photos are maintained in Google Drive; the app serves them via /api/cdn/image.
 */
export const wnluxeBrand = {
  id: "wnluxe",
  name: "WN Luxe",
  publicSiteLabel: "The Wynn Luxury Villas",
  defaultAreaDistrict: "Cherng Talay",
  /** Override with WNLUXE_GOOGLE_DRIVE_FOLDER_ID in env */
  googleDriveFolderId: process.env.WNLUXE_GOOGLE_DRIVE_FOLDER_ID ?? "",
  googleDriveFolderUrl:
    process.env.WNLUXE_GOOGLE_DRIVE_FOLDER_URL ??
    "https://drive.google.com/drive/folders/",
} as const;

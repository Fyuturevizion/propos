import {
  driveFileIdFromStored,
  extractGoogleDriveFileId,
  isDriveStoredRef,
} from "./google-drive";

export function cdnImagePath(fileId: string, width = 1200): string {
  const w = Math.min(Math.max(width, 200), 2560);
  return `/api/cdn/image?id=${encodeURIComponent(fileId)}&w=${w}`;
}

/**
 * Turn a stored property image value into a URL the browser can load.
 * Drive refs and raw Drive links go through the app CDN proxy.
 */
export function resolvePropertyImageUrl(
  stored: string,
  options?: { width?: number }
): string {
  const width = options?.width ?? 1200;

  if (!stored) return "";

  if (isDriveStoredRef(stored)) {
    const id = driveFileIdFromStored(stored);
    return id ? cdnImagePath(id, width) : "";
  }

  if (stored.startsWith("http://") || stored.startsWith("https://")) {
    const driveId = extractGoogleDriveFileId(stored);
    if (driveId) return cdnImagePath(driveId, width);
    return stored;
  }

  const driveId = extractGoogleDriveFileId(stored);
  if (driveId) return cdnImagePath(driveId, width);

  return stored;
}

export function resolvePropertyImages(
  images: string[] | null | undefined,
  options?: { width?: number }
): string[] {
  if (!images?.length) return [];
  return images
    .map((img) => resolvePropertyImageUrl(img, options))
    .filter(Boolean);
}

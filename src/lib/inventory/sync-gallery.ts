import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase as defaultSupabase } from "@/lib/db/supabase-server";
import { resolvePhotoCellToImageRefs } from "@/lib/google/drive-photos";
import { extractGoogleDriveFolderId } from "@/lib/images/google-drive";
import { getGoogleAccessTokenResult } from "@/lib/google/access-token";
import { loadInventoryByRef } from "./load-listing";

export type SyncGalleryResult = {
  propertyRef: string;
  imageRefs: string[];
  folderId: string | null;
  syncedAt: string;
};

function photosRootFromEnv(): string | undefined {
  return (
    process.env.WNLUXE_DRIVE_PHOTOS_ROOT_ID ||
    process.env.WNLUXE_GOOGLE_DRIVE_FOLDER_ID ||
    undefined
  );
}

/**
 * Resolve Google Drive folder / link from inventory into stored `gdrive:` image refs.
 */
export async function syncInventoryGallery(
  propertyRef: string,
  options?: { supabase?: SupabaseClient; maxFiles?: number }
): Promise<SyncGalleryResult> {
  const client = options?.supabase ?? defaultSupabase;
  const maxFiles = options?.maxFiles ?? 24;

  const row = await loadInventoryByRef(propertyRef, { supabase: client });
  if (!row) throw new Error(`Inventory listing not found: ${propertyRef}`);

  const tokenCheck = await getGoogleAccessTokenResult();
  if (!tokenCheck.ok && row.photo_url) {
    throw new Error(tokenCheck.reason);
  }

  const photoCell = (row.photo_url as string | null)?.trim() ?? "";
  if (!photoCell) {
    return {
      propertyRef,
      imageRefs: (row.gallery_files as string[] | null) ?? [],
      folderId: null,
      syncedAt: new Date().toISOString(),
    };
  }

  let imageRefs: string[] = [];
  let folderId: string | null = null;
  try {
    const resolved = await resolvePhotoCellToImageRefs(photoCell, {
      photosRootFolderId: photosRootFromEnv(),
      maxImages: maxFiles,
    });
    imageRefs = resolved.imageRefs;
    folderId = resolved.folderId;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Drive folder sync failed";
    throw new Error(`${msg} (ref ${propertyRef})`);
  }

  const folderFromUrl = extractGoogleDriveFolderId(photoCell);
  const resolvedFolderId = folderId ?? folderFromUrl;

  const syncedAt = new Date().toISOString();
  const { error: updateError } = await client
    .from("inventory_listings")
    .update({
      gallery_files: imageRefs,
      photos_synced_at: syncedAt,
      updated_at: syncedAt,
    })
    .eq("id", row.id);

  if (updateError) throw new Error(updateError.message);

  return {
    propertyRef,
    imageRefs,
    folderId: resolvedFolderId,
    syncedAt,
  };
}

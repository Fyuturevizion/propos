import { getGoogleAccessToken } from "./access-token";
import {
  extractGoogleDriveFileId,
  extractGoogleDriveFolderId,
  toStoredDriveRef,
} from "@/lib/images/google-drive";

type DriveFile = { id: string; name: string; mimeType?: string };

async function driveGet<T>(path: string): Promise<T> {
  const token = await getGoogleAccessToken();
  if (!token) throw new Error("Google Drive not connected.");

  const res = await fetch(`https://www.googleapis.com/drive/v3/${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`Drive API error: ${res.status} ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

/** Find a child folder by exact name under a parent folder */
export async function findChildFolderByName(
  parentFolderId: string,
  name: string
): Promise<string | null> {
  const trimmed = name.trim();
  if (!trimmed) return null;

  const q = encodeURIComponent(
    `'${parentFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and name = '${trimmed.replace(/'/g, "\\'")}' and trashed = false`
  );
  const data = await driveGet<{ files?: DriveFile[] }>(
    `files?q=${q}&fields=files(id,name)&pageSize=5`
  );
  return data.files?.[0]?.id ?? null;
}

/** Global search for a folder by exact name (when root is unknown) */
export async function findFolderByName(name: string): Promise<string | null> {
  const trimmed = name.trim();
  if (!trimmed) return null;

  const q = encodeURIComponent(
    `mimeType = 'application/vnd.google-apps.folder' and name = '${trimmed.replace(/'/g, "\\'")}' and trashed = false`
  );
  const data = await driveGet<{ files?: DriveFile[] }>(
    `files?q=${q}&fields=files(id,name)&pageSize=3`
  );
  return data.files?.[0]?.id ?? null;
}

export async function listImageFileIdsInFolder(
  folderId: string,
  limit = 20
): Promise<string[]> {
  const q = encodeURIComponent(
    `'${folderId}' in parents and trashed = false and mimeType contains 'image/'`
  );
  const data = await driveGet<{ files?: DriveFile[] }>(
    `files?q=${q}&fields=files(id)&pageSize=${limit}&orderBy=name`
  );
  return (data.files ?? []).map((f) => f.id);
}

/**
 * Turn a spreadsheet "Photo" cell into stored image refs.
 * Supports: Drive folder/file URLs, folder codes (J070, SV-006), or existing gdrive: refs.
 */
export async function resolvePhotoCellToImageRefs(
  photoCell: string,
  options?: { photosRootFolderId?: string; maxImages?: number }
): Promise<{ folderId: string | null; imageRefs: string[] }> {
  const cell = (photoCell ?? "").trim();
  if (!cell || cell === "-" || cell.toLowerCase() === "tbc") {
    return { folderId: null, imageRefs: [] };
  }

  const maxImages = options?.maxImages ?? 15;
  const root = options?.photosRootFolderId;

  const folderFromUrl = extractGoogleDriveFolderId(cell);
  if (folderFromUrl) {
    const ids = await listImageFileIdsInFolder(folderFromUrl, maxImages);
    return {
      folderId: folderFromUrl,
      imageRefs: ids.map(toStoredDriveRef),
    };
  }

  const fileFromUrl = extractGoogleDriveFileId(cell);
  if (fileFromUrl && cell.startsWith("http")) {
    return { folderId: null, imageRefs: [toStoredDriveRef(fileFromUrl)] };
  }

  if (cell.startsWith("gdrive:")) {
    return { folderId: null, imageRefs: [cell] };
  }

  // Treat as folder name / property photo code (J070, SV-006, K001, …)
  const code = cell.split(/[\s,]/)[0]?.trim();
  if (!code) return { folderId: null, imageRefs: [] };

  let folderId: string | null = null;
  if (root) {
    folderId = await findChildFolderByName(root, code);
  }
  if (!folderId) {
    folderId = await findFolderByName(code);
  }
  if (!folderId) {
    return { folderId: null, imageRefs: [] };
  }

  const ids = await listImageFileIdsInFolder(folderId, maxImages);
  return { folderId, imageRefs: ids.map(toStoredDriveRef) };
}

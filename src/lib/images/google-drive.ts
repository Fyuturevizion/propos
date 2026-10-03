const DRIVE_FILE_ID_RE = /^[\w-]{10,}$/;

/** Extract a Google Drive file id from common share / embed URLs */
export function extractGoogleDriveFileId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("gdrive:")) {
    const id = trimmed.slice("gdrive:".length);
    return DRIVE_FILE_ID_RE.test(id) ? id : null;
  }

  if (DRIVE_FILE_ID_RE.test(trimmed) && !trimmed.includes("/")) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "drive.google.com") {
      const pathMatch = url.pathname.match(/\/file\/d\/([^/]+)/);
      if (pathMatch?.[1]) return pathMatch[1];

      const openId = url.searchParams.get("id");
      if (openId) return openId;
    }

    if (host === "docs.google.com") {
      const pathMatch = url.pathname.match(/\/d\/([^/]+)/);
      if (pathMatch?.[1]) return pathMatch[1];
    }

    if (host === "lh3.googleusercontent.com") {
      const dMatch = url.pathname.match(/\/d\/([^/=]+)/);
      if (dMatch?.[1]) return dMatch[1];
    }
  } catch {
    return null;
  }

  return null;
}

/** Canonical value stored in `properties.images` for Drive files */
export function toStoredDriveRef(fileId: string): string {
  return `gdrive:${fileId}`;
}

export function parseImageLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Normalize user paste (URLs or ids) into stored image refs */
export function normalizeImageInputs(inputs: string[]): string[] {
  const out: string[] = [];

  for (const raw of inputs) {
    if (raw.startsWith("gdrive:")) {
      out.push(raw);
      continue;
    }

    if (raw.startsWith("http://") || raw.startsWith("https://")) {
      const driveId = extractGoogleDriveFileId(raw);
      if (driveId) {
        out.push(toStoredDriveRef(driveId));
      } else {
        out.push(raw);
      }
      continue;
    }

    const driveId = extractGoogleDriveFileId(raw);
    if (driveId) {
      out.push(toStoredDriveRef(driveId));
    }
  }

  return [...new Set(out)];
}

export function isDriveStoredRef(value: string): boolean {
  return value.startsWith("gdrive:");
}

export function driveFileIdFromStored(value: string): string | null {
  if (!isDriveStoredRef(value)) return null;
  const id = value.slice("gdrive:".length);
  return DRIVE_FILE_ID_RE.test(id) ? id : null;
}

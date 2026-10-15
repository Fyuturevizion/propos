import { NextRequest, NextResponse } from "next/server";
import { getGoogleAccessToken } from "@/lib/google/access-token";
import { toStoredDriveRef } from "@/lib/images/google-drive";
import { resolveDriveFolderId } from "@/lib/images/drive-config";

type DriveFile = {
  id: string;
  name: string;
  mimeType?: string;
  thumbnailLink?: string;
};

export async function GET(req: NextRequest) {
  const folderId =
    req.nextUrl.searchParams.get("folderId") || resolveDriveFolderId();

  if (!folderId) {
    return NextResponse.json(
      {
        error:
          "No folder id. Set WNLUXE_GOOGLE_DRIVE_FOLDER_ID or pass ?folderId=.",
      },
      { status: 400 }
    );
  }

  const token = await getGoogleAccessToken();
  if (!token) {
    return NextResponse.json(
      {
        error:
          "Google Drive not connected. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN.",
      },
      { status: 503 }
    );
  }

  const q = encodeURIComponent(
    `'${folderId}' in parents and trashed = false and mimeType contains 'image/'`
  );
  const fields = encodeURIComponent("files(id,name,mimeType,thumbnailLink)");
  const url = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=${fields}&pageSize=100&orderBy=name`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const detail = await res.text();
    return NextResponse.json(
      { error: "Drive API error", detail },
      { status: res.status }
    );
  }

  const data = (await res.json()) as { files?: DriveFile[] };
  const files = data.files ?? [];

  return NextResponse.json({
    folderId,
    count: files.length,
    files: files.map((f) => ({
      id: f.id,
      name: f.name,
      mimeType: f.mimeType,
      storedRef: toStoredDriveRef(f.id),
      cdnUrl: `/api/cdn/image?id=${encodeURIComponent(f.id)}&w=800`,
      thumbnailLink: f.thumbnailLink,
    })),
    imageRefs: files.map((f) => toStoredDriveRef(f.id)),
  });
}

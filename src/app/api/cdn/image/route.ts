import { NextRequest, NextResponse } from "next/server";
import { getGoogleAccessToken } from "@/lib/google/access-token";

const FILE_ID_RE = /^[\w-]{10,}$/;

async function fetchDriveImage(
  fileId: string,
  width: number
): Promise<Response | null> {
  const thumbnailUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w${width}`;
  let res = await fetch(thumbnailUrl, { redirect: "follow" });

  const type = res.headers.get("content-type") ?? "";
  if (res.ok && type.startsWith("image/")) {
    return res;
  }

  res = await fetch(`https://drive.google.com/uc?export=view&id=${fileId}`, {
    redirect: "follow",
  });
  const type2 = res.headers.get("content-type") ?? "";
  if (res.ok && type2.startsWith("image/")) {
    return res;
  }

  const token = await getGoogleAccessToken();
  if (!token) return null;

  return fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${token}` },
    redirect: "follow",
  });
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const widthParam = parseInt(req.nextUrl.searchParams.get("w") || "1200", 10);
  const width = Math.min(Math.max(widthParam || 1200, 200), 2560);

  if (!id || !FILE_ID_RE.test(id)) {
    return NextResponse.json({ error: "Invalid file id" }, { status: 400 });
  }

  const upstream = await fetchDriveImage(id, width);
  if (!upstream?.ok) {
    return NextResponse.json(
      {
        error:
          "Image not available. Ensure the file is shared (anyone with the link) or connect Google Drive in settings.",
      },
      { status: 404 }
    );
  }

  const buffer = await upstream.arrayBuffer();
  const contentType =
    upstream.headers.get("content-type")?.split(";")[0] || "image/jpeg";

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
    },
  });
}

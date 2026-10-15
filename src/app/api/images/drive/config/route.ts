import { NextResponse } from "next/server";
import { getBrandId } from "@/lib/brands";
import { resolveDriveFolderId } from "@/lib/images/drive-config";

/** Public config for CRM Drive image picker (folder id only, no secrets) */
export async function GET() {
  const folderId = resolveDriveFolderId();

  return NextResponse.json({
    brandId: getBrandId(),
    driveFolderId: folderId || null,
    folderImportEnabled: Boolean(folderId),
  });
}

import { NextRequest, NextResponse } from "next/server";
import {
  syncSheetTab,
  WNLUXE_SHEET_TABS,
  type SheetTabConfig,
} from "@/lib/sync/wnluxe-sheet";
import { resolveDriveFolderId } from "@/lib/images/drive-config";

function authorize(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  const header = req.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

export async function POST(req: NextRequest) {
  if (!authorize(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const tabName = (body.tab as string) || req.nextUrl.searchParams.get("tab");
  const limitParam = parseInt(req.nextUrl.searchParams.get("limit") || "0", 10);
  const limit =
    body.limit ??
    (limitParam > 0 ? limitParam : undefined);
  const onlyRef = body.ref as string | undefined;
  const photosRoot =
    (body.photosRootFolderId as string) ||
    resolveDriveFolderId() ||
    process.env.WNLUXE_DRIVE_PHOTOS_ROOT_ID;

  const tabs: SheetTabConfig[] = tabName
    ? WNLUXE_SHEET_TABS.filter((t) => t.tabName === tabName)
    : WNLUXE_SHEET_TABS;

  if (!tabs.length) {
    return NextResponse.json(
      {
        error: "Unknown tab",
        availableTabs: WNLUXE_SHEET_TABS.map((t) => t.tabName),
      },
      { status: 400 }
    );
  }

  if (!photosRoot) {
    return NextResponse.json(
      {
        error:
          "Set WNLUXE_DRIVE_PHOTOS_ROOT_ID (or WNLUXE_GOOGLE_DRIVE_FOLDER_ID) to the Drive folder that contains photo subfolders named like J070, SV-006, etc.",
        sheetId: process.env.WNLUXE_SHEET_ID ?? "1tL7C6X7KGcDnVSIrqrmMT0KXzxmzq0q6kgmoqaSoSPg",
      },
      { status: 400 }
    );
  }

  const allResults = [];
  for (const tab of tabs) {
    const results = await syncSheetTab({
      tab,
      photosRootFolderId: photosRoot,
      limit: tabName ? limit : limit ? Math.min(limit, 5) : 3,
      onlyRef,
    });
    allResults.push({ tab: tab.tabName, results });
  }

  return NextResponse.json({
    ok: true,
    photosRootFolderId: photosRoot,
    synced: allResults,
  });
}

export async function GET() {
  return NextResponse.json({
    sheetId:
      process.env.WNLUXE_SHEET_ID ??
      "1tL7C6X7KGcDnVSIrqrmMT0KXzxmzq0q6kgmoqaSoSPg",
    sheetUrl:
      "https://docs.google.com/spreadsheets/d/1tL7C6X7KGcDnVSIrqrmMT0KXzxmzq0q6kgmoqaSoSPg/edit",
    tabs: WNLUXE_SHEET_TABS.map((t) => t.tabName),
    photosRootConfigured: Boolean(
      resolveDriveFolderId() || process.env.WNLUXE_DRIVE_PHOTOS_ROOT_ID
    ),
    howPhotoColumnWorks:
      "Photo cell = subfolder name under photos root (e.g. J070), or a Drive folder/file URL",
  });
}

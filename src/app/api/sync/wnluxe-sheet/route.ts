import { NextRequest, NextResponse } from "next/server";
import {
  syncSheetTab,
  WNLUXE_PROPERTY_SHEET_ID,
  WNLUXE_PROPERTY_SHEET_URL,
  WNLUXE_SHEET_TABS,
  type SheetTabConfig,
} from "@/lib/sync/wnluxe-sheet";
import { resolveDriveFolderId } from "@/lib/images/drive-config";
import { isDashboardAuthed } from "@/lib/auth/dashboard-gate";

async function authorize(req: NextRequest): Promise<boolean> {
  const secret = process.env.CRON_SECRET;
  const header = req.headers.get("authorization");
  if (secret && header === `Bearer ${secret}`) return true;
  return isDashboardAuthed();
}

export async function POST(req: NextRequest) {
  if (!(await authorize(req))) {
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

  const allResults = [];
  for (const tab of tabs) {
    const results = await syncSheetTab({
      tab,
      photosRootFolderId: photosRoot || undefined,
      limit: tabName ? limit : limit ? Math.min(limit, 5) : 3,
      onlyRef,
    });
    allResults.push({ tab: tab.tabName, results });
  }

  return NextResponse.json({
    ok: true,
    sheetUrl: WNLUXE_PROPERTY_SHEET_URL,
    photosRootFolderId: photosRoot ?? null,
    photosRootWarning: photosRoot
      ? null
      : "WNLUXE_DRIVE_PHOTOS_ROOT_ID not set — folder codes (J100) need it; Drive hyperlinks in Photo column still work.",
    synced: allResults,
  });
}

export async function GET() {
  return NextResponse.json({
    sheetId: WNLUXE_PROPERTY_SHEET_ID,
    sheetUrl: WNLUXE_PROPERTY_SHEET_URL,
    tabs: WNLUXE_SHEET_TABS.map((t) => t.tabName),
    photosRootConfigured: Boolean(
      resolveDriveFolderId() || process.env.WNLUXE_DRIVE_PHOTOS_ROOT_ID
    ),
    howPhotoColumnWorks:
      "Photo cells with embedded links use the hyperlink URL (Drive folder). Plain text uses WNLUXE_DRIVE_PHOTOS_ROOT_ID + folder name (e.g. J100).",
  });
}

import { NextRequest, NextResponse } from "next/server";
import { publishInventoryToWebsite } from "@/lib/inventory/publish-to-website";
import { syncInventoryGallery } from "@/lib/inventory/sync-gallery";
import {
  loadFirstInventoryRef,
  loadInventoryByRef,
} from "@/lib/inventory/load-listing";

function authorizeCron(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

/** Server/cron: publish (and sync photos) for one inventory ref or the first row. */
export async function POST(req: NextRequest) {
  if (!authorizeCron(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const syncOnly = Boolean(body.syncOnly);
  let propertyRef = (body.ref as string | undefined)?.trim();

  if (!propertyRef) {
    propertyRef = (await loadFirstInventoryRef()) ?? "";
  }

  if (!propertyRef) {
    return NextResponse.json(
      { error: "No inventory rows found" },
      { status: 404 }
    );
  }

  const row = await loadInventoryByRef(propertyRef);
  if (!row) {
    return NextResponse.json(
      { error: `Inventory listing not found: ${propertyRef}` },
      { status: 404 }
    );
  }

  try {
    if (syncOnly) {
      const synced = await syncInventoryGallery(propertyRef);
      return NextResponse.json({ ok: true, ...synced });
    }

    const result = await publishInventoryToWebsite(propertyRef, {
      syncPhotosFirst: true,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Publish failed";
    return NextResponse.json(
      { error: message, propertyRef },
      { status: 500 }
    );
  }
}

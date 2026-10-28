export const dynamic = "force-dynamic";

import { getAgent } from "@/lib/auth";
import { supabase } from "@/lib/db/supabase-server";
import { InventoryListingsBoard } from "@/components/dashboard/inventory-listings-board";
import { SheetSyncPanel } from "@/components/dashboard/sheet-sync-panel";
import { slugFromPropertyRef } from "@/lib/inventory/spreadsheet";

export default async function InventoryPage() {
  await getAgent();

  const { data: inventory, error: inventoryError } = await supabase
    .from("inventory_listings")
    .select(
      "id, property_ref, listing_type, location, project_name, photo_url, map_url, price_thb, price_raw, bedrooms, bathrooms, beds_baths_raw, gallery_files, is_published, published_property_id, photos_synced_at"
    )
    .order("property_ref", { ascending: true });

  const rows = (inventory ?? []).map((row) => ({
    ...row,
    gallery_files: (row.gallery_files as string[] | null) ?? null,
  }));

  const propertyIds = rows
    .filter((r) => r.published_property_id)
    .map((r) => r.published_property_id as string);

  const publishedSlugs: Record<string, string> = {};
  if (propertyIds.length) {
    const { data: properties } = await supabase
      .from("properties")
      .select("id, slug")
      .in("id", propertyIds);
    const slugById = new Map(
      (properties ?? []).map((p) => [p.id, p.slug as string])
    );
    for (const row of rows) {
      if (row.published_property_id) {
        const slug = slugById.get(row.published_property_id);
        if (slug) publishedSlugs[row.property_ref] = slug;
      } else {
        publishedSlugs[row.property_ref] = slugFromPropertyRef(row.property_ref);
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Property inventory</h1>
        <p className="text-muted-foreground mt-1">
          Master CRM from your spreadsheet — import, sync Drive photos, publish to the site.
        </p>
      </div>
      <SheetSyncPanel />
      {inventoryError && (
        <p className="mb-4 text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          Database table missing? Run migration{" "}
          <code className="text-xs">supabase/migrations/00003_inventory_listings.sql</code>{" "}
          on your Supabase project, then reload.
        </p>
      )}
      <InventoryListingsBoard
        initialRows={rows}
        publishedSlugs={publishedSlugs}
      />
    </div>
  );
}

import { supabase } from "@/lib/db/supabase-server";
import type { ParsedWorkbook } from "./types";

export type UpsertInventoryResult = {
  inserted: number;
  updated: number;
  total: number;
};

export async function upsertInventoryFromWorkbook(
  blocks: ParsedWorkbook[],
  sourceWorkbook?: string
): Promise<UpsertInventoryResult> {
  let inserted = 0;
  let updated = 0;
  let total = 0;

  for (const block of blocks) {
    for (const row of block.rows) {
      total++;
      const now = new Date().toISOString();
      const record = {
        property_ref: row.propertyRef,
        listing_type: row.listingType,
        location: row.location,
        project_name: row.projectName,
        photo_url: row.photoUrl,
        map_url: row.mapUrl,
        price_raw: row.priceRaw,
        price_thb: row.priceThb,
        bedrooms: row.bedrooms,
        bathrooms: row.bathrooms,
        beds_baths_raw: row.bedsBathsRaw,
        notes: row.notes,
        source_workbook: sourceWorkbook ?? null,
        raw_row: row.rawRow,
        updated_at: now,
      };

      const { data: existing } = await supabase
        .from("inventory_listings")
        .select("id")
        .eq("property_ref", row.propertyRef)
        .eq("listing_type", row.listingType)
        .maybeSingle();

      if (existing?.id) {
        const { error } = await supabase
          .from("inventory_listings")
          .update(record)
          .eq("id", existing.id);
        if (!error) updated++;
      } else {
        const { error } = await supabase
          .from("inventory_listings")
          .insert({ ...record, created_at: now });
        if (!error) inserted++;
      }
    }
  }

  return { inserted, updated, total };
}

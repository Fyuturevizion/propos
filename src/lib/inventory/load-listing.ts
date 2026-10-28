import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase as defaultSupabase } from "@/lib/db/supabase-server";

export type InventoryListingRecord = {
  id: string;
  property_ref: string;
  listing_type: string | null;
  photo_url: string | null;
  gallery_files: string[] | null;
  photos_synced_at: string | null;
  published_property_id: string | null;
  is_published: boolean | null;
  [key: string]: unknown;
};

/** Load one inventory row by ref (handles duplicate sale/rent rows). */
export async function loadInventoryByRef(
  propertyRef: string,
  options?: { supabase?: SupabaseClient; listingType?: string }
): Promise<InventoryListingRecord | null> {
  const client = options?.supabase ?? defaultSupabase;
  let query = client
    .from("inventory_listings")
    .select("*")
    .eq("property_ref", propertyRef);

  if (options?.listingType) {
    query = query.eq("listing_type", options.listingType);
  }

  const { data, error } = await query
    .order("updated_at", { ascending: false })
    .limit(1);

  if (error) throw new Error(error.message);
  const row = data?.[0];
  return (row as InventoryListingRecord | undefined) ?? null;
}

export async function loadFirstInventoryRef(
  options?: { supabase?: SupabaseClient }
): Promise<string | null> {
  const client = options?.supabase ?? defaultSupabase;
  const { data, error } = await client
    .from("inventory_listings")
    .select("property_ref")
    .order("property_ref", { ascending: true })
    .limit(1);

  if (error) throw new Error(error.message);
  return data?.[0]?.property_ref ?? null;
}

import { supabase } from "@/lib/db/supabase-server";
import { syncInventoryGallery } from "./sync-gallery";
import { slugFromPropertyRef } from "./spreadsheet";

export type PublishResult = {
  propertyRef: string;
  propertyId: string;
  slug: string;
  imageCount: number;
  imageRefs: string[];
  created: boolean;
};

export async function publishInventoryToWebsite(
  propertyRef: string,
  options?: { syncPhotosFirst?: boolean; agentId?: string }
): Promise<PublishResult> {
  const syncPhotosFirst = options?.syncPhotosFirst ?? true;

  const { data: listing, error } = await supabase
    .from("inventory_listings")
    .select("*")
    .eq("property_ref", propertyRef)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!listing) throw new Error(`Inventory listing not found: ${propertyRef}`);

  let gallery = (listing.gallery_files as string[] | null) ?? [];
  const needsSync =
    syncPhotosFirst &&
    listing.photo_url &&
    (!gallery.length || !listing.photos_synced_at);

  if (needsSync) {
    const synced = await syncInventoryGallery(propertyRef);
    gallery = synced.imageRefs;
  } else if (syncPhotosFirst && listing.photo_url && !gallery.length) {
    const synced = await syncInventoryGallery(propertyRef);
    gallery = synced.imageRefs;
  }

  const slug = slugFromPropertyRef(propertyRef);
  if (!slug) throw new Error("Invalid property reference");

  const title =
    listing.project_name
      ? `${listing.project_name} (${propertyRef})`
      : propertyRef;

  const payload = {
    slug,
    title_en: title,
    description_en: listing.location
      ? `${listing.location}, Phuket`
      : listing.notes,
    property_type: "villa" as const,
    listing_type: (listing.listing_type as "sale" | "rent") ?? "sale",
    status: "active" as const,
    area_district: listing.location,
    price_thb: listing.price_thb,
    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms,
    images: gallery.length ? gallery : null,
    agent_id: options?.agentId ?? null,
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  let propertyId = listing.published_property_id as string | null;
  let created = false;

  if (propertyId) {
    const { error: updateError } = await supabase
      .from("properties")
      .update(payload)
      .eq("id", propertyId);
    if (updateError) throw new Error(updateError.message);
  } else {
    const { data: existing } = await supabase
      .from("properties")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existing?.id) {
      propertyId = existing.id;
      const { error: updateError } = await supabase
        .from("properties")
        .update(payload)
        .eq("id", propertyId);
      if (updateError) throw new Error(updateError.message);
    } else {
      const { data: inserted, error: insertError } = await supabase
        .from("properties")
        .insert(payload)
        .select("id")
        .single();
      if (insertError) throw new Error(insertError.message);
      propertyId = inserted.id;
      created = true;
    }
  }

  const now = new Date().toISOString();
  const { error: invError } = await supabase
    .from("inventory_listings")
    .update({
      is_published: true,
      published_property_id: propertyId,
      gallery_files: gallery,
      updated_at: now,
    })
    .eq("id", listing.id);

  if (invError) throw new Error(invError.message);

  return {
    propertyRef,
    propertyId: propertyId!,
    slug,
    imageCount: gallery.length,
    imageRefs: gallery,
    created,
  };
}

export async function unpublishInventoryFromWebsite(
  propertyRef: string
): Promise<void> {
  const { data: listing, error } = await supabase
    .from("inventory_listings")
    .select("id, published_property_id")
    .eq("property_ref", propertyRef)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!listing) throw new Error(`Inventory listing not found: ${propertyRef}`);

  if (listing.published_property_id) {
    await supabase
      .from("properties")
      .update({ status: "archived", updated_at: new Date().toISOString() })
      .eq("id", listing.published_property_id);
  }

  await supabase
    .from("inventory_listings")
    .update({
      is_published: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", listing.id);
}

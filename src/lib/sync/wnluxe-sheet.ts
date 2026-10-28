import { fetchSheetRangeCells } from "@/lib/google/sheets";
import { resolvePhotoCellToImageRefs } from "@/lib/google/drive-photos";
import { supabase } from "@/lib/db/supabase-server";
import {
  photoUrlFromSheetCell,
  slugFromPropertyRef,
} from "@/lib/inventory/spreadsheet";

export const WNLUXE_PROPERTY_SHEET_ID =
  process.env.WNLUXE_SHEET_ID ??
  "1tL7C6X7KGcDnVSIrqrmMT0KXzxmzq0q6kgmoqaSoSPg";

export const WNLUXE_PROPERTY_SHEET_URL = `https://docs.google.com/spreadsheets/d/${WNLUXE_PROPERTY_SHEET_ID}/edit`;

export type SheetTabConfig = {
  tabName: string;
  listingType: "sale" | "rent";
  /** Column header names (row 1) */
  headers: {
    ref: string;
    location: string;
    project: string;
    photo: string;
    price?: string;
    beds?: string;
    baths?: string;
  };
};

export const WNLUXE_SHEET_TABS: SheetTabConfig[] = [
  {
    tabName: "Sales",
    listingType: "sale",
    headers: {
      ref: "Property Ref",
      location: "Location",
      project: "Project Name",
      photo: "Photo",
      price: "Price",
      beds: "No.bed",
      baths: "No.bath",
    },
  },
  {
    tabName: "Rent-Phuket",
    listingType: "rent",
    headers: {
      ref: "Property Ref",
      location: "Location",
      project: "Project",
      photo: "Photo",
      price: "Price",
      beds: "Bed/bath",
    },
  },
  {
    tabName: "Luxury Rent-Phuket",
    listingType: "rent",
    headers: {
      ref: "Ref",
      location: "Location",
      project: "Project",
      photo: "Photo /Detail",
      price: "Price",
      beds: "Bed/bath",
    },
  },
];

function colIndex(headerRow: string[], name: string): number {
  const key = name.trim().toLowerCase();
  const exact = headerRow.findIndex((h) => h.trim().toLowerCase() === key);
  if (exact >= 0) return exact;
  return headerRow.findIndex(
    (h) =>
      h.trim().toLowerCase().includes(key) ||
      key.includes(h.trim().toLowerCase())
  );
}

function parsePriceThb(raw: string | undefined): string | null {
  if (!raw) return null;
  const cleaned = raw.replace(/[^\d.]/g, "");
  if (!cleaned || raw.toLowerCase().includes("orq")) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? String(Math.round(n)) : null;
}

function parseBedsBaths(
  bedsRaw?: string,
  bathsRaw?: string
): { bedrooms: number | null; bathrooms: number | null } {
  if (bedsRaw?.includes("/")) {
    const [b, ba] = bedsRaw.split("/");
    return {
      bedrooms: parseInt(b.replace(/\D/g, ""), 10) || null,
      bathrooms: parseInt(ba.replace(/\D/g, ""), 10) || null,
    };
  }
  return {
    bedrooms: bedsRaw ? parseInt(bedsRaw.replace(/\D/g, ""), 10) || null : null,
    bathrooms: bathsRaw
      ? parseInt(bathsRaw.replace(/\D/g, ""), 10) || null
      : null,
  };
}

export type SyncRowResult = {
  ref: string;
  slug: string;
  action: "created" | "updated" | "skipped";
  imageCount: number;
  note?: string;
};

async function upsertInventoryFromSheetRow(options: {
  ref: string;
  listingType: "sale" | "rent";
  location: string;
  project: string;
  photoUrl: string | null;
  priceRaw?: string;
  bedrooms: number | null;
  bathrooms: number | null;
  rawRow: Record<string, string>;
}): Promise<void> {
  const now = new Date().toISOString();
  const record = {
    property_ref: options.ref,
    listing_type: options.listingType,
    location: options.location || null,
    project_name: options.project || null,
    photo_url: options.photoUrl,
    price_raw: options.priceRaw ?? null,
    price_thb: parsePriceThb(options.priceRaw),
    bedrooms: options.bedrooms,
    bathrooms: options.bathrooms,
    source_workbook: WNLUXE_PROPERTY_SHEET_URL,
    raw_row: options.rawRow,
    updated_at: now,
  };

  const { data: existing } = await supabase
    .from("inventory_listings")
    .select("id")
    .eq("property_ref", options.ref)
    .eq("listing_type", options.listingType)
    .maybeSingle();

  if (existing?.id) {
    await supabase.from("inventory_listings").update(record).eq("id", existing.id);
  } else {
    await supabase
      .from("inventory_listings")
      .insert({ ...record, created_at: now });
  }
}

export async function syncSheetTab(options: {
  tab: SheetTabConfig;
  photosRootFolderId?: string;
  limit?: number;
  onlyRef?: string;
}): Promise<SyncRowResult[]> {
  const { tab, photosRootFolderId, limit, onlyRef } = options;
  const grid = await fetchSheetRangeCells(
    WNLUXE_PROPERTY_SHEET_ID,
    `'${tab.tabName}'!A1:Z500`
  );
  if (grid.length < 2) return [];

  const header = grid[0].map((c) => c.text);
  const idx = {
    ref: colIndex(header, tab.headers.ref),
    location: colIndex(header, tab.headers.location),
    project: colIndex(header, tab.headers.project),
    photo: colIndex(header, tab.headers.photo),
    price: tab.headers.price ? colIndex(header, tab.headers.price) : -1,
    beds: tab.headers.beds ? colIndex(header, tab.headers.beds) : -1,
    baths: tab.headers.baths ? colIndex(header, tab.headers.baths) : -1,
  };

  if (idx.ref < 0 || idx.project < 0) {
    throw new Error(`Missing required columns on tab ${tab.tabName}`);
  }

  const results: SyncRowResult[] = [];
  let processed = 0;

  for (let r = 1; r < grid.length; r++) {
    const row = grid[r];
    const ref = (row[idx.ref]?.text ?? "").trim();
    if (!ref) continue;
    if (onlyRef && ref.toLowerCase() !== onlyRef.toLowerCase()) continue;

    const project = (row[idx.project]?.text ?? "").trim();
    const location =
      idx.location >= 0 ? (row[idx.location]?.text ?? "").trim() : "";
    const photoCell = idx.photo >= 0 ? row[idx.photo] : undefined;
    const photoText = photoCell?.text ?? "";
    const photoUrl = photoUrlFromSheetCell(
      photoText,
      photoCell?.hyperlink ?? null
    );

    const slug = slugFromPropertyRef(ref);
    if (!slug) {
      results.push({ ref, slug: "", action: "skipped", imageCount: 0, note: "Invalid ref" });
      continue;
    }

    const resolveInput = photoUrl ?? photoText;
    const { imageRefs, folderId } = await resolvePhotoCellToImageRefs(
      resolveInput,
      {
        photosRootFolderId,
        maxImages: 20,
      }
    );

    const priceRaw = idx.price >= 0 ? row[idx.price]?.text : undefined;
    const { bedrooms, bathrooms } = parseBedsBaths(
      idx.beds >= 0 ? row[idx.beds]?.text : undefined,
      idx.baths >= 0 ? row[idx.baths]?.text : undefined
    );

    const rawRow: Record<string, string> = {};
    header.forEach((h, i) => {
      if (!h) return;
      rawRow[h] = row[i]?.text ?? "";
    });

    try {
      await upsertInventoryFromSheetRow({
        ref,
        listingType: tab.listingType,
        location,
        project,
        photoUrl,
        priceRaw,
        bedrooms,
        bathrooms,
        rawRow,
      });
      if (imageRefs.length) {
        await supabase
          .from("inventory_listings")
          .update({
            gallery_files: imageRefs,
            photos_synced_at: new Date().toISOString(),
          })
          .eq("property_ref", ref)
          .eq("listing_type", tab.listingType);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "inventory upsert failed";
      results.push({
        ref,
        slug,
        action: "skipped",
        imageCount: imageRefs.length,
        note: msg,
      });
      processed++;
      if (limit && processed >= limit) break;
      continue;
    }

    const payload = {
      slug,
      title_en: project ? `${project} (${ref})` : ref,
      description_en: location ? `${location}, Phuket` : null,
      property_type: "villa" as const,
      listing_type: tab.listingType,
      status: "active" as const,
      area_district: location || null,
      price_thb: parsePriceThb(priceRaw),
      bedrooms,
      bathrooms,
      images: imageRefs.length ? imageRefs : null,
      updated_at: new Date().toISOString(),
    };

    const { data: existing } = await supabase
      .from("properties")
      .select("id, slug")
      .eq("slug", slug)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("properties")
        .update(payload)
        .eq("id", existing.id);
      if (error) {
        results.push({
          ref,
          slug,
          action: "skipped",
          imageCount: imageRefs.length,
          note: error.message,
        });
      } else {
        results.push({
          ref,
          slug,
          action: "updated",
          imageCount: imageRefs.length,
          note: folderId
            ? `folder ${folderId}`
            : photoUrl
              ? "hyperlink/url"
              : photoText || "no photo",
        });
      }
    } else {
      const { error } = await supabase.from("properties").insert(payload);
      if (error) {
        results.push({
          ref,
          slug,
          action: "skipped",
          imageCount: imageRefs.length,
          note: error.message,
        });
      } else {
        results.push({
          ref,
          slug,
          action: "created",
          imageCount: imageRefs.length,
          note: folderId
            ? `folder ${folderId}`
            : photoUrl
              ? "hyperlink/url"
              : photoText || "no photo",
        });
      }
    }

    processed++;
    if (limit && processed >= limit) break;
  }

  return results;
}

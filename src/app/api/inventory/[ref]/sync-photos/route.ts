import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { syncInventoryGallery } from "@/lib/inventory/sync-gallery";
import { supabase } from "@/lib/db/supabase-server";

async function isDashboardAuthed(): Promise<boolean> {
  const cookieStore = await cookies();
  if (cookieStore.get("tg-auth-user-id")?.value) return true;
  const { createClient } = await import("@/lib/supabase/server");
  const supabaseAuth = await createClient();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();
  return Boolean(user);
}

type RouteContext = { params: Promise<{ ref: string }> };

export async function POST(_req: NextRequest, context: RouteContext) {
  if (!(await isDashboardAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ref } = await context.params;
  const propertyRef = decodeURIComponent(ref).trim();
  if (!propertyRef) {
    return NextResponse.json({ error: "Invalid property ref" }, { status: 400 });
  }

  try {
    const result = await syncInventoryGallery(propertyRef);

    const { data: listing } = await supabase
      .from("inventory_listings")
      .select("published_property_id, is_published")
      .eq("property_ref", propertyRef)
      .maybeSingle();

    if (listing?.is_published && listing.published_property_id) {
      await supabase
        .from("properties")
        .update({
          images: result.imageRefs.length ? result.imageRefs : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", listing.published_property_id);
    }

    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Sync failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db/supabase-server";
import { normalizeImageInputs } from "@/lib/images/google-drive";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isPropertyId(value: string): boolean {
  return UUID_RE.test(value);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  let query = supabase.from("properties").select("*").limit(1);

  const { data: result, error } = isPropertyId(slug)
    ? await query.eq("id", slug).maybeSingle()
    : await query.eq("slug", slug).maybeSingle();

  if (error || !result) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!isPropertyId(slug)) {
    return NextResponse.json(
      { error: "Updates require property id" },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    const updates: Record<string, unknown> = {};

    if (body.images !== undefined) {
      const list = Array.isArray(body.images)
        ? body.images
        : typeof body.images === "string"
          ? body.images
              .split(/\r?\n/)
              .map((s: string) => s.trim())
              .filter(Boolean)
          : [];
      updates.images = list.length ? normalizeImageInputs(list) : null;
    }

    if (body.titleEn !== undefined) updates.title_en = body.titleEn;
    if (body.titleTh !== undefined) updates.title_th = body.titleTh;
    if (body.descriptionEn !== undefined) updates.description_en = body.descriptionEn;
    if (body.status !== undefined) updates.status = body.status;
    if (body.priceThb !== undefined) updates.price_thb = body.priceThb;
    if (body.areaDistrict !== undefined) updates.area_district = body.areaDistrict;

    if (!Object.keys(updates).length) {
      return NextResponse.json({ error: "No updates provided" }, { status: 400 });
    }

    updates.updated_at = new Date().toISOString();

    const { data: property, error } = await supabase
      .from("properties")
      .update(updates)
      .eq("id", slug)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, property });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Update failed";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

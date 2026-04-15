import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db/supabase-server";

/** Convert camelCase keys to snake_case for Supabase inserts */
function toSnakeCase(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    result[snakeKey] = value;
  }
  return result;
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  let query = supabase
    .from("properties")
    .select("*")
    .eq("status", "active");

  const type = searchParams.get("type");
  if (type) query = query.eq("property_type", type);

  const area = searchParams.get("area");
  if (area) query = query.eq("area_district", area);

  const listingType = searchParams.get("listingType");
  if (listingType) query = query.eq("listing_type", listingType);

  const minPrice = searchParams.get("minPrice");
  if (minPrice) query = query.gte("price_thb", minPrice);

  const maxPrice = searchParams.get("maxPrice");
  if (maxPrice) query = query.lte("price_thb", maxPrice);

  const bedrooms = searchParams.get("bedrooms");
  if (bedrooms) query = query.gte("bedrooms", parseInt(bedrooms));

  const { data: results } = await query
    .order("created_at", { ascending: false })
    .limit(50);

  return NextResponse.json(results);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Generate slug from title
    const slug = body.titleEn
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      + "-" + Date.now().toString(36);

    const snakeBody = toSnakeCase(body);

    const { data: property, error } = await supabase
      .from("properties")
      .insert({ ...snakeBody, slug, status: body.status || "active" })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, property });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

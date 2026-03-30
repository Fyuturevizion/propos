import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  // TODO: Query properties from database with filters
  // const filters = {
  //   type: searchParams.get("type"),
  //   area: searchParams.get("area"),
  //   minPrice: searchParams.get("minPrice"),
  //   maxPrice: searchParams.get("maxPrice"),
  //   bedrooms: searchParams.get("bedrooms"),
  //   listingType: searchParams.get("listingType"),
  // };

  return NextResponse.json([]);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // TODO: Create property in database
  // 1. Validate body with insertPropertySchema
  // 2. Insert into properties table
  // 3. Optionally sync to Notion
  // 4. Return created property

  return NextResponse.json({ success: true, property: null });
}

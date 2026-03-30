import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const status = searchParams.get("status");

  // TODO: Query leads from database with optional status filter

  return NextResponse.json([]);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // TODO: Create lead in database
  // 1. Validate body with insertLeadSchema
  // 2. Check PDPA consent
  // 3. Insert into leads table
  // 4. Optionally sync to Notion CRM database
  // 5. Return created lead

  return NextResponse.json({ success: true, lead: null });
}

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db/supabase-server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const status = searchParams.get("status");

  let query = supabase.from("leads").select("*");
  if (status) query = query.eq("status", status);

  const { data: results } = await query
    .order("created_at", { ascending: true })
    .limit(50);

  return NextResponse.json(results);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.fullName) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    const { data: lead, error } = await supabase
      .from("leads")
      .insert({
        full_name: body.fullName,
        email: body.email || null,
        phone: body.phone || null,
        source: body.source || "website",
        notes: body.message || body.notes || null,
        pdpa_consent: body.pdpaConsent || false,
        pdpa_consent_date: body.pdpaConsent ? new Date().toISOString() : null,
        status: "new",
        score: "warm",
        language_preference: body.language || "en",
        property_type_interest: body.propertyTypeInterest || null,
        budget_min_thb: body.budgetMin || null,
        budget_max_thb: body.budgetMax || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, lead });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db/supabase-server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const { data: result, error } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .limit(1)
    .maybeSingle();

  if (error || !result) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}

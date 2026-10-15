import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parsePropertyListingsWorkbook } from "@/lib/inventory/parse-workbook";
import { upsertInventoryFromWorkbook } from "@/lib/inventory/upsert-from-workbook";

async function isDashboardAuthed(): Promise<boolean> {
  const cookieStore = await cookies();
  if (cookieStore.get("tg-auth-user-id")?.value) return true;
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return Boolean(user);
}

export async function POST(req: NextRequest) {
  if (!(await isDashboardAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file upload" }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  const blocks = parsePropertyListingsWorkbook(buffer);
  if (!blocks.length) {
    return NextResponse.json(
      { error: "No listing rows found in workbook" },
      { status: 400 }
    );
  }

  const result = await upsertInventoryFromWorkbook(blocks, file.name);
  return NextResponse.json({
    ok: true,
    sheets: blocks.map((b) => ({
      name: b.sheetName,
      listingType: b.listingType,
      rowCount: b.rows.length,
    })),
    ...result,
  });
}

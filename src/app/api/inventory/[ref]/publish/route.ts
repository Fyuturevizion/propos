import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { publishInventoryToWebsite } from "@/lib/inventory/publish-to-website";

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
    const result = await publishInventoryToWebsite(propertyRef, {
      syncPhotosFirst: true,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Publish failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

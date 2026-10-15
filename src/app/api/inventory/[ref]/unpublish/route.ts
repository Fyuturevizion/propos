import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { unpublishInventoryFromWebsite } from "@/lib/inventory/publish-to-website";

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

  try {
    await unpublishInventoryFromWebsite(propertyRef);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unpublish failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

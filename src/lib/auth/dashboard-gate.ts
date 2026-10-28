import { cookies } from "next/headers";

/** Logged-in dashboard user (Supabase or Telegram cookie). */
export async function isDashboardAuthed(): Promise<boolean> {
  const cookieStore = await cookies();
  if (cookieStore.get("tg-auth-user-id")?.value) return true;
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return Boolean(user);
}

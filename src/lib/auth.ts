import { createClient } from "@/lib/supabase/server";
import { supabase as adminClient } from "@/lib/db/supabase-server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

interface AgentRow {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: string;
  avatar_url: string | null;
  telegram_chat_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getAgent() {
  // Check TG auth cookie first
  const cookieStore = await cookies();
  const tgUserId = cookieStore.get("tg-auth-user-id")?.value;

  if (tgUserId) {
    // TG authenticated user -- look up agent by ID via REST API
    const { data } = await adminClient
      .from("agents")
      .select("*")
      .eq("id", tgUserId)
      .limit(1)
      .single();

    if (data) {
      const agent = data as AgentRow;
      return {
        user: { id: tgUserId, email: agent.email },
        agent,
      };
    }
  }

  // Fall back to Supabase auth
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/dashboard/login");
  }

  // Look up agent via REST API
  const { data } = await adminClient
    .from("agents")
    .select("*")
    .eq("id", user.id)
    .limit(1)
    .single();

  const agent = data as AgentRow | null;

  return {
    user,
    agent: agent || { id: user.id, email: user.email, full_name: user.email?.split("@")[0], role: "agent" },
  };
}

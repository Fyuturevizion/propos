import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, first_name, last_name, username, auth_date, hash } = body;

    if (!id || !hash) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // Verify the hash
    const secretKey = crypto.createHash("sha256").update(BOT_TOKEN).digest();
    const checkArr = Object.entries(body)
      .filter(([k]) => k !== "hash")
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join("\n");
    const hmac = crypto.createHmac("sha256", secretKey).update(checkArr).digest("hex");

    if (hmac !== hash) {
      return NextResponse.json({ error: "Invalid auth" }, { status: 401 });
    }

    // Check auth_date (24h window)
    if (Date.now() / 1000 - Number(auth_date) > 86400) {
      return NextResponse.json({ error: "Expired" }, { status: 401 });
    }

    // Find agent by telegram_chat_id
    const agentRes = await fetch(
      `${SUPABASE_URL}/rest/v1/agents?telegram_chat_id=eq.${id}&select=id,email,full_name`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );
    const agents = await agentRes.json();

    if (!agents || agents.length === 0) {
      return NextResponse.json(
        { error: "No account linked to this Telegram user. Contact admin." },
        { status: 403 }
      );
    }

    const agent = agents[0];

    // Set auth cookie and return success
    const response = NextResponse.json({ success: true, user: agent });
    response.cookies.set("tg-auth-user-id", agent.id, {
      path: "/",
      maxAge: 86400 * 7,
      httpOnly: true,
      sameSite: "lax",
    });
    response.cookies.set("tg-auth-tg-id", String(id), {
      path: "/",
      maxAge: 86400 * 7,
      httpOnly: true,
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("TG auth error:", error);
    return NextResponse.json({ error: "Auth failed" }, { status: 500 });
  }
}

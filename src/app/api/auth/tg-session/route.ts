import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tgId = searchParams.get("tg_id");
  const agentId = searchParams.get("agent_id");
  const ts = searchParams.get("ts");
  const hash = searchParams.get("hash");

  if (!tgId || !agentId || !ts || !hash) {
    return NextResponse.redirect(
      new URL("/dashboard/login?error=missing_params", request.url)
    );
  }

  // Verify hash
  const authData = { id: tgId, ts };
  const checkString = Object.entries(authData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");
  const secret = crypto.createHash("sha256").update(BOT_TOKEN).digest();
  const expectedHash = crypto
    .createHmac("sha256", secret)
    .update(checkString)
    .digest("hex");

  if (expectedHash !== hash) {
    return NextResponse.redirect(
      new URL("/dashboard/login?error=invalid_auth", request.url)
    );
  }

  // Check timestamp (1 hour window)
  const age = Date.now() / 1000 - Number(ts);
  if (age > 3600) {
    return NextResponse.redirect(
      new URL("/dashboard/login?error=expired", request.url)
    );
  }

  // Verify the agent exists
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const agentRes = await fetch(
    `${supabaseUrl}/rest/v1/agents?id=eq.${agentId}&telegram_chat_id=eq.${tgId}&select=id,email,full_name`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    }
  );
  const agents = await agentRes.json();

  if (!agents || agents.length === 0) {
    return NextResponse.redirect(
      new URL("/dashboard/login?error=no_account", request.url)
    );
  }

  // Set auth cookies and redirect to dashboard
  // Use the request origin (tunnel URL or localhost) not a hardcoded URL
  const origin = request.headers.get("host") 
    ? `${request.headers.get("x-forwarded-proto") || request.nextUrl.protocol.replace(":", "")}://${request.headers.get("host")}`
    : request.nextUrl.origin;
  
  const response = NextResponse.redirect(
    new URL("/dashboard", origin)
  );

  response.cookies.set("tg-auth-user-id", agentId, {
    path: "/",
    maxAge: 86400 * 7,
    httpOnly: true,
    sameSite: "lax",
  });
  response.cookies.set("tg-auth-tg-id", tgId, {
    path: "/",
    maxAge: 86400 * 7,
    httpOnly: true,
    sameSite: "lax",
  });

  return response;
}

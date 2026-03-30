import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  // TODO: Process incoming Telegram message via Chat SDK
  // 1. Parse message from body.message
  // 2. Find or create lead by telegram_id
  // 3. Route to AI assistant
  // 4. Send response back via Telegram Bot API
  // 5. Log message in database

  console.log("Telegram webhook received:", JSON.stringify(body).slice(0, 200));

  return NextResponse.json({ status: "ok" });
}

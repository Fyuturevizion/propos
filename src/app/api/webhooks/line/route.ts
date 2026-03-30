import { NextRequest, NextResponse } from "next/server";
import { validateSignature } from "@line/bot-sdk";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-line-signature") || "";

  // Verify LINE webhook signature
  const channelSecret = process.env.LINE_CHANNEL_SECRET;
  if (channelSecret && !validateSignature(body, channelSecret, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  const parsed = JSON.parse(body);

  // TODO: Process incoming LINE message
  // 1. Parse events from parsed.events
  // 2. Find or create lead by LINE user ID
  // 3. Route to AI assistant
  // 4. Reply via LINE Messaging API
  // 5. Log message in database

  console.log("LINE webhook received:", JSON.stringify(parsed).slice(0, 200));

  return NextResponse.json({ status: "ok" });
}

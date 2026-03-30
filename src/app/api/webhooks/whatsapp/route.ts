import { NextRequest, NextResponse } from "next/server";

// WhatsApp webhook verification
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

// WhatsApp message handler
export async function POST(req: NextRequest) {
  const body = await req.json();

  // TODO: Process incoming WhatsApp message via Chat SDK
  // 1. Parse message from body.entry[0].changes[0].value.messages[0]
  // 2. Find or create lead
  // 3. Route to AI assistant
  // 4. Send response back via WhatsApp API
  // 5. Log message in database

  console.log("WhatsApp webhook received:", JSON.stringify(body).slice(0, 200));

  return NextResponse.json({ status: "ok" });
}

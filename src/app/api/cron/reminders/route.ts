import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // TODO: Send appointment reminders
  // 1. Query viewings scheduled in next 30 minutes where reminder_sent = false
  // 2. For each viewing:
  //    a. Send reminder to client via their preferred channel
  //    b. Send reminder to agent via Telegram
  //    c. Mark reminder_sent = true
  // 3. Check for WhatsApp 24-hour window — use template messages if needed

  return NextResponse.json({
    status: "ok",
    message: "Reminders checked",
    timestamp: new Date().toISOString(),
  });
}

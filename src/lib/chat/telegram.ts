/**
 * Telegram integration via Vercel Chat SDK
 *
 * Uses the official Chat SDK Telegram adapter (released February 2026).
 * Also handles direct Telegram Bot API calls for features not covered by Chat SDK.
 */

export interface TelegramConfig {
  botToken: string;
}

export function createTelegramConfig(): TelegramConfig {
  return {
    botToken: process.env.TELEGRAM_BOT_TOKEN!,
  };
}

/**
 * Send a message to Iain via Telegram (for escalations and briefings)
 */
export async function sendTelegramMessage(
  chatId: string,
  text: string,
  parseMode: "HTML" | "Markdown" = "HTML"
): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: parseMode,
    }),
  });
}

/**
 * Send escalation summary to Iain via Telegram
 */
export async function escalateToIain(summary: {
  clientName: string;
  context: string;
  question: string;
  recommendation: string;
}): Promise<void> {
  const iainChatId = process.env.IAIN_TELEGRAM_CHAT_ID;
  if (!iainChatId) return;

  const message = `
<b>🔔 Escalation Required</b>

<b>Client:</b> ${summary.clientName}
<b>Context:</b> ${summary.context}
<b>Question:</b> ${summary.question}
<b>Recommended Action:</b> ${summary.recommendation}
  `.trim();

  await sendTelegramMessage(iainChatId, message);
}

/**
 * WhatsApp integration via Vercel Chat SDK
 *
 * Uses the official Chat SDK WhatsApp adapter (released March 2026).
 *
 * Key considerations:
 * - 24-hour messaging window: After last client message, you can reply freely.
 *   After 24h, you must use pre-approved template messages.
 * - Template messages require Meta Business approval.
 * - Reminders and outbound notifications need template messages.
 */

export interface WhatsAppConfig {
  accessToken: string;
  verifyToken: string;
  phoneNumberId: string;
}

export function createWhatsAppConfig(): WhatsAppConfig {
  return {
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN!,
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN!,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID!,
  };
}

/**
 * Check if we're within the 24-hour messaging window for a contact
 */
export function isWithinMessageWindow(lastMessageAt: Date): boolean {
  const now = new Date();
  const diff = now.getTime() - lastMessageAt.getTime();
  const hours = diff / (1000 * 60 * 60);
  return hours < 24;
}

/**
 * Send a WhatsApp template message (for use outside 24h window)
 */
export async function sendTemplateMessage(
  phoneNumberId: string,
  to: string,
  templateName: string,
  languageCode: string = "en",
  components?: unknown[]
): Promise<void> {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  await fetch(
    `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: templateName,
          language: { code: languageCode },
          components,
        },
      }),
    }
  );
}

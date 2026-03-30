import type { LineAdapterConfig, LineWebhookPayload } from "./types";
import { LineAdapter } from "./adapter";

/**
 * Create a LINE webhook handler for use in Next.js API routes
 *
 * Usage in app/api/webhooks/line/route.ts:
 *
 *   import { createLineWebhookHandler } from "@propos/line-chat-sdk-adapter";
 *
 *   const handler = createLineWebhookHandler({
 *     channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
 *     channelSecret: process.env.LINE_CHANNEL_SECRET!,
 *   });
 *
 *   export async function POST(req: Request) {
 *     return handler(req, async (messages, adapter) => {
 *       for (const msg of messages) {
 *         // Process message with AI, then reply
 *         const aiResponse = await getAIResponse(msg.text);
 *         await adapter.replyMessage(msg.replyToken, aiResponse);
 *       }
 *     });
 *   }
 */
export function createLineWebhookHandler(config: LineAdapterConfig) {
  const adapter = new LineAdapter(config);

  return async (
    req: Request,
    onMessage: (
      messages: ReturnType<LineAdapter["parseWebhook"]>,
      adapter: LineAdapter
    ) => Promise<void>
  ): Promise<Response> => {
    const body = await req.text();
    const signature = req.headers.get("x-line-signature") || "";

    // Verify signature
    if (!adapter.verifySignature(body, signature)) {
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const payload: LineWebhookPayload = JSON.parse(body);
    const messages = adapter.parseWebhook(payload);

    if (messages.length > 0) {
      await onMessage(messages, adapter);
    }

    return new Response(JSON.stringify({ status: "ok" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };
}

# @propos/line-chat-sdk-adapter

The first open-source LINE Messaging API adapter for [Vercel Chat SDK](https://chat-sdk.vercel.ai/).

Bridges LINE's Messaging API with Chat SDK's unified adapter interface, enabling LINE as a first-class messaging channel alongside WhatsApp, Telegram, Slack, and others.

## Why?

Vercel Chat SDK supports WhatsApp, Telegram, Slack, Teams, Discord, and more — but not LINE. Given LINE's dominance in Thailand, Japan, and Taiwan, this adapter fills a critical gap for developers building in Southeast Asia.

## Installation

```bash
npm install @propos/line-chat-sdk-adapter @line/bot-sdk
```

## Quick Start

```typescript
// app/api/webhooks/line/route.ts
import { createLineWebhookHandler } from "@propos/line-chat-sdk-adapter";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

const handler = createLineWebhookHandler({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
  channelSecret: process.env.LINE_CHANNEL_SECRET!,
});

export async function POST(req: Request) {
  return handler(req, async (messages, adapter) => {
    for (const msg of messages) {
      if (!msg.text) continue;

      // Use Vercel AI SDK to generate response
      const result = await streamText({
        model: openai("gpt-4o"),
        messages: [{ role: "user", content: msg.text }],
      });

      const text = await result.text;
      await adapter.replyMessage(msg.replyToken, text);
    }
  });
}
```

## API

### `LineAdapter`

```typescript
const adapter = new LineAdapter({ channelAccessToken, channelSecret });

// Verify webhook signature
adapter.verifySignature(body, signature); // boolean

// Parse webhook events
const messages = adapter.parseWebhook(payload); // LineMessage[]

// Send message
await adapter.sendMessage({ userId, message: "Hello" });

// Reply to message (uses reply token)
await adapter.replyMessage(replyToken, "Thanks!");

// Get user profile
const profile = await adapter.getUserProfile(userId);

// Convert between formats
const chatMsg = adapter.toChatMessage(lineMessage);
const lineMsg = adapter.toLineMessage("Hello");
```

### `createLineWebhookHandler`

Factory function that creates a webhook handler with signature verification built in.

## LINE Setup

1. Create a LINE channel at [LINE Developers Console](https://developers.line.biz/)
2. Enable Messaging API
3. Get your Channel Access Token and Channel Secret
4. Set your webhook URL to `https://your-domain.com/api/webhooks/line`
5. Enable "Use webhook" in the console

## License

MIT

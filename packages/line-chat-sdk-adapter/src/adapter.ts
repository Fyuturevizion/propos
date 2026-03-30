import { messagingApi, validateSignature } from "@line/bot-sdk";
import type {
  LineAdapterConfig,
  LineMessage,
  LineSendMessageOptions,
  LineWebhookPayload,
} from "./types";

/**
 * LINE Chat SDK Adapter
 *
 * Bridges LINE Messaging API with Vercel Chat SDK interface.
 * Implements the adapter pattern from Chat SDK's adapter building guide.
 *
 * Usage:
 *   const adapter = new LineAdapter({ channelAccessToken, channelSecret });
 *   // In webhook route:
 *   const messages = adapter.parseWebhook(body, signature);
 *   // To send reply:
 *   await adapter.sendMessage({ userId, message: "Hello" });
 */
export class LineAdapter {
  private client: messagingApi.MessagingApiClient;
  private channelSecret: string;

  constructor(config: LineAdapterConfig) {
    this.client = new messagingApi.MessagingApiClient({
      channelAccessToken: config.channelAccessToken,
    });
    this.channelSecret = config.channelSecret;
  }

  /**
   * Verify LINE webhook signature
   */
  verifySignature(body: string, signature: string): boolean {
    return validateSignature(body, this.channelSecret, signature);
  }

  /**
   * Parse incoming LINE webhook events into normalized messages
   */
  parseWebhook(payload: LineWebhookPayload): LineMessage[] {
    return payload.events
      .filter((event) => event.type === "message")
      .map((event) => {
        const messageEvent = event as {
          message: { id: string; type: string; text?: string };
          source: { userId?: string };
          replyToken: string;
          timestamp: number;
        };
        return {
          id: messageEvent.message.id,
          type: messageEvent.message.type as LineMessage["type"],
          text: messageEvent.message.text,
          userId: messageEvent.source.userId || "",
          replyToken: messageEvent.replyToken,
          timestamp: messageEvent.timestamp,
        };
      });
  }

  /**
   * Send a text message to a LINE user
   */
  async sendMessage(options: LineSendMessageOptions): Promise<void> {
    const message: messagingApi.TextMessage = {
      type: "text",
      text: options.message,
    };

    if (options.quickReply) {
      message.quickReply = {
        items: options.quickReply,
      };
    }

    await this.client.pushMessage({
      to: options.userId,
      messages: [message],
    });
  }

  /**
   * Reply to a specific message using reply token
   * (Reply tokens expire after a short time)
   */
  async replyMessage(replyToken: string, text: string): Promise<void> {
    await this.client.replyMessage({
      replyToken,
      messages: [{ type: "text", text }],
    });
  }

  /**
   * Get user profile from LINE
   */
  async getUserProfile(
    userId: string
  ): Promise<{ displayName: string; pictureUrl?: string; language?: string }> {
    const profile = await this.client.getProfile(userId);
    return {
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl,
      language: profile.language,
    };
  }

  /**
   * Convert Chat SDK message format to LINE message format
   * This is the core bridging function for the Chat SDK adapter interface
   */
  toLineMessage(content: string): messagingApi.TextMessage {
    return {
      type: "text",
      text: content,
    };
  }

  /**
   * Convert LINE message to Chat SDK message format
   */
  toChatMessage(lineMessage: LineMessage): {
    role: "user";
    content: string;
    metadata: Record<string, string>;
  } {
    return {
      role: "user",
      content: lineMessage.text || "",
      metadata: {
        platform: "line",
        userId: lineMessage.userId,
        messageId: lineMessage.id,
        replyToken: lineMessage.replyToken,
      },
    };
  }
}

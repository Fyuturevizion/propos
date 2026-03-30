import type { WebhookEvent, MessageEvent, TextMessage } from "@line/bot-sdk";

export interface LineAdapterConfig {
  channelAccessToken: string;
  channelSecret: string;
}

export interface LineMessage {
  id: string;
  type: "text" | "image" | "audio" | "video" | "location" | "sticker";
  text?: string;
  userId: string;
  replyToken: string;
  timestamp: number;
}

export interface LineSendMessageOptions {
  userId: string;
  message: string;
  quickReply?: Array<{
    type: "action";
    action: {
      type: "message" | "uri" | "postback";
      label: string;
      text?: string;
      uri?: string;
      data?: string;
    };
  }>;
}

export interface LineWebhookPayload {
  destination: string;
  events: WebhookEvent[];
}

export type { WebhookEvent, MessageEvent, TextMessage };

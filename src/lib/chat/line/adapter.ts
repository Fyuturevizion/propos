// Internal LINE adapter — wraps the standalone package for use within PropOS
// See packages/line-chat-sdk-adapter for the full implementation

import { LineAdapter } from "../../../../packages/line-chat-sdk-adapter/src/adapter";

export function createLineAdapter() {
  return new LineAdapter({
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
    channelSecret: process.env.LINE_CHANNEL_SECRET!,
  });
}

export { LineAdapter };

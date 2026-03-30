import { streamText } from "ai";
import { getModel } from "@/lib/ai";
import { getSystemPrompt } from "@/lib/ai/system-prompt";
import { mcpTools } from "@/lib/ai/tools";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: getModel("client"),
    system: getSystemPrompt(),
    messages,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tools: mcpTools as any,
  });

  return result.toTextStreamResponse();
}

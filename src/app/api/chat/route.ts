import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { getSystemPrompt } from "@/lib/ai/system-prompt";

export const maxDuration = 60;

// LM Studio provider — local on Mac Mini
const lmStudio = createOpenAI({
  baseURL: process.env.OPENAI_BASE_URL || "http://localhost:1234/v1",
  apiKey: "lm-studio",
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const model = lmStudio("qwen3.5-35b-a3b-mlx");

  try {
    const result = streamText({
      model,
      system: getSystemPrompt(),
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({
        error: "I'm having trouble connecting to my brain right now. Please try again in a moment.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

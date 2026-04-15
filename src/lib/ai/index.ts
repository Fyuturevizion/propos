import { createOpenAI } from "@ai-sdk/openai";

// LM Studio provider (OpenAI-compatible, local on Mac Mini)
export const lmStudio = createOpenAI({
  baseURL: process.env.OPENAI_BASE_URL || "http://localhost:1234/v1",
  apiKey: "lm-studio",
});
export const lmStudioModel = lmStudio("qwen3.5-35b-a3b-mlx");

// Cloud provider — GPT-4o (when available)
const cloudProvider = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export const cloudModel = cloudProvider("gpt-4o");

// Route to appropriate model based on context
export function getModel(context: "client" | "internal" = "client") {
  // Use LM Studio by default (always available on Mac Mini)
  return lmStudioModel;
}

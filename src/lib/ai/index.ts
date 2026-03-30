import { openai } from "@ai-sdk/openai";
import { createOpenAI } from "@ai-sdk/openai";

// Cloud provider — GPT-4o for client-facing conversations
export const cloudProvider = openai;
export const cloudModel = openai("gpt-4o");

// Local provider — Ollama for internal operations
export const localProvider = createOpenAI({
  baseURL: process.env.OLLAMA_BASE_URL || "http://localhost:11434/v1",
  apiKey: "ollama", // Ollama doesn't need a real key
});
export const localModel = localProvider("qwen2.5");

// Route to appropriate model based on context
export function getModel(context: "client" | "internal" = "client") {
  if (context === "internal" && process.env.OLLAMA_BASE_URL) {
    return localModel;
  }
  return cloudModel;
}

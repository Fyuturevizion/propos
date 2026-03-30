import { createOpenAI } from "@ai-sdk/openai";

// Cloud provider — GPT-4o for client-facing conversations (lazy)
let _cloudProvider: ReturnType<typeof createOpenAI> | null = null;

function getCloudProvider() {
  if (!_cloudProvider) {
    _cloudProvider = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY || "",
    });
  }
  return _cloudProvider;
}

export function getCloudModel() {
  return getCloudProvider()("gpt-4o");
}

// Keep backward-compat export — lazily resolved
export const cloudModel = new Proxy({} as ReturnType<ReturnType<typeof createOpenAI>>, {
  get(_target, prop) {
    return (getCloudModel() as Record<string | symbol, unknown>)[prop];
  },
});

// Local provider — Ollama for internal operations
export const localProvider = createOpenAI({
  baseURL: process.env.OLLAMA_BASE_URL || "http://localhost:11434/v1",
  apiKey: "ollama",
});
export const localModel = localProvider("qwen2.5");

// Route to appropriate model based on context
export function getModel(context: "client" | "internal" = "client") {
  if (context === "internal" && process.env.OLLAMA_BASE_URL) {
    return localModel;
  }
  return getCloudModel();
}

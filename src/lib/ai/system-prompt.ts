import { readFileSync } from "fs";
import { join } from "path";

let cachedPrompt: string | null = null;

export function getSystemPrompt(): string {
  if (cachedPrompt) return cachedPrompt;

  try {
    cachedPrompt = readFileSync(
      join(process.cwd(), "SYSTEM_PROMPT.md"),
      "utf-8"
    );
  } catch {
    // Fallback inline prompt
    cachedPrompt = `You are PropOS Assistant — the intelligent executive assistant for a Phuket-based Thai real estate agency. You communicate fluently in both English and Thai. You help clients find properties, book viewings, and answer questions about the Phuket property market. You are friendly, knowledgeable, and solution-oriented.`;
  }

  return cachedPrompt;
}

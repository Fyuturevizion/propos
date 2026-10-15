import type { Locale } from "@/i18n/config";

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function deepMerge(base: JsonObject, overlay: JsonObject): JsonObject {
  const out: JsonObject = { ...base };
  for (const key of Object.keys(overlay)) {
    const a = base[key];
    const b = overlay[key];
    if (isObject(a) && isObject(b)) {
      out[key] = deepMerge(a, b);
    } else {
      out[key] = b;
    }
  }
  return out;
}

export async function loadAppMessages(locale: Locale): Promise<JsonObject> {
  const base = (await import(`../../messages/${locale}.json`)).default as JsonObject;
  let messages = base;

  if (process.env.NEXT_PUBLIC_BRAND_ID === "wnluxe") {
    try {
      const brand = (
        await import(`../../messages/brands/wnluxe.${locale}.json`)
      ).default as JsonObject;
      messages = deepMerge(base, brand);
    } catch {
      // Optional per-locale brand overlay
    }
  }

  return messages;
}

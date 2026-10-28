/** Normalize header cell text for column matching */
export function normalizeHeader(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function findColumnIndex(
  headers: string[],
  candidates: string[]
): number {
  const normalized = headers.map(normalizeHeader);
  for (const candidate of candidates) {
    const key = normalizeHeader(candidate);
    const exact = normalized.indexOf(key);
    if (exact >= 0) return exact;
  }
  for (const candidate of candidates) {
    const key = normalizeHeader(candidate);
    const partial = normalized.findIndex((h) => h.includes(key) || key.includes(h));
    if (partial >= 0) return partial;
  }
  return -1;
}

/** Prefer Excel formatted text (cell.w) so values like 3/2 are not read as dates */
export function cellDisplayText(
  cell: { w?: string; v?: unknown } | undefined,
  fallback = ""
): string {
  if (!cell) return fallback;
  if (typeof cell.w === "string" && cell.w.trim()) {
    return cell.w.trim();
  }
  if (cell.v === null || cell.v === undefined) return fallback;
  if (typeof cell.v === "number" && Number.isFinite(cell.v)) {
    return String(cell.v);
  }
  return String(cell.v).trim();
}

export function hyperlinkTarget(
  cell: { l?: { Target?: string } } | undefined
): string | null {
  const target = cell?.l?.Target;
  return target?.trim() ? target.trim() : null;
}

/** Value stored on inventory_listings.photo_url for Drive sync (link, URL, or folder code). */
export function photoUrlFromSheetCell(
  text: string,
  hyperlink: string | null
): string | null {
  const t = text.trim();
  const link = hyperlink?.trim();
  if (link) return link;
  if (t.startsWith("http")) return t;
  if (t && t !== "-" && t.toLowerCase() !== "tbc") return t;
  return null;
}

export function parseBedBathFraction(raw: string): {
  bedrooms: number | null;
  bathrooms: number | null;
} {
  const text = raw.trim();
  if (!text) return { bedrooms: null, bathrooms: null };

  const slash = text.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (slash) {
    return {
      bedrooms: parseInt(slash[1], 10) || null,
      bathrooms: parseInt(slash[2], 10) || null,
    };
  }

  const digits = text.replace(/[^\d/]/g, "");
  if (digits.includes("/")) {
    const [b, ba] = digits.split("/");
    return {
      bedrooms: parseInt(b, 10) || null,
      bathrooms: parseInt(ba, 10) || null,
    };
  }

  const n = parseInt(text.replace(/\D/g, ""), 10);
  return { bedrooms: Number.isFinite(n) ? n : null, bathrooms: null };
}

export function parsePriceThb(raw: string | null): number | null {
  if (!raw) return null;
  const lower = raw.toLowerCase();
  if (lower.includes("orq") || lower.includes("tbc")) return null;
  const cleaned = raw.replace(/[^\d.]/g, "");
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? Math.round(n) : null;
}

export function slugFromPropertyRef(ref: string): string {
  return ref
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

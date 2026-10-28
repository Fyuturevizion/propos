/** Client-safe WN LUXE brand flag (matches deploy env). */
export function isWnluxeBrand(): boolean {
  return process.env.NEXT_PUBLIC_BRAND_ID === "wnluxe";
}

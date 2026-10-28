#!/usr/bin/env node
// Print the public listing + inventory row for one ref (owner/contact fields omitted).
const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim().replace(/\/$/, "");
const KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();
const ref = (process.argv[2] ?? "J100").toUpperCase();
const SENSITIVE = /owner|contact|phone|email|remark|line_id|whatsapp/i;

async function get(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
}

function redact(row) {
  const out = {};
  for (const [k, v] of Object.entries(row ?? {})) {
    if (SENSITIVE.test(k)) out[k] = v ? "[redacted]" : v;
    else if (k === "images" || k === "gallery_files") out[k] = Array.isArray(v) ? `${v.length} item(s)` : v;
    else if (k === "raw_row" && v && typeof v === "object")
      out[k] = Object.fromEntries(Object.entries(v).map(([rk, rv]) => [rk, SENSITIVE.test(rk) ? "[redacted]" : rv]));
    else out[k] = v;
  }
  return out;
}

const inv = await get(`inventory_listings?property_ref=eq.${ref}&select=*`);
const slug = ref.toLowerCase().replace(/[^a-z0-9]+/g, "-");
const propertyId = inv[0]?.property_id;
const props = await get(
  propertyId ? `properties?or=(slug.eq.${slug},id.eq.${propertyId})&select=*` : `properties?slug=eq.${slug}&select=*`,
);
console.log("=== inventory_listings");
console.log(JSON.stringify(inv.map(redact), null, 2));
console.log("=== properties");
console.log(JSON.stringify(props.map(redact), null, 2));

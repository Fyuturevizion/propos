#!/usr/bin/env node
// Print every spreadsheet row matching a ref (all tabs) and non-image files in its Drive folder.
// Owner/contact columns are redacted.
const env = (n) => (process.env[n] ?? "").trim();
const SHEET_ID = env("WNLUXE_SHEET_ID") || "1tL7C6X7KGcDnVSIrqrmMT0KXzxmzq0q6kgmoqaSoSPg";
const ref = (process.argv[2] ?? "J100").toUpperCase();
const folderId = process.argv[3];
const SENSITIVE = /owner|contact|phone|email|remark|line|whatsapp|tel|เจ้าของ|ติดต่อ|เบอร์/i;

const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    client_id: env("GOOGLE_CLIENT_ID"),
    client_secret: env("GOOGLE_CLIENT_SECRET"),
    refresh_token: env("GOOGLE_REFRESH_TOKEN"),
    grant_type: "refresh_token",
  }),
});
const { access_token } = await tokenRes.json();
if (!access_token) throw new Error(`Google token error ${tokenRes.status}`);
const g = async (url) => {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${access_token}` } });
  if (!res.ok) throw new Error(`${res.status} ${url}: ${(await res.text()).slice(0, 200)}`);
  return res.json();
};

const meta = await g(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}?fields=sheets.properties.title`);
for (const { properties } of meta.sheets) {
  const title = properties.title;
  const data = await g(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(`'${title}'`)}?valueRenderOption=FORMATTED_VALUE`,
  );
  const rows = data.values ?? [];
  const headerIdx = rows.findIndex((r) => r.some((c) => /ref|code|รหัส/i.test(String(c))));
  const header = rows[headerIdx >= 0 ? headerIdx : 0] ?? [];
  const matches = rows.filter((r) => r.some((c) => String(c).trim().toUpperCase() === ref));
  console.log(`=== tab "${title}": ${rows.length} rows, header: ${JSON.stringify(header)}`);
  for (const r of matches) {
    const out = {};
    r.forEach((v, i) => {
      const k = header[i] || `col${i}`;
      out[k] = SENSITIVE.test(k) && v ? "[redacted]" : v;
    });
    console.log(JSON.stringify(out, null, 2));
  }
}

if (folderId) {
  const q = encodeURIComponent(`'${folderId}' in parents and trashed = false and not mimeType contains 'image/'`);
  const files = await g(
    `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,mimeType,size)&supportsAllDrives=true&includeItemsFromAllDrives=true`,
  );
  console.log(`=== non-image files in Drive folder: ${JSON.stringify(files.files, null, 2)}`);
}

#!/usr/bin/env node
// Drive folder (inventory_listings.photo_url) -> Supabase Storage `property-images`
// -> inventory_listings.gallery_files + properties.images.
// Mirrors syncInventoryGalleryRow in the production app so the dashboard reads the same shape.
// Usage: node scripts/sync-inventory-galleries.mjs [REF ...]   (no refs = every row with a photo_url)

const env = (name) => (process.env[name] ?? "").trim();
const SUPABASE_URL = env("NEXT_PUBLIC_SUPABASE_URL").replace(/\/$/, "");
const SERVICE_KEY = env("SUPABASE_SERVICE_ROLE_KEY");
const GOOGLE_CLIENT_ID = env("GOOGLE_CLIENT_ID");
const GOOGLE_CLIENT_SECRET = env("GOOGLE_CLIENT_SECRET");
const GOOGLE_REFRESH_TOKEN = env("GOOGLE_REFRESH_TOKEN");

// Non-secret fingerprints so a client/token mismatch is visible in CI logs.
for (const name of ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN"]) {
  const raw = process.env[name] ?? "";
  const v = raw.trim();
  const shape =
    name === "GOOGLE_CLIENT_ID"
      ? `project=${v.split("-")[0]} clientPrefix=${v.split("-")[1]?.slice(0, 6)} endsWithGoogleDomain=${v.endsWith(".apps.googleusercontent.com")}`
      : name === "GOOGLE_CLIENT_SECRET"
        ? `startsWithGOCSPX=${v.startsWith("GOCSPX-")}`
        : `startsWith1slashslash=${v.startsWith("1//")}`;
  console.log(`${name}: length=${v.length} hadWhitespace=${raw !== v} ${shape}`);
}
const BUCKET = "property-images";

for (const [k, v] of Object.entries({
  NEXT_PUBLIC_SUPABASE_URL: SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: SERVICE_KEY,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN,
})) {
  if (!v) {
    console.error(`Missing ${k}`);
    process.exit(1);
  }
}

const sbHeaders = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
};

async function sb(path, init = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: { ...sbHeaders, "Content-Type": "application/json", ...(init.headers || {}) },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Supabase ${res.status} ${path}: ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : null;
}

function parseDriveFolderId(url) {
  if (!url) return null;
  const m = url.match(/\/folders\/([A-Za-z0-9_-]+)|[?&]id=([A-Za-z0-9_-]+)/);
  return m?.[1] ?? m?.[2] ?? null;
}

let cachedToken = null;
async function googleToken() {
  if (cachedToken) return cachedToken;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: GOOGLE_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });
  const json = await res.json();
  if (!res.ok || !json.access_token) {
    throw new Error(`Google token error (${res.status}): ${json.error} ${json.error_description ?? ""}`);
  }
  console.log(`Google token scopes: ${json.scope}`);
  cachedToken = json.access_token;
  return cachedToken;
}

async function listDriveImages(folderId) {
  const token = await googleToken();
  const files = [];
  let pageToken;
  do {
    const params = new URLSearchParams({
      q: `'${folderId}' in parents and trashed = false and mimeType contains 'image/'`,
      fields: "nextPageToken, files(id,name,mimeType,thumbnailLink,modifiedTime)",
      pageSize: "200",
      supportsAllDrives: "true",
      includeItemsFromAllDrives: "true",
    });
    if (pageToken) params.set("pageToken", pageToken);
    const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || `Drive list failed (${res.status})`);
    files.push(...(json.files ?? []));
    pageToken = json.nextPageToken;
  } while (pageToken);
  return files.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
}

async function copyToStorage(propertyRef, file) {
  const token = await googleToken();
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media&supportsAllDrives=true`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error(`Drive download failed (${res.status}) for ${file.name}`);
  const mimeType = file.mimeType || res.headers.get("content-type") || "image/jpeg";
  const ext = mimeType.includes("png")
    ? "png"
    : mimeType.includes("webp")
      ? "webp"
      : mimeType.includes("gif")
        ? "gif"
        : mimeType.includes("avif")
          ? "avif"
          : "jpg";
  const storagePath = `inventory/${propertyRef}/${file.id}.${ext}`;
  const up = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${storagePath}`, {
    method: "POST",
    headers: { ...sbHeaders, "Content-Type": mimeType, "x-upsert": "true" },
    body: Buffer.from(await res.arrayBuffer()),
  });
  if (!up.ok) throw new Error(`Storage upload failed (${up.status}): ${(await up.text()).slice(0, 200)}`);
  return {
    storagePath,
    cdnUrl: `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storagePath}`,
  };
}

async function syncRow(row) {
  const folderId = parseDriveFolderId(row.photo_url);
  if (!folderId) throw new Error(`No Drive folder link in photo_url: ${row.photo_url}`);

  const existing = new Map(
    (Array.isArray(row.gallery_files) ? row.gallery_files : [])
      .filter((g) => g && typeof g === "object")
      .map((g) => [g.driveFileId, g])
  );
  const driveFiles = await listDriveImages(folderId);
  console.log(`  ${row.property_ref}: ${driveFiles.length} image(s) in folder ${folderId}`);

  const gallery = [];
  for (const f of driveFiles) {
    const prev = existing.get(f.id);
    let cdnUrl = prev?.cdnUrl ?? null;
    let storagePath = prev?.storagePath ?? null;
    const stale = f.modifiedTime && prev?.modifiedTime && f.modifiedTime > prev.modifiedTime;
    if (!cdnUrl || stale) {
      ({ cdnUrl, storagePath } = await copyToStorage(row.property_ref, f));
    }
    gallery.push({
      driveFileId: f.id,
      name: f.name,
      mimeType: f.mimeType,
      driveThumbnailUrl: f.thumbnailLink ?? null,
      cdnUrl,
      storagePath,
      modifiedTime: f.modifiedTime ?? null,
    });
  }

  await sb(`inventory_listings?id=eq.${row.id}`, {
    method: "PATCH",
    body: JSON.stringify({
      drive_folder_id: folderId,
      gallery_files: gallery,
      gallery_synced_at: new Date().toISOString(),
      gallery_sync_error: null,
    }),
  });

  const images = gallery.map((g) => g.cdnUrl).filter(Boolean);
  const slug = row.property_ref.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const filter = row.property_id ? `id=eq.${row.property_id}` : `slug=eq.${encodeURIComponent(slug)}`;
  const updated = await sb(`properties?${filter}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      images,
      internal_images: [{ type: "drive_folder", url: row.photo_url }],
    }),
  });
  console.log(
    `  ${row.property_ref}: ${images.length} image(s) stored; website listing ${
      updated?.length ? `updated (${updated[0].slug})` : "not found — publish it from Inventory"
    }`
  );
  return images.length;
}

async function main() {
  const refs = process.argv.slice(2).map((r) => r.trim().toUpperCase()).filter(Boolean);
  let query = "inventory_listings?select=*&photo_url=not.is.null&order=property_ref";
  if (refs.length) query += `&property_ref=in.(${refs.map(encodeURIComponent).join(",")})`;
  const rows = await sb(query);
  console.log(`Rows to sync: ${rows.length}${refs.length ? ` (${refs.join(", ")})` : ""}`);
  if (refs.length && !rows.length) {
    const any = await sb(
      `inventory_listings?select=property_ref,photo_url&property_ref=in.(${refs.map(encodeURIComponent).join(",")})`
    );
    console.log(`Matching rows (any photo_url): ${JSON.stringify(any)}`);
  }

  let ok = 0;
  let failed = 0;
  for (const row of rows) {
    try {
      await syncRow(row);
      ok++;
    } catch (e) {
      failed++;
      const message = e instanceof Error ? e.message : String(e);
      console.error(`  ${row.property_ref}: FAILED — ${message}`);
      await sb(`inventory_listings?id=eq.${row.id}`, {
        method: "PATCH",
        body: JSON.stringify({ gallery_sync_error: message }),
      }).catch(() => {});
    }
  }
  console.log(`Done: ${ok} synced, ${failed} failed`);
  if (failed && !ok) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

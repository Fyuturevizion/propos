# Google Drive listing photos

Master spreadsheet (embedded Photo links):

https://docs.google.com/spreadsheets/d/1tL7C6X7KGcDnVSIrqrmMT0KXzxmzq0q6kgmoqaSoSPg/edit

WN Luxe stores Drive file references as `gdrive:<fileId>` in `properties.images` and `inventory_listings.gallery_files`. The site serves them through `/api/cdn/image`.

## Live sheet sync

**Dashboard → Listings** (or Inventory) → **Sync Sales** / **Rent-Phuket** calls `/api/sync/wnluxe-sheet`. It reads each Photo cell’s **hyperlink** (not just visible text), upserts **inventory_listings**, and updates public **properties** with resolved images.

## OAuth (Drive + Sheets)

1. In [Google Cloud Console](https://console.cloud.google.com/) (project **WN-Luxe**): enable **Google Drive API** and **Google Sheets API**.
2. OAuth client (same Web client as before) must authorize these **scopes** when you mint the refresh token:
   - `https://www.googleapis.com/auth/drive.readonly` — photo folders/files
   - `https://www.googleapis.com/auth/spreadsheets.readonly` — live sync from the master sheet (including Photo **hyperlinks** via grid API)
3. Share the [Property Listings spreadsheet](https://docs.google.com/spreadsheets/d/1tL7C6X7KGcDnVSIrqrmMT0KXzxmzq0q6kgmoqaSoSPg/edit) with the **same Google account** that owns the refresh token (Viewer is enough for read-only scope).
4. Set secrets on Cloudflare Workers (synced from GitHub on deploy) and in GitHub Actions **production** secrets:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`

**If Sheets was enabled after the refresh token was created:** the old token often has **Drive only**. Re-authorize in [OAuth Playground](https://developers.google.com/oauthplayground) (use your Web client ID/secret, select **both** scopes above), exchange for a new refresh token, then update `GOOGLE_REFRESH_TOKEN` in GitHub and re-run deploy (or `scripts/cloudflare-sync-worker-secrets.sh`).

**Cursor “Sheets MCP”** uses the same Google Cloud project/credentials in the IDE only; production **wnluxe.com** still uses the Worker secrets above—not the MCP connection.

Optional:

- `WNLUXE_DRIVE_PHOTOS_ROOT_ID` — parent folder containing subfolders named like `J100`, `SV-006`.

## Publish flow

1. Upload `Property-Listings.xlsx` on **Dashboard → Inventory**.
2. The parser reads **hyperlinks** in the Photo column (not just visible cell text).
3. **Publish** runs `syncInventoryGallery` then copies `gallery_files` onto the public `properties` row.
4. If images are missing after publish, use **Sync photos** (requires Google OAuth above, or public “anyone with link” sharing on files).

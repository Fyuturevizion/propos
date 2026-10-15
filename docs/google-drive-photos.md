# Google Drive listing photos

WN Luxe stores Drive file references as `gdrive:<fileId>` in `properties.images` and `inventory_listings.gallery_files`. The site serves them through `/api/cdn/image`.

## OAuth (recommended for private folders)

1. In [Google Cloud Console](https://console.cloud.google.com/), create OAuth credentials (Desktop or Web) with Drive read scope.
2. Obtain a refresh token for the account that owns the photo folders.
3. Set secrets on Cloudflare Workers (and locally in `.env.production.local`):

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`

Optional:

- `WNLUXE_DRIVE_PHOTOS_ROOT_ID` — parent folder containing subfolders named like `J100`, `SV-006`.

## Publish flow

1. Upload `Property-Listings.xlsx` on **Dashboard → Inventory**.
2. The parser reads **hyperlinks** in the Photo column (not just visible cell text).
3. **Publish** runs `syncInventoryGallery` then copies `gallery_files` onto the public `properties` row.
4. If images are missing after publish, use **Sync photos** (requires Google OAuth above, or public “anyone with link” sharing on files).

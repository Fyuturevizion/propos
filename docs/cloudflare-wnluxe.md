# WN Luxe on Cloudflare Workers

Production runs on the **`wnluxe`** Worker in your Cloudflare account (Worker tag `011e834a2c3547d0a1bd8c1622e9c181`).

## How deploys are triggered

1. **Workers Builds (Git)** — push to `main` on `Fyuturevizion/propos` runs build + deploy when Builds is connected to this Worker.
2. **Manual** — `wrangler deploy` from a machine with Cloudflare auth (what you used before if Builds shows no history).
3. **Builds API** — `scripts/cloudflare-wnluxe-build.sh` (needs `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`).

## MCP (Cursor Cloudflare integrations)

| Server | What agents can do |
|--------|-------------------|
| **Cloudflare-bindings** | List Workers, read Worker metadata |
| **Cloudflare-builds** | List builds and fetch logs for `wnluxe` |
| **Cloudflare-builds** | Does **not** trigger builds or edit env vars (read-only) |

Authenticate **Cloudflare-builds** under Cursor → Integrations if build lists fail.

## Required production settings

**Runtime** (Worker → Settings → Variables & secrets):

- `NEXT_PUBLIC_BRAND_ID=wnluxe`
- `NEXT_PUBLIC_APP_URL=https://wnluxe.com`
- Supabase keys, Google OAuth, `WNLUXE_SHEET_ID`, `WNLUXE_DRIVE_PHOTOS_ROOT_ID`, etc.

**Build-time** (Worker → Settings → Builds → Build variables, or Builds API):

- Same `NEXT_PUBLIC_*` values (Next.js bakes them at build)
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (and any other vars needed during `next build`)

## Connect Git (one-time, dashboard)

1. [Workers & Pages](https://dash.cloudflare.com/?to=/:account/workers-and-pages) → **wnluxe**
2. **Settings** → **Builds** → connect **GitHub** → `Fyuturevizion/propos`, production branch **`main`**
3. Typical commands (match your existing OpenNext setup):
   - **Build:** `npm run build` (or your OpenNext build script)
   - **Deploy:** `npx wrangler deploy`

After connection, every push to `main` (including merge `947f76e`) should start a build.

## API trigger from an agent

```bash
export CLOUDFLARE_API_TOKEN=...
export CLOUDFLARE_ACCOUNT_ID=...
export SET_WNLUXE_BUILD_ENV=1   # optional: patch NEXT_PUBLIC_BRAND_ID / APP_URL on the trigger
./scripts/cloudflare-wnluxe-build.sh
```

Token scopes: **Workers Builds Edit**, **Workers Scripts Edit**, **Account Settings Read**.

## Agent-ready checklist (WN Luxe)

| Item | Target | Repo / Cloudflare |
|------|--------|-------------------|
| `robots.txt` + Content-Signal | `search=yes, ai-input=yes, ai-train=no` | `public/robots.txt` + `src/app/robots.txt/route.ts` |
| `llms.txt` | Citation map for AI crawlers | `public/llms.txt` + `src/app/llms.txt/route.ts` |
| `sitemap.xml` | All locales + listings | `src/app/sitemap.ts` (after deploy) |
| Locales | `/en`, `/th`, `/ru` | App + hreflang |
| Worker name | `wnluxe` | `wrangler.jsonc` |
| Observability | Enabled | `wrangler.jsonc` → `observability.enabled` |
| Builds | `npm run build:cloudflare` → `opennextjs-cloudflare deploy` | `scripts/cloudflare-wnluxe-apply.sh` |

## Cursor Cloud Agent secrets

Secrets in the Cursor UI are **not** automatically visible in every agent shell. This repo includes root `environment.json` listing `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` so they are injected after you **Save** the environment and start a **new** agent run.

Then run:

```bash
npm run cf:audit    # read-only API + live URL checks
npm run cf:deploy   # trigger build (or use apply script below)
bash scripts/cloudflare-wnluxe-apply.sh   # set optimal build commands + env + deploy
```

## Production status note

If `https://wnluxe.com/robots.txt` returns 404, production is on an **older OpenNext bundle** without the latest routes. Static `public/robots.txt` and `public/llms.txt` ship on the next deploy; run `npm run deploy:cloudflare` or Workers Builds on `main`.

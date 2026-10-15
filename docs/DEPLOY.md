# Deploy WN Luxe (agent + human)

## Standard for agents

**You do not need Cloudflare tokens in the Cloud Agent VM.**

1. Commit changes on a branch (or `main`).
2. Merge to **`main`** and **`git push origin main`** (or run `bash scripts/agent-deploy.sh` on `main`).
3. **GitHub Actions** runs [Deploy production](../.github/workflows/deploy-production.yml) and publishes to the **`wnluxe`** Cloudflare Worker.

Check status: [Actions → Deploy production](https://github.com/Fyuturevizion/propos/actions/workflows/deploy-production.yml).

Manual redeploy without a code change: Actions → **Deploy production (WN Luxe)** → **Run workflow**.

## One-time setup (repository admin)

Add these **GitHub repository secrets** (Settings → Secrets and variables → Actions):

| Secret | Used for |
|--------|----------|
| `CLOUDFLARE_API_TOKEN` | Wrangler deploy (Workers Scripts Edit) |
| `CLOUDFLARE_ACCOUNT_ID` | Account targeting |
| `NEXT_PUBLIC_SUPABASE_URL` | Build + app |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Build + app |
| `SUPABASE_SERVICE_ROLE_KEY` | Build sitemap/API + Worker runtime (synced on deploy) |

Optional runtime secrets (synced to Worker on each deploy if present):

`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, `OPENAI_API_KEY`, `TELEGRAM_BOT_TOKEN`, `WHATSAPP_*`, `LINE_CHANNEL_*`, `WNLUXE_DRIVE_PHOTOS_ROOT_ID`

Create a GitHub **environment** named `production` (optional; workflow references it for audit trail).

### Cloudflare (one-time)

- Worker name: **`wnluxe`** (`wrangler.jsonc`)
- Custom domain: **`wnluxe.com`** → this Worker (dashboard)
- **Workers Builds** is optional; **GitHub Actions is the source of truth** for deploys from this repo.

## Security

- Secrets live only in **GitHub Actions** and **Cloudflare Worker secrets**, never in git.
- Deploy workflow uses least privilege: `contents: read`.
- Production deploys are serialized (`concurrency`) so two pushes do not fight.
- PRs run **CI** (lint + build) only; no deploy.

## Local / emergency

```bash
npm run deploy:cloudflare
```

Requires `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, and Supabase env vars locally.

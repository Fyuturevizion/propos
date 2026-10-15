# Deploy WN Luxe (agent + human)

## Standard for agents

**You do not need Cloudflare tokens in the Cloud Agent VM.**

1. Commit changes on a branch (or `main`).
2. Merge to **`main`** and **`git push origin main`** (or run `bash scripts/agent-deploy.sh` on `main`).
3. **GitHub Actions** runs [Deploy production](../.github/workflows/deploy-production.yml) and publishes to the **`wnluxe`** Cloudflare Worker.

Check status: [Actions → Deploy production](https://github.com/Fyuturevizion/propos/actions/workflows/deploy-production.yml).

Manual redeploy without a code change: Actions → **Deploy production (WN Luxe)** → **Run workflow**.

## One-time setup (repository admin)

Do this once per repository. After this, **cloud agents only merge and push `main`**; they never need Cloudflare or Supabase keys in the agent VM.

**Cursor Cloud Environment secrets** (dashboard environment UUID, past agent chats, or “main” conversation IDs) do **not** deploy the site. Production deploy reads **GitHub Actions** secrets only. If you already configured Cloudflare/Supabase in Cursor, copy the same values into GitHub (table below).

### GitHub Environments

1. Create environment **`production`** (Settings → Environments → New environment).
2. Optional: add required reviewers or deployment branches (`main` only) for extra safety.
3. The deploy workflow uses `environment: production` so deploys show up under Environments.

### Repository secrets

Add these **GitHub repository secrets** (Settings → Secrets and variables → Actions), or add the same names as **environment secrets** on `production` (environment secrets override repo secrets for that job):

| Secret | Used for |
|--------|----------|
| `CLOUDFLARE_API_TOKEN` | Wrangler deploy (Workers Scripts Edit) |
| `CLOUDFLARE_ACCOUNT_ID` | Account targeting |
| `NEXT_PUBLIC_SUPABASE_URL` | Build + app |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Build + app |
| `SUPABASE_SERVICE_ROLE_KEY` | Build sitemap/API + Worker runtime (synced on deploy) |

Optional runtime secrets (synced to Worker on each deploy if present):

`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, `OPENAI_API_KEY`, `TELEGRAM_BOT_TOKEN`, `WHATSAPP_*`, `LINE_CHANNEL_*`, `WNLUXE_DRIVE_PHOTOS_ROOT_ID`

### Cloudflare API token (one-time)

Create a token in Cloudflare dashboard with:

- **Account** → Workers Scripts → **Edit**
- **Account** → Workers Secrets → **Edit** (for `wrangler secret put` on deploy)
- **Zone** → `wnluxe.com` → **Read** (optional; for smoke checks only)

Store as `CLOUDFLARE_API_TOKEN`. Account ID → `CLOUDFLARE_ACCOUNT_ID`.

### Cloudflare Worker (one-time)

- Worker name: **`wnluxe`** (`wrangler.jsonc`)
- Custom domain: **`wnluxe.com`** → this Worker (dashboard)
- **Workers Builds** is optional; **GitHub Actions is the source of truth** for deploys from this repo.

### Branch protection (recommended)

On **`main`**: require pull request before merging, require status check **CI / build**, and disallow force-push. Deploy still runs only on push to `main` after merge.

### If Actions fail with “Missing GitHub Actions secret(s)”

The workflow lists which names are empty. Add them in GitHub; re-run **Deploy production** from the Actions tab (no code change required).

## Security

- Secrets live only in **GitHub Actions** (and optional **production** environment) and **Cloudflare Worker secrets**, never in git or Cursor agent VMs.
- Deploy workflow uses least privilege: `contents: read` only.
- Production deploys are serialized (`concurrency`) so two pushes do not fight.
- PRs run **CI** (lint + build) only; no deploy.
- `scripts/github-actions-preflight.sh` fails the job with a clear list if secrets were never configured (avoids cryptic `npm` or `wrangler` errors).
- Dependencies install with `legacy-peer-deps` (`.npmrc`) so `npm ci` matches OpenNext + Next 16 peer ranges in CI.

## Local / emergency

```bash
npm run deploy:cloudflare
```

Requires `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, and Supabase env vars locally.

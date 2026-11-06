# Making GitHub `main` match what wnluxe.com serves

## Current facts (verified)

1. **`DEPLOY_FREEZE` in the repo root** causes **Deploy production (WN Luxe)** to **skip** `npm ci`, build, and Cloudflare deploy. The workflow still exits **success**, but production is **not** updated from `main`.

2. **Live HTML does not match `main` source.** For example, `https://wnluxe.com/en` includes copy such as “Exceptional … beautifully …” and meta that describe a **curated luxury villa** positioning. A full-text search over **`Fyuturevizion/propos` `main`** does **not** contain those strings. So **`origin/main` ≠ the bundle currently served** at the edge.

3. The team has already documented that the **rolled-back** Worker was built from a **local checkout that was never pushed** (see **`docs/RESTORE-PRE-GITHUB-APP.md`**). Until that tree is on GitHub, **`main` cannot be the source of truth** for production.

## What “settled” means

| Goal | Requirement |
|------|-------------|
| **`main` = production code** | Push a commit to `Fyuturevizion/propos` whose built output matches what Cloudflare serves (or merge a branch that contains that tree). |
| **Deploys from `main` again** | Remove **`DEPLOY_FREEZE`** only **after** the repository matches production, then merge to `main` and let **Deploy production** run without the freeze skip. |

**Do not delete `DEPLOY_FREEZE` first** — the next successful deploy would ship **`main`**, which is **not** the same as today’s site.

## Recommended sequence

### A. From the machine that has the real app source (e.g. home Mac)

1. Locate the folder that produced the **current** production build (the doc above suggests something like `~/Projects/propos/propos`).
2. Confirm it is a **clean** git repo (no stray secrets in commits; `.env*` not tracked).
3. Add this remote if needed: `git remote add origin git@github.com:Fyuturevizion/propos.git` (or HTTPS).
4. Create a branch and push the **full tree** that matches production, e.g.  
   `git checkout -b restore/live-as-deployed`  
   `git add -A && git commit -m "Restore source matching current wnluxe.com Worker"`  
   `git push -u origin restore/live-as-deployed`

### B. In GitHub (human or agent with PR access)

1. Open a PR **`restore/live-as-deployed` → `main`**.
2. Merge **deploy workflows and scripts** from current `main` if the restored branch overwrote them — keep **`.github/workflows/**`** and **`scripts/cloudflare-*`** aligned with what you use to deploy.
3. Run a diff / smoke test: local `NEXT_PUBLIC_BRAND_ID=wnluxe` build and compare routes and copy to **https://wnluxe.com**.

### C. Unfreeze and deploy

1. Delete **`DEPLOY_FREEZE`** on `main` (single commit).
2. Push to `main` (or **workflow_dispatch** on **Deploy production (WN Luxe)**) and confirm the Actions log **does not** print “Deploys frozen” and that **Build and deploy** steps **run**.

### D. Optional: prove bundle parity

Use **[`.github/workflows/inspect-worker.yml`](./.github/inspect-worker.yml)** with the **Worker version id** shown in Cloudflare (see **`docs/RESTORE-PRE-GITHUB-APP.md`**) to download the deployed bundle for comparison with a local `opennext`/`wrangler` output.

## PRs from agents (e.g. contact env fixes)

Branches created from **`main` while production is frozen** only reflect **repository** `main`, not necessarily **wnluxe.com**. Rebase or recreate those PRs **after** `main` contains the deployed source, or merge them into the **restore** branch before making it `main`.

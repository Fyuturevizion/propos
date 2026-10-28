# Restoring the pre–GitHub-deploy app as `main`

## Current production state

- **wnluxe.com** runs Worker version `8d4b9c02-9a1e-4ae4-8360-a9b5c791a3c2` (rolled back 2026-10-28 17:03 UTC).
- Its code is the manual `wrangler deploy` of **2026-10-03 06:53 UTC** (version `a0da96c1-7382-4249-b461-5401934b828f`, author iainmckie.ia@gmail.com), plus dashboard secret edits from 2026-10-28.
- `DEPLOY_FREEZE` in the repo root stops **Deploy production** from overwriting it. Delete the file to resume deploys.

## Where the source is

The bundle was built from a local checkout that was never pushed:

```
/Users/iainm/Projects/propos/propos
```

That build contains routes missing from this repo's history, e.g. `api/inventory/import`, `api/inventory/sync-galleries`, `api/media/signed-url`, `dashboard/listings/[slug]`, and the "Import Google Sheet" inventory UI.

## Push it from the Mac

```bash
cd ~/Projects/propos/propos   # or ~/Projects/propos if the git root is there
git status                    # .env* files must NOT be listed
git checkout -b restore/live-oct3
git add -A
git commit -m "Restore app that was live on wnluxe.com (Oct 3 build)"
git push -u origin restore/live-oct3
```

## Then (agent)

1. Diff `restore/live-oct3` against `main`; carry over only the deploy workflows/scripts (`.github/workflows/*`, `scripts/cloudflare-*`, `scripts/github-actions-preflight.sh`).
2. Make that branch the new `main`.
3. Delete `DEPLOY_FREEZE`, deploy, and compare against the rolled-back site.

## Tools

- `[rollback-worker before=<ISO time>]` in a `main` commit message → roll back to the newest version before that time (`rollback-worker.yml`).
- `[inspect-worker version=<id>]` → download that version's bundle as an artifact (`inspect-worker.yml`).

# Restoring the pre–GitHub-deploy app as `main`

When the rolled-back Worker matches the site you want:

## 1. Confirm production

- Open https://wnluxe.com and the admin paths you remember (inventory, login).
- Compare with screenshots if you have them.

## 2. Stop accidental redeploys

Until source is aligned, **do not push to `main`** except `[rollback-worker]` commits.  
Optional: disable **Deploy production** in GitHub Actions temporarily.

## 3. Recover source code (required to make rollback “main” in git)

A Cloudflare rollback restores the **compiled Worker bundle**, not this repo’s history. To make that app the real `main`:

| Approach | Action |
|----------|--------|
| **A. You have the old project** | Push that repo or branch; we point GitHub deploy at it. |
| **B. Only Cloudflare has it** | In Cloudflare dashboard → **Workers → wnluxe → Versions**, note the version ID that matches. Download/extract if available; otherwise re-implement admin/inventory from the live UI and retire PropOS reskin. |
| **C. Pin deploy to a version** | Document the version ID; avoid `wrangler deploy` from current `main` until code matches. |

## 4. After source is found

1. Replace or merge into `Fyuturevizion/propos` `main`.
2. Run **Deploy production** once to verify parity.
3. Re-enable normal pushes to `main`.

Agent note: tonight’s GitHub deploys (from ~23:29 Bangkok) replaced an older manual bundle. Multiple rollbacks (`steps=5`–`6`) may be needed to reach it.

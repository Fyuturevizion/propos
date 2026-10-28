# Push a commit to `main` with message containing `[rollback-worker]`
# to roll back the wnluxe Worker (see rollback-worker.yml).
#
# Examples:
#   `[rollback-worker]` — one version back
#   `[rollback-worker steps=5]` — five versions back (toward pre–GitHub deploy)
#
# Manual: GitHub Actions → Rollback Worker (WN Luxe) → Run workflow (set **steps**).
#
# After rollback, production deploy is **skipped** for these commits so the
# rolled-back bundle is not immediately overwritten.

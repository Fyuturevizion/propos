#!/usr/bin/env bash
# Agent deploy entrypoint: ensure main is pushed; GitHub Actions deploys to Cloudflare.
set -euo pipefail

branch=$(git rev-parse --abbrev-ref HEAD)
if [[ "$branch" != "main" ]]; then
  echo "Current branch is ${branch}. Merge to main and push, or:" >&2
  echo "  git checkout main && git merge ${branch} && git push origin main" >&2
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Uncommitted changes. Commit first." >&2
  git status -sb
  exit 1
fi

git push origin main
echo "Pushed main. Production deploy: https://github.com/Fyuturevizion/propos/actions/workflows/deploy-production.yml"

#!/usr/bin/env bash
# Fail fast in GitHub Actions when required secrets are missing (values are never printed).
set -euo pipefail

mode="${1:-deploy}"

required_deploy=(
  CLOUDFLARE_API_TOKEN
  CLOUDFLARE_ACCOUNT_ID
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  SUPABASE_SERVICE_ROLE_KEY
)

required_ci=(
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  SUPABASE_SERVICE_ROLE_KEY
)

case "$mode" in
  deploy) required=("${required_deploy[@]}") ;;
  ci) required=("${required_ci[@]}") ;;
  *)
    echo "Usage: $0 deploy|ci" >&2
    exit 1
    ;;
esac

missing=()
for name in "${required[@]}"; do
  if [[ -z "${!name:-}" ]]; then
    missing+=("$name")
  fi
done

if [[ ${#missing[@]} -gt 0 ]]; then
  echo "::error::Missing GitHub Actions secret(s): ${missing[*]}"
  echo "Add them under Settings → Secrets and variables → Actions."
  echo "See docs/DEPLOY.md for the checklist and Cloudflare token scopes."
  exit 1
fi

echo "Preflight OK (${mode}): required secrets are set."

#!/usr/bin/env bash
# Push runtime secrets to the wnluxe Worker (never logs values).
set -euo pipefail

WORKER_NAME="${WORKER_NAME:-wnluxe}"

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  if [[ "${GITHUB_ACTIONS:-}" == "true" ]]; then
    echo "CLOUDFLARE_API_TOKEN not set in GitHub Actions." >&2
    exit 1
  fi
  echo "CLOUDFLARE_API_TOKEN not set; skipping Worker secret sync." >&2
  exit 0
fi

put_secret() {
  local name="$1"
  local value="${!name:-}"
  if [[ -z "$value" ]]; then
    echo "Skip ${name} (not in environment)"
    return 0
  fi
  echo "Sync ${name} -> Worker ${WORKER_NAME}"
  echo -n "$value" | npx wrangler secret put "$name" --name "$WORKER_NAME"
}

# Runtime-only (not baked into NEXT_PUBLIC_ build output)
put_secret SUPABASE_SERVICE_ROLE_KEY
put_secret GOOGLE_CLIENT_ID
put_secret GOOGLE_CLIENT_SECRET
put_secret GOOGLE_REFRESH_TOKEN
put_secret OPENAI_API_KEY
put_secret TELEGRAM_BOT_TOKEN
put_secret WHATSAPP_ACCESS_TOKEN
put_secret WHATSAPP_VERIFY_TOKEN
put_secret WHATSAPP_PHONE_NUMBER_ID
put_secret LINE_CHANNEL_ACCESS_TOKEN
put_secret LINE_CHANNEL_SECRET
put_secret WNLUXE_DRIVE_PHOTOS_ROOT_ID
put_secret CRON_SECRET

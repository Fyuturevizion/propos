#!/usr/bin/env bash
# Apply recommended Workers Builds settings for WN Luxe and trigger a main deploy.
set -euo pipefail

WORKER_TAG="${WORKER_TAG:-011e834a2c3547d0a1bd8c1622e9c181}"
BRANCH="${BRANCH:-main}"
API="https://api.cloudflare.com/client/v4"

load_secret() {
  local name="$1"
  if [[ -n "${!name:-}" ]]; then return 0; fi
  for path in "/run/secrets/${name}" "/secrets/${name}"; do
    if [[ -f "$path" ]]; then
      export "$name=$(tr -d '\n' < "$path")"
      return 0
    fi
  done
  return 1
}

load_secret CLOUDFLARE_API_TOKEN || true
load_secret CLOUDFLARE_ACCOUNT_ID || true

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" || -z "${CLOUDFLARE_ACCOUNT_ID:-}" ]]; then
  echo "Cloudflare secrets not available in this shell." >&2
  echo "They must be in Cursor environment secrets AND listed in environment.json (Save, then start a new agent)." >&2
  exit 1
fi

auth=(--header "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}")

triggers_json=$(curl -fsS "${API}/accounts/${CLOUDFLARE_ACCOUNT_ID}/builds/workers/${WORKER_TAG}/triggers" "${auth[@]}")
trigger_uuid=$(echo "$triggers_json" | jq -r '.result[] | select((.branch_includes // []) | index("main") != null) | .trigger_uuid' | head -n1)
if [[ -z "$trigger_uuid" ]]; then
  trigger_uuid=$(echo "$triggers_json" | jq -r '.result[0].trigger_uuid // empty')
fi

if [[ -z "$trigger_uuid" ]]; then
  echo "No Builds trigger. Connect Git on Worker wnluxe first." >&2
  exit 2
fi

echo "Updating trigger ${trigger_uuid}..."
curl -fsS "${API}/accounts/${CLOUDFLARE_ACCOUNT_ID}/builds/triggers/${trigger_uuid}" \
  "${auth[@]}" \
  --header "Content-Type: application/json" \
  --request PATCH \
  --data '{
    "build_command": "npm run build:cloudflare",
    "deploy_command": "npx opennextjs-cloudflare deploy",
    "build_caching_enabled": true
  }' | jq '{success}'

patch=$(jq -n \
  --arg brand "${NEXT_PUBLIC_BRAND_ID:-wnluxe}" \
  --arg url "${NEXT_PUBLIC_APP_URL:-https://wnluxe.com}" \
  --arg supa "${NEXT_PUBLIC_SUPABASE_URL:-}" \
  --arg anon "${NEXT_PUBLIC_SUPABASE_ANON_KEY:-}" \
  '{
    NEXT_PUBLIC_BRAND_ID: { value: $brand, is_secret: false },
    NEXT_PUBLIC_APP_URL: { value: $url, is_secret: false }
  }
  | if $supa != "" then . + {NEXT_PUBLIC_SUPABASE_URL: {value: $supa, is_secret: false}} else . end
  | if $anon != "" then . + {NEXT_PUBLIC_SUPABASE_ANON_KEY: {value: $anon, is_secret: true}} else . end')

curl -fsS "${API}/accounts/${CLOUDFLARE_ACCOUNT_ID}/builds/triggers/${trigger_uuid}/environment_variables" \
  "${auth[@]}" \
  --header "Content-Type: application/json" \
  --request PATCH \
  --data "$patch" | jq '{success}'

echo "Triggering build for ${BRANCH}..."
curl -fsS "${API}/accounts/${CLOUDFLARE_ACCOUNT_ID}/builds/triggers/${trigger_uuid}/builds" \
  "${auth[@]}" \
  --header "Content-Type: application/json" \
  --request POST \
  --data "{\"branch\":\"${BRANCH}\"}" | jq '{success, build: .result.uuid, status: .result.status}'

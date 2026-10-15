#!/usr/bin/env bash
# Trigger a Workers Builds deploy for the `wnluxe` Worker and (optionally) set build env vars.
# Requires: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID
# Docs: https://developers.cloudflare.com/workers/ci-cd/builds/api-reference/

set -euo pipefail

WORKER_NAME="${WORKER_NAME:-wnluxe}"
WORKER_TAG="${WORKER_TAG:-011e834a2c3547d0a1bd8c1622e9c181}"
BRANCH="${BRANCH:-main}"
API="https://api.cloudflare.com/client/v4"

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" || -z "${CLOUDFLARE_ACCOUNT_ID:-}" ]]; then
  echo "Set CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID (Cloudflare dashboard → API Tokens)." >&2
  exit 1
fi

auth=(--header "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}")

echo "Listing build triggers for Worker ${WORKER_NAME} (tag ${WORKER_TAG})..."
triggers_json=$(curl -fsS "${API}/accounts/${CLOUDFLARE_ACCOUNT_ID}/builds/workers/${WORKER_TAG}/triggers" "${auth[@]}")
echo "$triggers_json" | jq '.result[] | {trigger_uuid, trigger_name, branch_includes, branch_excludes}'

trigger_uuid=$(echo "$triggers_json" | jq -r --arg branch "$BRANCH" '
  .result[]
  | select((.branch_includes // []) | index($branch) != null or index("*") != null)
  | .trigger_uuid' | head -n1)

if [[ -z "$trigger_uuid" || "$trigger_uuid" == "null" ]]; then
  trigger_uuid=$(echo "$triggers_json" | jq -r '.result[0].trigger_uuid // empty')
fi

if [[ -z "$trigger_uuid" ]]; then
  echo "No Workers Builds trigger found. Connect Git in the dashboard:" >&2
  echo "  Workers & Pages → wnluxe → Settings → Builds → Connect repository Fyuturevizion/propos (branch ${BRANCH})" >&2
  exit 2
fi

echo "Using trigger ${trigger_uuid}"

if [[ "${SET_WNLUXE_BUILD_ENV:-}" == "1" ]]; then
  echo "Patching build-time environment variables..."
  curl -fsS "${API}/accounts/${CLOUDFLARE_ACCOUNT_ID}/builds/triggers/${trigger_uuid}/environment_variables" \
    "${auth[@]}" \
    --header "Content-Type: application/json" \
    --request PATCH \
    --data "$(jq -n \
      --arg brand "${NEXT_PUBLIC_BRAND_ID:-wnluxe}" \
      --arg url "${NEXT_PUBLIC_APP_URL:-https://wnluxe.com}" \
      '{
        NEXT_PUBLIC_BRAND_ID: { value: $brand, is_secret: false },
        NEXT_PUBLIC_APP_URL: { value: $url, is_secret: false }
      }')" | jq '.success'
fi

echo "Triggering build for branch ${BRANCH}..."
curl -fsS "${API}/accounts/${CLOUDFLARE_ACCOUNT_ID}/builds/triggers/${trigger_uuid}/builds" \
  "${auth[@]}" \
  --header "Content-Type: application/json" \
  --request POST \
  --data "{\"branch\":\"${BRANCH}\"}" | jq '{success, result: .result | {uuid, status, created_on}}'

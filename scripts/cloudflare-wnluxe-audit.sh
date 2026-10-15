#!/usr/bin/env bash
# Audit Cloudflare Worker `wnluxe` + zone wnluxe.com (read-only).
set -euo pipefail

WORKER_NAME="${WORKER_NAME:-wnluxe}"
WORKER_TAG="${WORKER_TAG:-011e834a2c3547d0a1bd8c1622e9c181}"
ZONE_NAME="${ZONE_NAME:-wnluxe.com}"
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
  echo "Missing CLOUDFLARE_API_TOKEN or CLOUDFLARE_ACCOUNT_ID in the agent environment." >&2
  echo "Add them to Cursor Cloud environment secrets and ensure environment.json lists them (then Save + new agent run)." >&2
  exit 1
fi

auth=(--header "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}")

echo "== Token =="
curl -fsS "${API}/user/tokens/verify" "${auth[@]}" | jq '{success, status: .result.status}'

echo "== Worker script =="
curl -fsS "${API}/accounts/${CLOUDFLARE_ACCOUNT_ID}/workers/scripts/${WORKER_NAME}" "${auth[@]}" \
  | jq '{success, id: .result.id, modified: .result.modified_on, usage_model: .result.usage_model}'

echo "== Worker routes (custom domains) =="
curl -fsS "${API}/accounts/${CLOUDFLARE_ACCOUNT_ID}/workers/scripts/${WORKER_NAME}/routes" "${auth[@]}" \
  | jq '.result[]? | {id, pattern, script}'

echo "== Workers Builds triggers =="
curl -fsS "${API}/accounts/${CLOUDFLARE_ACCOUNT_ID}/builds/workers/${WORKER_TAG}/triggers" "${auth[@]}" \
  | jq '.result[]? | {trigger_uuid, trigger_name, branch_includes, build_command, deploy_command, build_caching_enabled}'

echo "== Recent builds =="
curl -fsS "${API}/accounts/${CLOUDFLARE_ACCOUNT_ID}/builds/workers/${WORKER_TAG}/builds?per_page=5" "${auth[@]}" \
  | jq '.result[]? | {uuid, status, created_on, source: .source.branch}'

echo "== Zone =="
zone_id=$(curl -fsS "${API}/zones?name=${ZONE_NAME}" "${auth[@]}" | jq -r '.result[0].id // empty')
if [[ -z "$zone_id" ]]; then
  echo "Zone ${ZONE_NAME} not found in this account."
else
  curl -fsS "${API}/zones/${zone_id}" "${auth[@]}" \
    | jq '.result | {name, status, plan: .plan.name, paused}'
  echo "== Zone settings (performance / SSL) =="
  for setting in ssl, always_use_https, automatic_https_rewrites, brotli, early_hints, http3, minify; do
    curl -fsS "${API}/zones/${zone_id}/settings/${setting}" "${auth[@]}" \
      | jq --arg s "$setting" '{setting: s, value: .result.value}'
  done
fi

echo "== Live discovery URLs =="
for path in /robots.txt /llms.txt /sitemap.xml /en; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "https://${ZONE_NAME}${path}")
  echo "${path} -> HTTP ${code}"
done

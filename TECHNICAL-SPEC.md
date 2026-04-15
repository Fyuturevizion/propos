# TTT Properties — Technical Specification for Agent Orchestration

**Version:** 1.0  
**Date:** April 11, 2026  
**Purpose:** Enable any AI agent (Hermes, Claude Code, Codex, etc.) to understand, connect to, and automate every part of the TTT Properties system in a single request.

---

## 1. Agent Orchestration Philosophy

This system is designed so that an AI agent can:

1. **Understand** the entire system from this document alone
2. **Authenticate** to every service without human help
3. **Read and write** data across all components
4. **Chain operations** across services in a single flow
5. **Learn** new services by discovering their APIs

The orchestrator is the "king of automation" — it doesn't need to know how to use each service. It learns by reading API specs, testing endpoints, and building a mental model of each application it encounters.

---

## 2. Service Registry

Every service the orchestrator can reach, with exact connection details.

### 2.1 Supabase (Primary Database + Auth)

| Detail | Value |
|--------|-------|
| URL | http://localhost:54321 |
| DB Host | 127.0.0.1:54322 |
| DB User | postgres |
| DB Pass | (in .env.local) |
| Anon Key | (in .env.local as NEXT_PUBLIC_SUPABASE_ANON_KEY) |
| Service Role Key | (in .env.local as SUPABASE_SERVICE_ROLE_KEY) |
| Studio | http://localhost:54323 |

**Tables:** agents, properties, leads, messages, viewings, tasks, social_posts, daily_briefs

**How to connect:**
```python
from supabase import create_client
sb = create_client("http://localhost:54321", SERVICE_ROLE_KEY)
# Service role bypasses RLS — full read/write to all tables
result = sb.table("properties").select("*").execute()
```

**How to query via REST:**
```bash
curl "http://localhost:54321/rest/v1/properties" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $SERVICE_ROLE_KEY"
```

**How to query via SQL:**
```bash
docker exec supabase_db_propos psql -U postgres -c "SELECT * FROM properties"
```

**Auth (admin generate session):**
```bash
curl -X POST "http://localhost:54321/auth/v1/admin/generate-link" \
  -H "apikey: $SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
  -d '{"type":"magiclink","email":"bow@tttproperties.com"}'
```

### 2.2 Next.js Web Application

| Detail | Value |
|--------|-------|
| Dev Server | http://localhost:3000 |
| Tunnel | https://baseline-historic-advertisements-sticky.trycloudflare.com |
| Project Path | /Users/iainmck/Projects-2026/propos/ |
| Start | `npm run dev` |
| Env File | .env.local |

**API Routes (all return JSON):**
```
GET  /api/properties              — List properties (filters: type, district, bedrooms, listing_type)
POST /api/properties              — Create property
GET  /api/properties/[slug]       — Get single property
POST /api/leads                   — Create lead
GET  /api/leads?status=new        — List leads with filter
POST /api/upload                  — Upload image (multipart/form-data, field: "file")
POST /api/auth/login              — Email/password login (form data)
POST /api/auth/logout             — Logout
GET  /api/auth/tg-session?...     — Telegram auth (sets cookies, redirects)
POST /api/auth/telegram           — Telegram auth (JSON body)
```

**How to create a property via API:**
```bash
curl -X POST http://localhost:3000/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -d '{
    "slug": "kata-villa-3bed",
    "title_en": "Kata Villa with Pool",
    "property_type": "villa",
    "listing_type": "sale",
    "price_thb": 5500000,
    "bedrooms": 3,
    "bathrooms": 2,
    "area_sqm": 150,
    "area_district": "Kata",
    "features": {"pool": true, "sea_view": true}
  }'
```

### 2.3 Telegram Bot

| Detail | Value |
|--------|-------|
| Bot Username | @TTT_Properties_Bot |
| Bot Token | (in propos-bot/.env) |
| Allowed Users | 453758488 (Iain), 2117223412 (Bow) |
| Project Path | /Users/iainmck/Projects-2026/propos-bot/ |
| Start | `source venv/bin/activate && python3 -m src.bot` |

**How to send a message as the bot:**
```bash
curl -X POST "https://api.telegram.org/bot${TOKEN}/sendMessage" \
  -H "Content-Type: application/json" \
  -d '{"chat_id": "2117223412", "text": "Hello from the orchestrator!"}'
```

**How to send a dashboard login link:**
```bash
# Generate via Python
cd /Users/iainmck/Projects-2026/propos-bot
source venv/bin/activate
python3 -c "
from src.bot import build_dashboard_url
print(build_dashboard_url(2117223412))
"
# Send that URL to Bow via sendMessage with inline keyboard
```

### 2.4 LM Studio (Local LLM)

| Detail | Value |
|--------|-------|
| URL | http://localhost:1234 |
| Model | qwen3.5-35b-a3b-mlx |
| API | OpenAI-compatible (/v1/chat/completions) |

**How to call:**
```bash
curl -X POST http://localhost:1234/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen3.5-35b-a3b-mlx",
    "messages": [{"role": "user", "content": "Hello"}],
    "temperature": 0.7,
    "max_tokens": 2048
  }'
```

---

## 3. Orchestration Patterns

### 3.1 Pattern: Bow says something → Full automation

```
INPUT:  Bow messages TG bot: "New client Khun Prasert, phone 089-111-2222, 
        wants a 2-bed condo in Patong under 3 million baht"

FLOW:
  1. Bot receives message → logs to Supabase messages table
  2. Bot pulls live DB context (properties, leads, tasks)
  3. Bot sends to LM Studio with full system prompt + context
  4. LM Studio returns: natural response + structured JSON
  5. Bot classifies intent: "add_client" (has name + phone)
  6. Bot calls supabase_db.add_client() → creates lead in Supabase
  7. Bot also checks: does this match any existing properties?
  8. If match found, bot suggests: "I found 2 condos in Patong under 3M..."
  9. Bot sends response to Bow via Telegram
  10. Dashboard CRM shows new lead immediately

ZERO human intervention. Bow just talks.
```

### 3.2 Pattern: Orchestrator discovers a new service

```
INPUT:  User says "Connect to Google Calendar"

FLOW:
  1. Orchestrator reads this spec — no Google Calendar entry found
  2. Orchestrator searches for Google Calendar API documentation
  3. Orchestrator identifies required auth (OAuth2, API key, etc.)
  4. Orchestrator creates a new service entry in this registry
  5. Orchestrator writes integration code (adapter/client)
  6. Orchestrator tests connection
  7. Orchestrator wires into existing flow (e.g., viewings → GCal events)
  8. Orchestrator updates this spec with new service details
  9. Future requests can use Google Calendar immediately

The orchestrator LEARNS each service and teaches itself to log in.
```

### 3.3 Pattern: Cross-service automation

```
INPUT:  "Send this week's property listings to all warm leads"

FLOW:
  1. Query Supabase: properties created this week (status=active)
  2. Query Supabase: leads with score=warm
  3. For each lead, determine preferred language and contact method
  4. For each lead, call LM Studio to draft personalized message
  5. For TG leads: send via bot
  6. For email leads: send via email API
  7. For LINE leads: send via LINE adapter (when built)
  8. Log all sent messages to Supabase messages table
  9. Update lead.last_contact_at
  10. Report back: "Sent to 5 warm leads: 3 via TG, 2 via email"
```

---

## 4. Agent Handshake Protocol

When a new agent starts working on this project, it should:

### Step 1: Read Context
```
Read this file (TECHNICAL-SPEC.md)
Read PRD.md
Read SESSION-HANDOFF.md (if exists)
```

### Step 2: Verify Services
```
curl http://localhost:3000 → expect 200
curl http://localhost:54321/rest/v1/agents → expect JSON array
ps aux | grep "src.bot" → expect running process
```

### Step 3: Understand State
```
Query Supabase for current data counts
Check which services are running
Identify what needs attention
```

### Step 4: Execute
```
Make changes following the patterns above
Write data to Supabase (service role key)
Update this spec if new services/integrations added
```

---

## 5. Authentication Cheat Sheet

| Service | How to Auth | Credentials Location |
|---------|-------------|---------------------|
| Supabase REST | `apikey` header + `Authorization: Bearer` | .env.local |
| Supabase DB | psql with password | .env.local (DATABASE_URL) |
| Next.js API | No auth (or service role key) | .env.local |
| Telegram Bot API | Bot token in URL path | propos-bot/.env |
| LM Studio | No auth (localhost only) | — |
| Cloudflare Tunnel | No auth (public, ephemeral) | — |

---

## 6. Environment Variables

### propos/.env.local
```
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
DATABASE_URL=postgresql://postgres:***@127.0.0.1:54322/postgres
OPENAI_API_KEY=***
OPENAI_BASE_URL=http://localhost:1234/v1
TELEGRAM_BOT_TOKEN=8539879472:AAF5...
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=***
```

### propos-bot/.env
```
TELEGRAM_BOT_TOKEN=8539879472:AAF5...
TELEGRAM_ALLOWED_USERS=453758488,2117223412
LM_STUDIO_URL=http://localhost:1234
LM_STUDIO_MODEL=qwen3.5-35b-a3b-mlx
SUPABASE_URL=http://localhost:54321
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
AGENT_ID_BOW=903513d1-b9bd-485e-8989-83b5c7629aa0
AGENT_ID_IAIN=d00ff6ae-8187-4f7e-83de-c261482c3a03
WEBAPP_URL=https://baseline-historic-advertisements-sticky.trycloudflare.com
```

---

## 7. Common Operations Reference

### Add a property programmatically
```python
from supabase import create_client
sb = create_client(URL, SERVICE_ROLE_KEY)
sb.table("properties").insert({
    "slug": "unique-slug-here",
    "title_en": "Beautiful Villa",
    "property_type": "villa",
    "listing_type": "sale",
    "price_thb": "5500000",
    "bedrooms": 3,
    "area_district": "Kata",
    "status": "active",
    "agent_id": "903513d1-b9bd-485e-8989-83b5c7629aa0"
}).execute()
```

### Create a lead from external source
```python
sb.table("leads").insert({
    "full_name": "Khun Somchai",
    "phone": "081-234-5678",
    "source": "website",
    "status": "new",
    "score": "warm",
    "budget_max_thb": "5000000",
    "preferred_areas": ["Patong", "Kata"]
}).execute()
```

### Send a Telegram notification
```python
import httpx
httpx.post(f"https://api.telegram.org/bot{TOKEN}/sendMessage", json={
    "chat_id": "2117223412",
    "text": "New lead: Khun Somchai wants a condo in Patong!",
    "parse_mode": "Markdown"
})
```

### Generate AI response
```python
import httpx
resp = httpx.post("http://localhost:1234/v1/chat/completions", json={
    "model": "qwen3.5-35b-a3b-mlx",
    "messages": [
        {"role": "system", "content": "You are a real estate assistant..."},
        {"role": "user", "content": "Write a Thai listing for a 3-bed Kata villa"}
    ],
    "temperature": 0.7,
    "max_tokens": 2048
})
print(resp.json()["choices"][0]["message"]["content"])
```

---

## 8. Extending the System

To add a new service integration:

1. Create adapter in `propos/packages/` or `propos-bot/src/`
2. Add env vars to both `.env.local` and `.env.example`
3. Add API routes if needed (e.g., `/api/webhooks/[service]`)
4. Wire into the TG bot's LLM context in `llm.py`
5. Add to this spec's Service Registry (Section 2)
6. Add to the wiki page in the dashboard
7. Test end-to-end

The orchestrator's job is to make this process invisible to the user. They say "connect X" and it happens.

# TTT Properties — Product Requirements Document

**Version:** 1.0  
**Date:** April 11, 2026  
**Status:** Live (Local Dev)  
**Owner:** Iain McKellar  
**Primary User:** Bow L. (TTT Properties, Phuket)

---

## 1. Product Overview

TTT Properties is a full-stack real estate operating system for a Phuket-based real estate agency. It provides a public bilingual website (EN/TH), an admin dashboard with CRM, a Telegram AI assistant that understands natural language, and mobile access via PWA, Telegram Mini App, and React Native.

The core philosophy: **Bow should be able to run her entire business from her phone.** Every feature must work on mobile. Every empty state must guide her on what to do next. Language should be simple, bilingual, and never assume technical knowledge.

---

## 2. Users

| User | Role | TG ID | Email | Access |
|------|------|-------|-------|--------|
| Iain McKellar | Developer / Admin | 453758488 | admin@tttproperties.com | Full |
| Bow L. | Agent / Owner | 2117223412 | bow@tttproperties.com | Full |

---

## 3. Product Components

### 3.1 Public Website (Bilingual EN/TH)

| Route | Description |
|-------|-------------|
| `/en` and `/th` | Home page with TTT branding |
| `/en/properties` | Property listings with filters (type, area, bedrooms, listing type) |
| `/en/properties/[slug]` | Property detail page with gallery, specs, enquiry form |
| `/en/contact` | Contact form → creates CRM lead with PDPA consent |
| `/en/areas/[area]` | 13 Phuket area guides with real EN+TH content |
| `/api/properties` | GET with filters, POST to create |
| `/api/leads` | GET with status filter, POST to create |
| `/api/upload` | POST images to Supabase Storage |

### 3.2 Admin Dashboard

| Route | Description | Status |
|-------|-------------|--------|
| `/dashboard/login` | Login via email/password or Telegram | Live |
| `/dashboard` | Overview: stats, recent leads, recent properties | Live |
| `/dashboard/crm` | Kanban board (7 stages: New → Won/Lost) | Live |
| `/dashboard/listings` | Property table with Add New form | Live |
| `/dashboard/listings/new` | Full property creation form | Live |
| `/dashboard/inbox` | Unified messages across all platforms | Live |
| `/dashboard/calendar` | Upcoming/past viewings | Live |
| `/dashboard/analytics` | Placeholder for GA/PostHog | Stub |
| `/dashboard/social` | Placeholder for social composer | Stub |
| `/dashboard/settings` | Profile, API key status, sign out | Live |
| `/dashboard/wiki` | Application guide and wiki | Live |

### 3.3 Telegram Bot (@TTT_Properties_Bot)

| Feature | Description | Status |
|---------|-------------|--------|
| Natural language AI | Powered by local LM Studio (Qwen 3.5 35B) | Live |
| Add properties | "New villa in Kata, 3 bed, 5.5M baht" | Live |
| Add clients/leads | "New client: Khun Somchai, phone 081-234-5678" | Live |
| Add tasks | "Remind me to call Khun Prasert tomorrow 2pm" | Live |
| Search/query | "How many properties do I have?" | Live |
| Draft messages | "Write a Thai message about the Kata villa" | Live |
| Live DB context | Bot reads current data before every response | Live |
| Dashboard login | `/dashboard` sends secure auto-login link | Live |
| Commands | /start, /help, /status, /properties, /clients, /tasks, /dashboard | Live |
| First-time welcome | Special love message from Iain for Bow | Live |
| Bilingual | Understands and responds in EN, TH, or mixed | Live |

### 3.4 Mobile Access

| Method | Description | Status |
|--------|-------------|--------|
| PWA | manifest.json + service worker, installable on home screen | Live |
| Telegram Mini App | Dashboard rendered inside Telegram | Live |
| React Native (Expo) | 4-tab app: Dashboard, Properties, Leads, Add | Scaffolded |

---

## 4. Architecture

### 4.1 Stack

- **Frontend:** Next.js 16 (Turbopack), React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API routes, Drizzle ORM
- **Database:** PostgreSQL via Supabase (local Docker, 12 containers)
- **Auth:** Supabase Auth (email/password) + Telegram auth cookies
- **AI:** LM Studio (Qwen 3.5 35B MLX) running locally
- **Bot:** Python 3.13, python-telegram-bot 22.0
- **Storage:** Supabase Storage (property-images bucket)
- **Tunnel:** Cloudflare tunnel (ephemeral, for public access)

### 4.2 Infrastructure (All Local on Mac Mini M4)

| Service | URL | Purpose |
|---------|-----|---------|
| Supabase Studio | http://localhost:54323 | DB management UI |
| Supabase API | http://localhost:54321 | REST API + Auth |
| PostgreSQL | localhost:54322 | Direct DB access |
| Mail (Inbucket) | http://localhost:54324 | Email testing |
| Next.js App | http://localhost:3000 | Web app |
| LM Studio | http://localhost:1234 | Local LLM |
| Cloudflare Tunnel | https://baseline-...trycloudflare.com | Public access |

### 4.3 Database Schema

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `agents` | Admin users | id, email, full_name, role, telegram_chat_id |
| `properties` | Property listings | slug, title_en/th, property_type, listing_type, price_thb, area_district, features (jsonb) |
| `leads` | Clients/buyers | full_name, phone, email, status (7 stages), score (hot/warm/cold), budget range, preferred_areas (jsonb) |
| `messages` | All communications | platform, direction, content, is_ai_generated, metadata (jsonb) |
| `viewings` | Property viewings | lead_id, property_id, scheduled_at, status, notes, feedback |
| `tasks` | To-dos and reminders | title, task_type, due_date, priority, agent_id |
| `social_posts` | Social media | content_en/th, platforms (jsonb), status, scheduled_at |
| `daily_briefs` | Daily summaries | agent_id, date, email_summary, action_items (jsonb) |

---

## 5. Authentication

### 5.1 Email/Password
- Standard Supabase Auth
- Login page at `/dashboard/login`
- Server-side form POST to `/api/auth/login`
- Sets Supabase SSR cookies

### 5.2 Telegram Auth
- User sends `/dashboard` to @TTT_Properties_Bot
- Bot generates HMAC-signed URL with timestamp
- URL hits `/api/auth/tg-session` which verifies hash and sets cookies
- Redirects to `/dashboard` — logged in automatically
- Session valid for 7 days

### 5.3 Authorization Flow
```
Browser → /dashboard → middleware.ts checks cookies
  ├── tg-auth-user-id cookie present? → Allow (rewrite)
  ├── Supabase session cookie present? → Allow
  └── Neither? → Redirect to /dashboard/login

Page component → getAgent() checks cookies
  ├── tg-auth-user-id cookie? → Look up agent by ID → Allow
  └── Supabase session? → Look up agent by user.id → Allow
```

---

## 6. Data Flow

### 6.1 TG Bot → Supabase (Write)
```
Bow types message → Bot sends to LM Studio → 
LM Studio returns response + structured JSON → 
Bot classifies intent → Bot calls Supabase REST API →
Data appears in dashboard
```

### 6.2 Supabase → TG Bot (Read)
```
Bow asks question → Bot pulls live data from Supabase →
Data injected into LLM system prompt → 
LLM answers with real numbers → 
Response sent to Bow
```

### 6.3 Website → Supabase
```
Contact form → POST /api/leads → Supabase insert →
Appears in dashboard CRM and TG bot context
```

---

## 7. File Structure

```
propos/                           # Next.js web app
├── src/
│   ├── app/
│   │   ├── api/                  # REST API routes
│   │   │   ├── auth/             # Login, logout, TG auth
│   │   │   ├── leads/            # Lead CRUD
│   │   │   ├── properties/       # Property CRUD
│   │   │   └── upload/           # Image upload
│   │   ├── dashboard/            # Admin panel pages
│   │   │   ├── login/            # Login page
│   │   │   ├── wiki/             # Application wiki
│   │   │   ├── crm/              # Kanban CRM
│   │   │   ├── listings/         # Property management
│   │   │   └── ...               # Calendar, inbox, settings
│   │   ├── en/ and th/           # Public website (i18n)
│   │   └── mini-app/             # TG Mini App
│   ├── lib/
│   │   ├── auth.ts               # Server-side auth helper
│   │   ├── db/schema.ts          # Drizzle ORM schema
│   │   ├── supabase/             # Supabase clients
│   │   │   ├── client.ts         # Browser client
│   │   │   ├── server.ts         # Server client
│   │   │   └── middleware.ts     # Auth middleware
│   │   └── area-guides.ts        # 13 Phuket area descriptions
│   └── components/layout/        # Sidebar, nav
├── supabase/
│   ├── config.toml               # Supabase config
│   └── migrations/               # SQL migrations
└── .env.local                    # All env vars

propos-bot/                       # Telegram bot (Python)
├── src/
│   ├── bot.py                    # TG handlers, commands
│   ├── llm.py                    # LM Studio interface + system prompt
│   └── supabase_db.py            # Supabase read/write layer
├── .env                          # Bot config
└── venv/                         # Python virtualenv

ttt-mobile/                       # React Native (Expo)
├── App.tsx                       # 4-tab app
└── package.json
```

---

## 8. Known Issues & TODO

### Critical
1. **Cloudflare tunnel is ephemeral** — URL changes on restart
2. **No production deployment** — everything runs locally on Mac Mini
3. **TG bot not a launchd service** — won't survive reboot

### Important
4. **No data** — system is empty, Bow needs to start adding properties
5. **Docker auth** — running `npm run dev` instead of Docker container
6. **Dashboard empty states** — no guidance for Bow on what to do
7. **No image upload UI** — API and storage exist but no frontend
8. **CRM has no drag-and-drop** — Kanban renders but can't move leads

### Nice to Have
9. Google Calendar integration
10. LINE adapter (scaffolded, not wired)
11. WhatsApp webhook (stub exists)
12. Social media posting (placeholder page)
13. Analytics (GA/PostHog stubs)
14. Area guide images (placeholder gradients)

---

## 9. Design Principles

1. **Mobile-first** — Bow works from her phone. Everything must work on mobile.
2. **Simple language** — No jargon. Short sentences. Thai-friendly.
3. **Guide, don't assume** — Every empty state tells the user what to do next.
4. **Bilingual by default** — EN + TH for all labels, guides, and empty states.
5. **Talk, don't click** — The TG bot understands natural language. No forms needed.
6. **Single source of truth** — Everything in one Supabase database.

---

## 10. Startup Procedure

```bash
# 1. Start Docker Desktop (manual)
open -a "Docker Desktop"

# 2. Start Supabase
cd /Users/iainmck/Projects-2026/propos
supabase start

# 3. Start the web app
npm run dev

# 4. Start the TG bot
cd /Users/iainmck/Projects-2026/propos-bot
source venv/bin/activate
python3 -m src.bot

# 5. Start Cloudflare tunnel (in another terminal)
cloudflared tunnel --url http://localhost:3000

# 6. Start LM Studio (load qwen3.5-35b-a3b-mlx)
```

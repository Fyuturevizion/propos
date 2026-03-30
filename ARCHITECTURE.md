# PropOS — Architecture Decision Record

## Overview

PropOS is a single Next.js 15 application serving as public property website, admin dashboard, CRM, AI executive assistant, and unified communications hub for a Phuket-based Thai real estate agency.

## Key Architecture Decisions

### 1. Single Codebase (Next.js App Router)

**Decision:** One Next.js application serves all roles — public website, admin dashboard, API, and webhooks.

**Rationale:** Eliminates deployment complexity, shares types and utilities, and enables SSR/SSG for public pages while keeping API routes and protected dashboard in the same repo. App Router's file-based routing maps cleanly to the application zones.

### 2. Hybrid LLM Strategy

**Decision:** GPT-4o (cloud) for client-facing conversations; Ollama with SeaLLM/Qwen (local) for internal operations.

**Rationale:**
- **Client-facing:** Requires highest-quality reasoning, nuanced bilingual responses, and reliable tool calling. GPT-4o delivers this consistently.
- **Internal ops:** Email drafts, CRM updates, daily reports — lower stakes, higher volume. Local models reduce cost and keep sensitive data on-premises (PDPA compliance).
- **SeaLLM** specifically optimized for Thai language understanding — better than generic Llama/Mistral for Thai content.

### 3. LINE Custom Adapter

**Decision:** Build a standalone LINE Chat SDK adapter as an open-source package.

**Rationale:** Vercel Chat SDK has no official LINE adapter. LINE dominates messaging in Thailand (~47M monthly active users). Building this as a standalone package:
- Solves our critical business need
- Positions us as the first open-source LINE adapter for Chat SDK
- High visibility in the Thai developer community
- Clean separation of concerns

### 4. Supabase as Infrastructure Layer

**Decision:** Supabase for database, auth, storage, and realtime — deployed in Singapore region.

**Rationale:**
- PostgreSQL with Row Level Security for multi-agent data isolation
- Built-in auth with social providers (Google, LINE LIFF)
- Storage for property images and documents
- Realtime subscriptions for live dashboard updates
- Singapore region provides low latency for Thailand
- Service role key bypasses RLS for API/cron routes

### 5. Drizzle ORM over Prisma

**Decision:** Drizzle ORM for database access.

**Rationale:** Lighter weight, TypeScript-first with zero runtime overhead. Better suited to serverless/edge deployments. Schema-as-code approach integrates cleanly with the Supabase PostgreSQL schema.

### 6. PDPA Compliance from Day One

**Decision:** Explicit consent tracking built into the schema and lead capture flow.

**Rationale:** Thailand's Personal Data Protection Act (PDPA) requires:
- Explicit consent before storing personal data
- Separate consent for marketing communications
- Consent timestamps for audit trail
- Privacy policy on all public pages
- The `leads` table has `pdpa_consent`, `pdpa_consent_date`, and `marketing_consent` fields

### 7. WhatsApp 24-Hour Window Architecture

**Decision:** Dual code paths for WhatsApp messaging — free-form within window, template messages outside.

**Rationale:** WhatsApp Business API enforces a 24-hour messaging window from last client message. After that, only pre-approved template messages can be sent. The reminder system needs:
- Active conversation path (free-form messages)
- Cold outreach path (template messages requiring Meta approval)
- `isWithinMessageWindow()` utility to determine which path to use

### 8. Social Media via Unified API

**Decision:** PostEverywhere/Ayrshare for social media posting, with option to migrate to direct APIs.

**Rationale:** A single API call posts to Facebook, Instagram, TikTok, and LINE OA simultaneously. For MVP timeline, this dramatically reduces development time compared to implementing 4+ direct API integrations. Individual platform control can be added later as needed.

### 9. MCP for External Service Integration

**Decision:** Custom MCP (Model Context Protocol) servers for Google Calendar, Gmail, CRM, Notion, and social tools.

**Rationale:** MCP provides a standardized tool interface that the AI assistant can invoke. The GSuite MCP server handles both email and calendar through a single server. This approach:
- Keeps tool definitions clean and typed
- Enables the AI to orchestrate complex workflows
- Makes it easy to add new tools without changing the core AI logic

### 10. Thai-Specific TTS

**Decision:** ThonburianTTS for Thai voice output, ElevenLabs/OpenAI for English.

**Rationale:** ThonburianTTS is a flow-matching model fine-tuned specifically for Thai, achieving better pronunciation accuracy and naturalness than general-purpose TTS APIs. This is a meaningful differentiator for Thai-speaking clients.

## Application Zones

```
/                           → Public property website (SSR/SSG)
/[locale]/properties        → Listings with search/filter (EN/TH)
/[locale]/property/[slug]   → Individual listing page
/[locale]/areas/[area]      → Phuket area guides
/[locale]/contact           → Contact form → CRM + Notion
/api/chat                   → AI chat endpoint (website widget)
/api/webhooks/whatsapp      → Chat SDK WhatsApp webhook
/api/webhooks/telegram      → Chat SDK Telegram webhook
/api/webhooks/line          → Custom LINE webhook
/api/cron/daily-digest      → Morning briefing cron
/api/cron/reminders         → Appointment reminder cron
/dashboard                  → Protected admin zone
/dashboard/inbox            → Unified messaging interface
/dashboard/crm              → Contact & deal management (Kanban)
/dashboard/listings         → Property CRUD → auto-publishes
/dashboard/calendar         → Google Calendar integration
/dashboard/analytics        → Analytics dashboard
/dashboard/social           → Social media composer + scheduler
/dashboard/settings         → API keys, agent config, AI prompts
```

## Phased Delivery Plan

### Phase 0 — Foundation (Week 1-2)
- [x] Project scaffold
- [x] Database schema + migration
- [x] i18n (EN/TH)
- [x] Public website layout
- [x] Dashboard layout with sidebar

### Phase 1 — AI Core (Week 3-4)
- [ ] AI chat on website (GPT-4o)
- [ ] MCP tool implementations
- [ ] Lead auto-creation from chat
- [ ] Ollama local setup

### Phase 2 — Messaging (Week 5-6)
- [ ] WhatsApp webhook + Chat SDK
- [ ] Telegram webhook + Chat SDK
- [ ] LINE custom adapter
- [ ] Unified inbox

### Phase 3 — CRM + Calendar (Week 7-8)
- [ ] Property CRUD in dashboard
- [ ] Lead pipeline Kanban
- [ ] Google Calendar integration
- [ ] Appointment reminders

### Phase 4 — Social + Voice (Week 9-10)
- [ ] Social media composer
- [ ] PostEverywhere integration
- [ ] Thai TTS (ThonburianTTS)
- [ ] Voice message transcription

### Phase 5 — Polish + Multi-Agent (Week 11-14)
- [ ] Analytics dashboard
- [ ] Notion bi-directional sync
- [ ] Daily briefing automation
- [ ] Multi-agent support
- [ ] PDPA audit flow

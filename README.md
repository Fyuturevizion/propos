# PropOS — AI-Powered Real Estate Operating System

A single Next.js application serving as public property website, admin dashboard, CRM, AI executive assistant, and unified communications hub for Phuket-based real estate.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Supabase (PostgreSQL + Auth + Storage) |
| ORM | Drizzle ORM |
| AI (Cloud) | Vercel AI SDK + GPT-4o |
| AI (Local) | Ollama (SeaLLM / Qwen 2.5) |
| Chat | Vercel Chat SDK + Custom LINE Adapter |
| i18n | next-intl (EN/TH) |

## Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project
- OpenAI API key
- (Optional) Ollama for local AI

### Setup

```bash
# Clone
git clone https://github.com/Fyuturevizion/propos.git
cd propos

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Fill in your keys in .env.local

# Run the Supabase migration
# (paste supabase/migrations/00001_initial_schema.sql into Supabase SQL Editor)

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Database Migrations

Using Drizzle Kit:

```bash
# Generate migration from schema changes
npx drizzle-kit generate

# Push schema to database
npx drizzle-kit push
```

## Project Structure

```
src/
├── app/
│   ├── [locale]/           # Public website (EN/TH)
│   ├── dashboard/          # Protected admin dashboard
│   └── api/                # API routes, webhooks, cron
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── layout/             # Header, footer, sidebar
│   ├── properties/         # Property card, grid, gallery
│   ├── chat/               # Chat widget, messages
│   ├── crm/                # Lead card, pipeline board
│   └── dashboard/          # Stats, recent leads, viewings
├── lib/
│   ├── db/                 # Drizzle schema + client
│   ├── ai/                 # AI config, tools, system prompt
│   ├── chat/               # WhatsApp, Telegram, LINE adapters
│   └── supabase/           # Browser + server clients
├── i18n/                   # next-intl config
├── messages/               # EN/TH translations
├── hooks/                  # React hooks
└── types/                  # TypeScript types

packages/
└── line-chat-sdk-adapter/  # Standalone LINE adapter (open-source)

supabase/
└── migrations/             # SQL migration files
```

## Architecture Decisions

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed rationale on:
- Hybrid LLM strategy (GPT-4o + Ollama)
- LINE custom adapter approach
- PDPA compliance
- WhatsApp 24-hour window handling
- And more

## Features

### Public Website
- Property listings with search and filters
- Individual property pages with gallery
- Phuket area guides (13 districts)
- Bilingual EN/TH with locale switcher
- AI chat widget

### Admin Dashboard
- Overview with stats and recent activity
- Unified inbox (WhatsApp, Telegram, LINE, website, email)
- CRM with Kanban pipeline
- Property CRUD with auto-publish
- Google Calendar integration
- Analytics dashboard
- Social media composer
- Settings and AI configuration

### AI Assistant
- Bilingual (English + Thai) responses
- Lead qualification through natural conversation
- Property search and recommendations
- Calendar booking and reminders
- Email drafting and summaries
- CRM auto-updates
- Daily briefings via Telegram

### Messaging
- WhatsApp via Vercel Chat SDK
- Telegram via Vercel Chat SDK
- LINE via custom adapter (first open-source)
- Template messages for WhatsApp outside 24h window

## License

Private — PropOS Real Estate

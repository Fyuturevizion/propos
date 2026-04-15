# PropOS — TTT Properties Operating System
## Complete Guide

**For:** Bow (owner), Iain (developer)  
**Last updated:** April 2026

---

## What is PropOS?

PropOS is your personal real estate operating system. It runs 24/7 on a Mac Mini server in your home. It connects your Telegram, your website, and your data into one place so you can run TTT Properties from your phone, anywhere, anytime.

You don't need to be technical. You just talk to the Telegram bot like a friend. It handles the rest.

---

## How Everything Connects

```
Your Phone (Telegram)
    │
    ├── Talk to @TTT_Properties_Bot (your AI assistant)
    │     │
    │     ├── "New villa Kata, 3 bed, 5.5M baht" → Creates property listing
    │     ├── "New client Khun Somchai, 081-234-5678" → Adds to CRM
    │     ├── "Remind me to call Khun Prasert tomorrow" → Creates task
    │     ├── "Show me all hot leads" → Searches and answers
    │     └── "Fix the website header" → Sends to Hermes (Iain's AI)
    │
    └── /dashboard → Opens the web dashboard (auto-login)

Web Dashboard (http://localhost:3000/dashboard)
    │
    ├── Overview → Numbers at a glance
    ├── Inbox → All messages from all channels
    ├── CRM → Client pipeline (Kanban board)
    ├── Listings → Property management
    ├── Calendar → Viewings and appointments
    ├── Analytics → Performance metrics (coming soon)
    ├── Social → Post to social media (coming soon)
    ├── Settings → Profile and configuration
    └── Guide → This guide (in-app version)

Supabase Database (the brain)
    │
    ├── properties, leads, messages, viewings, tasks
    ├── memory_facts → Things the system remembers about you and clients
    ├── agent_tasks → Queue for Hermes to execute complex requests
    └── session_contexts → Session handoff data

Hermes Agent (Iain's AI)
    │
    └── Watches agent_tasks queue, executes code changes, reports back
```

---

## Getting Started (First Time)

### Step 1: Open Telegram
Find **@TTT_Properties_Bot** in Telegram. Tap Start.

The bot will introduce itself and show you everything it can do.

### Step 2: Add Your First Property
Send this to the bot:
```
New villa in Kata, 3 bedrooms, 2 bathrooms, 5.5 million baht, private pool and sea view
```
The bot creates the listing automatically. Check it in the dashboard.

### Step 3: Add Your First Client
```
New client Khun Somchai, phone 081-234-5678, looking for a condo in Patong under 3 million
```
The bot saves the client AND their requirements.

### Step 4: Open the Dashboard
Send `/dashboard` to the bot. Tap the button. You're in!

---

## Telegram Bot Commands

| Command | What it does |
|---------|-------------|
| `/start` | Welcome message (with special first-time message for Bow) |
| `/help` | Show what the bot can do |
| `/status` | Quick numbers: properties, leads, tasks |
| `/properties` | Your recent listings |
| `/clients` | Your recent leads |
| `/tasks` | Your pending tasks |
| `/dashboard` | Open the web dashboard (auto-login) |
| `/wiki` | Show the in-app guide |
| `/agent <request>` | Send a task to Hermes (Iain only) |
| `/taskstatus <id>` | Check a Hermes task (Iain only) |

**Pro tip:** You don't need commands. Just talk naturally!

---

## Dashboard Sections Explained

### Overview (`/dashboard`)
**What it shows:** Your numbers at a glance — active listings, total leads, upcoming viewings, unread messages. Plus recent leads and recent properties.

**What Bow needs to do:** Check this daily. It's your home base. Everything flows here automatically from Telegram and the website.

**Status:** ✅ Working — pulls live data from Supabase.

---

### Inbox (`/dashboard/inbox`)
**What it shows:** All messages from all channels (Telegram, website, WhatsApp, LINE, email) in one unified inbox. Messages you haven't read are highlighted in green.

**What Bow needs to do:**
1. **Currently:** Messages from Telegram bot conversations appear here automatically
2. **To fully activate:** Connect WhatsApp Business API and/or LINE OA (see Settings → API Keys)
3. **Future:** When clients message the website chat, those appear here too

**Status:** ✅ Telegram messages working. ⏳ WhatsApp/LINE/website chat pending API connections.

**Required from Bow:**
- [ ] WhatsApp Business account → Iain needs the API access token
- [ ] LINE Official Account → Iain needs the channel access token
- [ ] Website chat widget → Iain can build this when ready

---

### CRM — Client Pipeline (`/dashboard/crm`)
**What it shows:** A Kanban board with all your leads organized by stage:

| Stage | Meaning |
|-------|---------|
| New | Just came in, not yet contacted |
| Qualified | Verified they're a real buyer/renter |
| Viewing | Scheduled or had a property viewing |
| Offer | Made an offer on a property |
| Negotiation | Negotiating price/terms |
| Won 🎉 | Deal closed! |
| Lost | Deal fell through |

Each card shows: name, contact info, source, property interest, score (hot/warm/cold), budget, notes.

**What Bow needs to do:**
1. **Add clients:** Tell the bot about new clients, or they come in from website enquiries
2. **Update stages:** Currently automatic via bot, but you'll be able to drag cards between stages soon
3. **Review daily:** Check who's in each stage and follow up

**Status:** ✅ Board working with live data. ⏳ Drag-and-drop stage changes pending.

**Required from Bow:**
- [ ] Start telling the bot about every new client (name + phone is enough)
- [ ] Mention when a client progresses (e.g. "Khun Somchai is coming for a viewing Friday")
- [ ] The bot will learn to update stages automatically

---

### Listings (`/dashboard/listings`)
**What it shows:** All your properties in a table — title, type, area, bedrooms, price, status (active/pending/sold/rented), and listing type (sale/rent).

**What Bow needs to do:**
1. **Add properties:** Tell the bot the details, or click "Add Property" in the dashboard
2. **Keep them updated:** Tell the bot when a property is sold, rented, or price changes
3. **Add photos:** Coming soon — you'll be able to send photos to the bot

**Status:** ✅ Table working. ⏳ Photo uploads, edit form, property detail page pending.

**Required from Bow:**
- [ ] Add all current TTT Properties listings (can do via bot, one at a time)
- [ ] Provide property photos (can send to bot later when photo feature is built)
- [ ] Tell the bot when a property status changes (sold, rented, price change)

---

### Calendar (`/dashboard/calendar`)
**What it shows:** Upcoming and past property viewings. Each viewing shows date/time, duration, status, and notes.

**What Bow needs to do:**
1. **Schedule viewings:** Tell the bot — "Set a viewing for the Kata villa with Khun Somchai on Friday at 3pm"
2. **Confirm viewings:** After the viewing, tell the bot — "Khun Somchai liked the Kata villa, he's thinking about it"
3. **Track no-shows:** If someone doesn't show up, tell the bot so it updates the status

**Status:** ✅ Basic calendar working. ⏳ Google Calendar sync, reminders, and re-scheduling pending.

**Required from Bow:**
- [ ] Start scheduling viewings through the bot (property + client + date/time)
- [ ] Provide feedback after each viewing so the system learns
- [ ] Connect Google Calendar? (optional — Iain can set up if wanted)

---

### Analytics (`/dashboard/analytics`)
**What it shows:** Performance metrics — website views, enquiry rate, conversion rate.

**Status:** ⏳ Coming soon. Needs analytics integration (Google Analytics or PostHog).

**Required from Bow:**
- [ ] Decide if you want website analytics tracked
- [ ] Iain will set up the integration

---

### Social Media (`/dashboard/social`)
**What it shows:** Compose and schedule posts to Facebook, Instagram, TikTok, and LINE OA from one place.

**Status:** ⏳ Coming soon. Needs social media API connections.

**Required from Bow:**
- [ ] Which social media accounts does TTT Properties use?
- [ ] Provide login/API access for each platform
- [ ] Iain will connect them

---

### Settings (`/dashboard/settings`)
**What it shows:** Your profile info, API key status, and sign out button.

**The hidden secret:** There's something special hidden in the settings page. The riddle is in the Guide section. 🤫

---

### Buildnet (Secret Easter Egg)
**What it is:** A surprise from Iain hidden in the dashboard. It's a social network for builders — a glimpse of a bigger project Iain is working on.

**How to find it:** Follow the riddle in the Guide page, or...
1. Go to Settings
2. Find the green T logo at the top of the sidebar
3. Tap it 5 times fast
4. Enjoy the reveal 🎉

---

## Memory System

The system remembers things about you, your clients, and your business. This is how:

1. **Every conversation** with the bot is stored in Supabase
2. **Facts are extracted** — preferences, personal details, business info, client notes
3. **Memory is persistent** — survives restarts, crashes, and reboots
4. **Hermes reads memory** — when Iain starts a session, the AI reads all accumulated knowledge

### What gets remembered:
- Your preferences (language, communication style, favorite areas)
- Client details (birthdays, preferences, budget, timeline)
- Business facts (commission rates, processes, pricing)
- Corrections (if you tell the bot it got something wrong)
- Patterns the AI notices (e.g., "Bow always asks about Bang Tao properties")

### What does NOT get remembered:
- Temporary task state (what's been done this session)
- Raw terminal output
- Session chat logs (those are in session transcripts, not Supabase)

---

## Hermes Agent (Technical Tasks)

Some things are too complex for the bot — like changing code, fixing bugs, adding features. Those go to Hermes.

**How it works:**
1. You ask the bot something technical (e.g., "the dashboard looks weird on my phone")
2. The bot recognizes it can't fix this itself
3. It creates a task in the `agent_tasks` queue
4. Hermes (Iain's AI agent) picks it up and executes it
5. Hermes writes the result back to Supabase
6. The bot notifies you: "Done! Here's what I did..."

**For Iain directly:** Use `/agent <request>` to bypass the bot and go straight to Hermes.

---

## Server Infrastructure

```
Mac Mini (24/7 home server)
├── Docker Desktop
│   └── Supabase (11 containers)
│       ├── PostgreSQL database (port 54322)
│       ├── REST API (port 54321)
│       ├── Auth service
│       ├── Realtime
│       ├── Storage
│       └── Studio (port 54323)
├── Next.js app (port 3000)
├── Buildnet app (port 5001)
├── PropOS Telegram Bot
├── Hermes Task Watcher
└── Cloudflare Tunnel (exposes to internet)
```

### Launchd Services (auto-start on boot)
All services are configured as macOS launchd agents:
- `com.tttproperties.propos-bot` — TG bot
- `com.tttproperties.propos-web` — Next.js app
- `com.tttproperties.watcher` — Hermes task watcher
- `com.tttproperties.buildnet` — Buildnet app

### To load all services:
```bash
launchctl load ~/Library/LaunchAgents/com.tttproperties.*.plist
```

### To check service status:
```bash
launchctl list | grep tttproperties
```

### To view logs:
- Bot: `~/Projects-2026/propos-bot/logs/bot.stdout.log`
- Web: `~/Projects-2026/propos/logs/next.stdout.log`
- Watcher: `~/Projects-2026/propos-bot/logs/watcher.stdout.log`
- Buildnet: `~/Projects-2026/Buildnet/buildnet/logs/buildnet.stdout.log`

---

## Login Credentials

| User | Email | Password |
|------|-------|----------|
| Iain (admin) | admin@tttproperties.com | TTT2026Admin! |
| Bow (agent) | bow@tttproperties.com | Bow2026TTT! |

**Easiest login:** Send `/dashboard` to the Telegram bot. It gives you a button that logs you in automatically.

---

## File Locations

| Component | Path |
|-----------|------|
| PropOS Web App | `~/Projects-2026/propos/` |
| Telegram Bot | `~/Projects-2026/propos-bot/` |
| Buildnet App | `~/Projects-2026/Buildnet/buildnet/` |
| Supabase Migrations | `~/Projects-2026/propos/supabase/migrations/` |
| Launchd Configs | `~/Library/LaunchAgents/com.tttproperties.*` |
| Session Handoff | `~/Projects-2026/SESSION-HANDOFF.md` |

---

## What's Working vs What's Coming

### ✅ Working Now
- Telegram bot with AI assistant (bilingual EN/TH)
- Property, client, task creation via natural language
- Dashboard overview, CRM pipeline, listings table
- Unified inbox (Telegram messages)
- Calendar (viewings)
- Persistent memory system
- Hermes agent task queue
- Buildnet easter egg
- Email + Telegram login

### ⏳ Coming Soon
- Photo uploads for properties
- WhatsApp integration
- LINE OA integration
- Website chat widget
- Drag-and-drop CRM stages
- Google Calendar sync
- Social media posting
- Analytics dashboard
- Property detail pages (public website)
- Mobile app

---

## Troubleshooting

### Bot not responding?
1. Check if Docker Desktop is running
2. Check if LM Studio is running (the AI needs it)
3. Iain can restart: `launchctl kickstart -k gui/$(id -u)/com.tttproperties.propos-bot`

### Dashboard not loading?
1. Check if Next.js is running: `curl localhost:3000`
2. Restart: `launchctl kickstart -k gui/$(id -u)/com.tttproperties.propos-web`

### Can't access from outside?
1. Check if Cloudflare tunnel is running
2. The tunnel URL changes on restart (it's ephemeral)
3. For a permanent URL, set up a named Cloudflare Tunnel

### Database issues?
1. Check Supabase: `docker ps` (should show 11 containers)
2. Supabase Studio: `http://localhost:54323`
3. Restart all: `docker restart $(docker ps -q --filter name=supabase)`

---

*Built with ❤️ by Iain for Bow*  
*PropOS v1.0 — April 2026*

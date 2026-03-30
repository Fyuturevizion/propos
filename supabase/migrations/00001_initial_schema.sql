-- PropOS Initial Schema
-- Run against Supabase PostgreSQL

-- ─── EXTENSIONS ─────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── AGENTS ─────────────────────────────────────────────────────────────────
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'agent' CHECK (role IN ('admin', 'agent')),
  avatar_url TEXT,
  telegram_chat_id TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── PROPERTIES ─────────────────────────────────────────────────────────────
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id),
  slug TEXT UNIQUE NOT NULL,
  title_en TEXT NOT NULL,
  title_th TEXT,
  description_en TEXT,
  description_th TEXT,
  property_type TEXT NOT NULL CHECK (property_type IN ('villa', 'condo', 'land', 'townhouse', 'apartment')),
  listing_type TEXT NOT NULL CHECK (listing_type IN ('sale', 'rent', 'sale_rent')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'sold', 'rented', 'archived')),
  price_thb NUMERIC,
  price_usd NUMERIC,
  rental_price_thb NUMERIC,
  bedrooms INTEGER,
  bathrooms INTEGER,
  area_sqm NUMERIC,
  land_area_sqm NUMERIC,
  area_district TEXT,
  address TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  features JSONB DEFAULT '{}',
  images JSONB DEFAULT '[]',
  floor_plan_url TEXT,
  video_url TEXT,
  ownership_type TEXT CHECK (ownership_type IN ('freehold', 'leasehold', 'company')),
  year_built INTEGER,
  foreign_quota_available BOOLEAN,
  seo_title_en TEXT,
  seo_title_th TEXT,
  seo_description_en TEXT,
  seo_description_th TEXT,
  notion_page_id TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_district ON properties(area_district);
CREATE INDEX idx_properties_agent ON properties(agent_id);
CREATE INDEX idx_properties_listing ON properties(listing_type);

-- ─── LEADS ──────────────────────────────────────────────────────────────────
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  whatsapp_id TEXT,
  telegram_id TEXT,
  line_id TEXT,
  language_preference TEXT DEFAULT 'en' CHECK (language_preference IN ('en', 'th', 'ru', 'zh')),
  source TEXT CHECK (source IN ('website', 'whatsapp', 'telegram', 'line', 'email', 'referral', 'social', 'walk_in')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'qualified', 'viewing', 'offer', 'negotiation', 'closed_won', 'closed_lost')),
  score TEXT DEFAULT 'cold' CHECK (score IN ('hot', 'warm', 'cold')),
  property_type_interest TEXT,
  listing_type_interest TEXT CHECK (listing_type_interest IN ('buy', 'rent')),
  budget_min_thb NUMERIC,
  budget_max_thb NUMERIC,
  preferred_areas JSONB DEFAULT '[]',
  bedrooms_needed INTEGER,
  requirements TEXT,
  timeline TEXT CHECK (timeline IN ('immediate', '1_3_months', '3_6_months', 'investment', 'undecided')),
  notes TEXT,
  pdpa_consent BOOLEAN DEFAULT false,
  pdpa_consent_date TIMESTAMPTZ,
  marketing_consent BOOLEAN DEFAULT false,
  notion_page_id TEXT,
  last_contact_at TIMESTAMPTZ,
  next_follow_up TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_score ON leads(score);
CREATE INDEX idx_leads_agent ON leads(agent_id);
CREATE INDEX idx_leads_source ON leads(source);

-- ─── MESSAGES ───────────────────────────────────────────────────────────────
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id),
  agent_id UUID REFERENCES agents(id),
  platform TEXT NOT NULL CHECK (platform IN ('website', 'whatsapp', 'telegram', 'line', 'email')),
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  content TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'text' CHECK (content_type IN ('text', 'image', 'audio', 'document', 'location')),
  metadata JSONB DEFAULT '{}',
  is_ai_generated BOOLEAN DEFAULT false,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_lead ON messages(lead_id);
CREATE INDEX idx_messages_platform ON messages(platform);
CREATE INDEX idx_messages_created ON messages(created_at);

-- ─── VIEWINGS ───────────────────────────────────────────────────────────────
CREATE TABLE viewings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id),
  property_id UUID NOT NULL REFERENCES properties(id),
  agent_id UUID NOT NULL REFERENCES agents(id),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
  notes TEXT,
  feedback TEXT,
  google_calendar_event_id TEXT,
  reminder_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_viewings_lead ON viewings(lead_id);
CREATE INDEX idx_viewings_property ON viewings(property_id);
CREATE INDEX idx_viewings_scheduled ON viewings(scheduled_at);

-- ─── SOCIAL POSTS ───────────────────────────────────────────────────────────
CREATE TABLE social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id),
  property_id UUID REFERENCES properties(id),
  content_en TEXT,
  content_th TEXT,
  platforms JSONB DEFAULT '[]',
  media_urls JSONB DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  platform_post_ids JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── DAILY BRIEFS ───────────────────────────────────────────────────────────
CREATE TABLE daily_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents(id),
  date DATE NOT NULL,
  email_summary TEXT,
  schedule_summary TEXT,
  lead_pipeline_summary TEXT,
  action_items JSONB DEFAULT '[]',
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── ROW LEVEL SECURITY ────────────────────────────────────────────────────
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE viewings ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_briefs ENABLE ROW LEVEL SECURITY;

-- Admin can do everything
CREATE POLICY "admin_all" ON agents FOR ALL USING (
  EXISTS (SELECT 1 FROM agents a WHERE a.id = auth.uid() AND a.role = 'admin')
);
CREATE POLICY "admin_all" ON properties FOR ALL USING (
  EXISTS (SELECT 1 FROM agents a WHERE a.id = auth.uid() AND a.role = 'admin')
);
CREATE POLICY "admin_all" ON leads FOR ALL USING (
  EXISTS (SELECT 1 FROM agents a WHERE a.id = auth.uid() AND a.role = 'admin')
);
CREATE POLICY "admin_all" ON messages FOR ALL USING (
  EXISTS (SELECT 1 FROM agents a WHERE a.id = auth.uid() AND a.role = 'admin')
);
CREATE POLICY "admin_all" ON viewings FOR ALL USING (
  EXISTS (SELECT 1 FROM agents a WHERE a.id = auth.uid() AND a.role = 'admin')
);
CREATE POLICY "admin_all" ON social_posts FOR ALL USING (
  EXISTS (SELECT 1 FROM agents a WHERE a.id = auth.uid() AND a.role = 'admin')
);
CREATE POLICY "admin_all" ON daily_briefs FOR ALL USING (
  EXISTS (SELECT 1 FROM agents a WHERE a.id = auth.uid() AND a.role = 'admin')
);

-- Agents can manage their own data
CREATE POLICY "agent_own" ON properties FOR ALL USING (agent_id = auth.uid());
CREATE POLICY "agent_own" ON leads FOR ALL USING (agent_id = auth.uid());
CREATE POLICY "agent_own" ON messages FOR ALL USING (agent_id = auth.uid());
CREATE POLICY "agent_own" ON viewings FOR ALL USING (agent_id = auth.uid());
CREATE POLICY "agent_own" ON social_posts FOR ALL USING (agent_id = auth.uid());
CREATE POLICY "agent_own" ON daily_briefs FOR ALL USING (agent_id = auth.uid());

-- Agents can read their own profile
CREATE POLICY "agent_read_self" ON agents FOR SELECT USING (id = auth.uid());

-- Public can read active properties (for website)
CREATE POLICY "public_read_active_properties" ON properties FOR SELECT USING (status = 'active');

-- Service role bypasses RLS (for API/cron routes using SUPABASE_SERVICE_ROLE_KEY)

-- ─── UPDATED_AT TRIGGER ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON agents FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON viewings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

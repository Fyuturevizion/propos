-- ═══════════════════════════════════════════════════════════════════════════
-- PropOS: Persistent Memory & Agent Task System
-- Enables: Bot → Supabase → Hermes execution loop
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── AGENT TASKS (Hermes execution queue) ─────────────────────────────────

CREATE TABLE IF NOT EXISTS agent_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Who requested this task
    requested_by UUID REFERENCES agents(id),
    tg_user_id BIGINT,                    -- TG user who triggered it
    source TEXT DEFAULT 'telegram',        -- telegram, whatsapp, dashboard, api
    
    -- The task itself
    request TEXT NOT NULL,                 -- Natural language request from user
    intent TEXT,                           -- Classified intent: code_change, data_update, research, general
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    
    -- Execution state
    status TEXT DEFAULT 'pending' CHECK (status IN (
        'pending',         -- Waiting to be picked up
        'assigned',        -- Hermes has claimed it
        'in_progress',     -- Hermes is working on it
        'completed',       -- Done successfully
        'failed',          -- Failed with error
        'cancelled'        -- Cancelled by user
    )),
    
    -- Results
    result TEXT,                           -- What Hermes did (natural language)
    result_metadata JSONB,                -- Structured output (files changed, commands run, etc.)
    
    -- Context for Hermes
    context JSONB,                        -- Extra context (conversation history, relevant data)
    
    -- Timestamps
    assigned_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_agent_tasks_status ON agent_tasks(status);
CREATE INDEX idx_agent_tasks_priority ON agent_tasks(priority);
CREATE INDEX idx_agent_tasks_requested_by ON agent_tasks(requested_by);
CREATE INDEX idx_agent_tasks_created ON agent_tasks(created_at DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_agent_tasks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER agent_tasks_updated_at
    BEFORE UPDATE ON agent_tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_agent_tasks_updated_at();

-- ─── MEMORY FACTS (What the system knows) ─────────────────────────────────

CREATE TABLE IF NOT EXISTS memory_facts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Who this fact is about / relevant to
    agent_id UUID REFERENCES agents(id),  -- NULL = system-wide fact
    lead_id UUID REFERENCES leads(id),    -- If about a client
    property_id UUID REFERENCES properties(id),  -- If about a property
    
    -- The fact itself
    category TEXT NOT NULL CHECK (category IN (
        'preference',      -- User preference (language, style, communication)
        'personal',        -- Personal info (birthday, family, habits)
        'business',        -- Business info (hours, processes, pricing)
        'client_note',     -- Notes about clients/leads
        'property_note',   -- Notes about properties
        'instruction',     -- Standing instructions from user
        'correction',      -- User correction to remember
        'learned',         -- Something the AI learned from observation
        'system'           -- System-level fact
    )),
    key TEXT NOT NULL,                     -- Short key like "bow.preferred_language" 
    value TEXT NOT NULL,                   -- The actual fact
    confidence REAL DEFAULT 1.0,           -- 0.0-1.0 how confident we are
    
    -- Source tracking
    source TEXT DEFAULT 'conversation',    -- conversation, observation, manual, agent_task
    source_id UUID,                        -- ID of the source (message, task, etc.)
    
    -- Lifecycle
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    superseded_by UUID REFERENCES memory_facts(id),  -- If this fact was updated
    
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_memory_facts_category ON memory_facts(category);
CREATE INDEX idx_memory_facts_agent ON memory_facts(agent_id);
CREATE INDEX idx_memory_facts_lead ON memory_facts(lead_id);
CREATE INDEX idx_memory_facts_key ON memory_facts(key);
CREATE INDEX idx_memory_facts_active ON memory_facts(is_active);

CREATE TRIGGER memory_facts_updated_at
    BEFORE UPDATE ON memory_facts
    FOR EACH ROW
    EXECUTE FUNCTION update_agent_tasks_updated_at();

-- ─── MEMORY ENTITIES (People, companies, relationships) ────────────────────

CREATE TABLE IF NOT EXISTS memory_entities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    entity_type TEXT NOT NULL CHECK (entity_type IN (
        'person', 'company', 'property', 'area', 'service', 'other'
    )),
    name TEXT NOT NULL,
    name_th TEXT,                          -- Thai name if applicable
    description TEXT,
    metadata JSONB,                        -- Flexible attributes
    
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_memory_entities_type ON memory_entities(entity_type);
CREATE INDEX idx_memory_entities_name ON memory_entities(name);

-- Entity relationships (person works for company, person likes area, etc.)
CREATE TABLE IF NOT EXISTS memory_relationships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    from_entity_id UUID REFERENCES memory_entities(id) NOT NULL,
    to_entity_id UUID REFERENCES memory_entities(id) NOT NULL,
    relationship_type TEXT NOT NULL,       -- "works_for", "owns", "prefers", "friend_of", etc.
    description TEXT,
    metadata JSONB,
    
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_memory_rel_from ON memory_relationships(from_entity_id);
CREATE INDEX idx_memory_rel_to ON memory_relationships(to_entity_id);
CREATE INDEX idx_memory_rel_type ON memory_relationships(relationship_type);

-- ─── SESSION CONTEXT (Handoff between Hermes sessions) ─────────────────────

CREATE TABLE IF NOT EXISTS session_contexts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    session_type TEXT DEFAULT 'hermes' CHECK (session_type IN ('hermes', 'bot', 'system')),
    trigger TEXT,                          -- What started this session
    
    -- The context blob - everything Hermes needs to know to pick up
    context JSONB NOT NULL,                -- {project_state, active_tasks, recent_changes, notes}
    
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'ended', 'archived')),
    
    started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_session_contexts_status ON session_contexts(status);
CREATE INDEX idx_session_contexts_type ON session_contexts(session_type);

-- ─── Enable RLS but allow service role full access ─────────────────────────

ALTER TABLE agent_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_facts ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_contexts ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (bot + Hermes use this)
CREATE POLICY "Service role full access on agent_tasks" ON agent_tasks
    FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access on memory_facts" ON memory_facts
    FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access on memory_entities" ON memory_entities
    FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access on memory_relationships" ON memory_relationships
    FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access on session_contexts" ON session_contexts
    FOR ALL USING (auth.role() = 'service_role');

-- Authenticated users can read (for dashboard)
CREATE POLICY "Authenticated read agent_tasks" ON agent_tasks
    FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated read memory_facts" ON memory_facts
    FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated read memory_entities" ON memory_entities
    FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated read memory_relationships" ON memory_relationships
    FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated read session_contexts" ON session_contexts
    FOR SELECT USING (auth.role() = 'authenticated');

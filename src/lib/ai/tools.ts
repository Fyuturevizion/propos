import { z } from "zod";

/**
 * MCP Tool Definitions for PropOS AI Assistant
 *
 * These define the tool schemas that the AI can invoke.
 * In AI SDK v6, tools are passed directly to streamText/generateText.
 *
 * Each tool has:
 * - description: What the tool does (for the AI to understand)
 * - parameters: Zod schema for input validation
 * - execute: Implementation function
 */

// ─── Property Tools ─────────────────────────────────────────────────────────

export const searchProperties = {
  description: "Search the property database with optional filters",
  parameters: z.object({
    propertyType: z.enum(["villa", "condo", "land", "townhouse", "apartment"]).optional(),
    listingType: z.enum(["sale", "rent"]).optional(),
    area: z.string().optional(),
    minPrice: z.number().optional(),
    maxPrice: z.number().optional(),
    bedrooms: z.number().optional(),
    features: z.array(z.string()).optional(),
  }),
  execute: async (params: {
    propertyType?: string;
    listingType?: string;
    area?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    features?: string[];
  }) => {
    // TODO: Implement with Drizzle query
    return { results: [] as unknown[], total: 0, filters: params };
  },
};

export const getPropertyDetails = {
  description: "Get full details of a specific property by ID or slug",
  parameters: z.object({
    id: z.string().optional(),
    slug: z.string().optional(),
  }),
  execute: async (params: { id?: string; slug?: string }) => {
    // TODO: Implement with Drizzle query
    return { property: null, params };
  },
};

// ─── CRM Tools ──────────────────────────────────────────────────────────────

export const createLead = {
  description: "Create a new lead in the CRM from a client interaction",
  parameters: z.object({
    fullName: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
    whatsappId: z.string().optional(),
    telegramId: z.string().optional(),
    lineId: z.string().optional(),
    source: z.enum(["website", "whatsapp", "telegram", "line", "email", "referral", "social", "walk_in"]),
    languagePreference: z.enum(["en", "th", "ru", "zh"]).optional(),
    propertyTypeInterest: z.string().optional(),
    listingTypeInterest: z.enum(["buy", "rent"]).optional(),
    budgetMinThb: z.number().optional(),
    budgetMaxThb: z.number().optional(),
    preferredAreas: z.array(z.string()).optional(),
    bedroomsNeeded: z.number().optional(),
    requirements: z.string().optional(),
    timeline: z.enum(["immediate", "1_3_months", "3_6_months", "investment", "undecided"]).optional(),
  }),
  execute: async (params: Record<string, unknown>) => {
    // TODO: Implement with Drizzle insert
    return { success: true, leadId: null as string | null, params };
  },
};

export const updateLead = {
  description: "Update an existing lead's information or status",
  parameters: z.object({
    id: z.string(),
    status: z.enum(["new", "qualified", "viewing", "offer", "negotiation", "closed_won", "closed_lost"]).optional(),
    score: z.enum(["hot", "warm", "cold"]).optional(),
    notes: z.string().optional(),
    nextFollowUp: z.string().optional(),
  }),
  execute: async (params: Record<string, unknown>) => {
    // TODO: Implement with Drizzle update
    return { success: true, params };
  },
};

export const getLead = {
  description: "Retrieve a lead's full profile and conversation history",
  parameters: z.object({
    id: z.string(),
  }),
  execute: async (params: { id: string }) => {
    // TODO: Implement with Drizzle query
    return { lead: null, messages: [] as unknown[], params };
  },
};

// ─── Calendar Tools ─────────────────────────────────────────────────────────

export const getCalendarEvents = {
  description: "Get calendar events for a given date range",
  parameters: z.object({
    startDate: z.string().describe("ISO date string"),
    endDate: z.string().describe("ISO date string"),
  }),
  execute: async (params: { startDate: string; endDate: string }) => {
    // TODO: Implement with Google Calendar MCP
    return { events: [] as unknown[], params };
  },
};

export const createCalendarEvent = {
  description: "Book a viewing, meeting, or call on the calendar",
  parameters: z.object({
    title: z.string(),
    description: z.string().optional(),
    startTime: z.string().describe("ISO datetime string"),
    endTime: z.string().describe("ISO datetime string"),
    attendeeEmail: z.string().optional(),
    location: z.string().optional(),
    propertyId: z.string().optional(),
    leadId: z.string().optional(),
  }),
  execute: async (params: Record<string, unknown>) => {
    // TODO: Implement with Google Calendar MCP
    return { success: true, eventId: null as string | null, params };
  },
};

export const sendReminder = {
  description: "Send a reminder message via any channel",
  parameters: z.object({
    channel: z.enum(["whatsapp", "telegram", "line", "email"]),
    recipientId: z.string(),
    message: z.string(),
  }),
  execute: async (params: { channel: string; recipientId: string; message: string }) => {
    // TODO: Implement per-channel delivery
    return { success: true, params };
  },
};

// ─── Communication Tools ────────────────────────────────────────────────────

export const getEmails = {
  description: "Fetch emails from Gmail with optional filters",
  parameters: z.object({
    query: z.string().optional(),
    maxResults: z.number().default(10),
    after: z.string().optional().describe("ISO date string"),
  }),
  execute: async (params: Record<string, unknown>) => {
    // TODO: Implement with Gmail MCP
    return { emails: [] as unknown[], params };
  },
};

export const draftEmail = {
  description: "Draft an email response",
  parameters: z.object({
    to: z.string(),
    subject: z.string(),
    body: z.string(),
    replyToId: z.string().optional(),
  }),
  execute: async (params: Record<string, unknown>) => {
    // TODO: Implement with Gmail MCP
    return { success: true, draftId: null as string | null, params };
  },
};

export const sendMessage = {
  description: "Send a message via WhatsApp, Telegram, or LINE",
  parameters: z.object({
    platform: z.enum(["whatsapp", "telegram", "line"]),
    recipientId: z.string(),
    message: z.string(),
    templateName: z.string().optional().describe("WhatsApp template for messages outside 24h window"),
  }),
  execute: async (params: Record<string, unknown>) => {
    // TODO: Implement per-platform delivery
    return { success: true, params };
  },
};

// ─── Notion Tools ───────────────────────────────────────────────────────────

export const createNotionPage = {
  description: "Create a page in a Notion database",
  parameters: z.object({
    database: z.enum(["crm", "listings"]),
    data: z.record(z.string(), z.unknown()),
  }),
  execute: async (params: Record<string, unknown>) => {
    // TODO: Implement with Notion API
    return { success: true, pageId: null as string | null, params };
  },
};

// ─── Social Media Tools ─────────────────────────────────────────────────────

export const schedulePost = {
  description: "Schedule a social media post to multiple platforms",
  parameters: z.object({
    platforms: z.array(z.enum(["facebook", "instagram", "tiktok", "line_oa"])),
    contentEn: z.string().optional(),
    contentTh: z.string().optional(),
    mediaUrls: z.array(z.string()).optional(),
    scheduledAt: z.string().describe("ISO datetime string"),
    propertyId: z.string().optional(),
  }),
  execute: async (params: Record<string, unknown>) => {
    // TODO: Implement with PostEverywhere/Ayrshare API
    return { success: true, postId: null as string | null, params };
  },
};

// ─── Voice Tools ────────────────────────────────────────────────────────────

export const ttsSpeak = {
  description: "Convert text to speech audio",
  parameters: z.object({
    text: z.string(),
    language: z.enum(["en", "th"]),
  }),
  execute: async (params: { text: string; language: string }) => {
    // TODO: ThonburianTTS for Thai, ElevenLabs/OpenAI for English
    return { audioUrl: null as string | null, params };
  },
};

export const sttTranscribe = {
  description: "Transcribe an audio file to text",
  parameters: z.object({
    audioUrl: z.string(),
  }),
  execute: async (params: { audioUrl: string }) => {
    // TODO: Implement with OpenAI Whisper
    return { text: null as string | null, params };
  },
};

// ─── Export all tools ───────────────────────────────────────────────────────
export const mcpTools = {
  searchProperties,
  getPropertyDetails,
  createLead,
  updateLead,
  getLead,
  getCalendarEvents,
  createCalendarEvent,
  sendReminder,
  getEmails,
  draftEmail,
  sendMessage,
  createNotionPage,
  schedulePost,
  ttsSpeak,
  sttTranscribe,
};

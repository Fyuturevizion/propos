import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  integer,
  numeric,
  jsonb,
  date,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ─── AGENTS ─────────────────────────────────────────────────────────────────
export const agents = pgTable("agents", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").unique().notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  role: text("role", { enum: ["admin", "agent"] })
    .default("agent")
    .notNull(),
  avatarUrl: text("avatar_url"),
  telegramChatId: text("telegram_chat_id"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const agentsRelations = relations(agents, ({ many }) => ({
  properties: many(properties),
  leads: many(leads),
  viewings: many(viewings),
  socialPosts: many(socialPosts),
  dailyBriefs: many(dailyBriefs),
}));

export const insertAgentSchema = createInsertSchema(agents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type Agent = typeof agents.$inferSelect;

// ─── PROPERTIES ─────────────────────────────────────────────────────────────
export const properties = pgTable(
  "properties",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    agentId: uuid("agent_id").references(() => agents.id),
    slug: text("slug").unique().notNull(),
    titleEn: text("title_en").notNull(),
    titleTh: text("title_th"),
    descriptionEn: text("description_en"),
    descriptionTh: text("description_th"),
    propertyType: text("property_type", {
      enum: ["villa", "condo", "land", "townhouse", "apartment"],
    }).notNull(),
    listingType: text("listing_type", {
      enum: ["sale", "rent", "sale_rent"],
    }).notNull(),
    status: text("status", {
      enum: ["active", "pending", "sold", "rented", "archived"],
    })
      .default("active")
      .notNull(),
    priceThb: numeric("price_thb"),
    priceUsd: numeric("price_usd"),
    rentalPriceThb: numeric("rental_price_thb"),
    bedrooms: integer("bedrooms"),
    bathrooms: integer("bathrooms"),
    areaSqm: numeric("area_sqm"),
    landAreaSqm: numeric("land_area_sqm"),
    areaDistrict: text("area_district"),
    address: text("address"),
    latitude: numeric("latitude"),
    longitude: numeric("longitude"),
    features: jsonb("features").$type<Record<string, boolean>>(),
    images: jsonb("images").$type<string[]>(),
    floorPlanUrl: text("floor_plan_url"),
    videoUrl: text("video_url"),
    ownershipType: text("ownership_type", {
      enum: ["freehold", "leasehold", "company"],
    }),
    yearBuilt: integer("year_built"),
    foreignQuotaAvailable: boolean("foreign_quota_available"),
    seoTitleEn: text("seo_title_en"),
    seoTitleTh: text("seo_title_th"),
    seoDescriptionEn: text("seo_description_en"),
    seoDescriptionTh: text("seo_description_th"),
    notionPageId: text("notion_page_id"),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_properties_status").on(table.status),
    index("idx_properties_type").on(table.propertyType),
    index("idx_properties_district").on(table.areaDistrict),
    index("idx_properties_agent").on(table.agentId),
  ]
);

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  agent: one(agents, {
    fields: [properties.agentId],
    references: [agents.id],
  }),
  viewings: many(viewings),
  socialPosts: many(socialPosts),
}));

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;

// ─── LEADS ──────────────────────────────────────────────────────────────────
export const leads = pgTable(
  "leads",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    agentId: uuid("agent_id").references(() => agents.id),
    fullName: text("full_name").notNull(),
    email: text("email"),
    phone: text("phone"),
    whatsappId: text("whatsapp_id"),
    telegramId: text("telegram_id"),
    lineId: text("line_id"),
    languagePreference: text("language_preference", {
      enum: ["en", "th", "ru", "zh"],
    }).default("en"),
    source: text("source", {
      enum: [
        "website",
        "whatsapp",
        "telegram",
        "line",
        "email",
        "referral",
        "social",
        "walk_in",
      ],
    }),
    status: text("status", {
      enum: [
        "new",
        "qualified",
        "viewing",
        "offer",
        "negotiation",
        "closed_won",
        "closed_lost",
      ],
    })
      .default("new")
      .notNull(),
    score: text("score", { enum: ["hot", "warm", "cold"] }).default("cold"),
    propertyTypeInterest: text("property_type_interest"),
    listingTypeInterest: text("listing_type_interest", {
      enum: ["buy", "rent"],
    }),
    budgetMinThb: numeric("budget_min_thb"),
    budgetMaxThb: numeric("budget_max_thb"),
    preferredAreas: jsonb("preferred_areas").$type<string[]>(),
    bedroomsNeeded: integer("bedrooms_needed"),
    requirements: text("requirements"),
    timeline: text("timeline", {
      enum: [
        "immediate",
        "1_3_months",
        "3_6_months",
        "investment",
        "undecided",
      ],
    }),
    notes: text("notes"),
    pdpaConsent: boolean("pdpa_consent").default(false),
    pdpaConsentDate: timestamp("pdpa_consent_date"),
    marketingConsent: boolean("marketing_consent").default(false),
    notionPageId: text("notion_page_id"),
    lastContactAt: timestamp("last_contact_at"),
    nextFollowUp: timestamp("next_follow_up"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_leads_status").on(table.status),
    index("idx_leads_score").on(table.score),
    index("idx_leads_agent").on(table.agentId),
    index("idx_leads_source").on(table.source),
  ]
);

export const leadsRelations = relations(leads, ({ one, many }) => ({
  agent: one(agents, { fields: [leads.agentId], references: [agents.id] }),
  messages: many(messages),
  viewings: many(viewings),
}));

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

// ─── MESSAGES ───────────────────────────────────────────────────────────────
export const messages = pgTable(
  "messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    leadId: uuid("lead_id").references(() => leads.id),
    agentId: uuid("agent_id").references(() => agents.id),
    platform: text("platform", {
      enum: ["website", "whatsapp", "telegram", "line", "email"],
    }).notNull(),
    direction: text("direction", {
      enum: ["inbound", "outbound"],
    }).notNull(),
    content: text("content").notNull(),
    contentType: text("content_type", {
      enum: ["text", "image", "audio", "document", "location"],
    })
      .default("text")
      .notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    isAiGenerated: boolean("is_ai_generated").default(false),
    isRead: boolean("is_read").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_messages_lead").on(table.leadId),
    index("idx_messages_platform").on(table.platform),
    index("idx_messages_created").on(table.createdAt),
  ]
);

export const messagesRelations = relations(messages, ({ one }) => ({
  lead: one(leads, { fields: [messages.leadId], references: [leads.id] }),
  agent: one(agents, { fields: [messages.agentId], references: [agents.id] }),
}));

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// ─── VIEWINGS ───────────────────────────────────────────────────────────────
export const viewings = pgTable(
  "viewings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    leadId: uuid("lead_id")
      .references(() => leads.id)
      .notNull(),
    propertyId: uuid("property_id")
      .references(() => properties.id)
      .notNull(),
    agentId: uuid("agent_id")
      .references(() => agents.id)
      .notNull(),
    scheduledAt: timestamp("scheduled_at").notNull(),
    durationMinutes: integer("duration_minutes").default(60),
    status: text("status", {
      enum: ["scheduled", "confirmed", "completed", "cancelled", "no_show"],
    })
      .default("scheduled")
      .notNull(),
    notes: text("notes"),
    feedback: text("feedback"),
    googleCalendarEventId: text("google_calendar_event_id"),
    reminderSent: boolean("reminder_sent").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_viewings_lead").on(table.leadId),
    index("idx_viewings_property").on(table.propertyId),
    index("idx_viewings_scheduled").on(table.scheduledAt),
  ]
);

export const viewingsRelations = relations(viewings, ({ one }) => ({
  lead: one(leads, { fields: [viewings.leadId], references: [leads.id] }),
  property: one(properties, {
    fields: [viewings.propertyId],
    references: [properties.id],
  }),
  agent: one(agents, { fields: [viewings.agentId], references: [agents.id] }),
}));

export const insertViewingSchema = createInsertSchema(viewings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertViewing = z.infer<typeof insertViewingSchema>;
export type Viewing = typeof viewings.$inferSelect;

// ─── SOCIAL POSTS ───────────────────────────────────────────────────────────
export const socialPosts = pgTable("social_posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  agentId: uuid("agent_id").references(() => agents.id),
  propertyId: uuid("property_id").references(() => properties.id),
  contentEn: text("content_en"),
  contentTh: text("content_th"),
  platforms: jsonb("platforms").$type<string[]>(),
  mediaUrls: jsonb("media_urls").$type<string[]>(),
  status: text("status", {
    enum: ["draft", "scheduled", "published", "failed"],
  })
    .default("draft")
    .notNull(),
  scheduledAt: timestamp("scheduled_at"),
  publishedAt: timestamp("published_at"),
  platformPostIds: jsonb("platform_post_ids").$type<Record<string, string>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const socialPostsRelations = relations(socialPosts, ({ one }) => ({
  agent: one(agents, {
    fields: [socialPosts.agentId],
    references: [agents.id],
  }),
  property: one(properties, {
    fields: [socialPosts.propertyId],
    references: [properties.id],
  }),
}));

export const insertSocialPostSchema = createInsertSchema(socialPosts).omit({
  id: true,
  createdAt: true,
});
export type InsertSocialPost = z.infer<typeof insertSocialPostSchema>;
export type SocialPost = typeof socialPosts.$inferSelect;

// ─── DAILY BRIEFS ───────────────────────────────────────────────────────────
export const dailyBriefs = pgTable("daily_briefs", {
  id: uuid("id").defaultRandom().primaryKey(),
  agentId: uuid("agent_id")
    .references(() => agents.id)
    .notNull(),
  date: date("date").notNull(),
  emailSummary: text("email_summary"),
  scheduleSummary: text("schedule_summary"),
  leadPipelineSummary: text("lead_pipeline_summary"),
  actionItems: jsonb("action_items").$type<string[]>(),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const dailyBriefsRelations = relations(dailyBriefs, ({ one }) => ({
  agent: one(agents, {
    fields: [dailyBriefs.agentId],
    references: [agents.id],
  }),
}));

export const insertDailyBriefSchema = createInsertSchema(dailyBriefs).omit({
  id: true,
  createdAt: true,
});
export type InsertDailyBrief = z.infer<typeof insertDailyBriefSchema>;
export type DailyBrief = typeof dailyBriefs.$inferSelect;

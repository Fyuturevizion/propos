export const dynamic = "force-dynamic";

import { getAgent } from "@/lib/auth";
import { supabase } from "@/lib/db/supabase-server";
import { SectionExplainer } from "@/components/dashboard/section-explainer";
import {
  MessageCircle,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
  Inbox,
  Filter,
} from "lucide-react";

export default async function InboxPage() {
  const { agent } = await getAgent();

  const { data: recentMessages } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  const messagesList = recentMessages ?? [];
  const unreadCount = messagesList.filter((m: any) => !m.is_read).length;

  const platformConfig: Record<
    string,
    { icon: typeof MessageCircle; gradient: string; label: string }
  > = {
    website: {
      icon: MessageCircle,
      gradient: "from-blue-500 to-cyan-500",
      label: "Website",
    },
    whatsapp: {
      icon: MessageCircle,
      gradient: "from-green-500 to-emerald-500",
      label: "WhatsApp",
    },
    telegram: {
      icon: MessageCircle,
      gradient: "from-sky-500 to-blue-600",
      label: "Telegram",
    },
    line: {
      icon: MessageCircle,
      gradient: "from-green-400 to-lime-500",
      label: "LINE",
    },
    email: {
      icon: MessageCircle,
      gradient: "from-amber-500 to-orange-500",
      label: "Email",
    },
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-sm">
            <Inbox className="h-3.5 w-3.5" />
          </div>
          <p className="text-xs font-medium text-primary uppercase tracking-wider">
            Communications
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Unified Inbox
            </h1>
            <p className="text-muted-foreground mt-0.5">
              Messages from all channels
            </p>
          </div>
          {unreadCount > 0 && (
            <span className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
              {unreadCount} unread
            </span>
          )}
        </div>
      </div>

      {/* Platform filter chips (visual only for now) */}
      <div className="flex items-center gap-2 mb-6 animate-slide-up">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Filter className="h-3.5 w-3.5" />
          <span className="font-medium">Channels</span>
        </div>
        {Object.entries(platformConfig).map(([key, cfg]) => (
          <div
            key={key}
            className="flex items-center gap-1.5 rounded-full border bg-background/50 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/20 hover:bg-primary/[0.02] transition-all cursor-default"
          >
            <div
              className={`h-2 w-2 rounded-full bg-gradient-to-br ${cfg.gradient}`}
            />
            {cfg.label}
          </div>
        ))}
      </div>

      <SectionExplainer
        title="Inbox"
        icon="💬"
        description="All your messages from Telegram, WhatsApp, LINE, website, and email in one place"
        status="partial"
        statusLabel="Telegram working, more coming"
        steps={[
          "Messages from your Telegram bot conversations appear here automatically",
          "When clients message the website, those will appear here too (coming soon)",
          "Connect WhatsApp and LINE to see those messages here as well",
        ]}
        requirements={[
          {
            label: "Telegram messages",
            done: true,
            note: "Already connected — all bot conversations appear here",
          },
          {
            label: "Website contact form / chat",
            done: false,
            note: "Iain needs to build the chat widget",
          },
          {
            label: "WhatsApp Business API",
            done: false,
            note: "Iain needs the API access token from your WhatsApp Business account",
          },
          {
            label: "LINE Official Account",
            done: false,
            note: "Iain needs the channel access token from your LINE OA",
          },
        ]}
      />

      {messagesList.length === 0 ? (
        <div className="rounded-2xl border bg-card overflow-hidden animate-slide-up">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-4">
              <Inbox className="h-7 w-7 text-primary/30" />
            </div>
            <h3 className="text-lg font-semibold">No messages yet</h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Conversations from WhatsApp, Telegram, LINE, website, and email
              will appear here as they come in.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2 animate-stagger">
          {messagesList.map((msg: any, i: number) => {
            const platform = platformConfig[msg.platform] || platformConfig.website;
            const PlatformIcon = platform.icon;
            const isInbound = msg.direction === "inbound";

            return (
              <div
                key={msg.id}
                className={`group rounded-xl border bg-card p-4 hover:border-primary/20 hover:bg-primary/[0.01] transition-all duration-200 animate-slide-up ${
                  !msg.is_read ? "border-l-4 border-l-primary" : ""
                }`}
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Platform icon */}
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${platform.gradient} text-white shadow-sm mt-0.5`}
                    >
                      <PlatformIcon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Direction */}
                        <span className="flex items-center gap-1 text-xs font-medium">
                          {isInbound ? (
                            <ArrowDownLeft className="h-3 w-3 text-emerald-500" />
                          ) : (
                            <ArrowUpRight className="h-3 w-3 text-blue-500" />
                          )}
                          <span className={isInbound ? "text-emerald-600" : "text-blue-600"}>
                            {isInbound ? "Incoming" : "Sent"}
                          </span>
                        </span>

                        {/* Platform badge */}
                        <span className="text-[10px] rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground capitalize">
                          {msg.platform}
                        </span>

                        {/* AI badge */}
                        {msg.is_ai_generated && (
                          <span className="flex items-center gap-0.5 text-[10px] rounded-full bg-purple-50 text-purple-600 px-2 py-0.5 font-semibold">
                            <Sparkles className="h-2.5 w-2.5" />
                            AI
                          </span>
                        )}
                      </div>

                      {/* Message content */}
                      <p className="mt-1.5 text-sm leading-relaxed line-clamp-2">
                        {msg.content}
                      </p>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <p className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0 mt-1">
                    {msg.created_at
                      ? new Date(msg.created_at).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

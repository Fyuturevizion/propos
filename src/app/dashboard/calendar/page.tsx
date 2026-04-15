export const dynamic = "force-dynamic";

import { getAgent } from "@/lib/auth";
import { supabase } from "@/lib/db/supabase-server";
import { SectionExplainer } from "@/components/dashboard/section-explainer";

const statusConfig: Record<string, { badge: string; dot: string; icon: string; border: string; bg: string }> = {
  scheduled: {
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    icon: "🕐",
    border: "border-l-emerald-500",
    bg: "bg-white",
  },
  confirmed: {
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
    icon: "✅",
    border: "border-l-blue-500",
    bg: "bg-white",
  },
  completed: {
    badge: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
    icon: "✓",
    border: "border-l-slate-400",
    bg: "bg-white",
  },
  cancelled: {
    badge: "bg-red-100 text-red-600 border-red-200",
    dot: "bg-red-400",
    icon: "✕",
    border: "border-l-red-400",
    bg: "bg-white",
  },
  no_show: {
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    icon: "⚠",
    border: "border-l-amber-500",
    bg: "bg-white",
  },
};

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default async function CalendarPage() {
  const { agent } = await getAgent();

  const { data: upcoming } = await supabase
    .from("viewings")
    .select("*")
    .eq("status", "scheduled")
    .order("scheduled_at", { ascending: true })
    .limit(20);

  const { data: past } = await supabase
    .from("viewings")
    .select("*")
    .order("scheduled_at", { ascending: false })
    .limit(20);

  const upcomingList = upcoming ?? [];
  const pastList = past ?? [];
  const upcomingCount = upcomingList.length;
  const pastCount = pastList.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
            <p className="mt-1 text-sm text-slate-300">Viewings and appointments</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/20 px-4 py-2 text-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-emerald-200">{upcomingCount} upcoming</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              <span className="text-slate-300">{pastCount} past</span>
            </div>
          </div>
        </div>
      </div>

      <SectionExplainer
        title="Calendar — Viewings"
        icon="📅"
        description="Your property viewings — upcoming and past"
        status="working"
        statusLabel="Working — Google Calendar sync coming soon"
        steps={[
          "Schedule a viewing by telling the bot: \"Set a viewing for the Kata villa with Khun Somchai on Friday at 3pm\"",
          "The viewing appears here in the 'Upcoming' section automatically",
          "After the viewing, tell the bot how it went: \"Khun Somchai liked it but wants to think about it\"",
          "The bot updates the viewing status and adds feedback",
        ]}
        requirements={[
          { label: "Start scheduling viewings through the bot", done: false, note: "Just mention property + client + date/time — the bot creates the viewing" },
          { label: "Give feedback after viewings", done: false, note: "Tell the bot — it helps track what each client thought" },
          { label: "Google Calendar sync", done: false, note: "Optional — Iain can connect it so viewings appear in your phone calendar too" },
          { label: "Automatic reminders", done: false, note: "Coming soon — bot will remind you before each viewing" },
        ]}
      />

      {/* Two-column layout */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Upcoming */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
              <span className="text-sm">📅</span>
            </div>
            <h2 className="text-lg font-bold tracking-tight">Upcoming</h2>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
              {upcomingCount}
            </span>
          </div>

          {upcomingList.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-16 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <span className="text-xl">📭</span>
              </div>
              <p className="text-sm font-medium text-muted-foreground">No upcoming viewings</p>
              <p className="mt-1 text-xs text-muted-foreground">Tell the bot to schedule one</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingList.map((v: any) => {
                const cfg = statusConfig[v.status] || statusConfig.scheduled;
                const date = new Date(v.scheduled_at);
                return (
                  <div
                    key={v.id}
                    className={`rounded-2xl border border-l-4 p-5 ${cfg.border} ${cfg.bg} shadow-sm ring-1 ring-black/[0.03] transition hover:shadow-md`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3">
                        {/* Date block */}
                        <div className="flex flex-col items-center rounded-xl bg-slate-50 px-3 py-2 text-center">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            {formatDate(date).split(",")[0]}
                          </span>
                          <span className="text-lg font-bold leading-tight text-slate-800">
                            {date.getDate()}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400">
                            {date.toLocaleDateString("en-US", { month: "short" })}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-slate-800">{formatTime(date)}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {v.duration_minutes || 60} min
                          </p>
                        </div>
                      </div>
                      <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${cfg.badge}`}>
                        {cfg.icon} {v.status}
                      </span>
                    </div>

                    {v.notes && (
                      <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-muted-foreground leading-relaxed">
                        {v.notes}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Past */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
              <span className="text-sm">📋</span>
            </div>
            <h2 className="text-lg font-bold tracking-tight">Past</h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
              {pastCount}
            </span>
          </div>

          {pastList.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-16 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <span className="text-xl">📭</span>
              </div>
              <p className="text-sm font-medium text-muted-foreground">No past viewings</p>
              <p className="mt-1 text-xs text-muted-foreground">Completed viewings will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pastList.map((v: any) => {
                const cfg = statusConfig[v.status] || statusConfig.completed;
                const date = new Date(v.scheduled_at);
                return (
                  <div
                    key={v.id}
                    className={`rounded-2xl border border-l-4 p-5 ${cfg.border} ${cfg.bg} shadow-sm ring-1 ring-black/[0.03]`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center rounded-xl bg-slate-50 px-3 py-2 text-center">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            {formatDate(date).split(",")[0]}
                          </span>
                          <span className="text-lg font-bold leading-tight text-slate-800">
                            {date.getDate()}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400">
                            {date.toLocaleDateString("en-US", { month: "short" })}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-slate-800">{formatTime(date)}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                            {v.duration_minutes || 60} min
                          </p>
                        </div>
                      </div>
                      <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${cfg.badge}`}>
                        {cfg.icon} {v.status}
                      </span>
                    </div>

                    {v.feedback && (
                      <p className="mt-3 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700 leading-relaxed">
                        💬 {v.feedback}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

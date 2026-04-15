export const dynamic = "force-dynamic";

import { getAgent } from "@/lib/auth";
import { supabase } from "@/lib/db/supabase-server";
import { SectionExplainer } from "@/components/dashboard/section-explainer";

const STAGES = [
  { id: "new", label: "New", gradient: "from-emerald-500 to-emerald-600", dot: "bg-emerald-500", bg: "bg-emerald-50/60", border: "border-emerald-200/80" },
  { id: "qualified", label: "Qualified", gradient: "from-blue-500 to-blue-600", dot: "bg-blue-500", bg: "bg-blue-50/60", border: "border-blue-200/80" },
  { id: "viewing", label: "Viewing", gradient: "from-amber-500 to-amber-600", dot: "bg-amber-500", bg: "bg-amber-50/60", border: "border-amber-200/80" },
  { id: "offer", label: "Offer", gradient: "from-purple-500 to-purple-600", dot: "bg-purple-500", bg: "bg-purple-50/60", border: "border-purple-200/80" },
  { id: "negotiation", label: "Negotiation", gradient: "from-indigo-500 to-indigo-600", dot: "bg-indigo-500", bg: "bg-indigo-50/60", border: "border-indigo-200/80" },
  { id: "closed_won", label: "Won 🎉", gradient: "from-green-500 to-teal-500", dot: "bg-green-500", bg: "bg-green-50/60", border: "border-green-200/80" },
  { id: "closed_lost", label: "Lost", gradient: "from-slate-400 to-slate-500", dot: "bg-slate-400", bg: "bg-slate-50/60", border: "border-slate-200/80" },
] as const;

const scoreBadge: Record<string, string> = {
  hot: "bg-red-100 text-red-700 border-red-200",
  warm: "bg-amber-100 text-amber-700 border-amber-200",
  cold: "bg-blue-100 text-blue-700 border-blue-200",
};

const scoreDot: Record<string, string> = {
  hot: "bg-red-500",
  warm: "bg-amber-500",
  cold: "bg-blue-400",
};

export default async function CRMPage() {
  const { agent } = await getAgent();

  const { data: rawLeads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: true });
  const allLeads = rawLeads ?? [];

  const leadsByStage = STAGES.map((stage) => ({
    ...stage,
    leads: allLeads.filter((l) => l.status === stage.id),
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Lead Pipeline</h1>
            <p className="mt-1 text-sm text-slate-300">
              {allLeads.length} leads total across {STAGES.length} stages
            </p>
          </div>
          <a
            href="/api/leads/export"
            className="rounded-xl bg-white/10 px-5 py-2.5 text-sm font-medium backdrop-blur-sm transition hover:bg-white/20"
          >
            ⬇ Export CSV
          </a>
        </div>

        {/* Quick stats */}
        <div className="mt-5 flex gap-3 overflow-x-auto">
          {leadsByStage.slice(0, 5).map((stage) => (
            <div
              key={stage.id}
              className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-xs backdrop-blur-sm"
            >
              <span className={`h-2 w-2 rounded-full ${stage.dot}`} />
              <span className="text-slate-200">{stage.label}</span>
              <span className="font-bold text-white">{stage.leads.length}</span>
            </div>
          ))}
        </div>
      </div>

      <SectionExplainer
        title="CRM — Client Pipeline"
        icon="👥"
        description="All your clients organized by stage — from new enquiry to closed deal"
        status="working"
        statusLabel="Working — drag-and-drop coming soon"
        steps={[
          "Add clients by telling the Telegram bot: \"New client Khun Somchai, phone 081-234-5678, looking for condo in Patong\"",
          "Clients appear in the 'New' column automatically",
          "Tell the bot when a client progresses: \"Khun Somchai is coming for a viewing Friday\" — it updates the stage",
          "Review your pipeline daily to see who needs follow-up",
        ]}
        requirements={[
          { label: "Add all current TTT Properties clients", done: false, note: "Tell the bot about each client — name and phone is enough to start" },
          { label: "Update client stages regularly", done: false, note: "Just mention it to the bot naturally — 'Khun Somchai made an offer!'" },
          { label: "Drag-and-drop stage changes", done: false, note: "Iain will build this — for now use the bot to update stages" },
        ]}
      />

      {/* Kanban columns */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {leadsByStage.map((stage) => (
          <div
            key={stage.id}
            className={`min-w-[290px] flex-shrink-0 rounded-2xl border ${stage.border} ${stage.bg} p-4 shadow-sm`}
          >
            {/* Column header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${stage.dot}`} />
                <h3 className="text-sm font-bold tracking-tight">{stage.label}</h3>
              </div>
              <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-xs font-bold shadow-sm">
                {stage.leads.length}
              </span>
            </div>

            {stage.leads.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white/40 py-8 text-center">
                <p className="text-xs text-muted-foreground">No leads yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stage.leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/[0.04] transition hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold truncate">{lead.full_name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {lead.source || "website"}
                          {lead.property_type_interest && ` · ${lead.property_type_interest}`}
                        </p>
                      </div>
                      <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${scoreBadge[lead.score as string] || scoreBadge.cold}`}>
                        {lead.score || "cold"}
                      </span>
                    </div>

                    {(lead.email || lead.phone) && (
                      <p className="mt-2 text-xs text-muted-foreground truncate">
                        {lead.email || lead.phone}
                      </p>
                    )}

                    {lead.notes && (
                      <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">{lead.notes}</p>
                    )}

                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2">
                      <p className="text-[10px] text-muted-foreground">
                        {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : ""}
                      </p>
                      <div className="flex items-center gap-1">
                        <div className={`h-1.5 w-1.5 rounded-full ${scoreDot[lead.score || "cold"]}`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

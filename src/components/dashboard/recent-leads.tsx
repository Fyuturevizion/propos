import type { Lead } from "@/lib/db/schema";
import { Users } from "lucide-react";

export function RecentLeads({ leads }: { leads: Lead[] }) {
  if (!leads.length) {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <Users className="h-10 w-10 text-muted-foreground/30" />
        <p className="mt-3 text-sm text-muted-foreground">No leads yet</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {leads.slice(0, 5).map((lead) => (
        <div key={lead.id} className="flex items-center justify-between rounded-lg border p-3">
          <div>
            <div className="font-medium">{lead.fullName}</div>
            <div className="text-xs text-muted-foreground">{lead.source} · {lead.status}</div>
          </div>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            lead.score === 'hot' ? 'bg-red-100 text-red-700' :
            lead.score === 'warm' ? 'bg-amber-100 text-amber-700' :
            'bg-slate-100 text-slate-700'
          }`}>
            {lead.score}
          </span>
        </div>
      ))}
    </div>
  );
}

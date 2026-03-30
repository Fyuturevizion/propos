import type { Lead } from "@/lib/db/schema";
import { LeadCard } from "./lead-card";
import { LEAD_STATUSES } from "@/lib/constants";

const stageLabels: Record<string, string> = {
  new: "New",
  qualified: "Qualified",
  viewing: "Viewing",
  offer: "Offer",
  negotiation: "Negotiation",
  closed_won: "Won",
  closed_lost: "Lost",
};

export function PipelineBoard({ leads }: { leads: Lead[] }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {LEAD_STATUSES.map((status) => (
        <div key={status} className="min-w-[250px] flex-shrink-0 rounded-xl bg-muted/50 p-3">
          <h3 className="mb-3 text-sm font-semibold">{stageLabels[status]}</h3>
          <div className="space-y-2">
            {leads.filter((l) => l.status === status).map((lead) => (
              <LeadCard key={lead.id} lead={lead} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

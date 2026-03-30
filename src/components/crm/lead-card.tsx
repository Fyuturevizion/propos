import type { Lead } from "@/lib/db/schema";
import { Phone, Mail, MessageCircle } from "lucide-react";

export function LeadCard({ lead }: { lead: Lead }) {
  return (
    <div className="rounded-lg border bg-card p-3 shadow-sm">
      <div className="font-medium">{lead.fullName}</div>
      <div className="mt-1 flex gap-2">
        {lead.phone && <Phone className="h-3.5 w-3.5 text-muted-foreground" />}
        {lead.email && <Mail className="h-3.5 w-3.5 text-muted-foreground" />}
        {(lead.whatsappId || lead.lineId || lead.telegramId) && (
          <MessageCircle className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
          lead.score === 'hot' ? 'bg-red-100 text-red-700' :
          lead.score === 'warm' ? 'bg-amber-100 text-amber-700' :
          'bg-slate-100 text-slate-700'
        }`}>
          {lead.score?.toUpperCase()}
        </span>
        <span className="text-xs text-muted-foreground">{lead.source}</span>
      </div>
    </div>
  );
}

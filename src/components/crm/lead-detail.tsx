import type { Lead } from "@/lib/db/schema";

export function LeadDetail({ lead }: { lead: Lead }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{lead.fullName}</h2>
      <div className="grid gap-3 text-sm">
        {lead.email && <div><span className="font-medium">Email:</span> {lead.email}</div>}
        {lead.phone && <div><span className="font-medium">Phone:</span> {lead.phone}</div>}
        {lead.budgetMinThb && <div><span className="font-medium">Budget:</span> ฿{Number(lead.budgetMinThb).toLocaleString()} - ฿{Number(lead.budgetMaxThb).toLocaleString()}</div>}
        {lead.requirements && <div><span className="font-medium">Requirements:</span> {lead.requirements}</div>}
      </div>
    </div>
  );
}

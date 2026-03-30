import { Users, Plus } from "lucide-react";

const stages = [
  { id: "new", label: "New", color: "bg-slate-100" },
  { id: "qualified", label: "Qualified", color: "bg-blue-50" },
  { id: "viewing", label: "Viewing", color: "bg-amber-50" },
  { id: "offer", label: "Offer", color: "bg-emerald-50" },
  { id: "negotiation", label: "Negotiation", color: "bg-purple-50" },
  { id: "closed_won", label: "Won", color: "bg-green-50" },
];

export default function CRMPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Lead Pipeline</h1>
          <p className="mt-1 text-muted-foreground">Manage your client journey from enquiry to close</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500">
          <Plus className="h-4 w-4" /> Add Lead
        </button>
      </div>

      {/* Kanban board */}
      <div className="mt-8 flex gap-4 overflow-x-auto pb-4">
        {stages.map(({ id, label, color }) => (
          <div key={id} className={`min-w-[250px] flex-shrink-0 rounded-xl ${color} p-4`}>
            <h3 className="text-sm font-semibold">{label}</h3>
            <div className="mt-4 flex flex-col items-center py-8">
              <Users className="h-8 w-8 text-muted-foreground/30" />
              <p className="mt-2 text-xs text-muted-foreground">No leads</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

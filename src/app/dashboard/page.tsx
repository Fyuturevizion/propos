import { Users, Building2, CalendarDays, MessageCircle } from "lucide-react";

const stats = [
  { label: "Total Leads", value: "0", icon: Users, color: "text-blue-600" },
  { label: "Active Listings", value: "0", icon: Building2, color: "text-emerald-600" },
  { label: "Viewings This Week", value: "0", icon: CalendarDays, color: "text-amber-600" },
  { label: "Unread Messages", value: "0", icon: MessageCircle, color: "text-purple-600" },
];

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Welcome back, Iain</p>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl border bg-card p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <p className="mt-2 text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border p-6">
          <h2 className="text-lg font-semibold">Recent Leads</h2>
          <div className="mt-6 flex flex-col items-center py-8 text-center">
            <Users className="h-10 w-10 text-muted-foreground/30" />
            <p className="mt-3 text-sm text-muted-foreground">
              No leads yet. New enquiries from all channels will appear here.
            </p>
          </div>
        </div>
        <div className="rounded-xl border p-6">
          <h2 className="text-lg font-semibold">Upcoming Viewings</h2>
          <div className="mt-6 flex flex-col items-center py-8 text-center">
            <CalendarDays className="h-10 w-10 text-muted-foreground/30" />
            <p className="mt-3 text-sm text-muted-foreground">
              No viewings scheduled. Book viewings from the CRM or calendar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

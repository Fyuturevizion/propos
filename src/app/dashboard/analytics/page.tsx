import { BarChart3, TrendingUp, Eye, Users } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Analytics</h1>
      <p className="mt-1 text-muted-foreground">Website traffic, lead conversion, and property performance</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border p-6">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-muted-foreground">Page Views</span>
          </div>
          <p className="mt-2 text-3xl font-bold">--</p>
          <p className="text-xs text-muted-foreground">Last 30 days</p>
        </div>
        <div className="rounded-xl border p-6">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium text-muted-foreground">Lead Conversion</span>
          </div>
          <p className="mt-2 text-3xl font-bold">--%</p>
          <p className="text-xs text-muted-foreground">Enquiry → Viewing</p>
        </div>
        <div className="rounded-xl border p-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-amber-600" />
            <span className="text-sm font-medium text-muted-foreground">Top Area</span>
          </div>
          <p className="mt-2 text-3xl font-bold">--</p>
          <p className="text-xs text-muted-foreground">Most enquiries</p>
        </div>
      </div>

      <div className="mt-8 rounded-xl border p-6">
        <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground/30" />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Charts will render here once GA4 and PostHog are connected.
        </p>
      </div>
    </div>
  );
}

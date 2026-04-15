export const dynamic = "force-dynamic";

import { getAgent } from "@/lib/auth";
import { supabase } from "@/lib/db/supabase-server";
import { Building2, Users, CalendarDays, MessageCircle, TrendingUp, ArrowRight, Clock, Sparkles } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const { agent } = await getAgent();

  // Fetch all stats in parallel via REST API
  const [
    { count: propCount },
    { count: leadCount },
    { count: activeCount },
    { count: msgCount },
  ] = await Promise.all([
    supabase.from("properties").select("*", { count: "exact", head: true }),
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase.from("properties").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("messages").select("*", { count: "exact", head: true }).eq("is_read", false),
  ]);

  const { data: recentLeads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: recentProperties } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: upcomingViewings } = await supabase
    .from("viewings")
    .select("*")
    .eq("status", "scheduled")
    .order("scheduled_at", { ascending: true })
    .limit(5);

  const scoreColor: Record<string, string> = { hot: "bg-red-50 text-red-600 border-red-200", warm: "bg-amber-50 text-amber-600 border-amber-200", cold: "bg-blue-50 text-blue-600 border-blue-200" };
  const statusColor: Record<string, string> = { new: "bg-emerald-50 text-emerald-600 border-emerald-200", qualified: "bg-blue-50 text-blue-600 border-blue-200", viewing: "bg-amber-50 text-amber-600 border-amber-200", offer: "bg-purple-50 text-purple-600 border-purple-200" };

  const firstName = (agent as any)?.full_name?.split(" ")[0] || (agent as any)?.fullName?.split(" ")[0] || "Admin";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-4 w-4 text-primary" />
          <p className="text-xs font-medium text-primary uppercase tracking-wider">{greeting}</p>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {firstName}</h1>
        <p className="text-muted-foreground mt-0.5">Here&apos;s what&apos;s happening with TTT Properties today.</p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8 animate-stagger">
        {[
          { label: "Active Listings", value: activeCount ?? 0, sub: `${propCount ?? 0} total`, icon: Building2, href: "/dashboard/listings", color: "from-emerald-500 to-teal-600" },
          { label: "Total Leads", value: leadCount ?? 0, sub: "View pipeline", icon: Users, href: "/dashboard/crm", color: "from-blue-500 to-indigo-600" },
          { label: "Upcoming Viewings", value: upcomingViewings?.length ?? 0, sub: "View calendar", icon: CalendarDays, href: "/dashboard/calendar", color: "from-amber-500 to-orange-600" },
          { label: "Unread Messages", value: msgCount ?? 0, sub: "View inbox", icon: MessageCircle, href: "/dashboard/inbox", color: "from-violet-500 to-purple-600" },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group relative overflow-hidden rounded-2xl border bg-card p-5 hover-lift animate-slide-up"
          >
            {/* Gradient accent */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${stat.color} text-white shadow-sm`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight">{stat.value}</p>
            <div className="mt-1 flex items-center gap-1 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {stat.sub}
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>

      {/* Two column layout */}
      <div className="grid gap-6 lg:grid-cols-2 animate-stagger">
        {/* Recent Leads */}
        <div className="rounded-2xl border bg-card overflow-hidden animate-slide-up">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <div>
              <h2 className="font-semibold tracking-tight">Recent Leads</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Latest enquiries from all channels</p>
            </div>
            <Link href="/dashboard/crm" className="flex items-center gap-1 text-xs text-primary font-medium hover:gap-1.5 transition-all">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="p-4">
            {(!recentLeads || recentLeads.length === 0) ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center mb-3">
                  <Users className="h-6 w-6 text-primary/40" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">No leads yet</p>
                <p className="text-xs text-muted-foreground/60 mt-1">They&apos;ll appear from website enquiries and Telegram</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentLeads.map((l: any, i: number) => (
                  <div
                    key={l.id}
                    className="group flex items-center justify-between rounded-xl border bg-background/50 p-3.5 hover:border-primary/20 hover:bg-primary/[0.02] transition-all duration-200"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-sm font-semibold text-primary">
                        {(l.full_name || "?")[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{l.full_name}</p>
                        <p className="text-xs text-muted-foreground">{l.source || "website"} · {l.email || l.phone || "No contact"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`rounded-lg border px-2 py-0.5 text-[10px] font-semibold ${statusColor[l.status] || "bg-slate-50 text-slate-600 border-slate-200"}`}>{l.status}</span>
                      <span className={`rounded-lg border px-2 py-0.5 text-[10px] font-semibold ${scoreColor[l.score || "cold"]}`}>{l.score || "cold"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Properties */}
        <div className="rounded-2xl border bg-card overflow-hidden animate-slide-up">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <div>
              <h2 className="font-semibold tracking-tight">Recent Properties</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Latest additions to your portfolio</p>
            </div>
            <Link href="/dashboard/listings" className="flex items-center gap-1 text-xs text-primary font-medium hover:gap-1.5 transition-all">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="p-4">
            {(!recentProperties || recentProperties.length === 0) ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center mb-3">
                  <Building2 className="h-6 w-6 text-primary/40" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">No properties yet</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Add one via the Telegram bot or the listings page</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentProperties.map((p: any, i: number) => (
                  <div
                    key={p.id}
                    className="group flex items-center justify-between rounded-xl border bg-background/50 p-3.5 hover:border-primary/20 hover:bg-primary/[0.02] transition-all duration-200"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-primary/60" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{p.title_en}</p>
                        <p className="text-xs text-muted-foreground">{p.area_district || "No area"} · {p.property_type} · {p.bedrooms || "-"} bed</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">
                        {p.price_thb ? `฿${Number(p.price_thb).toLocaleString()}` : "TBD"}
                      </p>
                      <p className="text-[10px] text-muted-foreground capitalize font-medium">{p.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

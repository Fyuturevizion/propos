export const dynamic = "force-dynamic";

import { getAgent } from "@/lib/auth";
import { SectionExplainer } from "@/components/dashboard/section-explainer";
import {
  BarChart3,
  Eye,
  MousePointerClick,
  TrendingUp,
  ArrowUpRight,
  Activity,
} from "lucide-react";

export default async function AnalyticsPage() {
  await getAgent();

  const statCards = [
    {
      label: "Website Views",
      value: "—",
      sub: "Connect GA or PostHog",
      icon: Eye,
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      label: "Enquiry Rate",
      value: "—",
      sub: "Leads per viewing",
      icon: MousePointerClick,
      gradient: "from-amber-500 to-orange-600",
    },
    {
      label: "Conversion Rate",
      value: "—",
      sub: "Leads to closed",
      icon: TrendingUp,
      gradient: "from-emerald-500 to-teal-600",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm">
            <BarChart3 className="h-3.5 w-3.5" />
          </div>
          <p className="text-xs font-medium text-primary uppercase tracking-wider">
            Insights
          </p>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-0.5">
          Performance metrics and insights
        </p>
      </div>

      <SectionExplainer
        title="Analytics"
        icon="📊"
        description="Track website traffic, lead conversion rates, and business performance"
        status="coming_soon"
        statusLabel="Coming soon — needs analytics integration"
        steps={[
          "Iain will connect Google Analytics or PostHog to track website visitors",
          "Once connected, you'll see: how many people view your properties, where leads come from, and conversion rates",
          "The system will also track which properties get the most interest",
        ]}
        requirements={[
          {
            label: "Decide if you want analytics",
            done: false,
            note: "Do you want to track website visitors? It's helpful but optional",
          },
          {
            label: "Google Analytics or PostHog setup",
            done: false,
            note: "Iain will set up whichever you prefer — just tell him",
          },
          {
            label: "Lead source tracking",
            done: false,
            note: "Will automatically track where each lead comes from (TG, website, etc.)",
          },
          {
            label: "Conversion funnel",
            done: false,
            note: "Shows how many leads make it from New → Won",
          },
        ]}
      />

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6 animate-stagger">
        {statCards.map((stat, i) => (
          <div
            key={stat.label}
            className="group relative overflow-hidden rounded-2xl border bg-card p-5 animate-slide-up hover-lift"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {/* Gradient accent */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            />

            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${stat.gradient} text-white shadow-sm opacity-30`}
              >
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="text-3xl font-bold tracking-tight text-muted-foreground/40">
              {stat.value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Empty chart area placeholder */}
      <div className="rounded-2xl border bg-card overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="font-semibold tracking-tight">Traffic Overview</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Visitors, page views, and lead sources over time
            </p>
          </div>
          <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-semibold text-muted-foreground">
            No data
          </span>
        </div>

        <div className="flex flex-col items-center justify-center py-20 text-center px-6">
          {/* Decorative chart illustration */}
          <div className="relative mb-6">
            <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center">
              <Activity className="h-7 w-7 text-primary/20" />
            </div>
            {/* Animated pulse rings */}
            <div className="absolute inset-0 rounded-2xl border-2 border-primary/10 animate-ping" style={{ animationDuration: "3s" }} />
          </div>

          <h3 className="text-lg font-semibold">Analytics coming soon</h3>
          <p className="mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
            Connect Google Analytics or PostHog to see traffic data, lead
            sources, and conversion metrics here.
          </p>

          <div className="mt-6 flex items-center gap-2 rounded-full bg-muted/50 px-4 py-2 text-xs text-muted-foreground">
            <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-[10px]">
              .env.example
            </span>
            <span>has configuration details</span>
          </div>
        </div>
      </div>
    </div>
  );
}

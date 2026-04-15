export const dynamic = "force-dynamic";

import { getAgent } from "@/lib/auth";
import { supabase } from "@/lib/db/supabase-server";
import Link from "next/link";
import { Plus, Building2, MapPin, Bed, Bath, ArrowRight, Search, Home, TrendingUp, Eye } from "lucide-react";
import { SectionExplainer } from "@/components/dashboard/section-explainer";

export default async function ListingsPage() {
  const { agent } = await getAgent();

  const { data: rawProperties } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });
  const allProperties = rawProperties ?? [];

  const statusConfig: Record<string, { label: string; dot: string; bg: string; border: string }> = {
    active: { label: "Active", dot: "bg-emerald-500", bg: "bg-emerald-50 text-emerald-700", border: "border-emerald-200" },
    pending: { label: "Pending", dot: "bg-amber-500", bg: "bg-amber-50 text-amber-700", border: "border-amber-200" },
    sold: { label: "Sold", dot: "bg-red-500", bg: "bg-red-50 text-red-700", border: "border-red-200" },
    rented: { label: "Rented", dot: "bg-blue-500", bg: "bg-blue-50 text-blue-700", border: "border-blue-200" },
    archived: { label: "Archived", dot: "bg-slate-400", bg: "bg-slate-50 text-slate-600", border: "border-slate-200" },
  };

  const activeCount = allProperties.filter((p) => p.status === "active").length;
  const totalValue = allProperties.reduce((sum, p) => sum + (Number(p.price_thb) || 0), 0);

  const propertyTypeIcons: Record<string, string> = {
    villa: "🏡",
    condo: "🏢",
    apartment: "🏢",
    house: "🏠",
    townhouse: "🏘️",
    land: "🌿",
    commercial: "🏪",
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-2 mb-1">
          <Building2 className="h-4 w-4 text-primary" />
          <p className="text-xs font-medium text-primary uppercase tracking-wider">Property Management</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Property Listings</h1>
            <p className="text-muted-foreground mt-0.5">{allProperties.length} properties in your portfolio</p>
          </div>
          <Link
            href="/dashboard/listings/new"
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-emerald-600 px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:shadow-md transition-all duration-200 hover-lift"
          >
            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90 duration-300" />
            Add Property
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8 animate-stagger">
        <div className="relative overflow-hidden rounded-2xl border bg-card p-5 animate-slide-up">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600" />
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Active Listings</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
              <Home className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight">{activeCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">of {allProperties.length} total</p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border bg-card p-5 animate-slide-up">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Portfolio Value</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold tracking-tight">
            {totalValue > 0 ? `฿${(totalValue / 1_000_000).toFixed(1)}M` : "—"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Total listing value</p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border bg-card p-5 animate-slide-up">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-600" />
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Property Types</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-sm">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight">
            {new Set(allProperties.map((p) => p.property_type)).size}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Unique types</p>
        </div>
      </div>

      <SectionExplainer
        title="Property Listings"
        icon="🏠"
        description="All your property listings — villas, condos, apartments, land, townhouses"
        status="working"
        statusLabel="Working — photos and editing coming soon"
        steps={[
          "Add a property by telling the bot: \"New villa in Kata, 3 bedrooms, 2 bathrooms, 5.5 million baht, private pool and sea view\"",
          "Or click the green 'Add Property' button above to use a form",
          "Properties appear here and on the public website automatically",
          "Tell the bot when a property is sold or rented — it updates the status",
        ]}
        requirements={[
          { label: "Add all current TTT Properties listings", done: false, note: "Do this via the bot — one property at a time, just describe each one naturally" },
          { label: "Property photos", done: false, note: "Coming soon — you'll be able to send photos to the bot for each property" },
          { label: "Property detail pages (public website)", done: false, note: "Iain will build individual property pages that clients can browse" },
          { label: "Edit properties in dashboard", done: false, note: "Coming soon — for now tell the bot to update any details" },
        ]}
      />

      {allProperties.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center animate-fade-in">
          <div className="h-16 w-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-4">
            <Building2 className="h-8 w-8 text-primary/30" />
          </div>
          <h3 className="text-lg font-semibold">No listings yet</h3>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Add your first property using the button above, or send details to the Telegram bot.
          </p>
          <Link
            href="/dashboard/listings/new"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-emerald-600 px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            Add Your First Property
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block rounded-2xl border bg-card overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <h2 className="font-semibold tracking-tight">All Properties</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Manage and track your portfolio</p>
              </div>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Property</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Type</th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Area</th>
                  <th className="text-center p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Beds</th>
                  <th className="text-center p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Baths</th>
                  <th className="text-right p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Price</th>
                  <th className="text-center p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                  <th className="text-center p-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Listing</th>
                </tr>
              </thead>
              <tbody>
                {allProperties.map((p, i) => {
                  const status = statusConfig[p.status] || statusConfig.archived;
                  return (
                    <tr
                      key={p.id}
                      className="group border-b last:border-b-0 hover:bg-primary/[0.02] transition-colors duration-150"
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm">{propertyTypeIcons[p.property_type || ""] || "🏠"}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{p.title_en}</p>
                            {p.title_th && <p className="text-xs text-muted-foreground truncate">{p.title_th}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 capitalize text-muted-foreground">{p.property_type}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{p.area_district || "—"}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">{p.bedrooms || "—"}</td>
                      <td className="p-4 text-center">{p.bathrooms || "—"}</td>
                      <td className="p-4 text-right">
                        <span className="font-bold text-primary">
                          {p.price_thb ? `฿${Number(p.price_thb).toLocaleString()}` : "TBD"}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-semibold ${status.bg} ${status.border}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </td>
                      <td className="p-4 text-center capitalize text-xs font-medium text-muted-foreground">
                        {p.listing_type?.replace("_", "/") || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3 animate-stagger">
            {allProperties.map((p, i) => {
              const status = statusConfig[p.status] || statusConfig.archived;
              return (
                <div
                  key={p.id}
                  className="group rounded-2xl border bg-card p-4 hover:border-primary/20 transition-all duration-200 animate-slide-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0">
                        <span className="text-base">{propertyTypeIcons[p.property_type || ""] || "🏠"}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{p.title_en}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <MapPin className="h-3 w-3" />
                          {p.area_district || "No area"} · {p.property_type}
                        </div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[10px] font-semibold flex-shrink-0 ${status.bg} ${status.border}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                      {status.label}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {p.bedrooms && (
                        <span className="flex items-center gap-1">
                          <Bed className="h-3 w-3" />
                          {p.bedrooms}
                        </span>
                      )}
                      {p.bathrooms && (
                        <span className="flex items-center gap-1">
                          <Bath className="h-3 w-3" />
                          {p.bathrooms}
                        </span>
                      )}
                      <span className="capitalize">{p.listing_type?.replace("_", "/") || "—"}</span>
                    </div>
                    <span className="font-bold text-sm text-primary">
                      {p.price_thb ? `฿${Number(p.price_thb).toLocaleString()}` : "TBD"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

import { notFound } from "next/navigation";
import { MapPin, Home, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { supabase } from "@/lib/db/supabase-server";
import { AREA_GUIDES } from "@/lib/area-guides";

type Props = {
  params: Promise<{ area: string; locale: string }>;
};

export default async function AreaGuidePage({ params }: Props) {
  const { area, locale } = await params;
  const guide = AREA_GUIDES[area];

  if (!guide) notFound();

  const name = locale === "th" ? guide.name_th : guide.name_en;
  const tagline = locale === "th" ? guide.tagline_th : guide.tagline_en;
  const description = locale === "th" ? guide.description_th : guide.description_en;

  // Count active properties in this area
  const { count: propertyCount } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true })
    .eq("area_district", guide.name_en);

  // Get a few featured properties
  const { data: featured } = await supabase
    .from("properties")
    .select("*")
    .eq("area_district", guide.name_en)
    .limit(3);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold">{name}</h1>
      <p className="mt-2 text-lg text-muted-foreground">{tagline}</p>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {/* Hero image placeholder */}
        <div className="aspect-square rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
          <MapPin className="h-12 w-12 text-emerald-600/50" />
        </div>

        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-6">
              <h3 className="flex items-center gap-2 font-semibold text-sm">
                <Home className="h-4 w-4 text-emerald-600" /> Properties
              </h3>
              <p className="mt-2 text-2xl font-bold">{propertyCount ?? 0}</p>
              <p className="text-xs text-muted-foreground">Active listings</p>
            </div>
            <div className="rounded-lg border p-6">
              <h3 className="flex items-center gap-2 font-semibold text-sm">
                <TrendingUp className="h-4 w-4 text-emerald-600" /> Avg. Price
              </h3>
              <p className="mt-2 text-lg font-bold">{guide.avgPriceSqm.split(" - ")[0]}</p>
              <p className="text-xs text-muted-foreground">Per sqm</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">{description}</p>

          {/* Highlights */}
          <div>
            <h3 className="font-semibold mb-2">Highlights</h3>
            <div className="flex flex-wrap gap-2">
              {guide.highlights.map((h) => (
                <span key={h} className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs text-emerald-700">
                  {h}
                </span>
              ))}
            </div>
          </div>

          {/* Property types */}
          <div>
            <h3 className="font-semibold mb-2">Property Types</h3>
            <div className="flex gap-2">
              {guide.propertyTypes.map((t) => (
                <span key={t} className="capitalize rounded-lg border px-3 py-1 text-xs font-medium">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <Link
            href={`/properties?area=${guide.name_en}`}
            className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 text-sm font-medium text-white hover:bg-emerald-500"
          >
            View Properties in {guide.name_en} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Featured properties */}
      {featured && featured.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold">Featured in {guide.name_en}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <Link key={p.id} href={`/properties/${p.slug}`} className="group overflow-hidden rounded-xl border transition hover:shadow-lg">
                <div className="aspect-[4/3] bg-muted" />
                <div className="p-4">
                  <h3 className="font-semibold group-hover:text-emerald-600">{p.title_en}</h3>
                  <p className="mt-1 text-lg font-bold text-emerald-600">
                    {p.price_thb ? `฿${Number(p.price_thb).toLocaleString()}` : "Price on request"}
                  </p>
                  {p.bedrooms && (
                    <p className="mt-1 text-xs text-muted-foreground">{p.bedrooms} bed {p.bathrooms ? `· ${p.bathrooms} bath` : ""}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

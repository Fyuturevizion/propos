import { getTranslations } from "next-intl/server";
import { Search, SlidersHorizontal } from "lucide-react";
import { supabase } from "@/lib/db/supabase-server";
import { PropertyGrid } from "@/components/properties/property-grid";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const t = await getTranslations("properties");
  const params = await searchParams;

  // Build query
  let query = supabase
    .from("properties")
    .select("*")
    .eq("status", "active");

  if (params.type && typeof params.type === "string") {
    query = query.eq("property_type", params.type);
  }
  if (params.area && typeof params.area === "string") {
    query = query.eq("area_district", params.area);
  }
  if (params.listingType && typeof params.listingType === "string") {
    query = query.eq("listing_type", params.listingType);
  }
  if (params.bedrooms && typeof params.bedrooms === "string") {
    query = query.gte("bedrooms", parseInt(params.bedrooms));
  }

  query = query.limit(50);

  let allProperties: any[] = [];
  try {
    const { data } = await query;
    allProperties = data ?? [];
  } catch (e) {
    // DB not available
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground">
          {allProperties.length} {allProperties.length === 1 ? "property" : "properties"} found
        </p>
      </div>

      {/* Filters bar */}
      <form className="mb-8 flex flex-wrap items-center gap-3 rounded-lg border bg-muted/30 p-4">
        <div className="flex flex-1 items-center gap-2 rounded-md border bg-background px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            name="area"
            defaultValue={params.area as string || ""}
            placeholder={t("filters.area")}
            className="flex-1 bg-transparent text-sm outline-none"
          />
        </div>
        <select
          name="type"
          defaultValue={params.type as string || ""}
          className="rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="">{t("filters.type")}</option>
          <option value="villa">{t("types.villa")}</option>
          <option value="condo">{t("types.condo")}</option>
          <option value="land">{t("types.land")}</option>
          <option value="townhouse">{t("types.townhouse")}</option>
          <option value="apartment">{t("types.apartment")}</option>
        </select>
        <select
          name="listingType"
          defaultValue={params.listingType as string || ""}
          className="rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="">{t("filters.listingType")}</option>
          <option value="sale">{t("listing.sale")}</option>
          <option value="rent">{t("listing.rent")}</option>
          <option value="sale_rent">{t("listing.sale_rent")}</option>
        </select>
        <select
          name="bedrooms"
          defaultValue={params.bedrooms as string || ""}
          className="rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="">{t("filters.bedrooms")}</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="5">5+</option>
        </select>
        <button
          type="submit"
          className="flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Search
        </button>
      </form>

      {/* Results */}
      {allProperties.length > 0 ? (
        <PropertyGrid properties={allProperties} />
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-20 text-center">
          <Search className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">No properties yet</h3>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Properties will appear here once they are added via the dashboard or Telegram bot.
          </p>
        </div>
      )}
    </div>
  );
}

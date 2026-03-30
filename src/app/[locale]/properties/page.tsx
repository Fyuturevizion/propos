import { useTranslations } from "next-intl";
import { Search, SlidersHorizontal } from "lucide-react";

export default function PropertiesPage() {
  const t = useTranslations("properties");

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Filters bar */}
      <div className="mb-8 flex flex-wrap items-center gap-3 rounded-lg border bg-muted/30 p-4">
        <div className="flex flex-1 items-center gap-2 rounded-md border bg-background px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("filters.area")}
            className="flex-1 bg-transparent text-sm outline-none"
          />
        </div>
        <select className="rounded-md border bg-background px-3 py-2 text-sm">
          <option value="">{t("filters.type")}</option>
          <option value="villa">{t("types.villa")}</option>
          <option value="condo">{t("types.condo")}</option>
          <option value="land">{t("types.land")}</option>
          <option value="townhouse">{t("types.townhouse")}</option>
        </select>
        <select className="rounded-md border bg-background px-3 py-2 text-sm">
          <option value="">{t("filters.listingType")}</option>
          <option value="sale">For Sale</option>
          <option value="rent">For Rent</option>
        </select>
        <button className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm">
          <SlidersHorizontal className="h-4 w-4" />
          {t("filters.priceRange")}
        </button>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-20 text-center">
        <Search className="h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-medium">No properties yet</h3>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Properties will appear here once they are added via the dashboard.
          Use filters above to search by area, type, and price range.
        </p>
      </div>
    </div>
  );
}

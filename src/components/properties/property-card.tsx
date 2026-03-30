import { Bed, Bath, Maximize, MapPin } from "lucide-react";
import type { Property } from "@/lib/db/schema";

export function PropertyCard({ property }: { property: Property }) {
  return (
    <div className="group overflow-hidden rounded-xl border transition hover:shadow-lg">
      <div className="aspect-[4/3] bg-muted" />
      <div className="p-4">
        <h3 className="font-semibold group-hover:text-emerald-600">{property.titleEn}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" /> {property.areaDistrict}
        </p>
        <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
          {property.bedrooms && <span className="flex items-center gap-1"><Bed className="h-3.5 w-3.5" /> {property.bedrooms}</span>}
          {property.bathrooms && <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" /> {property.bathrooms}</span>}
          {property.areaSqm && <span className="flex items-center gap-1"><Maximize className="h-3.5 w-3.5" /> {property.areaSqm} sqm</span>}
        </div>
        <div className="mt-3 text-lg font-bold text-emerald-600">
          ฿{property.priceThb ? Number(property.priceThb).toLocaleString() : '--'}
        </div>
      </div>
    </div>
  );
}

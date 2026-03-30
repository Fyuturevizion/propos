import { notFound } from "next/navigation";
import { PHUKET_AREAS } from "@/lib/constants";
import { MapPin, Home, TrendingUp } from "lucide-react";
import { Link } from "@/i18n/routing";

type Props = {
  params: Promise<{ area: string; locale: string }>;
};

export default async function AreaGuidePage({ params }: Props) {
  const { area, locale } = await params;
  const areaData = PHUKET_AREAS.find((a) => a.slug === area);

  if (!areaData) notFound();

  const name = locale === "th" ? areaData.name_th : areaData.name_en;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold">{name}</h1>
      <p className="mt-2 text-muted-foreground">
        Phuket area guide — {areaData.name_en}
      </p>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {/* Map placeholder */}
        <div className="aspect-square rounded-xl bg-muted flex items-center justify-center">
          <MapPin className="h-12 w-12 text-muted-foreground/30" />
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border p-6">
            <h3 className="flex items-center gap-2 font-semibold">
              <Home className="h-5 w-5 text-emerald-600" /> Properties Available
            </h3>
            <p className="mt-2 text-2xl font-bold">--</p>
            <p className="text-sm text-muted-foreground">Active listings in {areaData.name_en}</p>
          </div>
          <div className="rounded-lg border p-6">
            <h3 className="flex items-center gap-2 font-semibold">
              <TrendingUp className="h-5 w-5 text-emerald-600" /> Average Price
            </h3>
            <p className="mt-2 text-2xl font-bold">฿ --</p>
            <p className="text-sm text-muted-foreground">Per square meter</p>
          </div>
          <Link
            href={`/properties?area=${area}`}
            className="block rounded-lg bg-emerald-600 py-3 text-center text-sm font-medium text-white hover:bg-emerald-500"
          >
            View Properties in {areaData.name_en}
          </Link>
        </div>
      </div>
    </div>
  );
}

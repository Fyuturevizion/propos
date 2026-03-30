import { notFound } from "next/navigation";
import { ArrowLeft, Bed, Bath, Maximize, MapPin } from "lucide-react";
import { Link } from "@/i18n/routing";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;

  // TODO: Fetch property by slug from database
  // const property = await db.query.properties.findFirst({ where: eq(properties.slug, slug) });
  // if (!property) notFound();

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <Link href="/properties" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to listings
      </Link>

      {/* Placeholder property detail */}
      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Gallery placeholder */}
          <div className="aspect-video rounded-xl bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">Property gallery for: {slug}</p>
          </div>

          <h1 className="mt-6 text-2xl font-bold">Property Title</h1>
          <p className="mt-1 flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" /> Phuket, Thailand
          </p>

          <div className="mt-6 flex gap-6 text-sm">
            <span className="flex items-center gap-1"><Bed className="h-4 w-4" /> 3 Beds</span>
            <span className="flex items-center gap-1"><Bath className="h-4 w-4" /> 2 Baths</span>
            <span className="flex items-center gap-1"><Maximize className="h-4 w-4" /> 250 sqm</span>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold">Description</h2>
            <p className="mt-3 text-muted-foreground">
              Property description will be loaded from the database.
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="rounded-xl border p-6">
          <div className="text-2xl font-bold text-emerald-600">฿ --</div>
          <p className="text-sm text-muted-foreground">Price on request</p>
          <button className="mt-6 w-full rounded-lg bg-emerald-600 py-3 text-sm font-medium text-white hover:bg-emerald-500">
            Book a Viewing
          </button>
          <button className="mt-3 w-full rounded-lg border py-3 text-sm font-medium hover:bg-muted">
            Contact Agent
          </button>
        </div>
      </div>
    </div>
  );
}

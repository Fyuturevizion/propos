import { notFound } from "next/navigation";
import { ArrowLeft, Bed, Bath, Maximize, MapPin, Calendar, Home, Share2, Check } from "lucide-react";
import { Link } from "@/i18n/routing";
import { supabase } from "@/lib/db/supabase-server";
import { PropertyGallery } from "@/components/properties/property-gallery";
import { ContactForm } from "@/components/contact/contact-form";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export default async function PropertyDetailPage({ params }: Props) {
  const { slug, locale } = await params;

  const { data: result } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .limit(1)
    .single();

  const property = result;
  if (!property) notFound();

  const title = locale === "th" && property.title_th ? property.title_th : property.title_en;
  const description = locale === "th" && property.description_th ? property.description_th : property.description_en;
  const images: string[] = (property.images as string[]) || [];
  const features: Record<string, boolean> = (property.features as Record<string, boolean>) || {};

  const formatPrice = (price: string | number | null) => {
    if (!price) return null;
    return Number(price).toLocaleString();
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <Link
        href="/properties"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to listings
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Gallery */}
          <PropertyGallery images={images} />

          {/* Title & Location */}
          <h1 className="mt-6 text-2xl font-bold lg:text-3xl">{title}</h1>
          <p className="mt-1 flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" /> {property.area_district}, Phuket, Thailand
          </p>

          {/* Key Details */}
          <div className="mt-6 flex flex-wrap gap-6 text-sm">
            {property.bedrooms && (
              <span className="flex items-center gap-2 rounded-lg border px-3 py-2">
                <Bed className="h-4 w-4 text-emerald-600" /> {property.bedrooms} Bedrooms
              </span>
            )}
            {property.bathrooms && (
              <span className="flex items-center gap-2 rounded-lg border px-3 py-2">
                <Bath className="h-4 w-4 text-emerald-600" /> {property.bathrooms} Bathrooms
              </span>
            )}
            {property.area_sqm && (
              <span className="flex items-center gap-2 rounded-lg border px-3 py-2">
                <Maximize className="h-4 w-4 text-emerald-600" /> {property.area_sqm} sqm
              </span>
            )}
            {property.land_area_sqm && (
              <span className="flex items-center gap-2 rounded-lg border px-3 py-2">
                <Maximize className="h-4 w-4 text-emerald-600" /> {property.land_area_sqm} sqm land
              </span>
            )}
            {property.year_built && (
              <span className="flex items-center gap-2 rounded-lg border px-3 py-2">
                <Calendar className="h-4 w-4 text-emerald-600" /> Built {property.year_built}
              </span>
            )}
            {property.listing_type && (
              <span className="flex items-center gap-2 rounded-lg border px-3 py-2 capitalize">
                <Home className="h-4 w-4 text-emerald-600" /> {property.listing_type.replace("_", "/")}
              </span>
            )}
          </div>

          {/* Description */}
          {description && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold">Description</h2>
              <p className="mt-3 whitespace-pre-line text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          )}

          {/* Features */}
          {Object.keys(features).length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold">Features</h2>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {Object.entries(features)
                  .filter(([, v]) => v)
                  .map(([key]) => (
                    <span key={key} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-emerald-600" />
                      {key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                  ))}
              </div>
            </div>
          )}

          {/* Details Table */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold">Property Details</h2>
            <div className="mt-3 grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              {property.ownership_type && (
                <>
                  <span className="text-muted-foreground">Ownership</span>
                  <span className="capitalize font-medium">{property.ownership_type}</span>
                </>
              )}
              {property.foreign_quota_available !== null && (
                <>
                  <span className="text-muted-foreground">Foreign Quota</span>
                  <span className="font-medium">{property.foreign_quota_available ? "Available" : "N/A"}</span>
                </>
              )}
              {property.property_type && (
                <>
                  <span className="text-muted-foreground">Property Type</span>
                  <span className="capitalize font-medium">{property.property_type}</span>
                </>
              )}
              {property.address && (
                <>
                  <span className="text-muted-foreground">Address</span>
                  <span className="font-medium">{property.address}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-xl border p-6 sticky top-20">
            {/* Price */}
            <div className="text-2xl font-bold text-emerald-600">
              {property.price_thb ? `฿${formatPrice(property.price_thb)}` : "Price on request"}
            </div>
            {property.rental_price_thb && (
              <p className="text-sm text-muted-foreground">
                Rent: ฿{formatPrice(property.rental_price_thb)}/month
              </p>
            )}
            <p className="mt-1 text-xs text-muted-foreground capitalize">{property.listing_type?.replace("_", " / ")}</p>

            {/* CTA buttons */}
            <a
              href="#enquiry"
              className="mt-6 block w-full rounded-lg bg-emerald-600 py-3 text-center text-sm font-medium text-white hover:bg-emerald-500"
            >
              Book a Viewing
            </a>
            <Link
              href="/contact"
              className="mt-3 block w-full rounded-lg border py-3 text-center text-sm font-medium hover:bg-muted"
            >
              Contact Agent
            </Link>
            <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border py-3 text-sm font-medium hover:bg-muted">
              <Share2 className="h-4 w-4" /> Share
            </button>
          </div>

          {/* Enquiry Form */}
          <div id="enquiry" className="rounded-xl border p-6">
            <h3 className="font-semibold">Quick Enquiry</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Interested in this property? Send us a message.
            </p>
            <div className="mt-4">
              <ContactForm
                propertySlug={slug}
                propertyTitle={title}
                compact
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

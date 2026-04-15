"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    titleEn: "",
    titleTh: "",
    propertyType: "villa",
    listingType: "sale",
    priceThb: "",
    rentalPriceThb: "",
    bedrooms: "",
    bathrooms: "",
    areaSqm: "",
    areaDistrict: "",
    description: "",
    ownershipType: "freehold",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const slug = form.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now().toString(36);

    await fetch("/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        slug,
        priceThb: form.priceThb || null,
        rentalPriceThb: form.rentalPriceThb || null,
        bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
        bathrooms: form.bathrooms ? parseInt(form.bathrooms) : null,
        areaSqm: form.areaSqm || null,
      }),
    });

    router.push("/dashboard/listings");
    router.refresh();
  };

  const input = (name: string, label: string, placeholder: string, type = "text") => (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        value={(form as any)[name]}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        placeholder={placeholder}
        className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
      />
    </div>
  );

  const select = (name: string, label: string, options: { value: string; label: string }[]) => (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <select
        value={(form as any)[name]}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );

  return (
    <div>
      <Link href="/dashboard/listings" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to listings
      </Link>

      <h1 className="text-2xl font-bold mb-6">Add New Property</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="grid gap-4 sm:grid-cols-2">
          {input("titleEn", "Title (English)", "3 Bed Villa with Pool in Kata")}
          {input("titleTh", "Title (Thai)", "วิลล่า 3 ห้องนอน สระว่ายน้ำ กะตะ")}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {select("propertyType", "Property Type", [
            { value: "villa", label: "Villa" },
            { value: "condo", label: "Condo" },
            { value: "apartment", label: "Apartment" },
            { value: "townhouse", label: "Townhouse" },
            { value: "land", label: "Land" },
          ])}
          {select("listingType", "Listing Type", [
            { value: "sale", label: "For Sale" },
            { value: "rent", label: "For Rent" },
            { value: "sale_rent", label: "Sale / Rent" },
          ])}
          {select("ownershipType", "Ownership", [
            { value: "freehold", label: "Freehold" },
            { value: "leasehold", label: "Leasehold" },
            { value: "company", label: "Company" },
          ])}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {input("priceThb", "Price (THB)", "5500000")}
          {input("rentalPriceThb", "Rental Price (THB/month)", "35000")}
        </div>

        <div className="grid gap-4 sm:grid-cols-4">
          {input("bedrooms", "Bedrooms", "3")}
          {input("bathrooms", "Bathrooms", "2")}
          {input("areaSqm", "Area (sqm)", "250")}
          {input("areaDistrict", "District", "Kata")}
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            placeholder="Describe the property..."
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50">
            {loading ? "Saving..." : "Create Property"}
          </button>
          <Link href="/dashboard/listings" className="rounded-lg border px-6 py-2.5 text-sm font-medium hover:bg-muted">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

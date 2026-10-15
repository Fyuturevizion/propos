"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import { DriveImageField } from "@/components/dashboard/drive-image-field";
import {
  normalizeImageInputs,
  parseImageLines,
  storedImagesToPasteLines,
} from "@/lib/images/google-drive";

export default function EditListingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [titleEn, setTitleEn] = useState("");
  const [slug, setSlug] = useState("");
  const [imageUrls, setImageUrls] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/properties/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Property not found");
        return res.json();
      })
      .then((p) => {
        setTitleEn(p.title_en || "");
        setSlug(p.slug || "");
        const imgs = (p.images as string[] | null) ?? [];
        setImageUrls(storedImagesToPasteLines(imgs));
      })
      .catch(() => setError("Could not load this listing."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const images = normalizeImageInputs(parseImageLines(imageUrls));

    const res = await fetch(`/api/properties/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        images: images.length ? images : [],
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Save failed");
      setSaving(false);
      return;
    }

    router.push("/dashboard/listings");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading listing…
      </div>
    );
  }

  if (error && !titleEn) {
    return (
      <div className="max-w-lg mx-auto py-12 text-center">
        <p className="text-destructive">{error}</p>
        <Link href="/dashboard/listings" className="mt-4 inline-block text-sm text-primary">
          Back to listings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <Link
        href="/dashboard/listings"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to listings
      </Link>

      <h1 className="text-2xl font-bold mb-1">Listing photos</h1>
      <p className="text-muted-foreground text-sm mb-6">{titleEn}</p>

      {slug && (
        <Link
          href={`/en/properties/${slug}`}
          target="_blank"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          View on website <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <DriveImageField value={imageUrls} onChange={setImageUrls} />

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save photos"}
          </button>
          <Link
            href="/dashboard/listings"
            className="rounded-lg border px-6 py-2.5 text-sm font-medium hover:bg-muted"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

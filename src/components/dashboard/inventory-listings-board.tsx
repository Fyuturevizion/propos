"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  Upload,
  Loader2,
  Globe,
  GlobeLock,
  ImageIcon,
  ExternalLink,
} from "lucide-react";
import {
  ResizableDataTable,
  type DataTableColumn,
} from "@/components/dashboard/resizable-data-table";
import { resolvePropertyImageUrl } from "@/lib/images/resolve";

export type InventoryRow = {
  id: string;
  property_ref: string;
  listing_type: string;
  location: string | null;
  project_name: string | null;
  photo_url: string | null;
  map_url: string | null;
  price_thb: number | null;
  price_raw: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  beds_baths_raw: string | null;
  gallery_files: string[] | null;
  is_published: boolean;
  published_property_id: string | null;
  photos_synced_at: string | null;
};

type Props = {
  initialRows: InventoryRow[];
  publishedSlugs: Record<string, string>;
};

type RowAction = "publish" | "unpublish" | "sync" | null;

export function InventoryListingsBoard({
  initialRows,
  publishedSlugs,
}: Props) {
  const [rows, setRows] = useState(initialRows);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyRef, setBusyRef] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<RowAction>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const runAction = useCallback(async (propertyRef: string, action: RowAction) => {
    if (!action) return;
    setBusyRef(propertyRef);
    setBusyAction(action);
    setError(null);
    setMessage(null);

    const path =
      action === "publish"
        ? "publish"
        : action === "unpublish"
          ? "unpublish"
          : "sync-photos";

    try {
      const res = await fetch(
        `/api/inventory/${encodeURIComponent(propertyRef)}/${path}`,
        { method: "POST" }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || `${action} failed`);
        return;
      }

      setRows((prev) =>
        prev.map((row) => {
          if (row.property_ref !== propertyRef) return row;
          if (action === "publish") {
            return {
              ...row,
              is_published: true,
              gallery_files: data.imageRefs ?? row.gallery_files,
              photos_synced_at: data.syncedAt ?? row.photos_synced_at,
            };
          }
          if (action === "unpublish") {
            return { ...row, is_published: false };
          }
          if (action === "sync") {
            return {
              ...row,
              gallery_files: data.imageRefs ?? row.gallery_files,
              photos_synced_at: data.syncedAt ?? new Date().toISOString(),
            };
          }
          return row;
        })
      );

      if (action === "publish") {
        setMessage(
          `${propertyRef} published with ${data.imageCount ?? 0} photo(s).`
        );
      } else if (action === "sync") {
        setMessage(
          `${propertyRef}: synced ${data.imageRefs?.length ?? 0} photo(s).`
        );
      } else {
        setMessage(`${propertyRef} removed from the public site.`);
      }
    } catch {
      setError("Network error — try again.");
    } finally {
      setBusyRef(null);
      setBusyAction(null);
    }
  }, []);

  const columns = useMemo<DataTableColumn<InventoryRow>[]>(
    () => [
      {
        id: "ref",
        header: "Ref",
        width: 88,
        minWidth: 72,
        cell: (r) => <span className="font-semibold">{r.property_ref}</span>,
      },
      {
        id: "project",
        header: "Project",
        width: 160,
        minWidth: 100,
        cell: (r) => r.project_name ?? "—",
      },
      {
        id: "location",
        header: "Location",
        width: 120,
        minWidth: 90,
        cell: (r) => r.location ?? "—",
      },
      {
        id: "type",
        header: "Type",
        width: 72,
        minWidth: 64,
        cell: (r) => (
          <span className="capitalize text-xs font-medium">{r.listing_type}</span>
        ),
      },
      {
        id: "beds",
        header: "Beds",
        width: 64,
        minWidth: 56,
        cell: (r) =>
          r.beds_baths_raw?.includes("/")
            ? r.beds_baths_raw
            : r.bedrooms ?? "—",
      },
      {
        id: "price",
        header: "Price",
        width: 110,
        minWidth: 90,
        cell: (r) =>
          r.price_thb
            ? `฿${Number(r.price_thb).toLocaleString()}`
            : r.price_raw ?? "—",
      },
      {
        id: "media",
        header: "Media",
        width: 100,
        minWidth: 88,
        cell: (r) => {
          const count = r.gallery_files?.length ?? 0;
          const thumb = r.gallery_files?.[0];
          const thumbUrl = thumb
            ? resolvePropertyImageUrl(thumb, { width: 80 })
            : null;
          return (
            <div className="flex items-center gap-1.5">
              <div className="h-7 w-7 shrink-0 overflow-hidden rounded-md bg-muted">
                {thumbUrl ? (
                  <img
                    src={thumbUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                )}
              </div>
              <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                {count ? `${count} img` : r.photo_url ? "Drive" : "—"}
              </span>
              {r.photo_url && (
                <a
                  href={r.photo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-primary"
                  title="Open Drive folder"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          );
        },
      },
      {
        id: "site",
        header: "Website",
        width: 100,
        minWidth: 88,
        cell: (r) =>
          r.is_published ? (
            <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
              <Globe className="h-3 w-3" />
              Live
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] text-muted-foreground">
              <GlobeLock className="h-3 w-3" />
              Draft
            </span>
          ),
      },
      {
        id: "actions",
        header: "Actions",
        width: 200,
        minWidth: 180,
        cell: (r) => {
          const loading = busyRef === r.property_ref;
          return (
            <div className="flex flex-wrap gap-1">
              {!r.is_published ? (
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => runAction(r.property_ref, "publish")}
                  className="rounded-md bg-primary px-2 py-1 text-[11px] font-semibold text-primary-foreground disabled:opacity-50"
                >
                  {loading && busyAction === "publish" ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    "Publish"
                  )}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => runAction(r.property_ref, "sync")}
                    className="rounded-md border px-2 py-1 text-[11px] font-medium hover:bg-muted disabled:opacity-50"
                  >
                    {loading && busyAction === "sync" ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      "Sync photos"
                    )}
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => runAction(r.property_ref, "unpublish")}
                    className="rounded-md border border-amber-200 px-2 py-1 text-[11px] font-medium text-amber-900 hover:bg-amber-50 disabled:opacity-50"
                  >
                    Unpublish
                  </button>
                  {publishedSlugs[r.property_ref] && (
                    <a
                      href={`/en/properties/${publishedSlugs[r.property_ref]}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-md border px-2 py-1 text-[11px] font-medium hover:bg-muted"
                    >
                      View
                    </a>
                  )}
                </>
              )}
            </div>
          );
        },
      },
    ],
    [busyRef, busyAction, publishedSlugs, runAction]
  );

  async function onUpload(file: File) {
    setUploading(true);
    setError(null);
    setMessage(null);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/inventory/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed");
        return;
      }
      setMessage(
        `Imported ${data.total} rows (${data.inserted} new, ${data.updated} updated). Refresh to see updates.`
      );
      window.location.reload();
    } catch {
      setError("Upload failed — check your connection.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border bg-card p-4">
        <div>
          <p className="font-semibold">Property inventory (Excel)</p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Upload Property-Listings.xlsx — Photo links from Drive hyperlinks sync on publish.
          </p>
        </div>
        <div>
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onUpload(f);
            }}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Upload spreadsheet
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      {message && (
        <p className="text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
          {message}
        </p>
      )}

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12 border border-dashed rounded-2xl">
          No inventory rows yet. Upload your Excel workbook to get started.
        </p>
      ) : (
        <ResizableDataTable
          rows={rows}
          columns={columns}
          rowKey={(r) => r.id}
        />
      )}
    </div>
  );
}

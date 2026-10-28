"use client";

import { useState } from "react";
import { RefreshCw, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

type SyncResult = {
  tab: string;
  results: Array<{
    ref: string;
    slug: string;
    action: string;
    imageCount: number;
    note?: string;
  }>;
};

export function SheetSyncPanel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [synced, setSynced] = useState<SyncResult[] | null>(null);

  const runSync = async (tab: string) => {
    setLoading(true);
    setError(null);
    setSynced(null);
    try {
      const res = await fetch("/api/sync/wnluxe-sheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tab, limit: 25 }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Sync failed");
        return;
      }
      setSynced(data.synced ?? []);
    } catch {
      setError("Network error during sync.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 rounded-2xl border bg-card p-5 animate-fade-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">Google Sheet → listings</p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Live sync from{" "}
            <a
              href="https://docs.google.com/spreadsheets/d/1tL7C6X7KGcDnVSIrqrmMT0KXzxmzq0q6kgmoqaSoSPg/edit"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary"
            >
              Property Listings sheet
            </a>
            . Photo column hyperlinks → Drive folders; also updates Inventory CRM.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => runSync("Sales")}
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Sync Sales
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => runSync("Rent-Phuket")}
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
          >
            Sync Rent-Phuket
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-3 flex items-start gap-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          {error}
        </p>
      )}

      {synced && (
        <div className="mt-4 space-y-2 text-sm">
          {synced.map((block) => (
            <div key={block.tab}>
              <p className="font-medium flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                {block.tab}: {block.results.length} rows processed
              </p>
              <ul className="mt-1 ml-5 list-disc text-muted-foreground max-h-32 overflow-y-auto">
                {block.results.slice(0, 8).map((r) => (
                  <li key={`${block.tab}-${r.ref}`}>
                    {r.ref} → {r.action} ({r.imageCount} photos)
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

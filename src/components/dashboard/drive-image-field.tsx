"use client";

import { useState } from "react";
import { FolderOpen, Loader2, ImageIcon } from "lucide-react";
import {
  normalizeImageInputs,
  parseImageLines,
} from "@/lib/images/google-drive";
import { resolvePropertyImageUrl } from "@/lib/images/resolve";

type Props = {
  value: string;
  onChange: (value: string) => void;
  folderId?: string;
  label?: string;
};

export function DriveImageField({
  value,
  onChange,
  folderId,
  label = "Photos (Google Drive)",
}: Props) {
  const [loadingFolder, setLoadingFolder] = useState(false);
  const [folderError, setFolderError] = useState<string | null>(null);

  const previewRefs = normalizeImageInputs(parseImageLines(value)).slice(0, 6);

  const loadFromFolder = async () => {
    setLoadingFolder(true);
    setFolderError(null);
    try {
      const qs = folderId ? `?folderId=${encodeURIComponent(folderId)}` : "";
      const res = await fetch(`/api/images/drive/folder${qs}`);
      const data = await res.json();
      if (!res.ok) {
        setFolderError(data.error || "Could not load folder");
        return;
      }
      const refs: string[] = data.imageRefs ?? [];
      if (!refs.length) {
        setFolderError("No images found in that Drive folder.");
        return;
      }
      onChange(refs.join("\n"));
    } catch {
      setFolderError("Network error loading Drive folder.");
    } finally {
      setLoadingFolder(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <label className="text-sm font-medium">{label}</label>
        <button
          type="button"
          onClick={loadFromFolder}
          disabled={loadingFolder}
          className="inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-50"
        >
          {loadingFolder ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <FolderOpen className="h-3.5 w-3.5" />
          )}
          Load WN Luxe Drive folder
        </button>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        placeholder={`Paste Google Drive links (one per line), e.g.\nhttps://drive.google.com/file/d/FILE_ID/view\n\nOr use “Load WN Luxe Drive folder” when Google is connected.`}
        className="w-full rounded-md border px-3 py-2 text-sm font-mono"
      />

      {folderError && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
          {folderError}
        </p>
      )}

      {previewRefs.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <ImageIcon className="h-3.5 w-3.5" /> Preview (via CDN)
          </p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {previewRefs.map((ref) => {
              const src = resolvePropertyImageUrl(ref, { width: 400 });
              return (
                <div
                  key={ref}
                  className="aspect-square overflow-hidden rounded-lg border bg-muted"
                >
                  <img
                    src={src}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

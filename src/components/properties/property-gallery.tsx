"use client";

import { resolvePropertyImageUrl } from "@/lib/images/resolve";

export function PropertyGallery({ images }: { images: string[] }) {
  const resolved = images
    .map((img) => resolvePropertyImageUrl(img, { width: 1600 }))
    .filter(Boolean);

  if (!resolved.length) {
    return <div className="aspect-video rounded-xl bg-muted" />;
  }

  return (
    <div className="grid gap-2">
      <div className="aspect-video overflow-hidden rounded-xl">
        <img
          src={resolved[0]}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
      {resolved.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {resolved.slice(1, 5).map((img, i) => (
            <div key={i} className="aspect-square overflow-hidden rounded-lg">
              <img src={img} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

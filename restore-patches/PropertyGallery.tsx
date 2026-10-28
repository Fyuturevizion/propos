"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export function PropertyGallery({ images }: { images: string[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);
  const thumbs = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, step]);

  useEffect(() => {
    if (open === null) return;
    thumbs.current
      ?.querySelector<HTMLElement>(`[data-index="${open}"]`)
      ?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [open]);

  if (!images.length) {
    return <div className="aspect-video bg-gradient-to-br from-[#18324a] to-[#071523]" />;
  }

  const tiles = [images[0], images[1] ?? images[0], images[2] ?? images[0]];

  return (
    <>
      <div className="relative grid gap-1 overflow-hidden sm:grid-cols-[2fr_1fr] sm:grid-rows-2">
        {tiles.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => setOpen(Math.min(i, images.length - 1))}
            aria-label={`Open photo ${i + 1} of ${images.length}`}
            className={
              i === 0
                ? "relative aspect-[4/3] cursor-zoom-in overflow-hidden sm:row-span-2 sm:aspect-auto sm:min-h-[34rem]"
                : "relative hidden min-h-[16.875rem] cursor-zoom-in overflow-hidden sm:block"
            }
          >
            <Image
              src={src}
              alt={i === 0 ? "Main villa view" : `Villa gallery view ${i + 1}`}
              fill
              sizes={i === 0 ? "(max-width: 640px) 100vw, 66vw" : "33vw"}
              className="object-cover transition duration-700 hover:scale-105"
              preload={i === 0}
            />
          </button>
        ))}
        <button
          type="button"
          onClick={() => setOpen(0)}
          className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/95 px-4 py-3 text-xs font-semibold text-[#071523] shadow-lg backdrop-blur transition hover:bg-white"
        >
          <Images className="h-4 w-4 text-[#9b7b3e]" />
          View all {images.length} photos
        </button>
      </div>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo gallery"
          className="fixed inset-0 z-[100] flex flex-col bg-[#071523]/97 text-white backdrop-blur"
        >
          <div className="flex items-center justify-between px-5 py-4 text-xs font-semibold tracking-[0.2em] sm:px-8">
            <span className="text-[#c9a96a]">
              {open + 1} / {images.length}
            </span>
            <button type="button" onClick={close} aria-label="Close gallery" className="p-2 hover:text-[#c9a96a]">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div
            className="relative flex-1"
            onClick={(e) => e.target === e.currentTarget && close()}
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
              touchX.current = null;
            }}
          >
            <Image
              key={images[open]}
              src={images[open]}
              alt={`Villa photo ${open + 1}`}
              fill
              sizes="100vw"
              className="pointer-events-none object-contain px-2 sm:px-20"
              preload
            />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous photo"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/10 p-3 transition hover:bg-white/20 sm:left-6"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next photo"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 p-3 transition hover:bg-white/20 sm:right-6"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>

          <div ref={thumbs} className="flex gap-2 overflow-x-auto px-5 py-4 sm:px-8">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                data-index={i}
                onClick={() => setOpen(i)}
                aria-label={`Show photo ${i + 1}`}
                className={`relative h-16 w-24 shrink-0 overflow-hidden transition ${
                  i === open ? "ring-2 ring-[#c9a96a]" : "opacity-50 hover:opacity-100"
                }`}
              >
                <Image src={src} alt="" fill sizes="96px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

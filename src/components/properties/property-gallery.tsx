"use client";
export function PropertyGallery({ images }: { images: string[] }) {
  if (!images.length) {
    return <div className="aspect-video rounded-xl bg-muted" />;
  }

  return (
    <div className="grid gap-2">
      <div className="aspect-video overflow-hidden rounded-xl">
        <img src={images[0]} alt="" className="h-full w-full object-cover" />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.slice(1, 5).map((img, i) => (
            <div key={i} className="aspect-square overflow-hidden rounded-lg">
              <img src={img} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

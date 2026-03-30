import { Share2, Plus } from "lucide-react";

export default function SocialPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Social Media</h1>
          <p className="mt-1 text-muted-foreground">Schedule and publish to Facebook, Instagram, TikTok, and LINE OA</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500">
          <Plus className="h-4 w-4" /> Create Post
        </button>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border p-6 text-center">
          <Share2 className="mx-auto h-10 w-10 text-muted-foreground/30" />
          <h3 className="mt-4 font-semibold">Scheduled Posts</h3>
          <p className="mt-2 text-sm text-muted-foreground">No posts scheduled</p>
        </div>
        <div className="rounded-xl border p-6 text-center">
          <Share2 className="mx-auto h-10 w-10 text-muted-foreground/30" />
          <h3 className="mt-4 font-semibold">Published Posts</h3>
          <p className="mt-2 text-sm text-muted-foreground">No posts published yet</p>
        </div>
      </div>
    </div>
  );
}

import type { Viewing } from "@/lib/db/schema";
import { CalendarDays } from "lucide-react";

export function UpcomingViewings({ viewings }: { viewings: Viewing[] }) {
  if (!viewings.length) {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <CalendarDays className="h-10 w-10 text-muted-foreground/30" />
        <p className="mt-3 text-sm text-muted-foreground">No upcoming viewings</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {viewings.slice(0, 5).map((v) => (
        <div key={v.id} className="flex items-center justify-between rounded-lg border p-3">
          <div>
            <div className="font-medium">Viewing</div>
            <div className="text-xs text-muted-foreground">
              {new Date(v.scheduledAt).toLocaleDateString()} at{" "}
              {new Date(v.scheduledAt).toLocaleTimeString()}
            </div>
          </div>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
            {v.status}
          </span>
        </div>
      ))}
    </div>
  );
}

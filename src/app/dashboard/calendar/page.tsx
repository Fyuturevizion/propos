import Link from "next/link";
import { CalendarDays } from "lucide-react";

export default function CalendarPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Calendar</h1>
      <p className="mt-1 text-muted-foreground">Viewings, meetings, and appointments synced from Google Calendar</p>

      <div className="mt-8 flex flex-col items-center rounded-xl border py-20 text-center">
        <CalendarDays className="h-12 w-12 text-muted-foreground/30" />
        <h3 className="mt-4 text-lg font-medium">Google Calendar Integration</h3>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Connect your Google Calendar in Settings to sync viewings and appointments.
          The AI assistant will manage bookings and send reminders automatically.
        </p>
        <Link href="/dashboard/settings" className="mt-4 text-sm font-medium text-emerald-600 hover:underline">
          Go to Settings →
        </Link>
      </div>
    </div>
  );
}

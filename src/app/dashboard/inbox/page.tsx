import { Inbox, MessageCircle } from "lucide-react";

export default function InboxPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Unified Inbox</h1>
      <p className="mt-1 text-muted-foreground">All messages from WhatsApp, Telegram, LINE, and website in one place</p>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {/* Channel filters */}
        <div className="rounded-xl border p-4 lg:col-span-1">
          <h3 className="text-sm font-semibold text-muted-foreground">Channels</h3>
          <div className="mt-3 space-y-2">
            {["All", "WhatsApp", "Telegram", "LINE", "Website", "Email"].map((ch) => (
              <button key={ch} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted">
                <MessageCircle className="h-4 w-4" />
                {ch}
              </button>
            ))}
          </div>
        </div>

        {/* Message list */}
        <div className="rounded-xl border p-6 lg:col-span-2">
          <div className="flex flex-col items-center py-12 text-center">
            <Inbox className="h-12 w-12 text-muted-foreground/30" />
            <h3 className="mt-4 text-lg font-medium">No messages yet</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Conversations from WhatsApp, Telegram, LINE, and website will appear here automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

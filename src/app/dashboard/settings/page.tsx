import { Settings, Key, Bot, Bell, User } from "lucide-react";

const sections = [
  { id: "profile", icon: User, label: "Profile", description: "Your account details and preferences" },
  { id: "api", icon: Key, label: "API Keys", description: "Supabase, OpenAI, LINE, WhatsApp, Telegram credentials" },
  { id: "ai", icon: Bot, label: "AI Configuration", description: "System prompt, model selection, tool settings" },
  { id: "notifications", icon: Bell, label: "Notifications", description: "Alert preferences and daily briefing schedule" },
];

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="mt-1 text-muted-foreground">Configure your PropOS platform</p>

      <div className="mt-8 space-y-4">
        {sections.map(({ id, icon: Icon, label, description }) => (
          <div key={id} className="flex items-center gap-4 rounded-xl border p-6 hover:bg-muted/50 transition cursor-pointer">
            <Icon className="h-8 w-8 text-muted-foreground" />
            <div>
              <h3 className="font-semibold">{label}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

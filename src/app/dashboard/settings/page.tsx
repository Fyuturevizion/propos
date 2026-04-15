import { getAgent } from "@/lib/auth";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { BuildnetTrigger } from "@/components/dashboard/buildnet-trigger";
import {
  User,
  Mail,
  Shield,
  Key,
  KeyRound,
  Globe,
  Bot,
  Calendar,
  LogOut,
  Info,
  Cog,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { agent } = await getAgent();

  const apiKeys = [
    {
      label: "WhatsApp Business",
      env: "WHATSAPP_ACCESS_TOKEN",
      icon: Globe,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      label: "LINE Channel",
      env: "LINE_CHANNEL_ACCESS_TOKEN",
      icon: Globe,
      gradient: "from-green-400 to-lime-500",
    },
    {
      label: "OpenAI",
      env: "OPENAI_API_KEY",
      icon: Bot,
      gradient: "from-violet-500 to-purple-600",
    },
    {
      label: "Google Calendar",
      env: "GOOGLE_CLIENT_ID",
      icon: Calendar,
      gradient: "from-blue-500 to-indigo-600",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-sm">
            <Cog className="h-3.5 w-3.5" />
          </div>
          <p className="text-xs font-medium text-primary uppercase tracking-wider">
            Configuration
          </p>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-0.5">
          Account and configuration
        </p>
      </div>

      <div className="space-y-5 animate-stagger">
        {/* Profile Card */}
        <div className="rounded-2xl border bg-card overflow-hidden animate-slide-up">
          <div className="flex items-center gap-2 border-b px-5 py-4">
            <User className="h-4 w-4 text-primary" />
            <h2 className="font-semibold tracking-tight">Profile</h2>
          </div>
          <div className="p-5">
            {/* Avatar + name row */}
            <div className="flex items-center gap-4 mb-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5">
                <span className="text-xl font-bold text-primary">
                  {(agent.fullName || agent.email || "?")[0]?.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-lg font-semibold">{agent.fullName || "Agent"}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="rounded-full border px-2 py-0.5 text-[10px] font-semibold bg-primary/5 text-primary capitalize">
                    {agent.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Info rows */}
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border bg-background/50 p-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                    <User className="h-4 w-4 text-blue-500" />
                  </div>
                  <span className="text-sm text-muted-foreground">Full Name</span>
                </div>
                <span className="text-sm font-medium">
                  {agent.fullName || "—"}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border bg-background/50 p-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
                    <Mail className="h-4 w-4 text-amber-500" />
                  </div>
                  <span className="text-sm text-muted-foreground">Email</span>
                </div>
                <span className="text-sm font-medium">{agent.email}</span>
              </div>

              <div className="flex items-center justify-between rounded-xl border bg-background/50 p-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50">
                    <Shield className="h-4 w-4 text-purple-500" />
                  </div>
                  <span className="text-sm text-muted-foreground">Role</span>
                </div>
                <span className="text-sm font-medium capitalize">
                  {agent.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* API Keys Card */}
        <div className="rounded-2xl border bg-card overflow-hidden animate-slide-up">
          <div className="flex items-center gap-2 border-b px-5 py-4">
            <KeyRound className="h-4 w-4 text-primary" />
            <h2 className="font-semibold tracking-tight">API Keys</h2>
          </div>
          <div className="p-5 space-y-3">
            {apiKeys.map((item) => (
              <div
                key={item.env}
                className="flex items-center justify-between rounded-xl border bg-background/50 p-3.5 hover:border-primary/20 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${item.gradient} text-white shadow-sm`}
                  >
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      {item.env}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] rounded-full bg-amber-50 text-amber-600 px-2.5 py-1 font-semibold border border-amber-100">
                  Not set
                </span>
              </div>
            ))}

            <div className="flex items-start gap-2 rounded-xl bg-muted/50 p-3.5 mt-3">
              <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Configure API keys in your <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">.env.local</code> file on the server. See{" "}
                <code className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">.env.example</code> for available options.
              </p>
            </div>
          </div>
        </div>

        {/* Hidden easter egg trigger */}
        <div className="animate-slide-up">
          <BuildnetTrigger />
        </div>

        {/* Sign Out Card */}
        <div className="rounded-2xl border border-red-100 bg-red-50/50 overflow-hidden animate-slide-up">
          <div className="flex items-center gap-2 border-b border-red-100 px-5 py-4">
            <LogOut className="h-4 w-4 text-red-500" />
            <h2 className="font-semibold tracking-tight text-red-700">
              Sign Out
            </h2>
          </div>
          <div className="p-5">
            <p className="text-sm text-red-600/80 mb-4">
              Sign out of the admin dashboard. You&apos;ll need to log in again to access your account.
            </p>
            <SignOutButton />
          </div>
        </div>
      </div>
    </div>
  );
}

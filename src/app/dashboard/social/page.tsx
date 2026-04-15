export const dynamic = "force-dynamic";

import { getAgent } from "@/lib/auth";
import { SectionExplainer } from "@/components/dashboard/section-explainer";
import {
  Share2,
  ThumbsUp,
  Camera,
  Send,
  PenSquare,
  CalendarClock,
  Bot,
  Zap,
} from "lucide-react";

export default async function SocialPage() {
  await getAgent();

  const platforms = [
    {
      name: "Facebook",
      icon: ThumbsUp,
      gradient: "from-blue-600 to-blue-700",
      description: "Post to your Facebook Page",
    },
    {
      name: "Instagram",
      icon: Camera,
      gradient: "from-pink-500 to-purple-600",
      description: "Share photos and reels",
    },
    {
      name: "TikTok",
      icon: Share2,
      gradient: "from-slate-800 to-slate-900",
      description: "Short-form video content",
    },
    {
      name: "LINE OA",
      icon: Send,
      gradient: "from-green-500 to-emerald-600",
      description: "Broadcast to LINE followers",
    },
  ];

  const features = [
    {
      icon: PenSquare,
      title: "Compose Posts",
      description: "Write posts for all platforms from one place",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Bot,
      title: "AI Writer",
      description: "Ask the bot to generate posts for you",
      gradient: "from-violet-500 to-purple-600",
    },
    {
      icon: CalendarClock,
      title: "Schedule",
      description: "Schedule posts for the best engagement times",
      gradient: "from-amber-500 to-orange-600",
    },
    {
      icon: Zap,
      title: "Auto-Post",
      description: "New listings automatically shared to all channels",
      gradient: "from-emerald-500 to-teal-600",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-sm">
            <Share2 className="h-3.5 w-3.5" />
          </div>
          <p className="text-xs font-medium text-primary uppercase tracking-wider">
            Publishing
          </p>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Social Media</h1>
        <p className="text-muted-foreground mt-0.5">
          Compose and schedule posts
        </p>
      </div>

      <SectionExplainer
        title="Social Media"
        icon="📱"
        description="Post to Facebook, Instagram, TikTok, and LINE OA from one place"
        status="coming_soon"
        statusLabel="Coming soon — needs social media accounts connected"
        steps={[
          "Tell Iain which social media accounts TTT Properties uses (Facebook, Instagram, TikTok, LINE)",
          "Iain will connect each platform's API",
          "You'll be able to compose posts from here or ask the bot to write them",
          "Schedule posts in advance — the system posts automatically",
        ]}
        requirements={[
          {
            label: "Tell Iain which social accounts you use",
            done: false,
            note: "Facebook Page? Instagram? TikTok? LINE OA? Which ones?",
          },
          {
            label: "Provide account access/API tokens",
            done: false,
            note: "Iain needs admin access to connect each platform",
          },
          {
            label: "Bot-generated posts",
            done: false,
            note: "Coming soon — ask the bot: 'Write a Facebook post about the new Kata villa'",
          },
          {
            label: "Scheduled posting",
            done: false,
            note: "Coming soon — schedule posts for the best time to reach buyers",
          },
        ]}
      />

      {/* Platform cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6 animate-stagger">
        {platforms.map((platform, i) => (
          <div
            key={platform.name}
            className="group relative overflow-hidden rounded-2xl border bg-card p-4 animate-slide-up hover-lift"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {/* Gradient accent */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${platform.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            />

            <div className="flex items-center gap-3 mb-2">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${platform.gradient} text-white shadow-sm opacity-30`}
              >
                <platform.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">{platform.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {platform.description}
                </p>
              </div>
            </div>

            <span className="inline-flex items-center text-[10px] rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground">
              Not connected
            </span>
          </div>
        ))}
      </div>

      {/* Feature preview grid */}
      <div className="rounded-2xl border bg-card overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="font-semibold tracking-tight">
              Social Media Composer
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Everything you need to manage your online presence
            </p>
          </div>
          <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-semibold text-muted-foreground">
            Coming soon
          </span>
        </div>

        <div className="p-5">
          {/* Feature cards */}
          <div className="grid gap-3 sm:grid-cols-2 mb-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex items-start gap-3 rounded-xl border bg-background/50 p-4 hover:border-primary/20 transition-all duration-200"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-sm opacity-20`}
                >
                  <feature.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{feature.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA placeholder */}
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-4">
              <Share2 className="h-7 w-7 text-primary/20" />
            </div>
            <h3 className="text-base font-semibold">
              Ready to go social?
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground leading-relaxed">
              Connect your social media accounts via Ayrshare or PostEverywhere
              API to start publishing from one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

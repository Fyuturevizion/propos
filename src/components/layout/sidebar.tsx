"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Users,
  Building2,
  CalendarDays,
  BarChart3,
  Share2,
  Settings,
  LogOut,
  MessageCircle,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { setChatOpen } from "@/components/chat/chat-widget";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview", exact: true },
  { href: "/dashboard/inbox", icon: Inbox, label: "Inbox" },
  { href: "/dashboard/crm", icon: Users, label: "CRM" },
  { href: "/dashboard/listings", icon: Building2, label: "Listings" },
  { href: "/dashboard/calendar", icon: CalendarDays, label: "Calendar" },
  { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/dashboard/social", icon: Share2, label: "Social" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
  { href: "/dashboard/wiki", icon: BookOpen, label: "Guide" },
];

const mobileTabItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview", exact: true },
  { href: "/dashboard/listings", icon: Building2, label: "Listings" },
  { href: "/dashboard/crm", icon: Users, label: "CRM" },
  { href: "/dashboard/calendar", icon: CalendarDays, label: "Calendar" },
  { href: "#chat", icon: MessageCircle, label: "Chat" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [logoTaps, setLogoTaps] = useState(0);
  const [lastLogoTap, setLastLogoTap] = useState(0);

  const handleLogoTap = () => {
    const now = Date.now();
    if (now - lastLogoTap > 2000) {
      setLogoTaps(1);
    } else {
      const next = logoTaps + 1;
      setLogoTaps(next);
      if (next >= 5) {
        localStorage.setItem("buildnet_discovered", "true");
        router.push("/dashboard/buildnet");
        return;
      }
    }
    setLastLogoTap(now);
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/dashboard/login");
    router.refresh();
  };

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const handleMobileTabClick = (href: string) => {
    if (href === "#chat") {
      setChatOpen(true);
      return;
    }
  };

  const sidebar = (
    <aside className="flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo area */}
      <div className="flex h-16 items-center gap-3 px-5 border-b border-sidebar-border">
        <button
          onClick={handleLogoTap}
          className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:shadow-lg hover:shadow-primary/25 active:scale-95 transition-all duration-200"
        >
          T
          {logoTaps > 0 && logoTaps < 5 && (
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          )}
        </button>
        <div>
          <span className="text-sm font-bold text-sidebar-foreground tracking-tight">TTT Properties</span>
          <p className="text-[10px] text-sidebar-foreground/50 font-medium uppercase tracking-wider">Dashboard</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 p-3 overflow-y-auto">
        <div className="px-3 py-2">
          <span className="text-[10px] font-semibold text-sidebar-foreground/40 uppercase tracking-wider">Menu</span>
        </div>
        {navItems.map(({ href, icon: Icon, label, exact }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
              isActive(href, exact)
                ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
          >
            <Icon className={cn(
              "h-4 w-4 transition-all duration-200",
              isActive(href, exact)
                ? "text-primary"
                : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground/70"
            )} />
            {label}
            {isActive(href, exact) && (
              <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-fade-in-scale" />
            )}
          </Link>
        ))}
      </nav>

      {/* AI Assistant promo */}
      <div className="mx-3 mb-3 rounded-xl bg-primary/5 border border-primary/10 p-3">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold text-primary">AI Assistant</span>
        </div>
        <p className="text-[11px] text-sidebar-foreground/50 leading-relaxed">Ask me anything about your properties and leads</p>
      </div>

      {/* Sign out */}
      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={handleSignOut}
          className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/50 hover:bg-destructive/5 hover:text-destructive transition-all duration-200"
        >
          <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 lg:hidden">
        <div className="flex items-center justify-around h-16 px-2">
          {mobileTabItems.map(({ href, icon: Icon, label, exact }) => {
            const isChatTab = href === "#chat";
            const active = isChatTab ? false : isActive(href, exact);

            if (isChatTab) {
              return (
                <button
                  key={href}
                  onClick={() => handleMobileTabClick(href)}
                  className="relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all duration-200 text-sidebar-foreground/50 active:text-primary"
                >
                  <div className={cn(
                    "flex items-center justify-center rounded-2xl transition-all duration-200",
                    "h-10 w-10"
                  )}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-4.5 w-4.5 text-primary" />
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold leading-tight">{label}</span>
                </button>
              );
            }

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all duration-200",
                  active
                    ? "text-primary"
                    : "text-sidebar-foreground/40 active:text-primary"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center rounded-2xl transition-all duration-200",
                  active ? "h-10 w-10" : "h-10 w-10"
                )}>
                  <Icon className={cn("transition-all duration-200", active ? "h-5 w-5" : "h-5 w-5")} />
                </div>
                <span className={cn(
                  "text-[10px] font-semibold leading-tight transition-all duration-200",
                  active && "text-primary"
                )}>{label}</span>
                {active && (
                  <div className="absolute bottom-1 h-1 w-4 rounded-full bg-primary animate-fade-in-scale" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop sidebar */}
      <div className="hidden lg:block">{sidebar}</div>
    </>
  );
}

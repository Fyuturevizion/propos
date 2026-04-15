"use client";

import { useEffect, useState } from "react";

/**
 * Telegram Web App integration.
 * - Loads the TG Web App SDK
 * - Detects if we're inside a TG Mini App
 * - Provides auto-login via TG user data
 * - Sets app-like viewport (no bounce, full screen)
 */
export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [isTgApp, setIsTgApp] = useState(false);

  useEffect(() => {
    // Load TG Web App SDK
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-web-app.js";
    script.async = true;
    script.onload = () => {
      const tg = (window as any).Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();
        tg.setHeaderColor("#059669");
        tg.setBackgroundColor("#f8fafc");

        // Check if we have TG user data (means we're in a Mini App)
        if (tg.initDataUnsafe?.user?.id) {
          setIsTgApp(true);
          console.log("TG Web App detected, user:", tg.initDataUnsafe.user.id);
        }
      }
    };
    document.head.appendChild(script);

    // Add app-like meta tags
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
      );
    }

    // Prevent overscroll bounce on iOS
    document.body.style.overscrollBehavior = "none";
    document.documentElement.style.overscrollBehavior = "none";

    // Add standalone class for app-like feel
    document.documentElement.classList.add("standalone-app");
  }, []);

  return <>{children}</>;
}

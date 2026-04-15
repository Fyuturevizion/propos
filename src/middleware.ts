import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Dashboard routes — check auth
  if (pathname.startsWith("/dashboard")) {
    // Check TG auth cookie first (set by /api/auth/tg-session)
    const tgUserId = request.cookies.get("tg-auth-user-id")?.value;

    if (tgUserId) {
      // TG authenticated — rewrite to the same URL to bypass any redirect
      return NextResponse.rewrite(new URL(pathname, request.url));
    }

    // Login page is always accessible
    if (pathname === "/dashboard/login") {
      return NextResponse.next();
    }

    // All other dashboard routes need Supabase auth
    const { updateSession } = await import("@/lib/supabase/middleware");
    return await updateSession(request);
  }

  // API routes — skip i18n
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Public routes — apply i18n
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(en|th)/:path*", "/dashboard", "/dashboard/:path*"],
};

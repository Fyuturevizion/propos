import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Dashboard routes — check auth first
  if (pathname.startsWith("/dashboard")) {
    const response = await updateSession(request);
    if (response.status === 307 || response.status === 308) {
      return response;
    }
    return response;
  }

  // API routes — skip i18n
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Public routes — apply i18n
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(en|th)/:path*", "/dashboard/:path*"],
};

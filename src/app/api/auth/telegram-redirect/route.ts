import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // The Telegram Login Widget redirects here with query params
  // Forward to the login page which will read them from the hash
  const url = request.nextUrl.clone();
  url.pathname = "/dashboard/login";
  // Copy all query params to hash params for client-side processing
  const params = url.searchParams;
  const hashParts: string[] = [];
  params.forEach((value, key) => {
    hashParts.push(`${key}=${encodeURIComponent(value)}`);
  });
  url.hash = hashParts.join("&");
  url.search = "";
  return NextResponse.redirect(url);
}

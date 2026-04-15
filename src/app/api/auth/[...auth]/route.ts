import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ auth: string[] }> }
) {
  const { auth } = await params;
  const authPath = auth.join("/");
  // Preserve the full query string (e.g. ?grant_type=password)
  const queryString = request.nextUrl.search || "";
  const targetUrl = `${SUPABASE_URL}/auth/v1/${authPath}${queryString}`;

  try {
    const body = await request.text();

    const resp = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
      },
      body,
    });

    const data = await resp.text();

    const response = new NextResponse(data, {
      status: resp.status,
      headers: { "Content-Type": "application/json" },
    });

    // Forward Set-Cookie headers
    const setCookieHeaders = resp.headers.getSetCookie?.() || [];
    for (const cookie of setCookieHeaders) {
      response.headers.append("Set-Cookie", cookie);
    }

    return response;
  } catch (error) {
    console.error("Auth proxy error:", error);
    return NextResponse.json(
      { error: "Auth service unavailable" },
      { status: 503 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ auth: string[] }> }
) {
  const { auth } = await params;
  const authPath = auth.join("/");
  const queryString = request.nextUrl.search || "";
  const targetUrl = `${SUPABASE_URL}/auth/v1/${authPath}${queryString}`;

  try {
    const authHeader = request.headers.get("authorization") || "";

    const resp = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        ...(authHeader ? { authorization: authHeader } : {}),
      },
    });

    const data = await resp.text();

    const response = new NextResponse(data, {
      status: resp.status,
      headers: { "Content-Type": "application/json" },
    });

    const setCookieHeaders = resp.headers.getSetCookie?.() || [];
    for (const cookie of setCookieHeaders) {
      response.headers.append("Set-Cookie", cookie);
    }

    return response;
  } catch (error) {
    console.error("Auth proxy GET error:", error);
    return NextResponse.json(
      { error: "Auth service unavailable" },
      { status: 503 }
    );
  }
}

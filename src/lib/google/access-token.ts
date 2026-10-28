export type GoogleTokenResult =
  | { ok: true; accessToken: string }
  | { ok: false; reason: string };

/** OAuth access token for Google APIs (Drive, Calendar, etc.) */
export async function getGoogleAccessToken(): Promise<string | null> {
  const result = await getGoogleAccessTokenResult();
  return result.ok ? result.accessToken : null;
}

export async function getGoogleAccessTokenResult(): Promise<GoogleTokenResult> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return {
      ok: false,
      reason:
        "Google OAuth not configured (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN).",
    };
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return {
      ok: false,
      reason: `Google token refresh failed (${res.status}): ${text.slice(0, 200)}`,
    };
  }

  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) {
    return { ok: false, reason: "Google token response missing access_token." };
  }

  return { ok: true, accessToken: data.access_token };
}

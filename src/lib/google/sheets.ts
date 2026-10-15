import { getGoogleAccessToken } from "./access-token";

export async function fetchSheetValues(
  spreadsheetId: string,
  range: string
): Promise<string[][]> {
  const token = await getGoogleAccessToken();
  if (!token) {
    throw new Error(
      "Google Sheets not connected (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN)."
    );
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Sheets API error: ${res.status} ${detail}`);
  }

  const data = (await res.json()) as { values?: string[][] };
  return data.values ?? [];
}

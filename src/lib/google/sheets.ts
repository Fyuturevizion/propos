import { getGoogleAccessToken } from "./access-token";

export type SheetGridCell = { text: string; hyperlink: string | null };

export async function fetchSheetValues(
  spreadsheetId: string,
  range: string
): Promise<string[][]> {
  const grid = await fetchSheetRangeCells(spreadsheetId, range);
  return grid.map((row) => row.map((c) => c.text));
}

/**
 * Includes cell hyperlinks (Photo column Drive folder links show as text in values API only).
 */
export async function fetchSheetRangeCells(
  spreadsheetId: string,
  range: string
): Promise<SheetGridCell[][]> {
  const token = await getGoogleAccessToken();
  if (!token) {
    throw new Error(
      "Google Sheets not connected (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN)."
    );
  }

  const url = new URL(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`
  );
  url.searchParams.set("ranges", range);
  url.searchParams.set(
    "fields",
    "sheets(data(rowData(values(formattedValue,hyperlink))))"
  );

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Sheets API error: ${res.status} ${detail}`);
  }

  const data = (await res.json()) as {
    sheets?: Array<{
      data?: Array<{
        rowData?: Array<{
          values?: Array<{ formattedValue?: string; hyperlink?: string }>;
        }>;
      }>;
    }>;
  };

  const rowData = data.sheets?.[0]?.data?.[0]?.rowData ?? [];
  return rowData.map((row) =>
    (row.values ?? []).map((cell) => ({
      text: (cell.formattedValue ?? "").trim(),
      hyperlink: cell.hyperlink?.trim() ? cell.hyperlink.trim() : null,
    }))
  );
}

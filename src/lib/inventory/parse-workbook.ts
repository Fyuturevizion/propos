import * as XLSX from "xlsx";
import type { InventoryListingRow, ParsedWorkbook } from "./types";
import {
  cellDisplayText,
  findColumnIndex,
  hyperlinkTarget,
  parseBedBathFraction,
  parsePriceThb,
  photoUrlFromSheetCell,
} from "./spreadsheet";

const SALE_SHEETS = ["sales", "sale", "for sale"];
const RENT_SHEETS = ["rent", "rent-phuket", "luxury rent-phuket", "rental"];

function listingTypeForSheet(name: string): "sale" | "rent" {
  const lower = name.trim().toLowerCase();
  if (SALE_SHEETS.some((s) => lower.includes(s))) return "sale";
  if (RENT_SHEETS.some((s) => lower.includes(s))) return "rent";
  return lower.includes("rent") ? "rent" : "sale";
}

function parseSheet(
  sheet: XLSX.WorkSheet,
  sheetName: string
): ParsedWorkbook | null {
  const ref = XLSX.utils.decode_range(sheet["!ref"] ?? "A1");
  if (ref.e.r < 1) return null;

  const headerRow: string[] = [];
  for (let c = ref.s.c; c <= ref.e.c; c++) {
    const addr = XLSX.utils.encode_cell({ r: ref.s.r, c });
    headerRow.push(cellDisplayText(sheet[addr] as XLSX.CellObject));
  }

  const col = {
    ref: findColumnIndex(headerRow, [
      "Property Ref",
      "Ref",
      "Property ref",
      "REF",
    ]),
    location: findColumnIndex(headerRow, ["Location", "Area"]),
    project: findColumnIndex(headerRow, [
      "Project Name",
      "Project",
      "Project name",
    ]),
    photo: findColumnIndex(headerRow, [
      "Photo",
      "Photo /Detail",
      "Photos",
      "Media",
    ]),
    map: findColumnIndex(headerRow, ["Map", "Google Map", "Location Map"]),
    price: findColumnIndex(headerRow, ["Price", "Sale Price", "Rent"]),
    beds: findColumnIndex(headerRow, [
      "No.bed",
      "Bed",
      "Beds",
      "Bed/bath",
      "Bed/Bath",
    ]),
    baths: findColumnIndex(headerRow, ["No.bath", "Bath", "Baths"]),
    notes: findColumnIndex(headerRow, ["Note", "Notes", "Remark"]),
  };

  if (col.ref < 0) return null;

  const listingType = listingTypeForSheet(sheetName);
  const rows: InventoryListingRow[] = [];

  for (let r = ref.s.r + 1; r <= ref.e.r; r++) {
    const read = (index: number) => {
      if (index < 0) return { text: "", link: null as string | null };
      const addr = XLSX.utils.encode_cell({ r, c: ref.s.c + index });
      const cell = sheet[addr] as XLSX.CellObject | undefined;
      return {
        text: cellDisplayText(cell),
        link: hyperlinkTarget(cell),
      };
    };

    const propertyRef = read(col.ref).text;
    if (!propertyRef) continue;

    const photo = read(col.photo);
    const map = read(col.map);
    const bedsCell = read(col.beds);
    const bathsCell = read(col.baths);

    const bedsBathsRaw =
      bedsCell.text.includes("/") && col.baths < 0
        ? bedsCell.text
        : [bedsCell.text, bathsCell.text].filter(Boolean).join(" / ") || null;

    let bedrooms: number | null = null;
    let bathrooms: number | null = null;
    if (bedsCell.text.includes("/")) {
      const parsed = parseBedBathFraction(bedsCell.text);
      bedrooms = parsed.bedrooms;
      bathrooms = parsed.bathrooms;
    } else {
      bedrooms = parseBedBathFraction(bedsCell.text).bedrooms;
      bathrooms = parseBedBathFraction(bathsCell.text).bathrooms;
    }

    const rawRow: Record<string, string> = {};
    headerRow.forEach((h, i) => {
      if (!h) return;
      const addr = XLSX.utils.encode_cell({ r, c: ref.s.c + i });
      rawRow[h] = cellDisplayText(sheet[addr] as XLSX.CellObject);
    });

    const priceRaw = col.price >= 0 ? read(col.price).text : null;

    rows.push({
      propertyRef,
      listingType,
      location: col.location >= 0 ? read(col.location).text || null : null,
      projectName: col.project >= 0 ? read(col.project).text || null : null,
      photoUrl: photoUrlFromSheetCell(photo.text, photo.link),
      mapUrl: map.link ?? (map.text.startsWith("http") ? map.text : null),
      priceRaw,
      priceThb: parsePriceThb(priceRaw),
      bedrooms,
      bathrooms,
      bedsBathsRaw,
      notes: col.notes >= 0 ? read(col.notes).text || null : null,
      rawRow,
    });
  }

  return { sheetName, listingType, rows };
}

export function parsePropertyListingsWorkbook(
  buffer: ArrayBuffer,
  options?: { sheetNames?: string[] }
): ParsedWorkbook[] {
  const workbook = XLSX.read(buffer, {
    type: "array",
    cellDates: false,
    cellNF: true,
    cellText: true,
  });

  const names =
    options?.sheetNames?.length
      ? options.sheetNames.filter((n) => workbook.SheetNames.includes(n))
      : workbook.SheetNames;

  const parsed: ParsedWorkbook[] = [];
  for (const name of names) {
    const sheet = workbook.Sheets[name];
    if (!sheet) continue;
    const block = parseSheet(sheet, name);
    if (block?.rows.length) parsed.push(block);
  }
  return parsed;
}

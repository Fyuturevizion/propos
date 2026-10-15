export type InventoryListingRow = {
  propertyRef: string;
  listingType: "sale" | "rent";
  location: string | null;
  projectName: string | null;
  photoUrl: string | null;
  mapUrl: string | null;
  priceRaw: string | null;
  priceThb: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  bedsBathsRaw: string | null;
  notes: string | null;
  rawRow: Record<string, string>;
};

export type ParsedWorkbook = {
  sheetName: string;
  listingType: "sale" | "rent";
  rows: InventoryListingRow[];
};

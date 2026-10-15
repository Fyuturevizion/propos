-- CRM inventory imported from Property-Listings.xlsx (and similar workbooks)

CREATE TABLE IF NOT EXISTS inventory_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_ref TEXT NOT NULL,
  listing_type TEXT CHECK (listing_type IN ('sale', 'rent')),
  location TEXT,
  project_name TEXT,
  photo_url TEXT,
  map_url TEXT,
  price_raw TEXT,
  price_thb NUMERIC,
  bedrooms INTEGER,
  bathrooms INTEGER,
  beds_baths_raw TEXT,
  notes TEXT,
  gallery_files JSONB NOT NULL DEFAULT '[]',
  photos_synced_at TIMESTAMPTZ,
  published_property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  is_published BOOLEAN NOT NULL DEFAULT false,
  source_workbook TEXT,
  raw_row JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (property_ref, listing_type)
);

CREATE INDEX idx_inventory_listings_ref ON inventory_listings(property_ref);
CREATE INDEX idx_inventory_listings_published ON inventory_listings(is_published);

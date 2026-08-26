-- Placements table: one source of truth for niche edit, guest post, and crowd link examples
CREATE TABLE IF NOT EXISTS placements (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type    text NOT NULL CHECK (service_type IN ('niche_edit', 'guest_post', 'crowd_link')),
  domain          text NOT NULL,
  placement_url   text NOT NULL,
  title           text DEFAULT '',
  niche           text NOT NULL DEFAULT '',
  dr              integer NOT NULL DEFAULT 0,
  traffic         integer NOT NULL DEFAULT 0,
  keywords        integer DEFAULT NULL,
  screenshot_url  text DEFAULT '',
  status          text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'hidden')),
  featured        boolean NOT NULL DEFAULT false,
  homepage_featured boolean NOT NULL DEFAULT false,
  sort_order      integer NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE placements ENABLE ROW LEVEL SECURITY;

-- Public read: anyone can view active placements (no-auth site needs anon access)
CREATE POLICY "select_placements_public" ON placements FOR SELECT
  TO anon, authenticated USING (true);

-- Only authenticated (admin) can write
CREATE POLICY "insert_placements_admin" ON placements FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "update_placements_admin" ON placements FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "delete_placements_admin" ON placements FOR DELETE
  TO authenticated USING (true);

-- Index for common query patterns
CREATE INDEX idx_placements_service_status ON placements (service_type, status);
CREATE INDEX idx_placements_homepage ON placements (homepage_featured, status, service_type);
CREATE INDEX idx_placements_sort ON placements (sort_order, created_at DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_placements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER placements_updated_at
  BEFORE UPDATE ON placements
  FOR EACH ROW EXECUTE FUNCTION update_placements_updated_at();

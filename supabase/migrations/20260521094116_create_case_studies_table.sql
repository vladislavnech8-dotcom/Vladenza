/*
  # Create case_studies table

  ## Summary
  Adds a fully managed case_studies table so admins can create, edit, and publish
  SEO case studies from the admin panel without touching code.

  ## New Tables
  - `case_studies`
    - `id` (uuid, pk)
    - `slug` (text, unique) — URL segment e.g. "igaming-domain-authority"
    - `published` (boolean) — draft vs live
    - `title` (text)
    - `niche` (text) — iGaming, SaaS, Crypto, etc.
    - `service` (text) — service type label
    - `period` (text) — timeline label e.g. "9 months"
    - `metric` (text) — hero metric e.g. "+300"
    - `metric_sub` (text) — metric subtitle e.g. "Referring Domains"
    - `color` (text) — hex accent color
    - `image_url` (text) — hero image URL
    - `challenge` (text)
    - `solution` (text)
    - `result` (text)
    - `tags` (text[]) — tag chips
    - `bars` (integer[]) — sparkline data points (9 values)
    - `stats` (jsonb) — array of {label, value} key metrics
    - `screenshots` (text[]) — array of image URLs
    - `placement_report` (jsonb) — array of placement rows {domain, dr, traffic, type, quality, notes}
    - `body` (jsonb) — array of ContentSection objects (same shape as blog posts)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ## Security
  - RLS enabled
  - Only authenticated users (admins) can insert/update/delete
  - Public (anon) can SELECT published cases only
*/

CREATE TABLE IF NOT EXISTS case_studies (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            text UNIQUE NOT NULL,
  published       boolean NOT NULL DEFAULT false,
  title           text NOT NULL DEFAULT '',
  niche           text NOT NULL DEFAULT '',
  service         text NOT NULL DEFAULT '',
  period          text NOT NULL DEFAULT '',
  metric          text NOT NULL DEFAULT '',
  metric_sub      text NOT NULL DEFAULT '',
  color           text NOT NULL DEFAULT '#F97316',
  image_url       text NOT NULL DEFAULT '',
  challenge       text NOT NULL DEFAULT '',
  solution        text NOT NULL DEFAULT '',
  result          text NOT NULL DEFAULT '',
  tags            text[] NOT NULL DEFAULT '{}',
  bars            integer[] NOT NULL DEFAULT '{1,2,3,4,5,6,7,8,9}',
  stats           jsonb NOT NULL DEFAULT '[]',
  screenshots     text[] NOT NULL DEFAULT '{}',
  placement_report jsonb NOT NULL DEFAULT '[]',
  body            jsonb NOT NULL DEFAULT '[]',
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;

-- Public can read published cases
CREATE POLICY "Public can read published case studies"
  ON case_studies FOR SELECT
  TO anon
  USING (published = true);

-- Authenticated users (admins) can read all
CREATE POLICY "Admins can read all case studies"
  ON case_studies FOR SELECT
  TO authenticated
  USING (true);

-- Admins can insert
CREATE POLICY "Admins can insert case studies"
  ON case_studies FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Admins can update
CREATE POLICY "Admins can update case studies"
  ON case_studies FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Admins can delete
CREATE POLICY "Admins can delete case studies"
  ON case_studies FOR DELETE
  TO authenticated
  USING (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_case_studies_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_case_studies_updated_at ON case_studies;
CREATE TRIGGER set_case_studies_updated_at
  BEFORE UPDATE ON case_studies
  FOR EACH ROW EXECUTE FUNCTION update_case_studies_updated_at();

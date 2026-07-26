/*
  # Create SEO Settings Table

  ## Purpose
  Stores all editable SEO metadata for the site, manageable via admin panel.

  ## New Tables
  - `seo_settings`
    - `id` (uuid, primary key)
    - `page` (text) — page identifier, e.g. "home"
    - `title` (text) — <title> tag content
    - `description` (text) — meta description
    - `og_title` (text) — Open Graph title
    - `og_description` (text) — Open Graph description
    - `og_image` (text) — Open Graph image URL
    - `robots` (text) — robots meta tag value
    - `canonical` (text) — canonical URL
    - `keywords` (text) — meta keywords (legacy but some still use it)
    - `schema_json` (text) — raw JSON-LD schema markup
    - `updated_at` (timestamptz)
    - `updated_by` (uuid, references auth.users)

  ## Security
  - RLS enabled
  - Only authenticated users (admins) can read or write
*/

CREATE TABLE IF NOT EXISTS seo_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL DEFAULT 'home',
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  og_title text NOT NULL DEFAULT '',
  og_description text NOT NULL DEFAULT '',
  og_image text NOT NULL DEFAULT '',
  robots text NOT NULL DEFAULT 'index, follow',
  canonical text NOT NULL DEFAULT '',
  keywords text NOT NULL DEFAULT '',
  schema_json text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read seo_settings"
  ON seo_settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert seo_settings"
  ON seo_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = updated_by);

CREATE POLICY "Authenticated users can update seo_settings"
  ON seo_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Seed default home page settings
INSERT INTO seo_settings (page, title, description, og_title, og_description, og_image, robots, keywords)
VALUES (
  'home',
  'WordPress Site AI Migration — Быстрый переход без потери данных',
  'Профессиональная миграция WordPress-сайтов с помощью AI. Быстро, безопасно, без потери SEO-позиций и данных.',
  'WordPress Site AI Migration',
  'Профессиональная миграция WordPress-сайтов с помощью AI. Быстро, безопасно, без потери SEO-позиций.',
  'https://bolt.new/static/og_default.png',
  'index, follow',
  'wordpress migration, ai migration, seo migration'
);

/*
  # Create leads table

  Stores contact form submissions from the order modal on service pages.

  1. New Tables
    - `leads`
      - `id` (uuid, primary key)
      - `email` (text) — required
      - `messenger` (text) — Telegram / WhatsApp, optional
      - `website` (text) — optional
      - `service` (text) — e.g. "Guest Posting"
      - `package` (text) — e.g. "Authority Package"
      - `package_details` (text) — links + price string
      - `source` (text) — always 'vladenza.com'
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Anon users can INSERT (needed for public form)
    - Only authenticated (admin) users can SELECT
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL DEFAULT '',
  messenger text NOT NULL DEFAULT '',
  website text NOT NULL DEFAULT '',
  service text NOT NULL DEFAULT '',
  package text NOT NULL DEFAULT '',
  package_details text NOT NULL DEFAULT '',
  source text NOT NULL DEFAULT 'vladenza.com',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a lead"
  ON leads FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read leads"
  ON leads FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS leads_email_idx ON leads(email);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads(created_at DESC);

/*
  # Create orders table

  1. New Tables
    - `orders`
      - `id` (uuid, primary key)
      - `order_ref` (text, unique) — WayForPay order reference
      - `package_name` (text) — e.g. "Basic", "Standard", "Aggressive"
      - `amount` (numeric) — order amount in USD
      - `currency` (text) — default 'USD'
      - `type` (text) — 'payment' or 'consultation'
      - `name` (text) — customer name
      - `email` (text) — customer email
      - `website` (text) — customer website/url
      - `message` (text) — optional message
      - `status` (text) — 'pending', 'paid', 'failed', 'consultation'
      - `created_at` (timestamptz)
      - `paid_at` (timestamptz, nullable)

  2. Security
    - Enable RLS on `orders` table
    - Only service role can insert/update (done via Edge Function)
    - No public read access
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_ref text UNIQUE NOT NULL,
  package_name text NOT NULL,
  amount numeric(10,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  type text NOT NULL DEFAULT 'payment',
  name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  website text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  paid_at timestamptz
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can insert orders"
  ON orders FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update orders"
  ON orders FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can select orders"
  ON orders FOR SELECT
  TO service_role
  USING (true);

CREATE INDEX IF NOT EXISTS orders_order_ref_idx ON orders(order_ref);
CREATE INDEX IF NOT EXISTS orders_email_idx ON orders(email);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);

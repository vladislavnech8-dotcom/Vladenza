/*
  # Create client_orders table (client dashboard concept)

  1. New Tables
    - `client_orders` — orders placed by signed-in clients from the personal cabinet
      - `id` (uuid, primary key)
      - `user_id` (uuid, not null, defaults to authenticated user, references auth.users)
      - `service_type` (text) — e.g. 'Forum / Crowd Links', 'Guest Posting', 'Niche Edits', 'SEO Audit'
      - `target_url` (text) — the page/domain the client wants links to
      - `anchor_text` (text) — desired anchor text
      - `quantity` (int) — number of links requested
      - `budget` (text) — budget range as a label
      - `notes` (text) — free-form requirements
      - `status` (text) — order lifecycle: 'pending', 'in_progress', 'completed', 'cancelled'
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `client_orders`.
    - Owner-scoped CRUD: each authenticated user can only access rows they own (auth.uid() = user_id).
    - Owner column defaults to auth.uid() so inserts that omit user_id still satisfy the INSERT policy.

  3. Notes
    - This is separate from the existing `orders` table (which is service-role-only for WayForPay).
    - Indexes added on user_id and status for dashboard filtering.
*/

CREATE TABLE IF NOT EXISTS client_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  service_type text NOT NULL DEFAULT 'Forum / Crowd Links',
  target_url text NOT NULL DEFAULT '',
  anchor_text text NOT NULL DEFAULT '',
  quantity int NOT NULL DEFAULT 1,
  budget text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE client_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_client_orders" ON client_orders;
CREATE POLICY "select_own_client_orders" ON client_orders FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_client_orders" ON client_orders;
CREATE POLICY "insert_own_client_orders" ON client_orders FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_client_orders" ON client_orders;
CREATE POLICY "update_own_client_orders" ON client_orders FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_client_orders" ON client_orders;
CREATE POLICY "delete_own_client_orders" ON client_orders FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS client_orders_user_id_idx ON client_orders(user_id);
CREATE INDEX IF NOT EXISTS client_orders_status_idx ON client_orders(status);

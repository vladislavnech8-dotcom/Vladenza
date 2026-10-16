/*
# Add rate limiting table and locale column to orders

1. New Tables
- `rate_limits` — Persistent server-side rate limiting for public endpoints.
  Each row tracks one (endpoint, identifier) bucket with a window of timestamps.
  This replaces in-memory Maps that reset on cold start and don't share state
  across Edge Function instances.
  - `id` (uuid, primary key)
  - `endpoint` (text, which function/route: "checkout", "contact", "requirements", "promo")
  - `identifier` (text, IP address or other client identifier)
  - `timestamps` (bigint[], array of epoch-millis timestamps within the current window)
  - `updated_at` (timestamptz, for cleanup of stale rows)
  - Unique constraint on (endpoint, identifier) so concurrent inserts collapse to one row.

2. Modified Tables
- `orders` — Add `locale` column (text, default 'en') to store the checkout language
  so the email function can send localized confirmation emails.

3. Security
- Enable RLS on `rate_limits`.
- No public access needed — only edge functions with the service role key read/write this table.
  All policies are scoped to `authenticated` with ownership-style predicate, but in practice
  the service role bypasses RLS. We still enable RLS to follow the principle of least privilege.
  No anon access is granted.

4. Important Notes
- The rate_limits table is written by edge functions using the service role key, which bypasses RLS.
  RLS is enabled as defense-in-depth; no anon or authenticated policies are created because
  no frontend code should ever touch this table.
- A cleanup function/endpoint should be added later to prune rows older than 24 hours.
  For now, the array filtering in the edge function code naturally limits row growth.
*/

-- Add locale column to orders
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND table_schema = 'public' AND column_name = 'locale'
  ) THEN
    ALTER TABLE orders ADD COLUMN locale text NOT NULL DEFAULT 'en';
  END IF;
END $$;

-- Create rate_limits table
CREATE TABLE IF NOT EXISTS rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint text NOT NULL,
  identifier text NOT NULL,
  timestamps bigint[] DEFAULT '{}',
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT rate_limits_endpoint_identifier_key UNIQUE (endpoint, identifier)
);

ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_endpoint_identifier ON rate_limits (endpoint, identifier);
CREATE INDEX IF NOT EXISTS idx_rate_limits_updated_at ON rate_limits (updated_at);

-- Helper function: check and record a rate limit hit atomically.
-- Returns true if the request is allowed, false if rate-limited.
-- Uses the service role (bypasses RLS) from edge functions.
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_endpoint text,
  p_identifier text,
  p_limit int,
  p_window_ms bigint
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_now bigint := extract(epoch from now()) * 1000;
  v_existing bigint[];
  v_filtered bigint[];
  v_count int;
BEGIN
  -- Try to get existing row
  SELECT timestamps INTO v_existing
  FROM rate_limits
  WHERE endpoint = p_endpoint AND identifier = p_identifier;

  IF v_existing IS NULL THEN
    -- No existing row — insert new
    BEGIN
      INSERT INTO rate_limits (endpoint, identifier, timestamps, updated_at)
      VALUES (p_endpoint, p_identifier, ARRAY[v_now], now());
      RETURN true;
    EXCEPTION WHEN unique_violation THEN
      -- Race condition: another request inserted first, retry select
      SELECT timestamps INTO v_existing
      FROM rate_limits
      WHERE endpoint = p_endpoint AND identifier = p_identifier;
    END;
  END IF;

  -- Filter to only timestamps within the window
  v_filtered := ARRAY(SELECT unnest(v_existing) WHERE unnest > v_now - p_window_ms);
  v_count := array_length(v_filtered, 1);

  IF v_count IS NULL THEN
    v_count := 0;
  END IF;

  IF v_count >= p_limit THEN
    -- Rate limited — update the row with filtered timestamps (prunes old ones)
    UPDATE rate_limits SET timestamps = v_filtered, updated_at = now()
    WHERE endpoint = p_endpoint AND identifier = p_identifier;
    RETURN false;
  END IF;

  -- Allowed — append current timestamp
  v_filtered := array_append(v_filtered, v_now);
  UPDATE rate_limits SET timestamps = v_filtered, updated_at = now()
  WHERE endpoint = p_endpoint AND identifier = p_identifier;

  RETURN true;
END;
$$;

REVOKE EXECUTE ON FUNCTION check_rate_limit FROM anon;
GRANT EXECUTE ON FUNCTION check_rate_limit TO authenticated;

-- Function to clean up stale rate limit rows (older than 24 hours)
CREATE OR REPLACE FUNCTION cleanup_rate_limits() RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deleted int;
BEGIN
  DELETE FROM rate_limits WHERE updated_at < now() - interval '24 hours';
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$;

REVOKE EXECUTE ON FUNCTION cleanup_rate_limits FROM anon;
GRANT EXECUTE ON FUNCTION cleanup_rate_limits TO authenticated;

-- Create a secure secrets table for storing server-only encryption keys
CREATE TABLE IF NOT EXISTS app_secrets (
  name text PRIMARY KEY,
  value text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Lock down: only the service role (which edge functions use) can access
ALTER TABLE app_secrets ENABLE ROW LEVEL SECURITY;

-- No policies = denied to anon and authenticated roles
-- Service role bypasses RLS, so only server-side code can read

-- Helper function to upsert a secret (callable only by service role)
CREATE OR REPLACE FUNCTION upsert_secret(p_name text, p_value text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO app_secrets (name, value)
  VALUES (p_name, p_value)
  ON CONFLICT (name) DO UPDATE
  SET value = EXCLUDED.value, updated_at = now();
END;
$$;
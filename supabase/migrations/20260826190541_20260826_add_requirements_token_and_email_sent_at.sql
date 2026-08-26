-- Add columns for secure requirements access token and idempotent email sending
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS requirements_token_hash text,
  ADD COLUMN IF NOT EXISTS email_sent_at timestamptz;

-- Index for token hash lookups (fast verification)
CREATE INDEX IF NOT EXISTS orders_requirements_token_hash_idx ON orders(requirements_token_hash);
-- Add encrypted token storage (AES-GCM ciphertext) for email URL generation
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS requirements_token_encrypted text;

-- Add email_status for atomic claiming: null (not attempted), 'sending', 'sent', 'failed'
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS email_status text;

-- Index for atomic email claim lookups
CREATE INDEX IF NOT EXISTS orders_email_status_idx ON orders(email_status) WHERE email_status IS NULL OR email_status = 'failed';

-- Atomic email claim function: only one caller can transition from null/failed to 'sending'
CREATE OR REPLACE FUNCTION claim_email_sending(p_order_ref text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE orders
  SET email_status = 'sending'
  WHERE order_ref = p_order_ref
    AND (email_status IS NULL OR email_status = 'failed');
  RETURN FOUND;
END;
$$;

-- Fix legacy cart_snapshot for NE-1001: was stored as array, should be {items, total, currency}
UPDATE orders
SET cart_snapshot = jsonb_build_object(
  'items', order_items,
  'total', amount,
  'currency', currency
)
WHERE order_ref = 'vladenza-1787770489565-knv8e'
  AND cart_snapshot IS NOT NULL
  AND jsonb_typeof(cart_snapshot) = 'array';
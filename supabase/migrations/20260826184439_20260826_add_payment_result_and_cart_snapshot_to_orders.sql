-- Add columns to store the verified payment result and original cart snapshot
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_result jsonb,
  ADD COLUMN IF NOT EXISTS cart_snapshot jsonb;

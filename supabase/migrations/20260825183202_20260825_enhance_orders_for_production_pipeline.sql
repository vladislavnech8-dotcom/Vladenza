/*
  # Enhance orders table for production order pipeline

  Adds columns needed for the paid-order workflow:
  - order_number: human-readable ID (NE-XXXX)
  - order_items: JSONB array of purchased items
  - requirements: JSONB array of placement requirements
  - requirements_status: 'pending' | 'received'
  - order_status: 'pending_payment' | 'paid' | 'requirements_pending' | 'ready_for_review' | 'in_progress' | 'completed' | 'cancelled' | 'payment_failed'
  - company: customer company name
  - wfp_transaction_id: WayForPay transaction ID from callback
  - updated_at: last modification timestamp

  Also adds a sequence for human-readable order numbers.
*/

-- Add new columns
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS order_number text,
  ADD COLUMN IF NOT EXISTS order_items jsonb NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS requirements jsonb NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS requirements_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS order_status text NOT NULL DEFAULT 'pending_payment',
  ADD COLUMN IF NOT EXISTS company text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS wfp_transaction_id text,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Create sequence for human-readable order numbers (start at 1000)
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1000;

-- Function to generate next order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
DECLARE
  next_val integer;
BEGIN
  next_val := nextval('order_number_seq');
  return 'NE-' || next_val;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_orders_updated_at ON orders;
CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_orders_updated_at();

-- Index for order_number lookups
CREATE INDEX IF NOT EXISTS orders_order_number_idx ON orders(order_number);
CREATE INDEX IF NOT EXISTS orders_order_status_idx ON orders(order_status);

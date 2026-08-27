-- Add admin_notes and status_changed_by columns to orders table
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS admin_notes text DEFAULT '',
  ADD COLUMN IF NOT EXISTS status_changed_by text DEFAULT '';

-- Add trigger to update updated_at on row change
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_orders_updated_at();

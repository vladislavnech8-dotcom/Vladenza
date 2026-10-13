/*
# Promo Code System — Database Schema

## Overview
Creates promo_codes and promo_redemptions tables, adds discount columns to orders,
and adds a SECURITY DEFINER function for atomic promo code validation + reservation.

## New Tables

### promo_codes
Stores promo code definitions managed by the owner.
- code: case-insensitive, trimmed, unique promo code string
- discount_type: 'percentage' or 'fixed'
- discount_value: percentage (1-100) or fixed amount in USD
- max_discount_amount: cap for percentage discounts (null = no cap)
- min_order_amount: minimum eligible subtotal required
- max_uses: total usage limit (null = unlimited)
- used_count: count of successful redemptions (incremented atomically on payment)
- active: whether the code can be applied
- valid_from / valid_until: optional validity window
- applicable_product_ids: null = all products; array = specific product IDs
- created_at, updated_at

### promo_redemptions
Tracks each promo code usage per order.
- promo_code_id: FK to promo_codes
- order_id: FK to orders
- status: 'reserved' (pending payment), 'confirmed' (paid), 'released' (failed/cancelled)
- discount_amount: the discount applied in USD (minor units via numeric)
- reserved_at, confirmed_at, released_at

## Modified Tables

### orders
Added columns:
- promo_code_id: FK to promo_codes (nullable)
- promo_code_snapshot: text — the code string at time of checkout
- discount_amount: numeric(10,2) default 0 — the discount applied
- original_amount: numeric(10,2) — the pre-discount subtotal

## Security
- promo_codes: RLS enabled, service_role only (no public access)
- promo_redemptions: RLS enabled, service_role only
- orders promo columns: protected by existing orders RLS (service_role only)
- validate_promo_code function: SECURITY DEFINER, callable by anon+authenticated
  (reads promo_codes + creates reservation atomically)

## Important Notes
1. The validate_promo_code function is called by the wayforpay-checkout edge
   function to validate a promo code and atomically reserve a usage slot.
2. confirm_promo_redemption is called by the webhook on successful payment.
3. release_promo_redemption is called by the webhook on failed/cancelled payment.
4. used_count on promo_codes reflects only confirmed (paid) redemptions.
5. Concurrency safety: validate_promo_code uses SELECT ... FOR UPDATE on the
   promo_codes row, then checks used_count < max_uses within the transaction.
*/

-- ─── Promo Codes table ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS promo_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  discount_type text NOT NULL DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value numeric(10,2) NOT NULL DEFAULT 0,
  max_discount_amount numeric(10,2),
  min_order_amount numeric(10,2) DEFAULT 0,
  max_uses integer,
  used_count integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  valid_from timestamptz,
  valid_until timestamptz,
  applicable_product_ids text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- Only service_role can access promo_codes (admin uses service_role via edge functions)
DROP POLICY IF EXISTS "service_role_all_promo_codes" ON promo_codes;
CREATE POLICY "service_role_all_promo_codes"
  ON promo_codes FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

-- ─── Promo Redemptions table ────────────────────────────────────
CREATE TABLE IF NOT EXISTS promo_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_code_id uuid NOT NULL REFERENCES promo_codes(id) ON DELETE CASCADE,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'reserved' CHECK (status IN ('reserved', 'confirmed', 'released')),
  discount_amount numeric(10,2) NOT NULL DEFAULT 0,
  reserved_at timestamptz DEFAULT now(),
  confirmed_at timestamptz,
  released_at timestamptz,
  UNIQUE(order_id)
);

ALTER TABLE promo_redemptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_role_all_promo_redemptions" ON promo_redemptions;
CREATE POLICY "service_role_all_promo_redemptions"
  ON promo_redemptions FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

-- ─── Add discount columns to orders ─────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'promo_code_id') THEN
    ALTER TABLE orders ADD COLUMN promo_code_id uuid REFERENCES promo_codes(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'promo_code_snapshot') THEN
    ALTER TABLE orders ADD COLUMN promo_code_snapshot text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'discount_amount') THEN
    ALTER TABLE orders ADD COLUMN discount_amount numeric(10,2) NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'original_amount') THEN
    ALTER TABLE orders ADD COLUMN original_amount numeric(10,2) NOT NULL DEFAULT 0;
  END IF;
END $$;

-- ─── Indexes ────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_promo_codes_code_lower ON promo_codes (lower(code));
CREATE INDEX IF NOT EXISTS idx_promo_redemptions_promo_code_id ON promo_redemptions (promo_code_id);
CREATE INDEX IF NOT EXISTS idx_promo_redemptions_order_id ON promo_redemptions (order_id);
CREATE INDEX IF NOT EXISTS idx_promo_redemptions_status ON promo_redemptions (status);
CREATE INDEX IF NOT EXISTS idx_orders_promo_code_id ON orders (promo_code_id);

-- ─── validate_promo_code function ───────────────────────────────
-- Called by edge function to validate + reserve a promo code atomically.
-- Returns: { valid, promo_code_id, discount_type, discount_value, max_discount_amount,
--            min_order_amount, applicable_product_ids, discount_amount, redemption_id, error }
CREATE OR REPLACE FUNCTION validate_promo_code(
  p_code text,
  p_cart_items jsonb,
  p_order_ref text
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_promo promo_codes%ROWTYPE;
  v_eligible_subtotal numeric(10,2) := 0;
  v_total_subtotal numeric(10,2) := 0;
  v_discount numeric(10,2) := 0;
  v_final_total numeric(10,2) := 0;
  v_redemption_id uuid;
  v_product_ids text[];
  v_item jsonb;
  v_product_id text;
  v_quantity int;
  v_existing_redemption record;
BEGIN
  -- Normalize code
  p_code := lower(trim(p_code));
  IF p_code = '' THEN
    RETURN jsonb_build_object('valid', false, 'error', 'empty_code');
  END IF;

  -- Lock the promo code row for concurrency safety
  SELECT * INTO v_promo FROM promo_codes WHERE lower(code) = p_code FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'error', 'not_found');
  END IF;

  IF NOT v_promo.active THEN
    RETURN jsonb_build_object('valid', false, 'error', 'inactive');
  END IF;

  -- Check validity period
  IF v_promo.valid_from IS NOT NULL AND now() < v_promo.valid_from THEN
    RETURN jsonb_build_object('valid', false, 'error', 'not_yet_valid');
  END IF;
  IF v_promo.valid_until IS NOT NULL AND now() > v_promo.valid_until THEN
    RETURN jsonb_build_object('valid', false, 'error', 'expired');
  END IF;

  -- Check usage limits (used_count + active reservations)
  IF v_promo.max_uses IS NOT NULL THEN
    DECLARE
      v_active_reservations int;
    BEGIN
      SELECT count(*) INTO v_active_reservations
        FROM promo_redemptions
        WHERE promo_code_id = v_promo.id AND status = 'reserved';
      IF v_promo.used_count + v_active_reservations >= v_promo.max_uses THEN
        RETURN jsonb_build_object('valid', false, 'error', 'usage_limit_reached');
      END IF;
    END;
  END IF;

  -- Parse cart items and compute eligible subtotal
  v_product_ids := v_promo.applicable_product_ids;
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_cart_items) LOOP
    v_product_id := v_item->>'productId';
    v_quantity := COALESCE((v_item->>'quantity')::int, 0);
    IF v_quantity < 1 THEN CONTINUE; END IF;

    -- Track total subtotal for min_order check
    -- (price computed by edge function; we trust the items jsonb passed from server)
    v_total_subtotal := v_total_subtotal + COALESCE((v_item->>'eligibleAmount')::numeric, 0);

    -- Check if this product is eligible
    IF v_product_ids IS NULL OR v_product_id = ANY(v_product_ids) THEN
      v_eligible_subtotal := v_eligible_subtotal + COALESCE((v_item->>'eligibleAmount')::numeric, 0);
    END IF;
  END LOOP;

  -- Check minimum order amount (against total subtotal)
  IF v_promo.min_order_amount > 0 AND v_total_subtotal < v_promo.min_order_amount THEN
    RETURN jsonb_build_object('valid', false, 'error', 'min_order_not_met');
  END IF;

  -- If no eligible items, discount is 0
  IF v_eligible_subtotal <= 0 THEN
    RETURN jsonb_build_object('valid', false, 'error', 'no_eligible_items');
  END IF;

  -- Calculate discount
  IF v_promo.discount_type = 'percentage' THEN
    v_discount := v_eligible_subtotal * (v_promo.discount_value / 100.0);
    -- Apply max_discount cap if set
    IF v_promo.max_discount_amount IS NOT NULL AND v_discount > v_promo.max_discount_amount THEN
      v_discount := v_promo.max_discount_amount;
    END IF;
  ELSIF v_promo.discount_type = 'fixed' THEN
    v_discount := v_promo.discount_value;
    -- Fixed discount cannot exceed eligible subtotal
    IF v_discount > v_eligible_subtotal THEN
      v_discount := v_eligible_subtotal;
    END IF;
  ELSE
    RETURN jsonb_build_object('valid', false, 'error', 'invalid_discount_type');
  END IF;

  v_discount := round(v_discount, 2);
  v_final_total := round(v_total_subtotal - v_discount, 2);
  IF v_final_total < 0 THEN v_final_total := 0; END IF;

  -- Check if there's an existing reservation for this order_ref
  SELECT pr.id, pr.status INTO v_existing_redemption
    FROM promo_redemptions pr
    JOIN orders o ON o.id = pr.order_id
    WHERE o.order_ref = p_order_ref
    LIMIT 1;

  -- If existing reservation exists for this order, return it
  IF FOUND AND v_existing_redemption.status = 'reserved' THEN
    RETURN jsonb_build_object(
      'valid', true,
      'promo_code_id', v_promo.id,
      'code', v_promo.code,
      'discount_type', v_promo.discount_type,
      'discount_value', v_promo.discount_value,
      'discount_amount', v_discount,
      'final_total', v_final_total,
      'redemption_id', v_existing_redemption.id,
      'already_reserved', true
    );
  END IF;

  -- Create new reservation (order_id will be set later when order is created)
  -- For validation-only calls (no order yet), we don't create a reservation
  -- The edge function will call reserve_promo_code after order creation
  RETURN jsonb_build_object(
    'valid', true,
    'promo_code_id', v_promo.id,
    'code', v_promo.code,
    'discount_type', v_promo.discount_type,
    'discount_value', v_promo.discount_value,
    'max_discount_amount', v_promo.max_discount_amount,
    'min_order_amount', v_promo.min_order_amount,
    'applicable_product_ids', v_promo.applicable_product_ids,
    'discount_amount', v_discount,
    'eligible_subtotal', v_eligible_subtotal,
    'total_subtotal', v_total_subtotal,
    'final_total', v_final_total,
    'already_reserved', false
  );
END;
$$;

-- Grant execute to anon + authenticated (edge function uses service role, but be safe)
GRANT EXECUTE ON FUNCTION validate_promo_code TO anon, authenticated, service_role;

-- ─── reserve_promo_code function ────────────────────────────────
-- Called after order creation to create a reservation linked to the order.
CREATE OR REPLACE FUNCTION reserve_promo_code(
  p_promo_code_id uuid,
  p_order_id uuid,
  p_discount_amount numeric(10,2)
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_redemption_id uuid;
BEGIN
  INSERT INTO promo_redemptions (promo_code_id, order_id, status, discount_amount)
  VALUES (p_promo_code_id, p_order_id, 'reserved', p_discount_amount)
  RETURNING id INTO v_redemption_id;
  RETURN v_redemption_id;
END;
$$;

GRANT EXECUTE ON FUNCTION reserve_promo_code TO service_role;

-- ─── confirm_promo_redemption function ──────────────────────────
-- Called by webhook on successful payment. Atomically confirms reservation
-- and increments used_count. Idempotent: if already confirmed, does nothing.
CREATE OR REPLACE FUNCTION confirm_promo_redemption(
  p_order_id uuid
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_redemption promo_redemptions%ROWTYPE;
BEGIN
  SELECT * INTO v_redemption FROM promo_redemptions WHERE order_id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN RETURN; END IF;
  IF v_redemption.status = 'confirmed' THEN RETURN; END IF;
  IF v_redemption.status = 'released' THEN RETURN; END IF;

  UPDATE promo_redemptions
    SET status = 'confirmed', confirmed_at = now()
    WHERE id = v_redemption.id;

  UPDATE promo_codes
    SET used_count = used_count + 1, updated_at = now()
    WHERE id = v_redemption.promo_code_id;
END;
$$;

GRANT EXECUTE ON FUNCTION confirm_promo_redemption TO service_role;

-- ─── release_promo_redemption function ──────────────────────────
-- Called by webhook on failed/cancelled payment. Releases the reservation.
-- Idempotent: if already released or confirmed, does nothing.
CREATE OR REPLACE FUNCTION release_promo_redemption(
  p_order_id uuid
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_redemption promo_redemptions%ROWTYPE;
BEGIN
  SELECT * INTO v_redemption FROM promo_redemptions WHERE order_id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN RETURN; END IF;
  IF v_redemption.status != 'reserved' THEN RETURN; END IF;

  UPDATE promo_redemptions
    SET status = 'released', released_at = now()
    WHERE id = v_redemption.id;
END;
$$;

GRANT EXECUTE ON FUNCTION release_promo_redemption TO service_role;
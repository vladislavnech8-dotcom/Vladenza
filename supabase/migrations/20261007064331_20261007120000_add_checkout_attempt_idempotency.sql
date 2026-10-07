/*
# Add checkout creation idempotency

1. New Columns
- `orders.checkout_attempt_id` (text, nullable) stores the client-generated identifier for one payment creation attempt.
- The value is nullable so existing orders remain unchanged.

2. Data Integrity
- A unique partial index allows one server-side order per payment attempt while allowing legacy rows without an attempt identifier.
- A repeated network request with the same identifier reuses the existing pending order instead of inserting another order.

3. Security
- The identifier is only used together with server-recomputed cart data and the existing service-role order lookup.
- No payment secret or card data is exposed.
*/

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS checkout_attempt_id text;

CREATE UNIQUE INDEX IF NOT EXISTS orders_checkout_attempt_id_unique
  ON orders(checkout_attempt_id)
  WHERE checkout_attempt_id IS NOT NULL;

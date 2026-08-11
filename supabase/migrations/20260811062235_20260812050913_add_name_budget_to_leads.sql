/*
  # Add name and budget columns to leads table

  The order modal collects the customer's name (required by WayForPay for
  card payments) and a budget range, but the `leads` table doesn't have
  these columns yet — inserts with these fields would fail.

  1. Changes
    - Add `name` (text, default '')
    - Add `budget` (text, default '')

  2. Security
    - No RLS changes needed; existing policies on `leads` already cover
      inserts/selects regardless of column count.
*/

ALTER TABLE leads ADD COLUMN IF NOT EXISTS name text NOT NULL DEFAULT '';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS budget text NOT NULL DEFAULT '';

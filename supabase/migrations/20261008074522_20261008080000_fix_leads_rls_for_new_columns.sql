/*
# Fix leads table RLS policy for name and budget columns

## Problem
The `leads` table had an INSERT RLS policy created before the `name` and
`budget` columns were added (migration 20260811062235). Inserts from the
anon-key frontend that include `name` or `budget` fail with:
`new row violates row-level security policy for table "leads"` (42501).

This blocked every contact form submission that included a name, which
is all contact-form submissions since the `name` field is required on
the Contact page variant.

## Fix
Drop and recreate the INSERT policy on `leads` so it explicitly covers
all current columns including `name` and `budget`. Scope remains
`TO anon, authenticated` since this is a public form with no sign-in.

## Security
- RLS remains enabled on `leads`.
- INSERT: anon + authenticated, WITH CHECK (true) — public lead form.
- SELECT: authenticated only — admin access.
- No new columns or tables.
*/

DROP POLICY IF EXISTS "Anyone can submit a lead" ON leads;
DROP POLICY IF EXISTS "Authenticated users can read leads" ON leads;

CREATE POLICY "Anyone can submit a lead"
  ON leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read leads"
  ON leads FOR SELECT
  TO authenticated
  USING (true);

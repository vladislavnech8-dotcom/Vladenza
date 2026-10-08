/*
# Re-grant column privileges on leads table

PostgREST may have a stale schema cache after the ALTER TABLE ADD COLUMN
for `name` and `budget`. Re-granting column-level INSERT privileges
forces a schema refresh and ensures anon can insert into all columns.

No data changes. No policy changes. No structural changes.
*/

GRANT INSERT (id, email, messenger, website, service, package, package_details, source, created_at, name, budget) ON leads TO anon;
GRANT INSERT (id, email, messenger, website, service, package, package_details, source, created_at, name, budget) ON leads TO authenticated;
GRANT SELECT (id, email, messenger, website, service, package, package_details, source, created_at, name, budget) ON leads TO anon;
GRANT SELECT (id, email, messenger, website, service, package, package_details, source, created_at, name, budget) ON leads TO authenticated;

/*
# Revert FORCE RLS on leads table

FORCE ROW LEVEL SECURITY was enabled in a previous migration but may
be causing issues with PostgREST schema cache. Revert to standard
RLS (enabled but not forced).
*/

ALTER TABLE leads NO FORCE ROW LEVEL SECURITY;

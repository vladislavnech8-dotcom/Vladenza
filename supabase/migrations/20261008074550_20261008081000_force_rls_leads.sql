/*
# Force RLS on leads table

Enable FORCE ROW LEVEL SECURITY to ensure the table owner is also
subject to RLS policies, matching the expected Supabase security posture.
*/

ALTER TABLE leads FORCE ROW LEVEL SECURITY;

/*
# Allow anon to read active/pending SEO revisions

1. Security changes
- Add SELECT policy on seo_revisions for anon role
- Anon can only read revisions with status 'active' or 'pending'
- This is needed because the prerender script uses the anon key to fetch
  the current revision at build time. The metadata in active/pending
  revisions is public by design — it becomes visible in the prerendered HTML.
- Failed and superseded revisions remain visible only to crm_owners.
*/

DROP POLICY IF EXISTS "anon_read_active_pending_seo_revisions" ON seo_revisions;
CREATE POLICY "anon_read_active_pending_seo_revisions"
  ON seo_revisions FOR SELECT
  TO anon
  USING (status IN ('active', 'pending'));
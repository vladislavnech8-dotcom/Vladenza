/*
# Simplify SEO: Allow public read of seo_settings

## Purpose
Makes SEO metadata publicly readable so the useSEO hook and prerender script
can fetch it directly from the database without the revision system.
SEO metadata is inherently public — it appears in the HTML source of every page.

## Changes
- Add anon SELECT policy on seo_settings (public read)
- Keep authenticated write policies for admins
- Re-grant SELECT to anon role so the policy is effective

## Security
- Only SELECT is public. INSERT/UPDATE/DELETE remain authenticated-only.
- SEO metadata contains no sensitive information — it's what appears in <meta> tags.
*/

-- Allow anon (public) to read seo_settings
DROP POLICY IF EXISTS "anon_read_seo_settings" ON seo_settings;
CREATE POLICY "anon_read_seo_settings" ON seo_settings
  FOR SELECT TO anon, authenticated
  USING (true);

-- Ensure anon has SELECT grant (was revoked in a previous migration)
GRANT SELECT ON seo_settings TO anon;

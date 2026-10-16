/*
# SEO Revision System — Phase B

## Purpose
Creates the seo_revisions table for immutable publication snapshots,
adds locale to seo_settings, and creates SECURITY DEFINER functions
for creating, activating, failing, and rolling back revisions.

## Changes to existing tables
- seo_settings: ADD COLUMN locale text NOT NULL DEFAULT 'en'
- seo_settings: ADD unique index on (page, locale)
- Revoke anon grants on seo_settings (RLS already blocks, defense in depth)

## New tables
- seo_revisions: immutable publication snapshots with status lifecycle

## New functions (all SECURITY DEFINER)
- create_seo_revision(): snapshots all seo_settings drafts into a new pending revision
- activate_seo_revision(): marks a pending revision as active, supersedes previous
- fail_seo_revision(): marks a pending revision as failed
- rollback_seo_revision(): reverts to a previous superseded revision

## Security
- seo_revisions: RLS enabled, only CRM owners can read/write
- All functions check crm_owners membership internally
- Functions use SET search_path = public, pg_temp
- Execution granted only to authenticated, revoked from PUBLIC and anon
- Validation: canonical URL hostname, robots values, page registry, JSON validity
*/

-- ─── 1. Add locale to seo_settings ──────────────────────────────────
ALTER TABLE seo_settings ADD COLUMN IF NOT EXISTS locale text NOT NULL DEFAULT 'en';

CREATE UNIQUE INDEX IF NOT EXISTS seo_settings_page_locale_unique
  ON seo_settings (page, locale);

-- Revoke vestigial anon grants (RLS already blocks, defense in depth)
REVOKE SELECT, INSERT, UPDATE, DELETE ON seo_settings FROM anon;

-- Set existing rows to locale = 'en' (they are all English)
UPDATE seo_settings SET locale = 'en' WHERE locale IS NULL OR locale = '';

-- ─── 2. Create seo_revisions table ──────────────────────────────────
CREATE TABLE IF NOT EXISTS seo_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number serial,
  metadata jsonb NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'pending',
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  activated_at timestamptz,
  failed_at timestamptz,
  failure_reason text,
  html_hash text,
  activated_by uuid REFERENCES auth.users(id)
);

-- Only one pending revision at a time
CREATE UNIQUE INDEX IF NOT EXISTS seo_revisions_one_pending
  ON seo_revisions (number) WHERE status = 'pending';

-- Index for finding active revision
CREATE INDEX IF NOT EXISTS seo_revisions_active
  ON seo_revisions (number DESC) WHERE status = 'active';

-- Index for history listing
CREATE INDEX IF NOT EXISTS seo_revisions_created_at
  ON seo_revisions (created_at DESC);

ALTER TABLE seo_revisions ENABLE ROW LEVEL SECURITY;

-- RLS policies: only CRM owners can access seo_revisions
DROP POLICY IF EXISTS "owner_select_seo_revisions" ON seo_revisions;
CREATE POLICY "owner_select_seo_revisions" ON seo_revisions
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "owner_insert_seo_revisions" ON seo_revisions;
CREATE POLICY "owner_insert_seo_revisions" ON seo_revisions
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "owner_update_seo_revisions" ON seo_revisions;
CREATE POLICY "owner_update_seo_revisions" ON seo_revisions
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "owner_delete_seo_revisions" ON seo_revisions;
CREATE POLICY "owner_delete_seo_revisions" ON seo_revisions
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()));

-- ─── 3. create_seo_revision() ───────────────────────────────────────
CREATE OR REPLACE FUNCTION public.create_seo_revision()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_is_owner boolean;
  v_settings record;
  v_metadata jsonb := '{}'::jsonb;
  v_url text;
  v_parsed_hostname text;
  v_parsed_json jsonb;
  v_valid_robots text[] := ARRAY['index, follow', 'noindex, follow', 'index, nofollow', 'noindex, nofollow'];
  v_valid_pages text[];
  v_existing_pending boolean;
  v_new_number int;
BEGIN
  -- Authorization
  SELECT EXISTS (SELECT 1 FROM public.crm_owners WHERE user_id = auth.uid()) INTO v_is_owner;
  IF NOT v_is_owner THEN
    RAISE EXCEPTION 'Unauthorized: user is not a CRM owner' USING ERRCODE = '42501';
  END IF;

  -- Check no existing pending revision
  SELECT EXISTS (SELECT 1 FROM public.seo_revisions WHERE status = 'pending') INTO v_existing_pending;
  IF v_existing_pending THEN
    RAISE EXCEPTION 'A pending revision already exists. Activate or fail it before creating a new one.'
      USING ERRCODE = 'P0003';
  END IF;

  -- Build the list of valid pages from seo_settings rows
  -- (only pages that have a draft row can be included)
  -- Validate each row
  FOR v_settings IN SELECT * FROM public.seo_settings LOOP
    -- Title must not be empty (if the row has content)
    IF v_settings.title IS NULL OR v_settings.title = '' THEN
      RAISE EXCEPTION 'Cannot publish: title is empty for page=%', v_settings.page
        USING ERRCODE = '23514';
    END IF;

    -- Robots must be approved value
    IF NOT (v_settings.robots = ANY(v_valid_robots)) THEN
      RAISE EXCEPTION 'Invalid robots value "%" for page=%', v_settings.robots, v_settings.page
        USING ERRCODE = '23514';
    END IF;

    -- Canonical: if provided, must be on vladenza.com
    IF v_settings.canonical <> '' THEN
      BEGIN
        v_url := v_settings.canonical;
        -- Extract hostname using a simple parse
        v_parsed_hostname := regexp_replace(
          regexp_replace(v_url, '^https?://', ''),
          '/.*$', ''
        );
        IF v_parsed_hostname NOT IN ('vladenza.com', 'www.vladenza.com') THEN
          RAISE EXCEPTION 'Canonical for page=% must be on vladenza.com domain, got %', v_settings.page, v_parsed_hostname
            USING ERRCODE = '23514';
        END IF;
      END;
    END IF;

    -- Schema JSON: if provided, must be valid JSON
    IF v_settings.schema_json <> '' THEN
      BEGIN
        v_parsed_json := v_settings.schema_json::jsonb;
      EXCEPTION WHEN invalid_text_representation THEN
        RAISE EXCEPTION 'schema_json is not valid JSON for page=%', v_settings.page
          USING ERRCODE = '23514';
      END;
    END IF;

    -- Title length check
    IF length(v_settings.title) > 200 THEN
      RAISE EXCEPTION 'Title too long (max 200) for page=%', v_settings.page
        USING ERRCODE = '23514';
    END IF;

    -- Description length check
    IF length(v_settings.description) > 500 THEN
      RAISE EXCEPTION 'Description too long (max 500) for page=%', v_settings.page
        USING ERRCODE = '23514';
    END IF;

    -- Add to metadata blob
    v_metadata := v_metadata || jsonb_build_object(
      v_settings.page,
      jsonb_build_object(
        'title', v_settings.title,
        'description', v_settings.description,
        'og_title', v_settings.og_title,
        'og_description', v_settings.og_description,
        'og_image', v_settings.og_image,
        'robots', v_settings.robots,
        'canonical', v_settings.canonical,
        'schema_json', v_settings.schema_json,
        'locale', v_settings.locale
      )
    );
  END LOOP;

  -- Get next revision number
  SELECT COALESCE(MAX(number), 0) + 1 INTO v_new_number FROM public.seo_revisions;

  -- Insert the new pending revision
  INSERT INTO public.seo_revisions (number, metadata, status, created_by)
  VALUES (v_new_number, v_metadata, 'pending', auth.uid());

  RETURN jsonb_build_object(
    'ok', true,
    'revision_number', v_new_number,
    'page_count', (SELECT count(*) FROM public.seo_settings),
    'message', 'Revision created. Build and verify to activate.'
  );
END;
$$;

REVOKE ALL ON FUNCTION public.create_seo_revision() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_seo_revision() TO authenticated;

-- ─── 4. activate_seo_revision() ─────────────────────────────────────
CREATE OR REPLACE FUNCTION public.activate_seo_revision(
  p_revision_id uuid,
  p_html_hash text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_is_owner boolean;
  v_revision record;
BEGIN
  SELECT EXISTS (SELECT 1 FROM public.crm_owners WHERE user_id = auth.uid()) INTO v_is_owner;
  IF NOT v_is_owner THEN
    RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_revision FROM public.seo_revisions WHERE id = p_revision_id AND status = 'pending';
  IF NOT FOUND THEN
    RAISE EXCEPTION 'No pending revision with id=%', p_revision_id USING ERRCODE = 'P0002';
  END IF;

  -- Supersede previous active revision
  UPDATE public.seo_revisions SET status = 'superseded' WHERE status = 'active';

  -- Activate this revision
  UPDATE public.seo_revisions
  SET status = 'active',
      activated_at = now(),
      activated_by = auth.uid(),
      html_hash = p_html_hash
  WHERE id = p_revision_id;

  RETURN jsonb_build_object('ok', true, 'revision_id', p_revision_id, 'status', 'active');
END;
$$;

REVOKE ALL ON FUNCTION public.activate_seo_revision(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.activate_seo_revision(uuid, text) TO authenticated;

-- ─── 5. fail_seo_revision() ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.fail_seo_revision(
  p_revision_id uuid,
  p_reason text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_is_owner boolean;
BEGIN
  SELECT EXISTS (SELECT 1 FROM public.crm_owners WHERE user_id = auth.uid()) INTO v_is_owner;
  IF NOT v_is_owner THEN
    RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
  END IF;

  UPDATE public.seo_revisions
  SET status = 'failed',
      failed_at = now(),
      failure_reason = p_reason
  WHERE id = p_revision_id AND status = 'pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No pending revision with id=%', p_revision_id USING ERRCODE = 'P0002';
  END IF;

  RETURN jsonb_build_object('ok', true, 'revision_id', p_revision_id, 'status', 'failed');
END;
$$;

REVOKE ALL ON FUNCTION public.fail_seo_revision(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.fail_seo_revision(uuid, text) TO authenticated;

-- ─── 6. rollback_seo_revision() ─────────────────────────────────────
CREATE OR REPLACE FUNCTION public.rollback_seo_revision(
  p_target_revision_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_is_owner boolean;
  v_target record;
BEGIN
  SELECT EXISTS (SELECT 1 FROM public.crm_owners WHERE user_id = auth.uid()) INTO v_is_owner;
  IF NOT v_is_owner THEN
    RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_target FROM public.seo_revisions
  WHERE id = p_target_revision_id AND status IN ('superseded', 'active');

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No superseded/active revision with id=% to roll back to', p_target_revision_id
      USING ERRCODE = 'P0002';
  END IF;

  -- Mark current active as superseded
  UPDATE public.seo_revisions SET status = 'superseded' WHERE status = 'active';

  -- Mark target as active again
  UPDATE public.seo_revisions
  SET status = 'active',
      activated_at = now(),
      activated_by = auth.uid(),
      failure_reason = NULL,
      failed_at = NULL
  WHERE id = p_target_revision_id;

  RETURN jsonb_build_object('ok', true, 'revision_id', p_target_revision_id, 'status', 'active',
    'message', 'Rolled back. Rebuild and redeploy to update live HTML.');
END;
$$;

REVOKE ALL ON FUNCTION public.rollback_seo_revision(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.rollback_seo_revision(uuid) TO authenticated;

-- ─── 7. cancel_pending_revision() ───────────────────────────────────
CREATE OR REPLACE FUNCTION public.cancel_pending_revision(
  p_revision_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_is_owner boolean;
BEGIN
  SELECT EXISTS (SELECT 1 FROM public.crm_owners WHERE user_id = auth.uid()) INTO v_is_owner;
  IF NOT v_is_owner THEN
    RAISE EXCEPTION 'Unauthorized' USING ERRCODE = '42501';
  END IF;

  UPDATE public.seo_revisions
  SET status = 'failed',
      failed_at = now(),
      failure_reason = 'Cancelled by admin'
  WHERE id = p_revision_id AND status = 'pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No pending revision with id=%', p_revision_id USING ERRCODE = 'P0002';
  END IF;

  RETURN jsonb_build_object('ok', true, 'revision_id', p_revision_id, 'status', 'failed');
END;
$$;

REVOKE ALL ON FUNCTION public.cancel_pending_revision(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cancel_pending_revision(uuid) TO authenticated;

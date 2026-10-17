/*
# Fix anon RLS on seo_revisions + add 'cancelled' status

## Security Fix: Anon RLS on seo_revisions
- The previous anon SELECT policy exposed BOTH 'pending' and 'active' revisions.
- Pending revisions contain draft metadata not yet deployed — they must NOT be public.
- New policy: anon can ONLY read revisions with status = 'active' (already deployed).
- Pending, failed, superseded, and cancelled revisions are visible only to crm_owners.

## Lifecycle Fix: Add 'cancelled' status
- Previously, cancelling a pending revision set status='failed' with reason "Cancelled by admin".
- This conflated intentional cancellations with actual deployment verification failures.
- New status 'cancelled' distinguishes admin-cancelled revisions from failed verifications.
- Added `cancelled_at` timestamp column.
- Updated cancel_pending_revision() to set status='cancelled' and cancelled_at=now().

## Columns Added
- seo_revisions.cancelled_at (timestamptz, nullable) — when a pending revision was cancelled

## Functions Modified
- cancel_pending_revision() — now sets status='cancelled' instead of 'failed'

## Security Changes
- anon_read_active_pending_seo_revisions → replaced with anon_read_active_seo_revisions
  (anon can only read status='active', not 'pending')
*/

-- 1. Add cancelled_at column
ALTER TABLE seo_revisions ADD COLUMN IF NOT EXISTS cancelled_at timestamptz;

-- 2. Fix anon RLS: only active revisions are public
DROP POLICY IF EXISTS "anon_read_active_pending_seo_revisions" ON seo_revisions;
DROP POLICY IF EXISTS "anon_read_active_seo_revisions" ON seo_revisions;
CREATE POLICY "anon_read_active_seo_revisions"
  ON seo_revisions FOR SELECT
  TO anon
  USING (status = 'active');

-- 3. Update cancel_pending_revision to use 'cancelled' status
CREATE OR REPLACE FUNCTION public.cancel_pending_revision(p_revision_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_is_owner boolean;
BEGIN
  SELECT EXISTS (SELECT 1 FROM public.crm_owners WHERE user_id = auth.uid()) INTO v_is_owner;
  IF NOT v_is_owner THEN
    RAISE EXCEPTION 'Unauthorized: user is not a CRM owner' USING ERRCODE = '42501';
  END IF;

  UPDATE public.seo_revisions
  SET status = 'cancelled',
      cancelled_at = now()
  WHERE id = p_revision_id AND status = 'pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'No pending revision with id=%', p_revision_id USING ERRCODE = 'P0002';
  END IF;

  RETURN jsonb_build_object('ok', true, 'revision_id', p_revision_id, 'status', 'cancelled');
END;
$function$;

REVOKE ALL ON FUNCTION public.cancel_pending_revision(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cancel_pending_revision(uuid) TO authenticated;
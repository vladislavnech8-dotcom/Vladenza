/*
# Create CRM Foundation Tables (Phase 1)

## Purpose
Build an isolated, owner-only CRM database for managing companies, contacts,
activities, notes, follow-ups, tags, source attribution, and CSV imports.
This is entirely additive — no existing tables are modified.

## Owner-Only Access
All CRM tables use RLS policies that check a `crm_owners` whitelist table.
Only users whose UUID appears in `crm_owners` can read or write CRM data.
The owner's UUID is seeded on creation.
No existing roles, policies, or permissions are changed.

## New Tables
1. crm_owners — whitelist of user UUIDs allowed to access CRM
2. crm_companies — company records with lifecycle, source, type, niche
3. crm_contacts — contact records linked optionally to companies
4. crm_activities — manual activity timeline entries
5. crm_notes — notes attached to companies or contacts
6. crm_follow_ups — follow-up reminders with status and due dates
7. crm_tags — user-created tag library
8. crm_company_tags — junction: companies ↔ tags
9. crm_contact_tags — junction: contacts ↔ tags
10. crm_imports — CSV import history/audit log

## Security
- RLS enabled on every CRM table
- All policies scope TO authenticated and check EXISTS in crm_owners
- 4 policies per table (SELECT/INSERT/UPDATE/DELETE)
- No anon access — CRM is private

## Important Notes
1. The owner UUID is seeded from the known owner account.
2. Lifecycle stages and sources are stored as text (not enums) for flexibility.
3. Soft-delete via archived_at column on companies and contacts.
4. Historical revenue is stored on contacts as informational CRM data only —
   it does NOT connect to Project Finance, Payroll, or any financial system.
5. No existing tables are modified.
*/

-- ─── Owner Whitelist ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS crm_owners (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Seed the known owner account
INSERT INTO crm_owners (user_id)
VALUES ('37f594bd-16e7-49ec-b3c1-eae9177ab138')
ON CONFLICT (user_id) DO NOTHING;

ALTER TABLE crm_owners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_select_crm_owners" ON crm_owners;
CREATE POLICY "owner_select_crm_owners" ON crm_owners
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM crm_owners co WHERE co.user_id = auth.uid()));

DROP POLICY IF EXISTS "owner_insert_crm_owners" ON crm_owners;
CREATE POLICY "owner_insert_crm_owners" ON crm_owners
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM crm_owners co WHERE co.user_id = auth.uid()));

-- ─── Tags ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS crm_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text DEFAULT 'gray',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_crm_tags_name ON crm_tags (name);

ALTER TABLE crm_tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_select_crm_tags" ON crm_tags;
CREATE POLICY "owner_select_crm_tags" ON crm_tags
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "owner_insert_crm_tags" ON crm_tags;
CREATE POLICY "owner_insert_crm_tags" ON crm_tags
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "owner_update_crm_tags" ON crm_tags;
CREATE POLICY "owner_update_crm_tags" ON crm_tags
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "owner_delete_crm_tags" ON crm_tags;
CREATE POLICY "owner_delete_crm_tags" ON crm_tags
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()));

-- ─── Companies ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS crm_companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  website text,
  domain text,
  company_type text DEFAULT 'other',
  niche text,
  country text,
  lifecycle_stage text DEFAULT 'prospect',
  source text,
  original_source text,
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  archived_at timestamptz,
  last_activity_at timestamptz,
  next_follow_up_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_crm_companies_name ON crm_companies (name);
CREATE INDEX IF NOT EXISTS idx_crm_companies_domain ON crm_companies (domain);
CREATE INDEX IF NOT EXISTS idx_crm_companies_lifecycle ON crm_companies (lifecycle_stage);
CREATE INDEX IF NOT EXISTS idx_crm_companies_source ON crm_companies (source);
CREATE INDEX IF NOT EXISTS idx_crm_companies_archived ON crm_companies (archived_at);
CREATE INDEX IF NOT EXISTS idx_crm_companies_created ON crm_companies (created_at DESC);

ALTER TABLE crm_companies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_select_crm_companies" ON crm_companies;
CREATE POLICY "owner_select_crm_companies" ON crm_companies
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "owner_insert_crm_companies" ON crm_companies;
CREATE POLICY "owner_insert_crm_companies" ON crm_companies
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "owner_update_crm_companies" ON crm_companies;
CREATE POLICY "owner_update_crm_companies" ON crm_companies
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "owner_delete_crm_companies" ON crm_companies;
CREATE POLICY "owner_delete_crm_companies" ON crm_companies
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()));

-- ─── Contacts ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS crm_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text,
  last_name text,
  full_name text,
  job_title text,
  company_id uuid REFERENCES crm_companies(id) ON DELETE SET NULL,
  email text,
  phone text,
  linkedin_url text,
  fiverr_username text,
  telegram text,
  country text,
  source text,
  original_source text,
  lifecycle_stage text DEFAULT 'prospect',
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  last_contacted_at timestamptz,
  next_follow_up_at timestamptz,
  historical_revenue numeric(12,2) DEFAULT 0,
  archived_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_crm_contacts_email ON crm_contacts (email);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_fiverr ON crm_contacts (fiverr_username);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_linkedin ON crm_contacts (linkedin_url);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_company ON crm_contacts (company_id);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_lifecycle ON crm_contacts (lifecycle_stage);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_source ON crm_contacts (source);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_archived ON crm_contacts (archived_at);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_created ON crm_contacts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_name ON crm_contacts (full_name);

ALTER TABLE crm_contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_select_crm_contacts" ON crm_contacts;
CREATE POLICY "owner_select_crm_contacts" ON crm_contacts
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "owner_insert_crm_contacts" ON crm_contacts;
CREATE POLICY "owner_insert_crm_contacts" ON crm_contacts
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "owner_update_crm_contacts" ON crm_contacts;
CREATE POLICY "owner_update_crm_contacts" ON crm_contacts
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "owner_delete_crm_contacts" ON crm_contacts;
CREATE POLICY "owner_delete_crm_contacts" ON crm_contacts
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()));

-- ─── Activities ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS crm_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL DEFAULT 'note',
  contact_id uuid REFERENCES crm_contacts(id) ON DELETE CASCADE,
  company_id uuid REFERENCES crm_companies(id) ON DELETE CASCADE,
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  notes text,
  activity_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_crm_activities_contact ON crm_activities (contact_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_company ON crm_activities (company_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_date ON crm_activities (activity_date DESC);

ALTER TABLE crm_activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_select_crm_activities" ON crm_activities;
CREATE POLICY "owner_select_crm_activities" ON crm_activities
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "owner_insert_crm_activities" ON crm_activities;
CREATE POLICY "owner_insert_crm_activities" ON crm_activities
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "owner_update_crm_activities" ON crm_activities;
CREATE POLICY "owner_update_crm_activities" ON crm_activities
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "owner_delete_crm_activities" ON crm_activities;
CREATE POLICY "owner_delete_crm_activities" ON crm_activities
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()));

-- ─── Notes ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS crm_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid REFERENCES crm_contacts(id) ON DELETE CASCADE,
  company_id uuid REFERENCES crm_companies(id) ON DELETE CASCADE,
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  body text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_crm_notes_contact ON crm_notes (contact_id);
CREATE INDEX IF NOT EXISTS idx_crm_notes_company ON crm_notes (company_id);
CREATE INDEX IF NOT EXISTS idx_crm_notes_created ON crm_notes (created_at DESC);

ALTER TABLE crm_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_select_crm_notes" ON crm_notes;
CREATE POLICY "owner_select_crm_notes" ON crm_notes
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "owner_insert_crm_notes" ON crm_notes;
CREATE POLICY "owner_insert_crm_notes" ON crm_notes
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "owner_update_crm_notes" ON crm_notes;
CREATE POLICY "owner_update_crm_notes" ON crm_notes
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "owner_delete_crm_notes" ON crm_notes;
CREATE POLICY "owner_delete_crm_notes" ON crm_notes
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()));

-- ─── Follow-ups ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS crm_follow_ups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid REFERENCES crm_contacts(id) ON DELETE CASCADE,
  company_id uuid REFERENCES crm_companies(id) ON DELETE CASCADE,
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  due_date date NOT NULL DEFAULT CURRENT_DATE,
  due_time text,
  note text,
  status text NOT NULL DEFAULT 'open',
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_crm_follow_ups_contact ON crm_follow_ups (contact_id);
CREATE INDEX IF NOT EXISTS idx_crm_follow_ups_company ON crm_follow_ups (company_id);
CREATE INDEX IF NOT EXISTS idx_crm_follow_ups_status ON crm_follow_ups (status);
CREATE INDEX IF NOT EXISTS idx_crm_follow_ups_due ON crm_follow_ups (due_date);

ALTER TABLE crm_follow_ups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_select_crm_follow_ups" ON crm_follow_ups;
CREATE POLICY "owner_select_crm_follow_ups" ON crm_follow_ups
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "owner_insert_crm_follow_ups" ON crm_follow_ups;
CREATE POLICY "owner_insert_crm_follow_ups" ON crm_follow_ups
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "owner_update_crm_follow_ups" ON crm_follow_ups;
CREATE POLICY "owner_update_crm_follow_ups" ON crm_follow_ups
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "owner_delete_crm_follow_ups" ON crm_follow_ups;
CREATE POLICY "owner_delete_crm_follow_ups" ON crm_follow_ups
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()));

-- ─── Company Tags Junction ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS crm_company_tags (
  company_id uuid REFERENCES crm_companies(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES crm_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (company_id, tag_id)
);

ALTER TABLE crm_company_tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_select_crm_company_tags" ON crm_company_tags;
CREATE POLICY "owner_select_crm_company_tags" ON crm_company_tags
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "owner_insert_crm_company_tags" ON crm_company_tags;
CREATE POLICY "owner_insert_crm_company_tags" ON crm_company_tags
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "owner_delete_crm_company_tags" ON crm_company_tags;
CREATE POLICY "owner_delete_crm_company_tags" ON crm_company_tags
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()));

-- ─── Contact Tags Junction ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS crm_contact_tags (
  contact_id uuid REFERENCES crm_contacts(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES crm_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (contact_id, tag_id)
);

ALTER TABLE crm_contact_tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_select_crm_contact_tags" ON crm_contact_tags;
CREATE POLICY "owner_select_crm_contact_tags" ON crm_contact_tags
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "owner_insert_crm_contact_tags" ON crm_contact_tags;
CREATE POLICY "owner_insert_crm_contact_tags" ON crm_contact_tags
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "owner_delete_crm_contact_tags" ON crm_contact_tags;
CREATE POLICY "owner_delete_crm_contact_tags" ON crm_contact_tags
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()));

-- ─── Import History ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS crm_imports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  source text,
  rows_total int DEFAULT 0,
  rows_created int DEFAULT 0,
  rows_updated int DEFAULT 0,
  rows_skipped int DEFAULT 0,
  rows_error int DEFAULT 0,
  status text DEFAULT 'completed',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_crm_imports_created ON crm_imports (created_at DESC);

ALTER TABLE crm_imports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_select_crm_imports" ON crm_imports;
CREATE POLICY "owner_select_crm_imports" ON crm_imports
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "owner_insert_crm_imports" ON crm_imports;
CREATE POLICY "owner_insert_crm_imports" ON crm_imports
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "owner_update_crm_imports" ON crm_imports;
CREATE POLICY "owner_update_crm_imports" ON crm_imports
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "owner_delete_crm_imports" ON crm_imports;
CREATE POLICY "owner_delete_crm_imports" ON crm_imports
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM crm_owners WHERE user_id = auth.uid()));

-- ─── Updated_at triggers ─────────────────────────────────────────

CREATE OR REPLACE FUNCTION crm_touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS crm_companies_touch ON crm_companies;
CREATE TRIGGER crm_companies_touch BEFORE UPDATE ON crm_companies
  FOR EACH ROW EXECUTE FUNCTION crm_touch_updated_at();

DROP TRIGGER IF EXISTS crm_contacts_touch ON crm_contacts;
CREATE TRIGGER crm_contacts_touch BEFORE UPDATE ON crm_contacts
  FOR EACH ROW EXECUTE FUNCTION crm_touch_updated_at();

DROP TRIGGER IF EXISTS crm_notes_touch ON crm_notes;
CREATE TRIGGER crm_notes_touch BEFORE UPDATE ON crm_notes
  FOR EACH ROW EXECUTE FUNCTION crm_touch_updated_at();

DROP TRIGGER IF EXISTS crm_follow_ups_touch ON crm_follow_ups;
CREATE TRIGGER crm_follow_ups_touch BEFORE UPDATE ON crm_follow_ups
  FOR EACH ROW EXECUTE FUNCTION crm_touch_updated_at();
/*
# Fix self-referential RLS policy on crm_owners

## Problem
The SELECT policy `owner_select_crm_owners` used a self-referential subquery:
`EXISTS (SELECT 1 FROM crm_owners co WHERE co.user_id = auth.uid())`
This creates an infinite recursion under RLS — PostgreSQL treats the table as
empty for the recursive check, so NO row is ever visible to the authenticated
client. As a result, `isCrmOwner()` always returns false and every user sees
"Доступ запрещён" even when their user_id is present in the table.

## Fix
Replace the self-referential policy with a simple ownership predicate
`auth.uid() = user_id`. Each authenticated user can read only their own row,
which is exactly what the `isCrmOwner(userId)` client function needs.

## Security
- Table: crm_owners (public)
- RLS: stays enabled
- SELECT: authenticated users can check if their own user_id is an owner
- No new tables or columns
*/

DROP POLICY IF EXISTS "owner_select_crm_owners" ON public.crm_owners;

CREATE POLICY "owner_select_crm_owners"
ON public.crm_owners FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
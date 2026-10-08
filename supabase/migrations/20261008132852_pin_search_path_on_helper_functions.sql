-- F22: pin search_path on all helper functions flagged by the linter.
ALTER FUNCTION public.upsert_secret(text, text) SET search_path = public, pg_temp;
ALTER FUNCTION public.claim_email_sending(text) SET search_path = public, pg_temp;
ALTER FUNCTION public.generate_order_number() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_placements_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_orders_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_case_studies_updated_at() SET search_path = public, pg_temp;
ALTER FUNCTION public.crm_touch_updated_at() SET search_path = public, pg_temp;

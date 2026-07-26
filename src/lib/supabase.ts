import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type SeoSettings = {
  id: string;
  page: string;
  title: string;
  description: string;
  og_title: string;
  og_description: string;
  og_image: string;
  robots: string;
  canonical: string;
  keywords: string;
  schema_json: string;
  updated_at: string;
  updated_by: string | null;
};

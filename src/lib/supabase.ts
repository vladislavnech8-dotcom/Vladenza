import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type SeoSettings = {
  id: string;
  page: string;
  locale: string;
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

export type SeoRevision = {
  id: string;
  number: number;
  metadata: Record<string, {
    title: string;
    description: string;
    og_title: string;
    og_description: string;
    og_image: string;
    robots: string;
    canonical: string;
    schema_json: string;
    locale: string;
  }>;
  status: 'pending' | 'active' | 'failed' | 'superseded' | 'cancelled';
  created_by: string | null;
  created_at: string;
  activated_at: string | null;
  failed_at: string | null;
  cancelled_at: string | null;
  failure_reason: string | null;
  html_hash: string | null;
  activated_by: string | null;
};

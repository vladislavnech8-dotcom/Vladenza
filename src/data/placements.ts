import { supabase } from '../lib/supabase';

export type PlacementServiceType = 'niche_edit' | 'guest_post' | 'crowd_link';
export type PlacementStatus = 'active' | 'hidden';

export interface Placement {
  id: string;
  service_type: PlacementServiceType;
  domain: string;
  placement_url: string;
  title: string;
  niche: string;
  dr: number;
  traffic: number;
  keywords: number | null;
  screenshot_url: string;
  status: PlacementStatus;
  featured: boolean;
  homepage_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export const SERVICE_TYPE_LABELS: Record<PlacementServiceType, string> = {
  niche_edit: 'Niche Edit',
  guest_post: 'Guest Post',
  crowd_link: 'Crowd Link',
};

export const SERVICE_TYPE_VALUES: PlacementServiceType[] = ['niche_edit', 'guest_post', 'crowd_link'];

export const PLACEMENT_NICHE_PRESETS = [
  'Tech', 'Marketing', 'Health', 'iGaming', 'SaaS', 'Crypto',
  'Automotive', 'FinTech', 'Dating', 'Software', 'Local SEO', 'E-commerce',
  'Finance', 'Education', 'Travel', 'Legal', 'Real Estate',
];

function formatTraffic(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  return n.toLocaleString();
}

export { formatTraffic };

export async function fetchPlacements(filters?: {
  service_type?: PlacementServiceType;
  status?: PlacementStatus;
  homepage_featured?: boolean;
  limit?: number;
}): Promise<Placement[]> {
  let query = supabase.from('placements').select('*').order('sort_order', { ascending: true });
  if (filters?.service_type) query = query.eq('service_type', filters.service_type);
  if (filters?.status) query = query.eq('status', filters.status);
  if (filters?.homepage_featured) query = query.eq('homepage_featured', true);
  if (filters?.limit) query = query.limit(filters.limit);
  const { data, error } = await query;
  if (error) {
    console.error('fetchPlacements error:', error.message);
    return [];
  }
  return (data ?? []) as Placement[];
}

export async function fetchAllPlacements(): Promise<Placement[]> {
  const { data, error } = await supabase
    .from('placements')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) return [];
  return (data ?? []) as Placement[];
}

export function getPlacementNiches(placements: Placement[]): string[] {
  return Array.from(new Set(placements.map((p) => p.niche).filter(Boolean))).sort();
}

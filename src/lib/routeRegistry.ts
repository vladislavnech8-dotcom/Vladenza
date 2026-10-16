/**
 * Single source of truth for all route metadata.
 * Consumed by useSEO.ts, prerender.mjs, and the admin SeoPanel.
 */

export type RouteStatus = 'indexable' | 'noindex' | 'redirect_301' | 'gone_410';
export type Locale = 'en' | 'uk';

export interface RouteEntry {
  /** Content route path without locale prefix, e.g. '/' or '/services/guest-posting' */
  path: string;
  /** Human-readable label for admin UI */
  label: string;
  /** Indexation status */
  status: RouteStatus;
  /** If redirect_301, the destination path */
  redirectTo?: string;
  /** Whether this route exists in UK locale */
  ukAvailable: boolean;
  /** Whether UK version is independently indexable */
  ukIndexable: boolean;
  /** Route grouping for admin UI */
  type: 'home' | 'service' | 'case-studies' | 'blog' | 'legal' | 'utility' | 'redirect' | 'gone';
}

// ─── Static routes ──────────────────────────────────────────────────

const STATIC_ROUTES: RouteEntry[] = [
  { path: '/', label: 'Home', status: 'indexable', ukAvailable: true, ukIndexable: true, type: 'home' },
  { path: '/services/guest-posting', label: 'Guest Posting', status: 'indexable', ukAvailable: true, ukIndexable: true, type: 'service' },
  { path: '/services/niche-edits', label: 'Niche Edits', status: 'indexable', ukAvailable: true, ukIndexable: true, type: 'service' },
  { path: '/services/crowd-links', label: 'Crowd Marketing', status: 'indexable', ukAvailable: true, ukIndexable: true, type: 'service' },
  { path: '/services/white-label', label: 'White Label', status: 'indexable', ukAvailable: true, ukIndexable: true, type: 'service' },
  { path: '/placements', label: 'Placements', status: 'indexable', ukAvailable: true, ukIndexable: false, type: 'utility' },
  { path: '/contact', label: 'Contact', status: 'indexable', ukAvailable: true, ukIndexable: true, type: 'utility' },
  { path: '/pricing', label: 'Pricing', status: 'indexable', ukAvailable: true, ukIndexable: true, type: 'utility' },
  { path: '/case-studies', label: 'Case Studies', status: 'indexable', ukAvailable: true, ukIndexable: true, type: 'case-studies' },
  { path: '/blog', label: 'Blog', status: 'indexable', ukAvailable: true, ukIndexable: false, type: 'blog' },

  // Noindex static routes
  { path: '/services/seo-audit', label: 'SEO Audit', status: 'noindex', ukAvailable: true, ukIndexable: false, type: 'service' },
  { path: '/services/ai-llm', label: 'AI & LLM Visibility', status: 'noindex', ukAvailable: true, ukIndexable: false, type: 'service' },
  { path: '/services/linkedin-personal', label: 'LinkedIn Personal', status: 'noindex', ukAvailable: true, ukIndexable: false, type: 'service' },
  { path: '/services/linkedin-company', label: 'LinkedIn Company', status: 'noindex', ukAvailable: true, ukIndexable: false, type: 'service' },
  { path: '/seo-audit-sample', label: 'SEO Audit Sample', status: 'noindex', ukAvailable: true, ukIndexable: false, type: 'utility' },
  { path: '/sitemap', label: 'Sitemap Page', status: 'noindex', ukAvailable: true, ukIndexable: false, type: 'utility' },
  { path: '/checkout', label: 'Checkout', status: 'noindex', ukAvailable: true, ukIndexable: false, type: 'utility' },
  { path: '/privacy-policy', label: 'Privacy Policy', status: 'noindex', ukAvailable: true, ukIndexable: false, type: 'legal' },
  { path: '/terms', label: 'Terms of Service', status: 'noindex', ukAvailable: true, ukIndexable: false, type: 'legal' },
  { path: '/refund-policy', label: 'Refund Policy', status: 'noindex', ukAvailable: true, ukIndexable: false, type: 'legal' },
  { path: '/cookie-policy', label: 'Cookie Policy', status: 'noindex', ukAvailable: true, ukIndexable: false, type: 'legal' },

  // 301 redirects
  { path: '/reviews', label: 'Reviews (→ Case Studies)', status: 'redirect_301', redirectTo: '/case-studies/', ukAvailable: true, ukIndexable: false, type: 'redirect' },
  { path: '/services/local-seo-links', label: 'Local SEO Links (→ Niche Edits)', status: 'redirect_301', redirectTo: '/services/niche-edits/', ukAvailable: true, ukIndexable: false, type: 'redirect' },
  { path: '/services/link-packages/auto', label: 'Link Packages: Auto (→ Niche Edits)', status: 'redirect_301', redirectTo: '/services/niche-edits/', ukAvailable: true, ukIndexable: false, type: 'redirect' },
  { path: '/services/link-packages/saas', label: 'Link Packages: SaaS (→ Niche Edits)', status: 'redirect_301', redirectTo: '/services/niche-edits/', ukAvailable: true, ukIndexable: false, type: 'redirect' },
  { path: '/services/link-packages/igaming', label: 'Link Packages: iGaming (→ Niche Edits)', status: 'redirect_301', redirectTo: '/services/niche-edits/', ukAvailable: true, ukIndexable: false, type: 'redirect' },
  { path: '/services/link-packages/health', label: 'Link Packages: Health (→ Niche Edits)', status: 'redirect_301', redirectTo: '/services/niche-edits/', ukAvailable: true, ukIndexable: false, type: 'redirect' },
  { path: '/services/link-packages/proxy', label: 'Link Packages: Proxy (→ Niche Edits)', status: 'redirect_301', redirectTo: '/services/niche-edits/', ukAvailable: true, ukIndexable: false, type: 'redirect' },
  { path: '/services/link-packages/renovations', label: 'Link Packages: Renovations (→ Niche Edits)', status: 'redirect_301', redirectTo: '/services/niche-edits/', ukAvailable: true, ukIndexable: false, type: 'redirect' },
  { path: '/services/crowd-links/english', label: 'Crowd Links: English (→ Crowd Links)', status: 'redirect_301', redirectTo: '/services/crowd-links/', ukAvailable: true, ukIndexable: false, type: 'redirect' },
  { path: '/blog/backlink-quality-guide', label: 'Blog: Backlink Quality (→ 5 Facts)', status: 'redirect_301', redirectTo: '/blog/5-facts-about-backlinks/', ukAvailable: true, ukIndexable: false, type: 'redirect' },
  { path: '/blog/dofollow-vs-nofollow-links', label: 'Blog: Dofollow vs Nofollow (→ 5 Facts)', status: 'redirect_301', redirectTo: '/blog/5-facts-about-backlinks/', ukAvailable: true, ukIndexable: false, type: 'redirect' },
  { path: '/blog/organic-seo-inbound-clients', label: 'Blog: Organic SEO Inbound (→ Services Guide)', status: 'redirect_301', redirectTo: '/blog/link-building-services-guide/', ukAvailable: true, ukIndexable: false, type: 'redirect' },

  // 410 Gone
  { path: '/services/crowd-links/korean', label: 'Crowd Links: Korean (410 Gone)', status: 'gone_410', ukAvailable: true, ukIndexable: false, type: 'gone' },
  { path: '/services/crowd-links/portuguese', label: 'Crowd Links: Portuguese (410 Gone)', status: 'gone_410', ukAvailable: true, ukIndexable: false, type: 'gone' },
];

// ─── Dynamic route slug lists ───────────────────────────────────────

export const INDEXABLE_CASE_SLUGS = [
  'dating-5x-traffic',
  'saas-non-brand-traffic',
  'igaming-domain-authority',
  'crypto-page1-ranking',
  'health-google-update-recovery',
  'igaming-20k-traffic',
  'crypto-forum-x10-traffic',
];

export const UNVERIFIED_CASE_SLUGS = [
  'automotive-keyword-rankings',
  'fintech-lead-generation',
  'health-organic-growth',
  'software-263-traffic',
];

export const INDEXABLE_BLOG_SLUGS = [
  '5-facts-about-backlinks',
  'crowd-marketing-website-promotion',
  'geo-get-cited-by-chatgpt-2025',
  'igaming-seo-link-building-2025',
  'link-building-2026',
  'link-building-german-websites',
  'link-building-services-guide',
  'saas-link-building',
  'white-label-seo',
  'how-long-does-link-building-take',
  'niche-edits-vs-guest-posts',
  'how-to-analyze-competitor-backlinks',
];

export const NOINDEX_BLOG_SLUGS = [
  'seo-redirects-guide',
];

export const CROWD_LINKS_LANGUAGES = ['german', 'french', 'spanish'];

// ─── Derived helpers ────────────────────────────────────────────────

const STATIC_BY_PATH = new Map(STATIC_ROUTES.map((r) => [r.path, r]));

export function getStaticRoute(path: string): RouteEntry | undefined {
  return STATIC_BY_PATH.get(path);
}

export function getStaticRoutes(status?: RouteStatus): RouteEntry[] {
  return status ? STATIC_ROUTES.filter((r) => r.status === status) : STATIC_ROUTES;
}

/**
 * Check if a given pathname is indexable.
 * Handles both EN and UK paths (UK paths start with /uk).
 */
export function isIndexableRoute(pathname: string): boolean {
  const isUk = pathname.startsWith('/uk');
  const normalized = isUk ? pathname.slice(3) || '/' : pathname;
  const stripped = normalized.endsWith('/') && normalized !== '/' ? normalized.slice(0, -1) : normalized;

  if (isUk) {
    const entry = STATIC_BY_PATH.get(stripped);
    if (entry) return entry.status === 'indexable' && entry.ukIndexable;
    const caseMatch = stripped.match(/^\/case-studies\/(.+)$/);
    if (caseMatch) return INDEXABLE_CASE_SLUGS.includes(caseMatch[1]);
    return false;
  }

  const entry = STATIC_BY_PATH.get(stripped);
  if (entry) return entry.status === 'indexable';
  const caseMatch = stripped.match(/^\/case-studies\/(.+)$/);
  if (caseMatch) return INDEXABLE_CASE_SLUGS.includes(caseMatch[1]);
  const blogMatch = stripped.match(/^\/blog\/(.+)$/);
  if (blogMatch) return INDEXABLE_BLOG_SLUGS.includes(blogMatch[1]);
  return false;
}

/**
 * Check if both EN and UK versions of a route are indexable.
 */
export function isBothLocalesIndexable(pathname: string): boolean {
  const isUk = pathname.startsWith('/uk');
  const contentRoute = isUk ? pathname.slice(3) || '/' : pathname;
  const enPath = contentRoute;
  const ukPath = enPath === '/' ? '/uk' : '/uk' + enPath;
  return isIndexableRoute(enPath) && isIndexableRoute(ukPath);
}

/**
 * Get hreflang pair for a pathname.
 */
export function getHreflangPair(pathname: string): { en: string; uk: string } {
  const SITE_URL = 'https://vladenza.com';
  let enPath = pathname;
  let ukPath = pathname;
  if (pathname.startsWith('/uk')) {
    enPath = pathname.slice(3) || '/';
    ukPath = pathname;
  } else {
    enPath = pathname;
    ukPath = pathname === '/' ? '/uk' : '/uk' + pathname;
  }
  const normalize = (url: string) => (url.endsWith('/') ? url : url + '/');
  return {
    en: normalize(`${SITE_URL}${enPath}`),
    uk: normalize(`${SITE_URL}${ukPath}`),
  };
}

/**
 * Convert a pathname to a page key for seo_settings (without locale).
 * e.g. '/' → 'home', '/services/guest-posting' → 'services/guest-posting'
 */
export function pathnameToPageKey(pathname: string): string {
  const isUk = pathname.startsWith('/uk');
  const normalized = isUk ? pathname.slice(3) || '/' : pathname;
  const stripped = normalized.endsWith('/') && normalized !== '/' ? normalized.slice(0, -1) : normalized;
  return stripped === '/' ? 'home' : stripped.slice(1);
}

/**
 * Get all editable page keys (indexable + noindex static routes, no redirects/gone).
 */
export function getEditablePageKeys(): { value: string; label: string; type: string }[] {
  return STATIC_ROUTES
    .filter((r) => r.status === 'indexable' || r.status === 'noindex')
    .map((r) => ({
      value: r.path === '/' ? 'home' : r.path.slice(1),
      label: r.label,
      type: r.type,
    }));
}

/**
 * Get all indexable routes for sitemap generation.
 * Returns { path, ukAvailable, ukIndexable } for each.
 */
export function getIndexableStaticRoutes(): RouteEntry[] {
  return STATIC_ROUTES.filter((r) => r.status === 'indexable');
}

/**
 * Get all noindex static routes for prerender.
 */
export function getNoindexStaticRoutes(): RouteEntry[] {
  return STATIC_ROUTES.filter((r) => r.status === 'noindex');
}

/**
 * Route registry data for Node.js / prerender use.
 * This mirrors src/lib/routeRegistry.ts but in plain JS (no TypeScript)
 * so prerender.mjs can import it directly without compilation.
 *
 * KEEP IN SYNC with src/lib/routeRegistry.ts.
 */

export const INDEXABLE_STATIC = [
  '/',
  '/services/guest-posting',
  '/services/niche-edits',
  '/services/crowd-links',
  '/services/white-label',
  '/placements',
  '/contact',
  '/pricing',
  '/case-studies',
  '/blog',
];

export const UK_INDEXABLE_STATIC = [
  '/',
  '/services/guest-posting',
  '/services/niche-edits',
  '/services/crowd-links',
  '/services/white-label',
  '/contact',
  '/pricing',
  '/case-studies',
];

export const NOINDEX_STATIC = [
  '/services/seo-audit',
  '/services/ai-llm',
  '/services/linkedin-personal',
  '/services/linkedin-company',
  '/seo-audit-sample',
  '/sitemap',
  '/checkout',
  '/privacy-policy',
  '/terms',
  '/refund-policy',
  '/cookie-policy',
];

export const UK_NOINDEX_STATIC = [
  '/services/seo-audit',
  '/services/ai-llm',
  '/services/linkedin-personal',
  '/services/linkedin-company',
  '/seo-audit-sample',
  '/sitemap',
  '/checkout',
  '/privacy-policy',
  '/terms',
  '/refund-policy',
  '/cookie-policy',
  '/placements',
  '/blog',
];

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

export const REDIRECTED_ROUTES = [
  '/reviews',
  '/services/local-seo-links',
  '/services/link-packages/auto',
  '/services/link-packages/saas',
  '/services/link-packages/igaming',
  '/services/link-packages/health',
  '/services/link-packages/proxy',
  '/services/link-packages/renovations',
  '/services/crowd-links/english',
  '/blog/backlink-quality-guide',
  '/blog/dofollow-vs-nofollow-links',
  '/blog/organic-seo-inbound-clients',
];

export const GONE_ROUTES = [
  '/services/crowd-links/korean',
  '/services/crowd-links/portuguese',
];

/**
 * Check if a content route (without locale prefix) is indexable in EN.
 */
export function isEnIndexable(route) {
  if (INDEXABLE_STATIC.includes(route)) return true;
  const caseMatch = route.match(/^\/case-studies\/(.+)$/);
  if (caseMatch) return INDEXABLE_CASE_SLUGS.includes(caseMatch[1]);
  const blogMatch = route.match(/^\/blog\/(.+)$/);
  if (blogMatch) return INDEXABLE_BLOG_SLUGS.includes(blogMatch[1]);
  return false;
}

/**
 * Check if a content route (without locale prefix) is indexable in UK.
 */
export function isUkIndexable(route) {
  if (UK_INDEXABLE_STATIC.includes(route)) return true;
  const caseMatch = route.match(/^\/case-studies\/(.+)$/);
  if (caseMatch) return INDEXABLE_CASE_SLUGS.includes(caseMatch[1]);
  return false;
}

/**
 * Only emit hreflang if BOTH en and uk versions are indexable.
 */
export function shouldHaveHreflang(contentRoute, locale) {
  if (locale === 'uk') {
    return isUkIndexable(contentRoute) && isEnIndexable(contentRoute);
  }
  return isEnIndexable(contentRoute) && isUkIndexable(contentRoute);
}

/**
 * Check if both EN and UK versions of a route are indexable.
 */
export function isBothLocalesIndexable(pathname) {
  const isUk = pathname.startsWith('/uk');
  const contentRoute = isUk ? pathname.slice(3) || '/' : pathname;
  const enPath = contentRoute;
  const ukPath = enPath === '/' ? '/uk' : '/uk' + enPath;
  return isEnIndexable(enPath) && isUkIndexable(ukPath);
}

/**
 * Get hreflang pair for a pathname.
 */
export function getHreflangPair(pathname) {
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
  const normalize = (url) => (url.endsWith('/') ? url : url + '/');
  return {
    en: normalize(`${SITE_URL}${enPath}`),
    uk: normalize(`${SITE_URL}${ukPath}`),
  };
}

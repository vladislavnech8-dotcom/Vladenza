import { useEffect } from 'react';
const SITE_URL = 'https://vladenza.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.svg`;

export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  schema?: object;
  noindex?: boolean;
}

export let lastRenderedSEO: SEOProps | null = null;

function clampDescription(text: string, max = 158): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const lastSpace = slice.lastIndexOf(' ');
  return (lastSpace > 60 ? slice.slice(0, lastSpace) : slice).replace(/[\s,;:.\u2013\u2014-]+$/, '');
}

function buildCanonicalFromLocation(): string {
  if (typeof window === 'undefined') return SITE_URL;
  const { pathname } = window.location;
  const normalized = pathname.endsWith('/') && pathname !== '/'
    ? pathname.slice(0, -1)
    : pathname;
  return `${SITE_URL}${normalized || ''}`;
}

function normalizeTrailingSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`;
}

const INDEXABLE_STATIC_ROUTES = [
  '/', '/services/guest-posting', '/services/niche-edits', '/services/crowd-links',
  '/services/white-label', '/placements', '/pricing', '/case-studies', '/blog',
];
const INDEXABLE_CASE_SLUGS = [
  'dating-5x-traffic', 'saas-non-brand-traffic', 'igaming-domain-authority',
  'crypto-page1-ranking', 'health-google-update-recovery', 'igaming-20k-traffic',
  'crypto-forum-x10-traffic',
];
const RETAINED_BLOG_SLUGS = [
  '5-facts-about-backlinks', 'crowd-marketing-website-promotion',
  'geo-get-cited-by-chatgpt-2025', 'igaming-seo-link-building-2025',
  'link-building-2026', 'link-building-german-websites', 'link-building-services-guide',
  'saas-link-building', 'white-label-seo', 'how-long-does-link-building-take',
  'niche-edits-vs-guest-posts', 'how-to-analyze-competitor-backlinks',
];

function isIndexableRoute(pathname: string): boolean {
  const normalized = pathname.startsWith('/uk') ? pathname.slice(3) || '/' : pathname;
  const stripped = normalized.endsWith('/') && normalized !== '/' ? normalized.slice(0, -1) : normalized;
  if (INDEXABLE_STATIC_ROUTES.includes(stripped)) return true;
  const caseMatch = stripped.match(/^\/case-studies\/(.+)$/);
  if (caseMatch) return INDEXABLE_CASE_SLUGS.includes(caseMatch[1]);
  const blogMatch = stripped.match(/^\/blog\/(.+)$/);
  if (blogMatch) return RETAINED_BLOG_SLUGS.includes(blogMatch[1]);
  return false;
}

function getHreflangPair(pathname: string): { en: string; uk: string } {
  let enPath = pathname;
  let ukPath = pathname;
  if (pathname.startsWith('/uk')) {
    enPath = pathname.slice(3) || '/';
    ukPath = pathname;
  } else {
    enPath = pathname;
    ukPath = pathname === '/' ? '/uk' : '/uk' + pathname;
  }
  return {
    en: normalizeTrailingSlash(`${SITE_URL}${enPath}`),
    uk: normalizeTrailingSlash(`${SITE_URL}${ukPath}`),
  };
}

export function useSEO({ title, description, canonical, ogImage, schema, noindex }: SEOProps) {
  const resolvedCanonical = normalizeTrailingSlash(canonical || buildCanonicalFromLocation());

  if (typeof window === 'undefined') {
    lastRenderedSEO = { title, description, canonical: resolvedCanonical, ogImage, schema, noindex };
  }

  useEffect(() => {
    document.title = title;
    const desc = clampDescription(description);
    const image = ogImage || DEFAULT_OG_IMAGE;
    const pageUrl = resolvedCanonical;
    setMeta('name', 'description', desc);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:url', pageUrl);
    setMeta('property', 'og:site_name', 'Vladenza');
    setMeta('property', 'og:image', image);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', desc);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:image', image);

    // Remove existing canonical + hreflang + robots
    document.querySelectorAll('link[rel="canonical"]').forEach((el) => el.remove());
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
    document.querySelectorAll('meta[name="robots"]').forEach((el) => el.remove());

    // Robots meta (noindex for checkout pages)
    if (noindex) {
      const robotsEl = document.createElement('meta');
      robotsEl.setAttribute('name', 'robots');
      robotsEl.setAttribute('content', 'noindex,follow');
      document.head.appendChild(robotsEl);
    }

    // Canonical
    const canonicalEl = document.createElement('link');
    canonicalEl.rel = 'canonical';
    canonicalEl.href = pageUrl;
    document.head.appendChild(canonicalEl);

    // Hreflang — only for indexable routes with reciprocal EN/UK pairs
    const { pathname } = window.location;
    const isIndexable = isIndexableRoute(pathname);
    if (isIndexable) {
      const pair = getHreflangPair(pathname);
      const hreflangs: Array<{ hreflang: string; href: string }> = [
        { hreflang: 'en', href: pair.en },
        { hreflang: 'uk', href: pair.uk },
        { hreflang: 'x-default', href: pair.en },
      ];
      for (const h of hreflangs) {
        const link = document.createElement('link');
        link.rel = 'alternate';
        link.setAttribute('hreflang', h.hreflang);
        link.href = h.href;
        document.head.appendChild(link);
      }
    }

    const schemaId = 'ld-json-schema';
    let schemaEl = document.getElementById(schemaId);
    if (schema) {
      if (!schemaEl) {
        schemaEl = document.createElement('script');
        schemaEl.id = schemaId;
        (schemaEl as HTMLScriptElement).type = 'application/ld+json';
        document.head.appendChild(schemaEl);
      }
      schemaEl.textContent = JSON.stringify(schema);
    } else if (schemaEl) {
      schemaEl.remove();
    }
  }, [title, description, canonical, ogImage, schema, noindex]);
}

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

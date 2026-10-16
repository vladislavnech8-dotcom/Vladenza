import { useEffect } from 'react';
import { isIndexableRoute, isBothLocalesIndexable, getHreflangPair } from '../lib/routeRegistry';
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

function clampDescription(text: string, max = 180): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const lastSpace = slice.lastIndexOf(' ');
  return (lastSpace > 60 ? slice.slice(0, lastSpace) : slice).replace(/[\s,;:.\u2013\u2014-]+$/, '');
}

function buildCanonicalFromLocation(): string {
  if (typeof window === 'undefined') return SITE_URL;
  const { pathname } = window.location;
  if (pathname === '/' || pathname === '') return `${SITE_URL}/`;
  const normalized = pathname.endsWith('/') ? pathname : pathname + '/';
  return `${SITE_URL}${normalized}`;
}

function normalizeTrailingSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`;
}

export function useSEO({ title, description, canonical, ogImage, schema, noindex }: SEOProps) {
  const resolvedCanonical = normalizeTrailingSlash(canonical || buildCanonicalFromLocation());

  if (typeof window === 'undefined') {
    lastRenderedSEO = { title, description, canonical: resolvedCanonical, ogImage, schema, noindex };
  }

  useEffect(() => {
    // 1. Set hardcoded metadata immediately (no flash of wrong content)
    let effectiveTitle = title;
    let effectiveDescription = description;
    let effectiveOgImage = ogImage || DEFAULT_OG_IMAGE;
    let effectiveCanonical = resolvedCanonical;

    // 2. Check for embedded SEO manifest (from prerendered HTML)
    const manifestEl = document.getElementById('seo-manifest');
    if (manifestEl) {
      try {
        const manifest = JSON.parse(manifestEl.textContent || '{}');
        const { pathname } = window.location;
        const isUk = pathname.startsWith('/uk');
        const contentRoute = isUk ? pathname.slice(3) || '/' : pathname;
        const pageKey = contentRoute === '/' ? 'home' : contentRoute.replace(/^\//, '').replace(/\/$/, '');
        const entry = manifest.metadata?.[pageKey];
        if (entry) {
          if (entry.title) effectiveTitle = entry.title;
          if (entry.description) effectiveDescription = entry.description;
          if (entry.og_image) effectiveOgImage = entry.og_image;
          if (entry.canonical) effectiveCanonical = entry.canonical;
        }
      } catch {
        // Manifest parse failed — use hardcoded values
      }
    }

    document.title = effectiveTitle;
    const desc = clampDescription(effectiveDescription);
    const image = effectiveOgImage;
    const pageUrl = effectiveCanonical;
    setMeta('name', 'description', desc);
    setMeta('property', 'og:title', effectiveTitle);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:url', pageUrl);
    setMeta('property', 'og:site_name', 'Vladenza');
    setMeta('property', 'og:image', image);
    setMeta('name', 'twitter:title', effectiveTitle);
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

    // Hreflang — only when BOTH en and uk routes are indexable
    const { pathname } = window.location;
    if (isBothLocalesIndexable(pathname)) {
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

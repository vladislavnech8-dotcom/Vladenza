import { useLayoutEffect } from 'react';
const SITE_URL = 'https://vladenza.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.svg`;

export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  schema?: object;
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

export function useSEO({ title, description, canonical, ogImage, schema }: SEOProps) {
  if (typeof window === 'undefined') {
    lastRenderedSEO = { title, description, canonical, ogImage, schema };
  }

  useLayoutEffect(() => {
    document.title = title;
    const desc = clampDescription(description);
    const image = ogImage || DEFAULT_OG_IMAGE;
    const pageUrl = canonical || buildCanonicalFromLocation();
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
    const existing = document.querySelectorAll('link[rel="canonical"]');
    existing.forEach((el) => el.remove());
    const canonicalEl = document.createElement('link');
    canonicalEl.rel = 'canonical';
    canonicalEl.href = pageUrl;
    document.head.appendChild(canonicalEl);
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
  }, [title, description, canonical, ogImage, schema]);
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

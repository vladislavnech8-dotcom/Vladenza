import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://vladenza.com';

function buildCanonicalUrl(pathname: string): string {
  if (pathname === '/' || pathname === '') {
    return `${SITE_URL}/`;
  }
  const normalized = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  return `${SITE_URL}${normalized}`;
}

export function useCanonical() {
  const location = useLocation();
  useEffect(() => {
    const canonicalUrl = buildCanonicalUrl(location.pathname);
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonicalUrl);
  }, [location.pathname]);
}

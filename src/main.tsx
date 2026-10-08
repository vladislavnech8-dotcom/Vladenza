import { StrictMode, useEffect, useRef } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter, useLocation } from 'react-router-dom';
import App from './App.tsx';
import { trackMetaEvent, captureUtmParams } from './lib/analytics';
import './index.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

const UA_BLOCKED = ['Googlebot','Bingbot','Slurp','DuckDuckBot','Baiduspider','YandexBot','Sogou','Exabot','ia_archiver','SemrushBot','AhrefsBot','MJ12bot'];

function maybeRedirectToUkianian() {
  if (window.location.pathname !== '/') return;
  try {
    const stored = localStorage.getItem('vladenza_locale');
    if (stored) return; // respect manual choice
  } catch { return; }
  const ua = navigator.userAgent;
  if (UA_BLOCKED.some((b) => ua.includes(b))) return;
  const langs = navigator.languages ?? [navigator.language ?? ''];
  const hasUk = langs.some((l) => l.toLowerCase().startsWith('uk'));
  if (hasUk) {
    const dest = new URL('/uk/', window.location.origin);
    dest.search = window.location.search; // preserve gclid, utm params
    window.location.replace(dest.toString());
  }
}

function MetaPixelRouteTracker() {
  const { pathname } = useLocation();
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      captureUtmParams();
      return;
    }
    trackMetaEvent('PageView');
  }, [pathname]);
  return null;
}

const rootEl = document.getElementById('root')!;

maybeRedirectToUkianian();

const app = (
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <MetaPixelRouteTracker />
      <App />
    </BrowserRouter>
  </StrictMode>
);

if (rootEl.hasChildNodes()) {
  hydrateRoot(rootEl, app);
} else {
  createRoot(rootEl).render(app);
}

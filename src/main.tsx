import { StrictMode, useEffect } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter, useLocation } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

const rootEl = document.getElementById('root')!;

const app = (
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <App />
    </BrowserRouter>
  </StrictMode>
);

if (rootEl.hasChildNodes()) {
  hydrateRoot(rootEl, app);
} else {
  createRoot(rootEl).render(app);
}

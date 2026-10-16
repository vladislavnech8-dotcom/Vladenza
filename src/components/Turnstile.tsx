import { useEffect, useRef, useState, useCallback } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById('cf-turnstile-script') as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Turnstile')));
      return;
    }
    const script = document.createElement('script');
    script.id = 'cf-turnstile-script';
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Turnstile'));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

interface TurnstileProps {
  onToken: (token: string) => void;
  className?: string;
}

export default function Turnstile({ onToken, className }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  const handleToken = useCallback((token: string) => {
    onToken(token);
  }, [onToken]);

  useEffect(() => {
    if (!siteKey) {
      // No site key configured — skip Turnstile silently
      onToken('');
      return;
    }

    let cancelled = false;

    loadScript().then(() => {
      if (cancelled || !containerRef.current || !window.turnstile) return;
      setLoaded(true);
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme: 'light',
        size: 'normal',
        callback: handleToken,
        'error-callback': () => setError(true),
        'expired-callback': () => handleToken(''),
      });
    }).catch(() => {
      if (!cancelled) setError(true);
    });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        try { window.turnstile.remove(widgetIdRef.current); } catch { /* ignore */ }
      }
    };
  }, [siteKey, handleToken, onToken]);

  if (!siteKey) return null;

  return (
    <div className={className}>
      <div ref={containerRef} className="min-h-[65px]" />
      {error && (
        <p className="text-xs text-ink/40 mt-1">
          Verification widget failed to load. Please refresh the page.
        </p>
      )}
      {!loaded && !error && (
        <div className="h-[65px] flex items-center">
          <div className="w-4 h-4 border-2 border-ink/20 border-t-signal rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export type AnalyticsEvent =
  | 'view_packages'
  | 'view_placement'
  | 'view_screenshot'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'begin_checkout'
  | 'add_payment_info'
  | 'requirements_completed'
  | 'payment_started'
  | 'purchase'
  | 'get_link_plan';

export function trackEvent(
  event: AnalyticsEvent,
  params?: Record<string, unknown>
): void {
  if (typeof window === 'undefined') return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', event, params);
  }
}

declare global {
  interface Window {
    __fbqPending?: Array<() => void>;
  }
}

export function trackMetaEvent(
  event: string,
  params?: Record<string, unknown>
): void {
  if (typeof window === 'undefined') return;

  const fire = () => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', event, params);
    }
  };

  if (typeof window.fbq === 'function') {
    fire();
  } else {
    if (!window.__fbqPending) window.__fbqPending = [];
    window.__fbqPending.push(fire);
  }
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;
const UTM_STORAGE_KEY = 'vladenza_utm';

export function captureUtmParams(): void {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  let hasUtm = false;
  for (const key of UTM_KEYS) {
    const val = params.get(key);
    if (val) { utm[key] = val; hasUtm = true; }
  }
  if (hasUtm) {
    try { sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm)); } catch { /* ignore */ }
  }
}

export function getStoredUtmParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = sessionStorage.getItem(UTM_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

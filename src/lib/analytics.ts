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

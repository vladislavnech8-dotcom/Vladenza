declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export type AnalyticsEvent =
  | 'view_packages'
  | 'view_placement'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'begin_checkout'
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

  if (typeof window.fbq === 'function') {
    window.fbq('track', event, params);
  }
}

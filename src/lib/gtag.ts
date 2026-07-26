declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Replace REPLACE_ME with your Google Ads conversion label
// Find it in Google Ads → Goals → Conversions → your conversion → Tag details
// It looks like: AW-16851233410/AbCdEfGhIjKlMnOp
const CONVERSION_ID = 'AW-16851233410/K9nFCMbw57EcEILVpeM-';

export function trackConversion() {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'conversion', {
      send_to: CONVERSION_ID,
    });
  }
}

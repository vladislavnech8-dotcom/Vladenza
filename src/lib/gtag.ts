declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Google Ads conversion IDs — one per conversion type for proper attribution
const LEAD_CONVERSION_ID = 'AW-16851233410/K9nFCMbw57EcEILVpeM-';
const PURCHASE_CONVERSION_ID = 'AW-16851233410/TO_REPLACE_PURCHASE';

export function trackLeadConversion() {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'conversion', {
      send_to: LEAD_CONVERSION_ID,
    });
  }
}

export function trackPurchaseConversion(transactionId: string, value: number) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'conversion', {
      send_to: PURCHASE_CONVERSION_ID,
      value,
      currency: 'USD',
      transaction_id: transactionId,
    });
  }
}

/** @deprecated Use trackLeadConversion or trackPurchaseConversion for specific events */
export function trackConversion() {
  trackLeadConversion();
}

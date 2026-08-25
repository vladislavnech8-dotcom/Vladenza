import { supabase } from './supabase';

const WFP_WIDGET_SRC = 'https://secure.wayforpay.com/server/pay-widget.js';

interface WfpCheckoutData {
  merchantAccount: string;
  merchantDomainName: string;
  merchantTransactionSecureType: string;
  authorizationType: string;
  merchantSignature: string;
  orderReference: string;
  orderDate: number;
  amount: number;
  currency: string;
  productName: string[];
  productCount: number[];
  productPrice: number[];
  clientFirstName: string;
  clientLastName: string;
  clientEmail: string;
  clientPhone: string;
  language: string;
  serviceUrl: string;
}

declare global {
  interface Window {
    Wayforpay?: new () => {
      run: (
        data: WfpCheckoutData,
        onApproved: (r: unknown) => void,
        onDeclined: (r: unknown) => void,
        onPending: (r: unknown) => void
      ) => void;
    };
  }
}

function loadWidgetScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Wayforpay) {
      resolve();
      return;
    }
    const existing = document.getElementById('wfp-widget-script') as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load WayForPay widget')));
      return;
    }
    const script = document.createElement('script');
    script.id = 'wfp-widget-script';
    script.src = WFP_WIDGET_SRC;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load WayForPay widget'));
    document.body.appendChild(script);
  });
}

export type WfpOutcome = 'approved' | 'declined' | 'pending';

export interface CartItemInput {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

export async function payWithWayForPay(params: {
  items?: CartItemInput[];
  packageName?: string;
  amount?: number;
  currency?: string;
  name: string;
  email: string;
  phone?: string;
  website?: string;
}): Promise<WfpOutcome> {
  const { data, error } = await supabase.functions.invoke('wayforpay-checkout', {
    body: {
      items: params.items,
      packageName: params.packageName,
      amount: params.amount,
      currency: params.currency || 'USD',
      name: params.name,
      email: params.email,
      phone: params.phone || '',
      website: params.website || '',
      type: 'payment',
    },
  });

  if (error || !data?.success) {
    throw new Error(error?.message || data?.error || 'Could not start checkout');
  }

  await loadWidgetScript();

  return new Promise((resolve) => {
    const wfp = new window.Wayforpay!();
    wfp.run(
      data.checkoutData,
      () => resolve('approved'),
      () => resolve('declined'),
      () => resolve('pending')
    );
  });
}

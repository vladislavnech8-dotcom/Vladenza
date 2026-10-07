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
    if (window.Wayforpay) { resolve(); return; }
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

export interface PayResult {
  outcome: WfpOutcome;
  orderRef: string;
  orderNumber: string;
  requirementsToken: string;
}

export interface CartItemInput {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

async function getPaymentStatus(orderRef: string, checkoutAttemptId: string): Promise<'paid' | 'failed' | 'pending'> {
  const { data, error } = await supabase.functions.invoke('wayforpay-checkout', {
    body: { action: 'status', orderRef, checkoutAttemptId },
  });

  if (error || !data?.success) return 'pending';
  if (data.status === 'paid') return 'paid';
  if (data.status === 'failed') return 'failed';
  return 'pending';
}

async function waitForPaymentConfirmation(orderRef: string, checkoutAttemptId: string): Promise<'paid' | 'failed' | 'pending'> {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const status = await getPaymentStatus(orderRef, checkoutAttemptId);
    if (status !== 'pending') return status;
    await new Promise((resolve) => window.setTimeout(resolve, 1000));
  }
  return 'pending';
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
  company?: string;
  requirements?: unknown;
  requirementsStatus?: string;
  checkoutAttemptId: string;
}): Promise<PayResult> {
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
      company: params.company || '',
      type: 'payment',
      requirements: params.requirements,
      requirementsStatus: params.requirementsStatus,
      checkoutAttemptId: params.checkoutAttemptId,
    },
  });

  if (error || !data?.success || !data.checkoutData || !data.orderRef || !data.orderNumber || !data.requirementsToken) {
    throw new Error('Could not start checkout');
  }

  const orderRef = data.orderRef as string;
  const orderNumber = data.orderNumber as string;
  const requirementsToken = data.requirementsToken as string;

  await loadWidgetScript();

  return new Promise((resolve) => {
    const wfp = new window.Wayforpay!();
    const resolveWithStatus = async (fallback: WfpOutcome) => {
      if (fallback === 'declined') {
        resolve({ outcome: fallback, orderRef, orderNumber, requirementsToken });
        return;
      }

      const status = await waitForPaymentConfirmation(orderRef, params.checkoutAttemptId);
      resolve({
        outcome: status === 'paid' ? 'approved' : status === 'failed' ? 'declined' : 'pending',
        orderRef,
        orderNumber,
        requirementsToken,
      });
    };

    wfp.run(
      data.checkoutData as WfpCheckoutData,
      () => { void resolveWithStatus('approved'); },
      () => { void resolveWithStatus('declined'); },
      () => { void resolveWithStatus('pending'); }
    );
  });
}

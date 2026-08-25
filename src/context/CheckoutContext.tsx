import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface PlacementRequirement {
  cartItemId: string;
  packageLabel: string;
  targetUrl: string;
  anchor: string;
  letVladenzaRecommend: boolean;
  notes: string;
}

export interface CheckoutData {
  requirementsChoice: 'now' | 'later' | null;
  placementRequirements: PlacementRequirement[];
  campaignNotes: string;
  customerName: string;
  customerEmail: string;
  customerCompany: string;
  customerWebsite: string;
  orderRef: string;
}

const DEFAULT_CHECKOUT: CheckoutData = {
  requirementsChoice: null,
  placementRequirements: [],
  campaignNotes: '',
  customerName: '',
  customerEmail: '',
  customerCompany: '',
  customerWebsite: '',
  orderRef: '',
};

const STORAGE_KEY = 'vladenza_checkout';

interface CheckoutContextValue {
  data: CheckoutData;
  update: (patch: Partial<CheckoutData>) => void;
  reset: () => void;
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

function loadCheckout(): CheckoutData {
  if (typeof window === 'undefined') return DEFAULT_CHECKOUT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CHECKOUT;
    return { ...DEFAULT_CHECKOUT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CHECKOUT;
  }
}

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<CheckoutData>(DEFAULT_CHECKOUT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setDataState(loadCheckout());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* ignore */ }
  }, [data, hydrated]);

  const update = (patch: Partial<CheckoutData>) => setDataState((prev) => ({ ...prev, ...patch }));
  const reset = () => setDataState(DEFAULT_CHECKOUT);

  return (
    <CheckoutContext.Provider value={{ data, update, reset }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout(): CheckoutContextValue {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error('useCheckout must be used within CheckoutProvider');
  return ctx;
}

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface TargetRequirement {
  url: string;
  anchor: string;
  niche: string;
  country: string;
  notes: string;
  quantity: number;
}

export interface CheckoutData {
  provideLater: boolean;
  targets: TargetRequirement[];
  customerName: string;
  customerEmail: string;
}

const DEFAULT_CHECKOUT: CheckoutData = {
  provideLater: false,
  targets: [{ url: '', anchor: '', niche: '', country: '', notes: '', quantity: 0 }],
  customerName: '',
  customerEmail: '',
};

const STORAGE_KEY = 'vladenza_checkout';

interface CheckoutContextValue {
  data: CheckoutData;
  setData: (data: CheckoutData) => void;
  update: (patch: Partial<CheckoutData>) => void;
  reset: () => void;
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

function loadCheckout(): CheckoutData {
  if (typeof window === 'undefined') return DEFAULT_CHECKOUT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CHECKOUT;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_CHECKOUT, ...parsed };
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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch { /* ignore */ }
  }, [data, hydrated]);

  const setData = (d: CheckoutData) => setDataState(d);
  const update = (patch: Partial<CheckoutData>) => setDataState((prev) => ({ ...prev, ...patch }));
  const reset = () => setDataState(DEFAULT_CHECKOUT);

  return (
    <CheckoutContext.Provider value={{ data, setData, update, reset }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout(): CheckoutContextValue {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error('useCheckout must be used within CheckoutProvider');
  return ctx;
}

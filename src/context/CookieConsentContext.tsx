import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type CookieConsentState = 'accepted' | 'rejected' | null;

interface CookieConsentContextValue {
  consent: CookieConsentState;
  showBanner: boolean;
  showPreferences: boolean;
  setConsent: (state: CookieConsentState) => void;
  openBanner: () => void;
  openPreferences: () => void;
  closeBanner: () => void;
  closePreferences: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextValue>({
  consent: null,
  showBanner: false,
  showPreferences: false,
  setConsent: () => {},
  openBanner: () => {},
  openPreferences: () => {},
  closeBanner: () => {},
  closePreferences: () => {},
});

const STORAGE_KEY = 'vladenza-cookie-consent';

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsentState] = useState<CookieConsentState>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as CookieConsentState | null;
      if (stored === 'accepted' || stored === 'rejected') {
        setConsentState(stored);
      } else {
        setShowBanner(true);
      }
    } catch {
      setShowBanner(true);
    }
  }, []);

  const setConsent = (state: CookieConsentState) => {
    setConsentState(state);
    setShowBanner(false);
    setShowPreferences(false);
    try {
      if (state) {
        localStorage.setItem(STORAGE_KEY, state);
      }
    } catch {
      // localStorage may be unavailable
    }
  };

  const openBanner = () => setShowBanner(true);
  const closeBanner = () => setShowBanner(false);
  const openPreferences = () => { setShowPreferences(true); setShowBanner(false); };
  const closePreferences = () => setShowPreferences(false);

  return (
    <CookieConsentContext.Provider value={{
      consent,
      showBanner,
      showPreferences,
      setConsent,
      openBanner,
      openPreferences,
      closeBanner,
      closePreferences,
    }}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  return useContext(CookieConsentContext);
}

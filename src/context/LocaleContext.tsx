import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import {
  type Locale,
  type TranslationKey,
  translations,
  getLocaleFromPath,
  localizePath,
  getOtherLocale,
} from '../lib/i18n';

interface LocaleContextValue {
  locale: Locale;
  t: TranslationKey;
  localizePath: (path: string) => string;
  switchLocale: () => string;
  otherLocale: Locale;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

const STORAGE_KEY = 'vladenza_locale';

export function LocaleProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const locale = getLocaleFromPath(pathname);

  // Persist locale preference
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // ignore
    }
  }, [locale]);

  // Set <html lang> attribute
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const t = translations[locale];

  const localize = useCallback(
    (path: string) => localizePath(path, locale),
    [locale]
  );

  const switchLocale = useCallback(() => {
    const other = getOtherLocale(locale);
    return localizePath(pathname, other);
  }, [locale, pathname]);

  const otherLocale = getOtherLocale(locale);

  return (
    <LocaleContext.Provider
      value={{ locale, t, localizePath: localize, switchLocale, otherLocale }}
    >
      {children}
      <Outlet />
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    // Fallback for SSR or outside provider — return English defaults
    return {
      locale: 'en',
      t: translations.en,
      localizePath: (p: string) => p,
      switchLocale: () => '/uk',
      otherLocale: 'uk',
    };
  }
  return ctx;
}

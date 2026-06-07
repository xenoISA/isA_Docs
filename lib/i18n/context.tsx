'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import {
  t as sdkT,
  setLocale as coreSetLocale,
  getLocale,
  getAvailableLocales,
} from '@xenoisa/core';
import { docsEn, docsZh, docsRu } from './locales';
import { useBrand } from '../brand-context';

type InterpolationValues = Record<string, string | number>;

const docsLocales: Record<string, Record<string, string>> = {
  en: docsEn,
  zh: docsZh,
  ru: docsRu,
};

function interpolate(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = values[key];
    return value !== undefined ? String(value) : match;
  });
}

interface I18nContextValue {
  locale: string;
  setLocale: (...args: [string]) => void;
  t: (...args: [string, InterpolationValues?]) => string;
  availableLocales: string[];
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState(getLocale());
  // Runtime brand (#332): expose the brand short name as a default interpolation
  // value so locale strings like 'footer.copyright' ('{{brand}}') resolve to the
  // brand chosen at container start. Caller-supplied values still win.
  const brand = useBrand();

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('isa.locale') : null;
    if (stored && ['en', 'zh', 'ru'].includes(stored)) {
      coreSetLocale(stored);
      setLocaleState(stored);
    }
  }, []);

  const setLocale = useCallback((newLocale: string) => {
    coreSetLocale(newLocale);
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('isa.locale', newLocale);
    }
  }, []);

  const t = useCallback(
    (key: string, values?: InterpolationValues) => {
      // Brand fields are available to every string; explicit caller values win.
      // `brand` maps the locale `{{brand}}` token to the runtime short name.
      const merged: InterpolationValues = { brand: brand.short, ...values };
      const strings = docsLocales[locale] || docsLocales['en'];
      let result = strings?.[key];
      if (result === undefined && locale !== 'en') {
        result = docsLocales['en']?.[key];
      }
      if (result === undefined) {
        return sdkT(key, merged);
      }
      return interpolate(result, merged);
    },
    [locale, brand],
  );

  return (
    <I18nContext.Provider
      value={{ locale, setLocale, t, availableLocales: getAvailableLocales() }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within an I18nProvider');
  return ctx;
}

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
  onLocaleChange,
} from '@isa/core';
import type { InterpolationValues } from '@isa/core';
import { docsEn, docsZh, docsRu } from './locales';

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
  setLocale: (locale: string) => void;
  t: (key: string, values?: InterpolationValues) => string;
  availableLocales: string[];
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState(getLocale());

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('isa.locale') : null;
    if (stored && ['en', 'zh', 'ru'].includes(stored)) {
      coreSetLocale(stored);
    }
  }, []);

  useEffect(() => {
    return onLocaleChange((newLocale: string) => {
      setLocaleState(newLocale);
    });
  }, []);

  const setLocale = useCallback((newLocale: string) => {
    coreSetLocale(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('isa.locale', newLocale);
    }
  }, []);

  const t = useCallback(
    (key: string, values?: InterpolationValues) => {
      const strings = docsLocales[locale] || docsLocales['en'];
      let result = strings?.[key];
      if (result === undefined && locale !== 'en') {
        result = docsLocales['en']?.[key];
      }
      if (result === undefined) {
        return sdkT(key, values);
      }
      if (values) {
        result = interpolate(result, values);
      }
      return result;
    },
    [locale],
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

"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { en, type TKey } from "./locales/en";
import { my } from "./locales/my";

export type { TKey };
export type Locale = "en" | "my";

const STORAGE_KEY = "mini-pos-locale";
const translations: Record<Locale, Record<TKey, string>> = { en, my };

type I18nContextType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TKey) => string;
};

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  setLocale: () => {},
  t: (key) => en[key],
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved === "en" || saved === "my") setLocaleState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  function setLocale(l: Locale) {
    setLocaleState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }

  function t(key: TKey): string {
    return translations[locale][key] ?? en[key];
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

export function useT() {
  const { locale, t } = useI18n();

  function plural(count: number, singularKey: TKey, pluralKey: TKey): string {
    if (locale === "my") return `${count} ${t(singularKey)}`;
    return `${count} ${count === 1 ? t(singularKey) : t(pluralKey)}`;
  }

  return { t, plural, locale };
}

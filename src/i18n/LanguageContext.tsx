import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AppLanguage } from '../types';
import { AppTranslations, TRANSLATIONS } from './translations';

export const LANGUAGE_STORAGE_KEY = 'cropshield_language';

export function getStoredLanguage(): AppLanguage {
  try {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved === 'te' || saved === 'hi' || saved === 'en') {
      return saved;
    }
  } catch {
    // Ignore storage access errors in restricted environments
  }
  return 'en';
}

interface LanguageContextValue {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: AppTranslations;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>(() => getStoredLanguage());

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // Ignore storage write errors
    }
  }, [language]);

  const setLanguage = useCallback((nextLang: AppLanguage) => {
    setLanguageState(nextLang);
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: TRANSLATIONS[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}

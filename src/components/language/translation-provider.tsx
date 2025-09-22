
'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { useLanguageStore } from '@/lib/language-store';
import { Loader2 } from 'lucide-react';

type Translations = { [key: string]: string | Translations };

interface TranslationContextType {
  translations: Translations;
  t: (key: string) => string;
}

export const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguageStore();
  const [translations, setTranslations] = useState<Translations>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTranslations() {
      if (!language) return;
      setLoading(true);
      try {
        const translationModule = await import(`@/locales/${language}.json`);
        setTranslations(translationModule.default);
      } catch (error) {
        console.error(`Could not load translations for ${language}`, error);
        // Fallback to English
        const fallbackModule = await import(`@/locales/en.json`);
        setTranslations(fallbackModule.default);
      } finally {
        setLoading(false);
      }
    }
    loadTranslations();
  }, [language]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let result: any = translations;
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        return key; // Return the key if translation is not found
      }
    }
    return typeof result === 'string' ? result : key;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <TranslationContext.Provider value={{ translations, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

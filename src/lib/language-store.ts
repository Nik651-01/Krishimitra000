
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Language = 'en' | 'hi' | 'nag' | 'sat' | 'kru' | 'mun';

interface LanguageState {
  language: Language | null;
  initialized: boolean;
  setLanguage: (language: Language) => void;
  setInitialized: (initialized: boolean) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: null,
      initialized: false,
      setLanguage: (language: Language) => set({ language }),
      setInitialized: (initialized: boolean) => set({ initialized }),
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setInitialized(true);
        }
      },
    }
  )
);


import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  isLoggedIn: boolean;
  isGuest: boolean;
  user: { email: string } | null;
  login: (email: string) => void;
  loginAsGuest: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      isGuest: false,
      user: null,
      login: (email) => set({ isLoggedIn: true, isGuest: false, user: { email } }),
      loginAsGuest: () => set({ isLoggedIn: false, isGuest: true, user: null }),
      logout: () => set({ isLoggedIn: false, isGuest: false, user: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

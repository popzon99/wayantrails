import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserProfile } from '@/lib/api/types';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: UserProfile | null) => void;
  setAuthenticated: (isAuth: boolean) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => set({ user }),

      setAuthenticated: (isAuth) => set({ isAuthenticated: isAuth }),

      setLoading: (loading) => set({ isLoading: loading }),

      logout: () => {
        // Clear tokens from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
        }
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : undefined as any
      ),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      skipHydration: true,
    }
  )
);

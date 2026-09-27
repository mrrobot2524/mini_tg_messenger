import { create } from 'zustand'
import {persist} from 'zustand/middleware'
import type { AuthCredentials, AuthState } from "./types";

type AuthStore = AuthState & {
  login: (credentials: AuthCredentials) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
      (set) => ({
        credentials: null,
        isAuthenticated: false,

        login: (credentials) =>
          set({
            credentials,
            isAuthenticated: true,
          }),

        logout: () =>
          set({
            credentials: null,
            isAuthenticated: false,
          }),
    }),
    {
      name: 'auth-store',

      partialize: (state) => ({
        credentials: state.credentials,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
)


if (typeof window !== 'undefined') {
  ;(window as any).useAuthStore = useAuthStore
}

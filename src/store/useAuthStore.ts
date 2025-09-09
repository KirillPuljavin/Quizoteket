// File: src/store/useAuthStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  username: string;
  password: string;
}

interface AuthState {
  users: User[];
  currentUser: string | null;

  signUp: (username: string, password: string) => boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isLoggedIn: () => boolean;

  // hydration
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: [],
      currentUser: null,

      signUp: (username, password) => {
        const { users } = get();
        if (users.some((u) => u.username === username)) return false;
        set({
          users: [...users, { username, password }],
          currentUser: username,
        });
        return true;
      },

      login: (username, password) => {
        const user = get().users.find((u) => u.username === username);
        if (!user || user.password !== password) return false;
        set({ currentUser: username });
        return true;
      },

      logout: () => set({ currentUser: null }),

      isLoggedIn: () => get().currentUser !== null,

      _hasHydrated: false,
      setHasHydrated: (v) => set({ _hasHydrated: v }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

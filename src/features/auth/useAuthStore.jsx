import { create } from 'zustand'


export const useAuthStore = create((set) => ({
    token: null,
    user: null,
    setSession: (token, user) => set({ token, user }),
    clear: () => set({ token: null, user: null })
}))
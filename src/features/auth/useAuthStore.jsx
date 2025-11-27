import { create } from 'zustand'

const savedToken = localStorage.getItem('access_token') || null

let savedUser = null
try {
  const raw = localStorage.getItem('user')
  if (raw) savedUser = JSON.parse(raw)
} catch {
  savedUser = null
}

export const useAuthStore = create((set) => ({
  token: savedToken,
  user: savedUser,

  setSession: (token, user) => {
    if (token) {
      localStorage.setItem('access_token', token)
    } else {
      localStorage.removeItem('access_token')
    }

    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }

    set({ token, user })
  },

  clear: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    set({ token: null, user: null })
  },
}))
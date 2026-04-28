import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'
import axiosInstance from '@api/axiosInstance'
import toast from 'react-hot-toast'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  setUser: (user: User) => void
  initAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const res = await axiosInstance.post('/auth/login', { email, password })
          const { token, user } = res.data.data
          localStorage.setItem('token', token)
          set({ user, token, isLoading: false })
          toast.success(`Welcome back, ${user.name}!`)
          return true
        } catch {
          set({ isLoading: false })
          return false
        }
      },

      initAuth: async () => {
        const token = localStorage.getItem('token')
        if (!token) return
        try {
          const res = await axiosInstance.get('/auth/me')
          set({ user: res.data.data })
        } catch {
          localStorage.removeItem('token')
          set({ user: null, token: null })
        }
      },

      logout: () => {
        localStorage.removeItem('token')
        set({ user: null, token: null })
        toast.success('Logged out successfully')
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
)
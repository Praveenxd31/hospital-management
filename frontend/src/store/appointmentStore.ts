import { create } from 'zustand'
import { appointmentsApi, dashboardApi, type CreateAppointmentPayload } from '@api/appointments.api'
import type { DashboardStats, Appointment } from '../types'
import toast from 'react-hot-toast'

interface AppointmentState {
  appointments: Appointment[]
  total: number
  page: number
  stats: DashboardStats | null
  isLoading: boolean
  fetchAppointments: (params?: {
    date?: string
    doctorId?: string
    status?: string
    search?: string
    page?: number
  }) => Promise<void>
  createAppointment: (data: CreateAppointmentPayload) => Promise<boolean>
  updateAppointment: (id: string, data: { status?: string; notes?: string }) => Promise<boolean>
  deleteAppointment: (id: string) => Promise<boolean>
  fetchStats: () => Promise<void>
  setPage: (page: number) => void
}

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  appointments: [],
  total: 0,
  page: 1,
  stats: null,
  isLoading: false,

  fetchAppointments: async (params) => {
    set({ isLoading: true })
    try {
      const res = await appointmentsApi.getAll({ page: get().page, limit: 10, ...params })
      const { appointments, total, page } = res.data.data as any
      set({ appointments, total, page, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },

  createAppointment: async (data) => {
    try {
      await appointmentsApi.create(data)
      toast.success('Appointment booked successfully')
      get().fetchAppointments()
      return true
    } catch {
      return false
    }
  },

  updateAppointment: async (id, data) => {
    try {
      await appointmentsApi.update(id, data)
      toast.success('Appointment updated')
      get().fetchAppointments()
      return true
    } catch {
      return false
    }
  },

  deleteAppointment: async (id) => {
    try {
      await appointmentsApi.delete(id)
      toast.success('Appointment cancelled')
      get().fetchAppointments()
      return true
    } catch {
      return false
    }
  },

  fetchStats: async () => {
    try {
      const res = await dashboardApi.getStats()
      set({ stats: res.data.data })
    } catch {}
  },

  setPage: (page) => set({ page }),
}))
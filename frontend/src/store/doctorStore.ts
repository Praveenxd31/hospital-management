import { create } from 'zustand'
import type { Doctor } from '../types'
import { doctorsApi, type CreateDoctorPayload } from '@api/doctors.api'
import toast from 'react-hot-toast'

interface DoctorState {
  doctors: Doctor[]
  selectedDoctor: Doctor | null
  isLoading: boolean
  fetchDoctors: (params?: { specialization?: string; search?: string }) => Promise<void>
  createDoctor: (data: CreateDoctorPayload) => Promise<boolean>
  updateDoctor: (id: string, data: Partial<CreateDoctorPayload>) => Promise<boolean>
  deleteDoctor: (id: string) => Promise<boolean>
}

export const useDoctorStore = create<DoctorState>((set, get) => ({
  doctors: [],
  selectedDoctor: null,
  isLoading: false,

  fetchDoctors: async (params) => {
    set({ isLoading: true })
    try {
      const res = await doctorsApi.getAll(params)
      set({ doctors: res.data.data as Doctor[], isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },

  createDoctor: async (data) => {
    try {
      await doctorsApi.create(data)
      toast.success('Doctor created successfully')
      get().fetchDoctors()
      return true
    } catch {
      return false
    }
  },

  updateDoctor: async (id, data) => {
    try {
      await doctorsApi.update(id, data)
      toast.success('Doctor updated successfully')
      get().fetchDoctors()
      return true
    } catch {
      return false
    }
  },

  deleteDoctor: async (id) => {
    try {
      await doctorsApi.delete(id)
      toast.success('Doctor deleted successfully')
      get().fetchDoctors()
      return true
    } catch {
      return false
    }
  },
}))
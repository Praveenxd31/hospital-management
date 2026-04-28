import { create } from 'zustand'
import type { Patient } from '../types'
import { patientsApi, type CreatePatientPayload } from '@api/patients.api'
import toast from 'react-hot-toast'

interface PatientState {
  patients: Patient[]
  selectedPatient: Patient | null
  total: number
  page: number
  isLoading: boolean
  fetchPatients: (params?: { search?: string; page?: number }) => Promise<void>
  fetchPatientById: (id: string) => Promise<void>
  createPatient: (data: CreatePatientPayload) => Promise<boolean>
  updatePatient: (id: string, data: Partial<CreatePatientPayload>) => Promise<boolean>
  deletePatient: (id: string) => Promise<boolean>
  setPage: (page: number) => void
}

export const usePatientStore = create<PatientState>((set, get) => ({
  patients: [],
  selectedPatient: null,
  total: 0,
  page: 1,
  isLoading: false,

  fetchPatients: async (params) => {
    set({ isLoading: true })
    try {
      const res = await patientsApi.getAll({ page: get().page, limit: 10, ...params })
      const { patients, total, page } = res.data.data as any
      set({ patients, total, page, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },

  fetchPatientById: async (id) => {
    set({ isLoading: true })
    try {
      const res = await patientsApi.getById(id)
      set({ selectedPatient: res.data.data ?? null, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },

  createPatient: async (data) => {
    try {
      await patientsApi.create(data)
      toast.success('Patient created successfully')
      get().fetchPatients()
      return true
    } catch {
      return false
    }
  },

  updatePatient: async (id, data) => {
    try {
      await patientsApi.update(id, data)
      toast.success('Patient updated successfully')
      get().fetchPatients()
      return true
    } catch {
      return false
    }
  },

  deletePatient: async (id) => {
    try {
      await patientsApi.delete(id)
      toast.success('Patient deleted successfully')
      get().fetchPatients()
      return true
    } catch {
      return false
    }
  },

  setPage: (page) => set({ page }),
}))
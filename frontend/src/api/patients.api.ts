import axiosInstance from './axiosInstance'
import type { Patient, ApiResponse, PaginatedResponse } from '../types'

export interface CreatePatientPayload {
  name: string
  age: number
  gender: string
  phone: string
  email: string
  address: string
}

export const patientsApi = {
  getAll: (params?: { search?: string; page?: number; limit?: number }) =>
    axiosInstance.get<ApiResponse<PaginatedResponse<Patient>>>('/patients', { params }),

  getById: (id: string) =>
    axiosInstance.get<ApiResponse<Patient>>(`/patients/${id}`),

  create: (data: CreatePatientPayload) =>
    axiosInstance.post<ApiResponse<Patient>>('/patients', data),

  update: (id: string, data: Partial<CreatePatientPayload>) =>
    axiosInstance.put<ApiResponse<Patient>>(`/patients/${id}`, data),

  delete: (id: string) =>
    axiosInstance.delete<ApiResponse<null>>(`/patients/${id}`),
}
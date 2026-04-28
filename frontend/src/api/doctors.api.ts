import axiosInstance from './axiosInstance'
import type { Doctor, ApiResponse } from '../types'

export interface CreateDoctorPayload {
  name: string
  specialization: string
  phone: string
  email: string
}

export const doctorsApi = {
  getAll: (params?: { specialization?: string; search?: string }) =>
    axiosInstance.get<ApiResponse<Doctor[]>>('/doctors', { params }),

  getById: (id: string) =>
    axiosInstance.get<ApiResponse<Doctor>>(`/doctors/${id}`),

  create: (data: CreateDoctorPayload) =>
    axiosInstance.post<ApiResponse<Doctor>>('/doctors', data),

  update: (id: string, data: Partial<CreateDoctorPayload>) =>
    axiosInstance.put<ApiResponse<Doctor>>(`/doctors/${id}`, data),

  delete: (id: string) =>
    axiosInstance.delete<ApiResponse<null>>(`/doctors/${id}`),
}
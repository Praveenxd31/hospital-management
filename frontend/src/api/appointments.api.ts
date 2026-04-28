import axiosInstance from './axiosInstance'
import type { Appointment, ApiResponse, PaginatedResponse } from '../types'

export interface CreateAppointmentPayload {
  patientId: string
  doctorId: string
  date: string
  timeSlot: string
  notes?: string
}

export const appointmentsApi = {
  getAll: (params?: {
    date?: string
    doctorId?: string
    patientId?: string
    status?: string
    search?: string
    page?: number
    limit?: number
  }) =>
    axiosInstance.get<ApiResponse<PaginatedResponse<Appointment>>>('/appointments', { params }),

  getById: (id: string) =>
    axiosInstance.get<ApiResponse<Appointment>>(`/appointments/${id}`),

  create: (data: CreateAppointmentPayload) =>
    axiosInstance.post<ApiResponse<Appointment>>('/appointments', data),

  update: (id: string, data: { status?: string; notes?: string }) =>
    axiosInstance.put<ApiResponse<Appointment>>(`/appointments/${id}`, data),

  delete: (id: string) =>
    axiosInstance.delete<ApiResponse<null>>(`/appointments/${id}`),
}

export const dashboardApi = {
  getStats: () =>
    axiosInstance.get('/dashboard/stats'),
}
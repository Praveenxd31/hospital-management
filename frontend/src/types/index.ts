export type Role = 'ADMIN' | 'DOCTOR' | 'NURSE' | 'RECEPTIONIST' | 'PATIENT'
export type Gender = 'MALE' | 'FEMALE' | 'OTHER'
export type AppointmentStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'

export interface User {
    id: string
    name: string
    email: string
    role: Role
    createdAt: string
    updatedAt: string
}

export interface Patient {
    id: string
    name: string
    age: number
    gender: Gender
    phone: string
    email: string
    address: string
    createdAt: string
    updatedAt: string
    appointments?: Appointment[]
}

export interface Doctor {
    id: string
    name: string
    specialty: string
    phone: string
    email: string
    createdAt: string
    updatedAt: string
    appointments?: Appointment[]
}

export interface Appointment {
    id: string
    patientId: string
    doctorId: string
    date: string
    status: AppointmentStatus
    notes?: string
    timeSlot: string
    createdAt: string
    updatedAt: string
    patient?: Patient
    doctor?: Doctor
}

export interface AuthResponse {
    token: string
    user: User
}

export interface ApiResponse<T> {
    success: boolean
    message: string
    data?: T
}

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    limit: number
}

export interface DashboardStats {
    totalPatients: number
    totalDoctors: number
    totalAppointments: number
    todayAppointments: number
    appointmentsByStatus: {
        scheduled: number
        completed: number
        cancelled: number
    }
    recentAppointments: Appointment[]
}
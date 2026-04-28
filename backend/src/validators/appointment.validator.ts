import { z } from 'zod';

export const createAppointmentSchema = z.object({
    patientId: z.string().uuid('Invalid patient ID'),
    doctorId: z.string().uuid('Invalid doctor ID'),
    date: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
    timeSlot: z
        .string()
        .regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:MM format'),
    notes: z.string().optional(),
})

export const updateAppointmentSchema = z.object({
    status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED']).optional(),
    notes: z.string().optional(),
    date: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), 'Invalid date')
        .optional(),
    timeSlot: z
        .string()
        .regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, 'Time must be HH:MM')
        .optional(),
})

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>

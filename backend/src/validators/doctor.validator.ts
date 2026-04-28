import { z } from 'zod'

export const createDoctorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  specialization: z.string().min(2, 'Specialization is required'),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, 'Phone must be 10 digits'),
  email: z.string().email('Invalid email address'),
  available: z.boolean().optional().default(true),
})

export const updateDoctorSchema = createDoctorSchema.partial()

export type CreateDoctorInput = z.infer<typeof createDoctorSchema>
export type UpdateDoctorInput = z.infer<typeof updateDoctorSchema>
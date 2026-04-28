import { z } from 'zod';

export const createPatientSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    age: z.number().min(0, 'Age must be a positive number').max(120, 'Age must be less than or equal to 120'),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
    phone: z.string().regex(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
    email: z.string().email('Invalid email address'),
    address: z.string().min(1, 'Address is required'),
})

export const updatePatientSchema = createPatientSchema.partial()

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>; 
import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import { Input } from '../ui/Input'

interface DoctorFormData {
  name: string
  specialization: string
  phone: string
  email: string
}

interface Props {
  register: UseFormRegister<DoctorFormData>
  errors: FieldErrors<DoctorFormData>
}

export const DoctorFormFields = ({ register, errors }: Props) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Input
      label="Full Name"
      placeholder="Dr. Jane Smith"
      error={errors.name?.message}
      {...register('name')}
    />
    <Input
      label="Specialization"
      placeholder="Cardiology"
      error={errors.specialization?.message}
      {...register('specialization')}
    />
    <Input
      label="Phone"
      placeholder="9876543210"
      error={errors.phone?.message}
      {...register('phone')}
    />
    <Input
      label="Email"
      type="email"
      placeholder="doctor@hospital.com"
      error={errors.email?.message}
      {...register('email')}
    />
  </div>
)
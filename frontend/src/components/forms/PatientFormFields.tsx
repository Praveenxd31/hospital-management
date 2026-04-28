import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'

interface PatientFormData {
  name: string
  age: number
  gender: string
  phone: string
  email: string
  address: string
}

interface Props {
  register: UseFormRegister<PatientFormData>
  errors: FieldErrors<PatientFormData>
}

export const PatientFormFields = ({ register, errors }: Props) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Input
      label="Full Name"
      placeholder="John Doe"
      error={errors.name?.message}
      {...register('name')}
    />
    <Input
      label="Age"
      type="number"
      placeholder="25"
      error={errors.age?.message}
      {...register('age', { valueAsNumber: true })}
    />
    <Select
      label="Gender"
      options={[
        { label: 'Male', value: 'MALE' },
        { label: 'Female', value: 'FEMALE' },
        { label: 'Other', value: 'OTHER' },
      ]}
      placeholder="Select gender"
      error={errors.gender?.message}
      {...register('gender')}
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
      placeholder="john@example.com"
      error={errors.email?.message}
      {...register('email')}
    />
    <Input
      label="Address"
      placeholder="123 Main St"
      error={errors.address?.message}
      {...register('address')}
    />
  </div>
)
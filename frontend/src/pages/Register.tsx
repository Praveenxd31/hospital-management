import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { Input } from '@ui/Input'
import { Button } from '@ui/Button'
import { Select } from '@ui/Select'
import axiosInstance from '@api/axiosInstance'
import toast from 'react-hot-toast'
import { Hospital } from 'lucide-react'

const schema = z.object({
  name: z.string().min(2, 'Min 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
  confirmPassword: z.string().min(6, 'Min 6 characters'),
  role: z.enum(['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST']),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})
type FormData = z.infer<typeof schema>

export const Register = () => {
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'RECEPTIONIST' },
  })

  const onSubmit = async (data: FormData) => {
    try {
      const { confirmPassword, ...payload } = data
      await axiosInstance.post('/auth/register', payload)
      toast.success('Account created! Please sign in.')
      navigate('/login')
    } catch {
        toast.error('Registration failed. Please try again.')
    }
  }

  return (
    <div className="card bg-base-100 shadow-xl w-full max-w-md">
      <div className="card-body">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-3">
            <span className="text-primary-content font-bold text-xl"><Hospital size={16} /></span>
          </div>
          <h2 className="text-2xl font-bold">HospitalMS</h2>
          <p className="text-base-content/60 text-sm mt-1">Create a new account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Email"
            type="email"
            placeholder="john@hospital.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Select
            label="Role"
            options={[
              { label: 'Admin', value: 'ADMIN' },
              { label: 'Doctor', value: 'DOCTOR' },
              { label: 'Nurse', value: 'NURSE' },
              { label: 'Receptionist', value: 'RECEPTIONIST' },
            ]}
            error={errors.role?.message}
            {...register('role')}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button type="submit" loading={isSubmitting} className="w-full mt-2">
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-base-content/60 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
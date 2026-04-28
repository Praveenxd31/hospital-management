import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@store/authStore'
import { useNavigate, Link } from 'react-router-dom'
import { Input } from '@ui/Input'
import { Button } from '@ui/Button'
import { Hospital } from 'lucide-react'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
})
type FormData = z.infer<typeof schema>

export const Login = () => {
  const { login, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    const ok = await login(data.email, data.password)
    if (ok) navigate('/dashboard')
  }

  return (
    <div className="card bg-base-100 shadow-xl w-full max-w-md">
      <div className="card-body">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-3">
            <span className="text-primary-content font-bold text-xl"><Hospital size={16} /></span>
          </div>
          <h2 className="text-2xl font-bold">HospitalMS</h2>
          <p className="text-base-content/60 text-sm mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="admin@gmail.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
          <Button type="submit" loading={isLoading} className="w-full mt-2">
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm text-base-content/60 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
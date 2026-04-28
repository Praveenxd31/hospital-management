import { useNavigate } from 'react-router-dom'
import { ShieldOff } from 'lucide-react'
import { useAuthStore } from '@store/authStore'

export const Unauthorized = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card bg-base-100 shadow-xl w-full max-w-md text-center">
        <div className="card-body items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center">
            <ShieldOff size={32} className="text-error" />
          </div>
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p className="text-base-content/60 text-sm">
            Your role <span className="badge badge-outline badge-sm ml-1">{user?.role}</span>{' '}
            does not have permission to view this page.
          </p>
          <div className="flex gap-3 mt-2">
            <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
              Go Back
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/dashboard')}>
              Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
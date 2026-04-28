import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '@store/authStore'

export const AuthLayout = () => {
  const { token } = useAuthStore()
  if (token) return <Navigate to="/dashboard" replace />

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <Outlet />
    </div>
  )
}
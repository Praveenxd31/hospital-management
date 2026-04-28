
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@store/authStore'
import type { Role } from '../types'

interface PrivateRouteProps {
  allowedRoles?: Role[]
}

export const PrivateRoute = ({ allowedRoles }: PrivateRouteProps) => {
  const { token, user } = useAuthStore()
  const location = useLocation()

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}
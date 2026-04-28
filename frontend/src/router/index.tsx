import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { AuthLayout } from '../layouts/AuthLayout'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { PrivateRoute } from './PrivateRoute'
import { Loader } from '@ui/Loader'

const Login = lazy(() =>
  import('@pages/Login').then((m) => ({ default: m.Login }))
)
const Register = lazy(() =>
  import('@pages/Register').then((m) => ({ default: m.Register }))
)
const Dashboard = lazy(() =>
  import('@pages/Dashboard').then((m) => ({ default: m.Dashboard }))
)
const Patients = lazy(() =>
  import('@pages/Patients').then((m) => ({ default: m.Patients }))
)
const PatientForm = lazy(() =>
  import('@pages/PatientForm').then((m) => ({ default: m.PatientForm }))
)
const Doctors = lazy(() =>
  import('@pages/Doctors').then((m) => ({ default: m.Doctors }))
)
const Appointments = lazy(() =>
  import('@pages/Appointments').then((m) => ({ default: m.Appointments }))
)
const Unauthorized = lazy(() =>
  import('@pages/Unauthorized').then((m) => ({ default: m.Unauthorized }))
)

const withSuspense = (element: React.ReactNode) => (
  <Suspense fallback={<Loader />}>{element}</Suspense>
)

export const router = createBrowserRouter([
  {
    element: withSuspense(<AuthLayout />),
    children: [
      { path: '/login',    element: <Login /> },
      { path: '/register', element: <Register /> },
    ],
  },

  {
    element: <PrivateRoute />,
    children: [
      { path: '/unauthorized', element: withSuspense(<Unauthorized />) },
    ],
  },

  {
    element: <PrivateRoute allowedRoles={['ADMIN']} />,
    children: [
      {
        element: withSuspense(<DashboardLayout />),
        children: [
          { path: '/doctors', element: <Doctors /> },
        ],
      },
    ],
  },

  {
    element: <PrivateRoute allowedRoles={['ADMIN', 'RECEPTIONIST']} />,
    children: [
      {
        element: withSuspense(<DashboardLayout />),
        children: [
          { path: '/patients',          element: <Patients /> },
          { path: '/patients/new',      element: <PatientForm /> },
          { path: '/patients/:id/edit', element: <PatientForm /> },
        ],
      },
    ],
  },

  {
    element: <PrivateRoute allowedRoles={['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'PATIENT']} />,
    children: [
      {
        element: withSuspense(<DashboardLayout />),
        children: [
          { path: '/dashboard',    element: <Dashboard /> },
          { path: '/appointments', element: <Appointments /> },
        ],
      },
    ],
  },

  { path: '*', element: <Login /> },
])
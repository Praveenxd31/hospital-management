import { useLocation } from 'react-router-dom'

const titleMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/patients': 'Patients',
  '/doctors': 'Doctors',
  '/appointments': 'Appointments',
}

export const Header = () => {
  const { pathname } = useLocation()
  const title = titleMap[pathname] || 'Hospital Management'

  return (
    <header className="h-16 bg-base-100 border-b border-base-200 flex items-center px-6">
      <h1 className="text-xl font-semibold">{title}</h1>
    </header>
  )
}
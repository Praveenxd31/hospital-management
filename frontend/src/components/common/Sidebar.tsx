import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, Stethoscope,
  CalendarDays, LogOut, Hospital 
} from 'lucide-react'
import { useAuthStore } from '@store/authStore'
import type { Role } from '../../types'

interface NavItem {
  to: string
  label: string
  icon: React.ElementType
  roles: Role[]  
}

const navItems: NavItem[] = [
  { to: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard, roles: ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'PATIENT'] },
  { to: '/patients',     label: 'Patients',     icon: Users,           roles: ['ADMIN', 'RECEPTIONIST'] },
  { to: '/doctors',      label: 'Doctors',      icon: Stethoscope,     roles: ['ADMIN'] },
  { to: '/appointments', label: 'Appointments', icon: CalendarDays,    roles: ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'PATIENT'] },
]

export const Sidebar = () => {
  const { user, logout } = useAuthStore()

  const visibleItems = navItems.filter((item) =>
    user?.role && item.roles.includes(user.role) 
  )

  return (
    <aside className="w-64 min-h-screen bg-base-200 flex flex-col border-r border-base-300">
      <div className="px-6 py-5 border-b border-base-300">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-content font-bold text-sm"><Hospital size={16} /></span>
          </div>
          <span className="font-bold text-lg">HospitalMS</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {visibleItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${isActive
                ? 'bg-primary text-primary-content'
                : 'text-base-content/70 hover:bg-base-300 hover:text-base-content'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-base-300">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content rounded-full w-8">
              <span className="text-xs">{user?.name?.charAt(0).toUpperCase()}</span>
            </div>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-base-content/50 truncate">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm
                     text-error hover:bg-error/10 transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  )
}
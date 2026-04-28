import { useEffect } from 'react'
import { useAppointmentStore } from '@store/appointmentStore'
import { Card } from '@ui/Card'
import { Loader } from '@ui/Loader'
import { StatusBadge } from '@ui/Badge'
import { Users, Stethoscope, CalendarDays, Clock } from 'lucide-react'
import { format } from 'date-fns'

export const Dashboard = () => {
  const { stats, fetchStats, isLoading } = useAppointmentStore()

  useEffect(() => { fetchStats() }, [])

  if (isLoading && !stats) return <Loader />

  const statCards = [
    { label: 'Total Patients', value: stats?.totalPatients ?? 0, icon: Users, color: 'text-primary' },
    { label: 'Total Doctors', value: stats?.totalDoctors ?? 0, icon: Stethoscope, color: 'text-secondary' },
    { label: 'Total Appointments', value: stats?.totalAppointments ?? 0, icon: CalendarDays, color: 'text-accent' },
    { label: "Today's Appointments", value: stats?.todayAppointments ?? 0, icon: Clock, color: 'text-info' },
  ]

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/60">{label}</p>
                <p className="text-3xl font-bold mt-1">{value}</p>
              </div>
              <Icon size={36} className={`${color} opacity-80`} />
            </div>
          </Card>
        ))}
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Appointment Status">
          <div className="space-y-3">
            {[
              { label: 'Scheduled', value: stats?.appointmentsByStatus.scheduled ?? 0, cls: 'bg-info' },
              { label: 'Completed', value: stats?.appointmentsByStatus.completed ?? 0, cls: 'bg-success' },
              { label: 'Cancelled', value: stats?.appointmentsByStatus.cancelled ?? 0, cls: 'bg-error' },
            ].map(({ label, value, cls }) => {
              const total = stats?.totalAppointments || 1
              const pct = Math.round((value / total) * 100)
              return (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                  <progress className={`progress ${cls} w-full`} value={pct} max="100" />
                </div>
              )
            })}
          </div>
        </Card>

        {/* Recent Appointments */}
        <Card title="Recent Appointments">
          <div className="space-y-3">
            {stats?.recentAppointments.length === 0 && (
              <p className="text-base-content/50 text-sm">No appointments yet</p>
            )}
            {stats?.recentAppointments.map((apt) => (
              <div key={apt.id} className="flex items-center justify-between py-1 border-b border-base-200 last:border-0">
                <div>
                  <p className="text-sm font-medium">{apt.patient?.name}</p>
                  <p className="text-xs text-base-content/60">
                    Dr. {apt.doctor?.name} · {format(new Date(apt.date), 'MMM d, yyyy')}
                  </p>
                </div>
                <StatusBadge status={apt.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
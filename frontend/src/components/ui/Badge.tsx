import type { AppointmentStatus } from '../../types';

interface BadgeProps {
  status: AppointmentStatus
}

const statusMap: Record<AppointmentStatus, { label: string; className: string }> = {
  SCHEDULED: { label: 'Scheduled', className: 'badge-info' },
  COMPLETED: { label: 'Completed', className: 'badge-success' },
  CANCELLED: { label: 'Cancelled', className: 'badge-error' },
}

export const StatusBadge = ({ status }: BadgeProps) => {
  const { label, className } = statusMap[status]
  return <span className={`badge ${className} badge-sm font-medium p-2 text-white`}>{label}</span>
}
import { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAppointmentStore } from '@store/appointmentStore'
import { usePatientStore } from '@store/patientStore'
import { useDoctorStore } from '@store/doctorStore'
import { useDebounce } from '@hooks/useDebounce'
import { Card } from '@ui/Card'
import { Button } from '@ui/Button'
import { Table } from '@common/Table'
import { Pagination } from '@common/Pagination'
import { StatusBadge } from '@ui/Badge'
import { Modal, openModal, closeModal } from '@ui/Modal'
import { ConfirmModal, openConfirmModal } from '@ui/ConfirmModal'
import { AppointmentFormFields } from '@forms/AppointmentFormFields'
import { Select } from '@ui/Select'
import type { Appointment } from '../types'
import { format } from 'date-fns'
import { Plus, Trash2, Search, X, Ban } from 'lucide-react'

const schema = z.object({
  patientId: z.string().min(1, 'Select a patient'),
  doctorId: z.string().min(1, 'Select a doctor'),
  date: z.string().min(1, 'Date is required'),
  timeSlot: z.string().min(1, 'Time slot is required'),
  notes: z.string().optional(),
})
type FormData = z.infer<typeof schema>

export const Appointments = () => {
  const {
    appointments, total, page, isLoading,
    fetchAppointments, createAppointment, updateAppointment,
    deleteAppointment, setPage,
  } = useAppointmentStore()
  const { patients, fetchPatients } = usePatientStore()
  const { doctors, fetchDoctors } = useDoctorStore()

  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  const targetId = useRef<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    setPage(1)
    fetchAppointments({ status: statusFilter || undefined, search: debouncedSearch || undefined, page: 1 })
  }, [debouncedSearch, statusFilter])

  useEffect(() => {
    fetchPatients()
    fetchDoctors()
  }, [])

  const onSubmit = async (data: FormData) => {
    const ok = await createAppointment(data)
    if (ok) { reset(); closeModal('appointment-modal') }
  }

  const handleCancelClick = (id: string) => {
    targetId.current = id
    openConfirmModal('confirm-cancel-modal')
  }

  const handleDeleteClick = (id: string) => {
    targetId.current = id
    openConfirmModal('confirm-delete-modal')
  }

  const confirmCancel = async () => {
    if (targetId.current) {
      await updateAppointment(targetId.current, { status: 'CANCELLED' })
      targetId.current = null
    }
  }

  const confirmDelete = async () => {
    if (targetId.current) {
      await deleteAppointment(targetId.current)
      targetId.current = null
    }
  }

  const columns = [
    { header: 'Patient', render: (a: Appointment) => a.patient?.name ?? '—' },
    { header: 'Doctor', render: (a: Appointment) => `Dr. ${a.doctor?.name ?? '—'}` },
    { header: 'Specialty', render: (a: Appointment) => a.doctor?.specialty ?? '—' },
    { header: 'Date', render: (a: Appointment) => format(new Date(a.date), 'MMM d, yyyy') },
    { header: 'Time', render: (a: Appointment) => a.timeSlot },
    { header: 'Status', render: (a: Appointment) => <StatusBadge status={a.status} /> },
    {
      header: 'Actions',
      render: (a: Appointment) => (
        <div className="flex gap-1">
          {a.status === 'SCHEDULED' && (
            <button
              className="btn btn-ghost btn-xs text-success"
              title="Mark as completed"
              onClick={() => updateAppointment(a.id, { status: 'COMPLETED' })}
            >
              Complete
            </button>
          )}
          {a.status === 'SCHEDULED' && (
            <button
              className="btn btn-ghost btn-xs text-warning"
              title="Cancel appointment"
              onClick={() => handleCancelClick(a.id)}
            >
              <Ban size={14} />
            </button>
          )}
          <button
            className="btn btn-ghost btn-xs text-error"
            title="Delete permanently"
            onClick={() => handleDeleteClick(a.id)}
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
            />
            <input
              className="input input-bordered w-full pl-9 pr-9"
              placeholder="Search patient, doctor, specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                onClick={() => setSearch('')}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <Select
              options={[
                { label: 'Scheduled', value: 'SCHEDULED' },
                { label: 'Completed', value: 'COMPLETED' },
                { label: 'Cancelled', value: 'CANCELLED' },
              ]}
              placeholder="All statuses"
              value={statusFilter}
              onChange={(e) => setStatusFilter((e.target as HTMLSelectElement).value)}
            />
            <Button onClick={() => { reset(); openModal('appointment-modal') }}>
              <Plus size={16} /> Book Appointment
            </Button>
          </div>
        </div>

        {(search || statusFilter) && (
          <p className="text-xs text-base-content/50 mt-2">
            {total} record{total !== 1 ? 's' : ''} found
            {search && <span> for <span className="font-medium text-base-content/70">"{search}"</span></span>}
            {statusFilter && <span> · status: <span className="font-medium text-base-content/70">{statusFilter}</span></span>}
          </p>
        )}
      </Card>

      <Card title={`Appointments (${total})`}>
        <Table
          columns={columns}
          data={appointments}
          loading={isLoading}
          keyExtractor={(a) => a.id}
          emptyMessage={search ? `No appointments found for "${search}"` : 'No appointments found'}
        />
        <Pagination
          total={total}
          page={page}
          limit={10}
          onPageChange={(p) => {
            setPage(p)
            fetchAppointments({
              status: statusFilter || undefined,
              search: debouncedSearch || undefined,
              page: p,
            })
          }}
        />
      </Card>

      <Modal id="appointment-modal" title="Book Appointment">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <AppointmentFormFields
            register={register}
            errors={errors}
            patients={patients}
            doctors={doctors}
          />
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" type="button" onClick={() => closeModal('appointment-modal')}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Book Appointment
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        id="confirm-cancel-modal"
        title="Cancel Appointment"
        message="Are you sure you want to cancel this appointment? The record will remain with a Cancelled status."
        confirmLabel="Yes, Cancel It"
        confirmVariant="warning"
        onConfirm={confirmCancel}
      />

      <ConfirmModal
        id="confirm-delete-modal"
        title="Delete Appointment"
        message="Are you sure you want to permanently delete this appointment? This action cannot be undone."
        confirmLabel="Yes, Delete"
        confirmVariant="error"
        onConfirm={confirmDelete}
      />
    </div>
  )
}
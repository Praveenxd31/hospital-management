import { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDoctorStore } from '@store/doctorStore'
import { useDebounce } from '@hooks/useDebounce'
import { Card } from '@ui/Card'
import { Button } from '@ui/Button'
import { Table } from '@common/Table'
import { Modal, openModal, closeModal } from '@ui/Modal'
import { ConfirmModal, openConfirmModal } from '@ui/ConfirmModal'
import { DoctorFormFields } from '@forms/DoctorFormFields'
import type { Doctor } from '../types'
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react'

const schema = z.object({
  name: z.string().min(2, 'Min 2 characters'),
  specialization: z.string().min(2, 'Required'),
  phone: z.string().regex(/^[0-9]{10}$/, '10 digit phone'),
  email: z.string().email('Invalid email'),
})
type FormData = z.infer<typeof schema>

export const Doctors = () => {
  const { doctors, isLoading, fetchDoctors, createDoctor, updateDoctor, deleteDoctor } = useDoctorStore()
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const targetId = useRef<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    fetchDoctors({ search: debouncedSearch })
  }, [debouncedSearch])

  const openAdd = () => {
    setEditingDoctor(null)
    reset({ name: '', specialization: '', phone: '', email: '' })
    openModal('doctor-modal')
  }

  const openEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor)
    reset({
      name: doctor.name,
      specialization: doctor.specialty,
      phone: doctor.phone,
      email: doctor.email,
    })
    openModal('doctor-modal')
  }

  const onSubmit = async (data: FormData) => {
    const ok = editingDoctor
      ? await updateDoctor(editingDoctor.id, data)
      : await createDoctor(data)
    if (ok) closeModal('doctor-modal')
  }

  const handleDeleteClick = (id: string) => {
    targetId.current = id
    openConfirmModal('confirm-delete-doctor-modal')
  }

  const confirmDelete = async () => {
    if (targetId.current) {
      await deleteDoctor(targetId.current)
      targetId.current = null
    }
  }

  const columns = [
    { header: 'Name', accessor: 'name' as keyof Doctor },
    { header: 'Specialty', accessor: 'specialty' as keyof Doctor },
    { header: 'Phone', accessor: 'phone' as keyof Doctor },
    { header: 'Email', accessor: 'email' as keyof Doctor },
    {
      header: 'Actions',
      render: (d: Doctor) => (
        <div className="flex gap-2">
          <button
            className="btn btn-ghost btn-xs"
            title="Edit doctor"
            onClick={() => openEdit(d)}
          >
            <Pencil size={14} />
          </button>
          <button
            className="btn btn-ghost btn-xs text-error"
            title="Delete doctor"
            onClick={() => handleDeleteClick(d.id)}
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
              placeholder="Search by name, specialty, phone, email..."
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

          <Button onClick={openAdd}>
            <Plus size={16} /> Add Doctor
          </Button>
        </div>

        {search && (
          <p className="text-xs text-base-content/50 mt-2">
            Showing results for <span className="font-medium text-base-content/70">"{search}"</span>
            {' '}— {doctors.length} record{doctors.length !== 1 ? 's' : ''} found
          </p>
        )}
      </Card>

      <Card title={`Doctors (${doctors.length})`}>
        <Table
          columns={columns}
          data={doctors}
          loading={isLoading}
          keyExtractor={(d) => d.id}
          emptyMessage={search ? `No doctors found for "${search}"` : 'No doctors found'}
        />
      </Card>

      <Modal id="doctor-modal" title={editingDoctor ? 'Edit Doctor' : 'Add Doctor'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DoctorFormFields register={register} errors={errors} />
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" type="button" onClick={() => closeModal('doctor-modal')}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {editingDoctor ? 'Update' : 'Add Doctor'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        id="confirm-delete-doctor-modal"
        title="Delete Doctor"
        message="Are you sure you want to permanently delete this doctor? This action cannot be undone."
        confirmLabel="Yes, Delete"
        confirmVariant="error"
        onConfirm={confirmDelete}
      />
    </div>
  )
}
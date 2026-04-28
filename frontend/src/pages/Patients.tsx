import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePatientStore } from '@store/patientStore'
import { useDebounce } from '@hooks/useDebounce'
import { Card } from '@ui/Card'
import { Button } from '@ui/Button'
import { Table } from '@common/Table'
import { Pagination } from '@common/Pagination'
import { ConfirmModal, openConfirmModal } from '@ui/ConfirmModal'
import type { Patient } from '../types'
import { format } from 'date-fns'
import { Plus, Search, Pencil, Trash2, X } from 'lucide-react'

export const Patients = () => {
  const { patients, total, page, isLoading, fetchPatients, deletePatient, setPage } = usePatientStore()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const targetId = useRef<string | null>(null)

  useEffect(() => {
    setPage(1)
    fetchPatients({ search: debouncedSearch, page: 1 })
  }, [debouncedSearch])

  useEffect(() => {
    fetchPatients({ search: debouncedSearch, page })
  }, [page])

  const handleDeleteClick = (id: string) => {
    targetId.current = id
    openConfirmModal('confirm-delete-patient-modal')
  }

  const confirmDelete = async () => {
    if (targetId.current) {
      await deletePatient(targetId.current)
      targetId.current = null
    }
  }

  const handleClearSearch = () => setSearch('')

  const columns = [
    { header: 'Name', accessor: 'name' as keyof Patient },
    { header: 'Age', accessor: 'age' as keyof Patient },
    { header: 'Gender', accessor: 'gender' as keyof Patient },
    { header: 'Phone', accessor: 'phone' as keyof Patient },
    { header: 'Email', accessor: 'email' as keyof Patient },
    {
      header: 'Registered',
      render: (p: Patient) => format(new Date(p.createdAt), 'MMM d, yyyy'),
    },
    {
      header: 'Actions',
      render: (p: Patient) => (
        <div className="flex gap-2">
          <button
            className="btn btn-ghost btn-xs"
            title="Edit patient"
            onClick={() => navigate(`/patients/${p.id}/edit`)}
          >
            <Pencil size={14} />
          </button>
          <button
            className="btn btn-ghost btn-xs text-error"
            title="Delete patient"
            onClick={() => handleDeleteClick(p.id)}
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
              placeholder="Search by name, email, phone, age, gender..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                onClick={handleClearSearch}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <Button onClick={() => navigate('/patients/new')}>
            <Plus size={16} /> Add Patient
          </Button>
        </div>

        {search && (
          <p className="text-xs text-base-content/50 mt-2">
            Showing results for <span className="font-medium text-base-content/70">"{search}"</span>
            {' '}— {total} record{total !== 1 ? 's' : ''} found
          </p>
        )}
      </Card>

      <Card title={`Patients (${total})`}>
        <Table
          columns={columns}
          data={patients}
          loading={isLoading}
          keyExtractor={(p) => p.id}
          emptyMessage={search ? `No patients found for "${search}"` : 'No patients found'}
        />
        <Pagination
          total={total}
          page={page}
          limit={10}
          onPageChange={(p) => {
            setPage(p)
            fetchPatients({ search: debouncedSearch, page: p })
          }}
        />
      </Card>

      <ConfirmModal
        id="confirm-delete-patient-modal"
        title="Delete Patient"
        message="Are you sure you want to permanently delete this patient? This action cannot be undone."
        confirmLabel="Yes, Delete"
        confirmVariant="error"
        onConfirm={confirmDelete}
      />
    </div>
  )
}
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import { usePatientStore } from '@store/patientStore'
import { Card } from '@ui/Card'
import { Button } from '@ui/Button'
import { PatientFormFields } from '@forms/PatientFormFields'
import { ArrowLeft } from 'lucide-react'

const schema = z.object({
  name: z.string().min(2, 'Min 2 characters'),
  age: z.number({ invalid_type_error: 'Required' }).min(0).max(150),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  phone: z.string().regex(/^[0-9]{10}$/, '10 digit phone required'),
  email: z.string().email('Invalid email'),
  address: z.string().min(1, 'Address required'),
})
type FormData = z.infer<typeof schema>

export const PatientForm = () => {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { createPatient, updatePatient, fetchPatientById, selectedPatient } = usePatientStore()

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (isEdit && id) fetchPatientById(id)
  }, [id])

  useEffect(() => {
    if (isEdit && selectedPatient) reset(selectedPatient as any)
  }, [selectedPatient])

  const onSubmit = async (data: FormData) => {
    const ok = isEdit && id
      ? await updatePatient(id, data)
      : await createPatient(data)
    if (ok) navigate('/patients')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <button
        className="btn btn-ghost btn-sm gap-2"
        onClick={() => navigate('/patients')}
      >
        <ArrowLeft size={16} /> Back to Patients
      </button>

      <Card title={isEdit ? 'Edit Patient' : 'Register New Patient'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <PatientFormFields register={register} errors={errors} />
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" type="button" onClick={() => navigate('/patients')}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {isEdit ? 'Update Patient' : 'Register Patient'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
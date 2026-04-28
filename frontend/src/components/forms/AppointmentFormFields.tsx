import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import { Select } from '../ui/Select'
import { Input } from '../ui/Input'
import type { Patient, Doctor } from '../../types'

interface AppointmentFormData {
  patientId: string
  doctorId: string
  date: string
  timeSlot: string
  notes?: string
}

interface Props {
  register: UseFormRegister<AppointmentFormData>
  errors: FieldErrors<AppointmentFormData>
  patients: Patient[]
  doctors: Doctor[]
}

export const AppointmentFormFields = ({ register, errors, patients, doctors }: Props) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Select
      label="Patient"
      options={patients.map((p) => ({ label: p.name, value: p.id }))}
      placeholder="Select patient"
      error={errors.patientId?.message}
      {...register('patientId')}
    />
    <Select
      label="Doctor"
      options={doctors.map((d) => ({ label: `${d.name} — ${d.specialty}`, value: d.id }))}
      placeholder="Select doctor"
      error={errors.doctorId?.message}
      {...register('doctorId')}
    />
    <Input
      label="Date"
      type="date"
      min={new Date().toISOString().split('T')[0]}
      error={errors.date?.message}
      {...register('date')}
    />

    <div className="form-control w-full">
      <label className="label">
        <span className="label-text font-medium">Time Slot</span>
      </label>
      <input
        type="time"
        min="09:00"
        max="17:00"
        step="1800"        
        className={`input input-bordered w-full ${errors.timeSlot ? 'input-error' : ''}`}
        {...register('timeSlot')}
      />
      {errors.timeSlot && (
        <label className="label">
          <span className="label-text-alt text-error">{errors.timeSlot.message}</span>
        </label>
      )}
      <label className="label">
        <span className="label-text-alt text-base-content/50">Working hours: 09:00 – 17:00</span>
      </label>
    </div>

    <div className="md:col-span-2">
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Notes (optional)</span>
        </label>
        <textarea
          className="textarea textarea-bordered"
          placeholder="Any additional notes..."
          rows={3}
          {...register('notes')}
        />
      </div>
    </div>
  </div>
)
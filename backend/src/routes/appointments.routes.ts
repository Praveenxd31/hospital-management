import express from 'express';
import {
  createAppointment, getAllAppointments,
  getAppointmentById, updateAppointment, deleteAppointment,
} from '../controllers/appointment.controller'
import { validate } from '../middleware/validate.middleware'
import {
  createAppointmentSchema,
  updateAppointmentSchema,
} from '../validators/appointment.validator'
import { authorize, protect } from '../middleware/auth.middleware'

const router = express.Router();

router.use(protect)

router.route('/')
  .get(getAllAppointments) 
  .post(
    authorize('ADMIN', 'RECEPTIONIST'),
    validate(createAppointmentSchema),
    createAppointment
  )

router.route('/:id')
  .get(getAppointmentById) 
  .put(
    authorize('ADMIN', 'RECEPTIONIST'),
    validate(updateAppointmentSchema),
    updateAppointment
  )
  .delete(
    authorize('ADMIN'),
    deleteAppointment
  )
export default router
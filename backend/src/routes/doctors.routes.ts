import express from 'express';
import {
  createDoctor, getAllDoctors,
  getDoctorById, updateDoctor, deleteDoctor,
} from '../controllers/doctor.controller'
import { validate } from '../middleware/validate.middleware'
import { createDoctorSchema, updateDoctorSchema } from '../validators/doctor.validator'
import { authorize, protect } from '../middleware/auth.middleware'

const router = express.Router();

router.use(protect)

router.route('/')
  .get(getAllDoctors) 
  .post(
    authorize('ADMIN'),
    validate(createDoctorSchema),
    createDoctor
  )

router.route('/:id')
  .get(getDoctorById) 
  .put(
    authorize('ADMIN'),
    validate(updateDoctorSchema),
    updateDoctor
  )
  .delete(
    authorize('ADMIN'),
    deleteDoctor
  )

export default router
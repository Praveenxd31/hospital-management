import express from 'express';
import {
  createPatient, getAllPatients,
  getPatientById, updatePatient, deletePatient,
} from '../controllers/patient.controller'
import { validate } from '../middleware/validate.middleware'
import { createPatientSchema, updatePatientSchema } from '../validators/patient.validator'
import { authorize, protect } from '../middleware/auth.middleware'

const router = express.Router();

router.use(protect)

router.route('/')
  .get(getAllPatients) 
  .post(
    authorize('ADMIN', 'RECEPTIONIST'),
    validate(createPatientSchema),
    createPatient
  )

router.route('/:id')
  .get(getPatientById) 
  .put(
    authorize('ADMIN', 'RECEPTIONIST'),
    validate(updatePatientSchema),
    updatePatient
  )
  .delete(
    authorize('ADMIN'),
    deletePatient
  )

export default router
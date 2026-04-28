import express from 'express';
import authRoutes from './auth.routes';
import dashboardRoutes from './dashboard.routes';
import doctorRoutes from './doctors.routes';
import patientRoutes from './patients.routes';
import appointmentRoutes from './appointments.routes';

const router = express.Router();;

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/doctors', doctorRoutes);
router.use('/patients', patientRoutes);
router.use('/appointments', appointmentRoutes);

export default router;
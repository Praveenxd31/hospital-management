import express from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller'
import { protect } from '../middleware/auth.middleware'

const router = express.Router();

router.use(protect)
router.get('/stats', getDashboardStats)

export default router
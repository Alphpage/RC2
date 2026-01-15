import { Router } from 'express';
import authRoutes from './authRoutes';
import pointsRoutes from './pointsRoutes';
import usersRoutes from './usersRoutes';
import employeesRoutes from './employeesRoutes';
import registersRoutes from './registersRoutes';
import schedulesRoutes from './schedulesRoutes';
import revenueRoutes from './revenueRoutes';
import encashmentRoutes from './encashmentRoutes';
import timesheetRoutes from './timesheetRoutes';
import reportsRoutes from './reportsRoutes';
import auditRoutes from './auditRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/points', pointsRoutes);
router.use('/users', usersRoutes);
router.use('/employees', employeesRoutes);
router.use('/registers', registersRoutes);
router.use('/schedules', schedulesRoutes);
router.use('/revenue', revenueRoutes);
router.use('/encashment', encashmentRoutes);
router.use('/timesheet', timesheetRoutes);
router.use('/reports', reportsRoutes);
router.use('/audit', auditRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;

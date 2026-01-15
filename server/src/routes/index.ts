import { Router } from 'express';
import authRoutes from './authRoutes';
import pointsRoutes from './pointsRoutes';
import usersRoutes from './usersRoutes';
import employeesRoutes from './employeesRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/points', pointsRoutes);
router.use('/users', usersRoutes);
router.use('/employees', employeesRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;

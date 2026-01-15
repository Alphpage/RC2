import { Router } from 'express';
import {
  getPointSchedules,
  createPointSchedule,
  updatePointSchedule,
  deletePointSchedule,
  getEmployeeSchedules,
  createEmployeeSchedule,
  updateEmployeeSchedule,
  deleteEmployeeSchedule,
} from '../controllers/schedulesController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticateToken);

// Point schedules
router.get('/points', getPointSchedules);
router.post('/points', authorizeRoles(UserRole.ADMIN, UserRole.SUPERVISOR), createPointSchedule);
router.put('/points/:id', authorizeRoles(UserRole.ADMIN), updatePointSchedule);
router.delete('/points/:id', authorizeRoles(UserRole.ADMIN), deletePointSchedule);

// Employee schedules
router.get('/employees', getEmployeeSchedules);
router.post('/employees', authorizeRoles(UserRole.ADMIN, UserRole.SUPERVISOR), createEmployeeSchedule);
router.put('/employees/:id', authorizeRoles(UserRole.ADMIN), updateEmployeeSchedule);
router.delete('/employees/:id', authorizeRoles(UserRole.ADMIN), deleteEmployeeSchedule);

export default router;

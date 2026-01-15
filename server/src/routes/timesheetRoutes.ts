import { Router } from 'express';
import {
  getTimesheetEntries,
  getTimesheetEntry,
  createTimesheetEntry,
  updateTimesheetEntry,
  deleteTimesheetEntry,
  getSalaryCalculation,
} from '../controllers/timesheetController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticateToken);

router.get('/', getTimesheetEntries);
router.get('/salary/calculate', getSalaryCalculation);
router.get('/:id', getTimesheetEntry);
router.post('/', authorizeRoles(UserRole.ADMIN, UserRole.SUPERVISOR), createTimesheetEntry);
router.put('/:id', authorizeRoles(UserRole.ADMIN), updateTimesheetEntry);
router.delete('/:id', authorizeRoles(UserRole.ADMIN), deleteTimesheetEntry);

export default router;

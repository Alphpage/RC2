import { Router } from 'express';
import {
  getAllEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../controllers/employeesController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticateToken);

router.get('/', getAllEmployees);
router.get('/:id', getEmployee);
router.post('/', authorizeRoles(UserRole.ADMIN), createEmployee);
router.put('/:id', authorizeRoles(UserRole.ADMIN), updateEmployee);
router.delete('/:id', authorizeRoles(UserRole.ADMIN), deleteEmployee);

export default router;

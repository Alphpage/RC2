import { Router } from 'express';
import {
  getAllRegisters,
  getRegister,
  createRegister,
  updateRegister,
  deleteRegister,
} from '../controllers/registersController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticateToken);

router.get('/', getAllRegisters);
router.get('/:id', getRegister);
router.post('/', authorizeRoles(UserRole.ADMIN), createRegister);
router.put('/:id', authorizeRoles(UserRole.ADMIN), updateRegister);
router.delete('/:id', authorizeRoles(UserRole.ADMIN), deleteRegister);

export default router;

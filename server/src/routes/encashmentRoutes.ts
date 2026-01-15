import { Router } from 'express';
import {
  getEncashmentEntries,
  getEncashmentEntry,
  createEncashmentEntry,
  updateEncashmentEntry,
  deleteEncashmentEntry,
  getEncashmentStats,
} from '../controllers/encashmentController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticateToken);

router.get('/', getEncashmentEntries);
router.get('/stats', getEncashmentStats);
router.get('/:id', getEncashmentEntry);
router.post('/', authorizeRoles(UserRole.ADMIN, UserRole.SUPERVISOR), createEncashmentEntry);
router.put('/:id', authorizeRoles(UserRole.ADMIN), updateEncashmentEntry);
router.delete('/:id', authorizeRoles(UserRole.ADMIN), deleteEncashmentEntry);

export default router;

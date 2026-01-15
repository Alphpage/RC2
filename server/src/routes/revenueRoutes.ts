import { Router } from 'express';
import {
  getRevenueEntries,
  getRevenueEntry,
  createRevenueEntry,
  updateRevenueEntry,
  deleteRevenueEntry,
  getRevenueStats,
} from '../controllers/revenueController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticateToken);

router.get('/', getRevenueEntries);
router.get('/stats', getRevenueStats);
router.get('/:id', getRevenueEntry);
router.post('/', authorizeRoles(UserRole.ADMIN, UserRole.SUPERVISOR), createRevenueEntry);
router.put('/:id', authorizeRoles(UserRole.ADMIN), updateRevenueEntry);
router.delete('/:id', authorizeRoles(UserRole.ADMIN), deleteRevenueEntry);

export default router;

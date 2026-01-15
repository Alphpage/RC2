import { Router } from 'express';
import {
  getAllPoints,
  getPoint,
  createPoint,
  updatePoint,
  deletePoint,
} from '../controllers/pointsController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticateToken);

router.get('/', getAllPoints);
router.get('/:id', getPoint);
router.post('/', authorizeRoles(UserRole.ADMIN), createPoint);
router.put('/:id', authorizeRoles(UserRole.ADMIN), updatePoint);
router.delete('/:id', authorizeRoles(UserRole.ADMIN), deletePoint);

export default router;

import { Router } from 'express';
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/usersController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticateToken);
router.use(authorizeRoles(UserRole.ADMIN));

router.get('/', getAllUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;

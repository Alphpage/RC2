import { Router } from 'express';
import {
  getMorningReports,
  getMorningReport,
  createMorningReport,
  updateMorningReport,
  deleteMorningReport,
  getEveningReports,
  getEveningReport,
  createEveningReport,
  updateEveningReport,
  deleteEveningReport,
} from '../controllers/reportsController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticateToken);

// Morning reports
router.get('/morning', getMorningReports);
router.get('/morning/:id', getMorningReport);
router.post('/morning', authorizeRoles(UserRole.ADMIN, UserRole.SUPERVISOR), createMorningReport);
router.put('/morning/:id', authorizeRoles(UserRole.ADMIN, UserRole.SUPERVISOR), updateMorningReport);
router.delete('/morning/:id', authorizeRoles(UserRole.ADMIN), deleteMorningReport);

// Evening reports
router.get('/evening', getEveningReports);
router.get('/evening/:id', getEveningReport);
router.post('/evening', authorizeRoles(UserRole.ADMIN, UserRole.SUPERVISOR), createEveningReport);
router.put('/evening/:id', authorizeRoles(UserRole.ADMIN, UserRole.SUPERVISOR), updateEveningReport);
router.delete('/evening/:id', authorizeRoles(UserRole.ADMIN), deleteEveningReport);

export default router;

import { Router } from 'express';
import {
  getAuditQuestions,
  getAuditQuestion,
  createAuditQuestion,
  updateAuditQuestion,
  deleteAuditQuestion,
  getAuditReports,
  getAuditReport,
  createAuditReport,
  updateAuditReport,
  deleteAuditReport,
} from '../controllers/auditController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticateToken);

// Audit questions
router.get('/questions', getAuditQuestions);
router.get('/questions/:id', getAuditQuestion);
router.post('/questions', authorizeRoles(UserRole.ADMIN), createAuditQuestion);
router.put('/questions/:id', authorizeRoles(UserRole.ADMIN), updateAuditQuestion);
router.delete('/questions/:id', authorizeRoles(UserRole.ADMIN), deleteAuditQuestion);

// Audit reports
router.get('/reports', getAuditReports);
router.get('/reports/:id', getAuditReport);
router.post('/reports', authorizeRoles(UserRole.ADMIN, UserRole.SUPERVISOR), createAuditReport);
router.put('/reports/:id', authorizeRoles(UserRole.ADMIN, UserRole.SUPERVISOR), updateAuditReport);
router.delete('/reports/:id', authorizeRoles(UserRole.ADMIN), deleteAuditReport);

export default router;

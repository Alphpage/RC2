import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { UserRole } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    login: string;
    role: UserRole;
    assignedPointIds: string[];
  };
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as AuthRequest['user'];
    (req as AuthRequest).user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export const authorizeRoles = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthRequest;
    
    if (!authReq.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!roles.includes(authReq.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
};

export const checkPointAccess = (req: Request, res: Response, next: NextFunction): void => {
  const authReq = req as AuthRequest;
  const pointId = req.params.pointId || req.body.pointId;

  if (!authReq.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  // Admin and Manager have access to all points
  if (authReq.user.role === UserRole.ADMIN || authReq.user.role === UserRole.MANAGER) {
    next();
    return;
  }

  // Supervisors only have access to assigned points
  if (authReq.user.role === UserRole.SUPERVISOR) {
    if (!pointId) {
      res.status(400).json({ error: 'Point ID required' });
      return;
    }

    if (!authReq.user.assignedPointIds.includes(pointId)) {
      res.status(403).json({ error: 'Access denied to this point' });
      return;
    }
  }

  next();
};

import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { UserRole } from '@prisma/client';
import logger from '../utils/logger';

export const getAllPoints = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    let points;

    // Admin and Manager see all points
    if (req.user.role === UserRole.ADMIN || req.user.role === UserRole.MANAGER) {
      points = await prisma.rentalPoint.findMany({
        include: {
          cashRegisters: true,
          employees: true,
        },
      });
    } else {
      // Supervisors see only assigned points
      points = await prisma.rentalPoint.findMany({
        where: {
          id: { in: req.user.assignedPointIds },
        },
        include: {
          cashRegisters: true,
          employees: true,
        },
      });
    }

    res.json(points);
  } catch (error) {
    logger.error('Get all points error:', error);
    res.status(500).json({ error: 'Failed to fetch points' });
  }
};

export const getPoint = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const point = await prisma.rentalPoint.findUnique({
      where: { id },
      include: {
        cashRegisters: true,
        employees: true,
      },
    });

    if (!point) {
      res.status(404).json({ error: 'Point not found' });
      return;
    }

    res.json(point);
  } catch (error) {
    logger.error('Get point error:', error);
    res.status(500).json({ error: 'Failed to fetch point' });
  }
};

export const createPoint = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, salaryPercent } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    const point = await prisma.rentalPoint.create({
      data: {
        name,
        salaryPercent: salaryPercent || null,
      },
    });

    logger.info(`Point created: ${point.name} by ${req.user?.login}`);
    res.status(201).json(point);
  } catch (error) {
    logger.error('Create point error:', error);
    res.status(500).json({ error: 'Failed to create point' });
  }
};

export const updatePoint = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, salaryPercent } = req.body;

    const point = await prisma.rentalPoint.update({
      where: { id },
      data: {
        name,
        salaryPercent,
      },
    });

    logger.info(`Point updated: ${point.name} by ${req.user?.login}`);
    res.json(point);
  } catch (error) {
    logger.error('Update point error:', error);
    res.status(500).json({ error: 'Failed to update point' });
  }
};

export const deletePoint = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.rentalPoint.delete({
      where: { id },
    });

    logger.info(`Point deleted: ${id} by ${req.user?.login}`);
    res.json({ message: 'Point deleted successfully' });
  } catch (error) {
    logger.error('Delete point error:', error);
    res.status(500).json({ error: 'Failed to delete point' });
  }
};

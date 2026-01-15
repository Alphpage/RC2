import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import logger from '../utils/logger';

export const getEncashmentEntries = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { pointId, registerId, startDate, endDate } = req.query;

    const where: any = {};
    
    if (pointId) {
      where.pointId = pointId as string;
    }

    if (registerId) {
      where.registerId = registerId as string;
    }

    if (startDate && endDate) {
      where.date = {
        gte: startDate as string,
        lte: endDate as string,
      };
    }

    const entries = await prisma.encashmentEntry.findMany({
      where,
      include: {
        point: true,
        register: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    res.json(entries);
  } catch (error) {
    logger.error('Get encashment entries error:', error);
    res.status(500).json({ error: 'Failed to fetch encashment entries' });
  }
};

export const getEncashmentEntry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const entry = await prisma.encashmentEntry.findUnique({
      where: { id },
      include: {
        point: true,
        register: true,
      },
    });

    if (!entry) {
      res.status(404).json({ error: 'Encashment entry not found' });
      return;
    }

    res.json(entry);
  } catch (error) {
    logger.error('Get encashment entry error:', error);
    res.status(500).json({ error: 'Failed to fetch encashment entry' });
  }
};

export const createEncashmentEntry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { pointId, registerId, date, amount } = req.body;

    if (!pointId || !registerId || !date || amount === undefined) {
      res.status(400).json({ error: 'PointId, registerId, date, and amount are required' });
      return;
    }

    const entry = await prisma.encashmentEntry.create({
      data: {
        pointId,
        registerId,
        date,
        amount,
      },
      include: {
        point: true,
        register: true,
      },
    });

    logger.info(`Encashment entry created for ${pointId} on ${date}: ${amount} by ${req.user?.login}`);
    res.status(201).json(entry);
  } catch (error) {
    logger.error('Create encashment entry error:', error);
    res.status(500).json({ error: 'Failed to create encashment entry' });
  }
};

export const updateEncashmentEntry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { amount, date } = req.body;

    const entry = await prisma.encashmentEntry.update({
      where: { id },
      data: {
        amount,
        date,
      },
      include: {
        point: true,
        register: true,
      },
    });

    logger.info(`Encashment entry updated: ${id} by ${req.user?.login}`);
    res.json(entry);
  } catch (error) {
    logger.error('Update encashment entry error:', error);
    res.status(500).json({ error: 'Failed to update encashment entry' });
  }
};

export const deleteEncashmentEntry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.encashmentEntry.delete({
      where: { id },
    });

    logger.info(`Encashment entry deleted: ${id} by ${req.user?.login}`);
    res.json({ message: 'Encashment entry deleted successfully' });
  } catch (error) {
    logger.error('Delete encashment entry error:', error);
    res.status(500).json({ error: 'Failed to delete encashment entry' });
  }
};

// ============ Encashment Statistics ============

export const getEncashmentStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { pointId, startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({ error: 'StartDate and endDate are required' });
      return;
    }

    const where: any = {
      date: {
        gte: startDate as string,
        lte: endDate as string,
      },
    };

    if (pointId) {
      where.pointId = pointId as string;
    }

    const entries = await prisma.encashmentEntry.findMany({
      where,
      include: {
        point: true,
        register: true,
      },
    });

    // Calculate statistics
    const totalAmount = entries.reduce((sum, e) => sum + e.amount, 0);
    const byPoint = entries.reduce((acc: any, e) => {
      if (!acc[e.pointId]) {
        acc[e.pointId] = {
          pointName: e.point.name,
          total: 0,
          count: 0,
        };
      }
      acc[e.pointId].total += e.amount;
      acc[e.pointId].count += 1;
      return acc;
    }, {});

    res.json({
      stats: {
        totalAmount,
        totalCount: entries.length,
        byPoint,
      },
      entries,
      period: { startDate, endDate },
    });
  } catch (error) {
    logger.error('Get encashment stats error:', error);
    res.status(500).json({ error: 'Failed to fetch encashment statistics' });
  }
};

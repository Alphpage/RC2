import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import logger from '../utils/logger';

export const getRevenueEntries = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const entries = await prisma.revenueEntry.findMany({
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
    logger.error('Get revenue entries error:', error);
    res.status(500).json({ error: 'Failed to fetch revenue entries' });
  }
};

export const getRevenueEntry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const entry = await prisma.revenueEntry.findUnique({
      where: { id },
      include: {
        point: true,
        register: true,
      },
    });

    if (!entry) {
      res.status(404).json({ error: 'Revenue entry not found' });
      return;
    }

    res.json(entry);
  } catch (error) {
    logger.error('Get revenue entry error:', error);
    res.status(500).json({ error: 'Failed to fetch revenue entry' });
  }
};

export const createRevenueEntry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { pointId, registerId, date, cash, card, refundCash, refundCard } = req.body;

    if (!pointId || !registerId || !date) {
      res.status(400).json({ error: 'PointId, registerId, and date are required' });
      return;
    }

    const entry = await prisma.revenueEntry.create({
      data: {
        pointId,
        registerId,
        date,
        cash: cash || 0,
        card: card || 0,
        refundCash: refundCash || 0,
        refundCard: refundCard || 0,
      },
      include: {
        point: true,
        register: true,
      },
    });

    logger.info(`Revenue entry created for ${pointId} on ${date} by ${req.user?.login}`);
    res.status(201).json(entry);
  } catch (error) {
    logger.error('Create revenue entry error:', error);
    res.status(500).json({ error: 'Failed to create revenue entry' });
  }
};

export const updateRevenueEntry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { cash, card, refundCash, refundCard } = req.body;

    const entry = await prisma.revenueEntry.update({
      where: { id },
      data: {
        cash,
        card,
        refundCash,
        refundCard,
      },
      include: {
        point: true,
        register: true,
      },
    });

    logger.info(`Revenue entry updated: ${id} by ${req.user?.login}`);
    res.json(entry);
  } catch (error) {
    logger.error('Update revenue entry error:', error);
    res.status(500).json({ error: 'Failed to update revenue entry' });
  }
};

export const deleteRevenueEntry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.revenueEntry.delete({
      where: { id },
    });

    logger.info(`Revenue entry deleted: ${id} by ${req.user?.login}`);
    res.json({ message: 'Revenue entry deleted successfully' });
  } catch (error) {
    logger.error('Delete revenue entry error:', error);
    res.status(500).json({ error: 'Failed to delete revenue entry' });
  }
};

// ============ Revenue Statistics ============

export const getRevenueStats = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const entries = await prisma.revenueEntry.findMany({
      where,
      include: {
        point: true,
        register: true,
      },
    });

    // Calculate statistics
    const stats = {
      totalCash: entries.reduce((sum, e) => sum + e.cash, 0),
      totalCard: entries.reduce((sum, e) => sum + e.card, 0),
      totalRefundCash: entries.reduce((sum, e) => sum + e.refundCash, 0),
      totalRefundCard: entries.reduce((sum, e) => sum + e.refundCard, 0),
      netRevenue: 0,
    };

    stats.netRevenue = 
      stats.totalCash + stats.totalCard - stats.totalRefundCash - stats.totalRefundCard;

    res.json({
      stats,
      entries,
      period: { startDate, endDate },
    });
  } catch (error) {
    logger.error('Get revenue stats error:', error);
    res.status(500).json({ error: 'Failed to fetch revenue statistics' });
  }
};

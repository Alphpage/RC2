import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import logger from '../utils/logger';

// ============ Morning Reports ============

export const getMorningReports = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { pointId, startDate, endDate } = req.query;

    const where: any = {};
    
    if (pointId) {
      where.pointId = pointId as string;
    }

    if (startDate && endDate) {
      where.date = {
        gte: startDate as string,
        lte: endDate as string,
      };
    }

    const reports = await prisma.morningReport.findMany({
      where,
      include: {
        point: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    res.json(reports);
  } catch (error) {
    logger.error('Get morning reports error:', error);
    res.status(500).json({ error: 'Failed to fetch morning reports' });
  }
};

export const getMorningReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const report = await prisma.morningReport.findUnique({
      where: { id },
      include: {
        point: true,
      },
    });

    if (!report) {
      res.status(404).json({ error: 'Morning report not found' });
      return;
    }

    res.json(report);
  } catch (error) {
    logger.error('Get morning report error:', error);
    res.status(500).json({ error: 'Failed to fetch morning report' });
  }
};

export const createMorningReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { pointId, date, openTime, employeeIds, media, cashVerified } = req.body;

    if (!pointId || !date || !openTime) {
      res.status(400).json({ error: 'PointId, date, and openTime are required' });
      return;
    }

    const report = await prisma.morningReport.upsert({
      where: {
        pointId_date: { pointId, date },
      },
      update: {
        openTime,
        employeeIds: employeeIds || [],
        media: media || [],
        cashVerified: cashVerified !== undefined ? cashVerified : true,
      },
      create: {
        pointId,
        date,
        openTime,
        employeeIds: employeeIds || [],
        media: media || [],
        cashVerified: cashVerified !== undefined ? cashVerified : true,
      },
      include: {
        point: true,
      },
    });

    logger.info(`Morning report created/updated for ${pointId} on ${date} by ${req.user?.login}`);
    res.status(201).json(report);
  } catch (error) {
    logger.error('Create morning report error:', error);
    res.status(500).json({ error: 'Failed to create morning report' });
  }
};

export const updateMorningReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { openTime, employeeIds, media, cashVerified } = req.body;

    const report = await prisma.morningReport.update({
      where: { id },
      data: {
        openTime,
        employeeIds,
        media,
        cashVerified,
      },
      include: {
        point: true,
      },
    });

    logger.info(`Morning report updated: ${id} by ${req.user?.login}`);
    res.json(report);
  } catch (error) {
    logger.error('Update morning report error:', error);
    res.status(500).json({ error: 'Failed to update morning report' });
  }
};

export const deleteMorningReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.morningReport.delete({
      where: { id },
    });

    logger.info(`Morning report deleted: ${id} by ${req.user?.login}`);
    res.json({ message: 'Morning report deleted successfully' });
  } catch (error) {
    logger.error('Delete morning report error:', error);
    res.status(500).json({ error: 'Failed to delete morning report' });
  }
};

// ============ Evening Reports ============

export const getEveningReports = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { pointId, startDate, endDate } = req.query;

    const where: any = {};
    
    if (pointId) {
      where.pointId = pointId as string;
    }

    if (startDate && endDate) {
      where.date = {
        gte: startDate as string,
        lte: endDate as string,
      };
    }

    const reports = await prisma.eveningReport.findMany({
      where,
      include: {
        point: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    res.json(reports);
  } catch (error) {
    logger.error('Get evening reports error:', error);
    res.status(500).json({ error: 'Failed to fetch evening reports' });
  }
};

export const getEveningReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const report = await prisma.eveningReport.findUnique({
      where: { id },
      include: {
        point: true,
      },
    });

    if (!report) {
      res.status(404).json({ error: 'Evening report not found' });
      return;
    }

    res.json(report);
  } catch (error) {
    logger.error('Get evening report error:', error);
    res.status(500).json({ error: 'Failed to fetch evening report' });
  }
};

export const createEveningReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { pointId, date, closeTime, cashVerified } = req.body;

    if (!pointId || !date || !closeTime) {
      res.status(400).json({ error: 'PointId, date, and closeTime are required' });
      return;
    }

    const report = await prisma.eveningReport.upsert({
      where: {
        pointId_date: { pointId, date },
      },
      update: {
        closeTime,
        cashVerified: cashVerified !== undefined ? cashVerified : true,
      },
      create: {
        pointId,
        date,
        closeTime,
        cashVerified: cashVerified !== undefined ? cashVerified : true,
      },
      include: {
        point: true,
      },
    });

    logger.info(`Evening report created/updated for ${pointId} on ${date} by ${req.user?.login}`);
    res.status(201).json(report);
  } catch (error) {
    logger.error('Create evening report error:', error);
    res.status(500).json({ error: 'Failed to create evening report' });
  }
};

export const updateEveningReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { closeTime, cashVerified } = req.body;

    const report = await prisma.eveningReport.update({
      where: { id },
      data: {
        closeTime,
        cashVerified,
      },
      include: {
        point: true,
      },
    });

    logger.info(`Evening report updated: ${id} by ${req.user?.login}`);
    res.json(report);
  } catch (error) {
    logger.error('Update evening report error:', error);
    res.status(500).json({ error: 'Failed to update evening report' });
  }
};

export const deleteEveningReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.eveningReport.delete({
      where: { id },
    });

    logger.info(`Evening report deleted: ${id} by ${req.user?.login}`);
    res.json({ message: 'Evening report deleted successfully' });
  } catch (error) {
    logger.error('Delete evening report error:', error);
    res.status(500).json({ error: 'Failed to delete evening report' });
  }
};

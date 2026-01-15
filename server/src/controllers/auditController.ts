import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import logger from '../utils/logger';
import { AuditType } from '@prisma/client';

// ============ Audit Questions ============

export const getAuditQuestions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type } = req.query;

    const where: any = {};
    
    if (type) {
      where.type = type as AuditType;
    }

    const questions = await prisma.auditQuestion.findMany({
      where,
      orderBy: {
        createdAt: 'asc',
      },
    });

    res.json(questions);
  } catch (error) {
    logger.error('Get audit questions error:', error);
    res.status(500).json({ error: 'Failed to fetch audit questions' });
  }
};

export const getAuditQuestion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const question = await prisma.auditQuestion.findUnique({
      where: { id },
    });

    if (!question) {
      res.status(404).json({ error: 'Audit question not found' });
      return;
    }

    res.json(question);
  } catch (error) {
    logger.error('Get audit question error:', error);
    res.status(500).json({ error: 'Failed to fetch audit question' });
  }
};

export const createAuditQuestion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { text, type, requireOnAnswer, requirementType } = req.body;

    if (!text || !type) {
      res.status(400).json({ error: 'Text and type are required' });
      return;
    }

    const question = await prisma.auditQuestion.create({
      data: {
        text,
        type,
        requireOnAnswer: requireOnAnswer || null,
        requirementType: requirementType || [],
      },
    });

    logger.info(`Audit question created (${type}): ${text} by ${req.user?.login}`);
    res.status(201).json(question);
  } catch (error) {
    logger.error('Create audit question error:', error);
    res.status(500).json({ error: 'Failed to create audit question' });
  }
};

export const updateAuditQuestion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { text, type, requireOnAnswer, requirementType } = req.body;

    const question = await prisma.auditQuestion.update({
      where: { id },
      data: {
        text,
        type,
        requireOnAnswer,
        requirementType,
      },
    });

    logger.info(`Audit question updated: ${id} by ${req.user?.login}`);
    res.json(question);
  } catch (error) {
    logger.error('Update audit question error:', error);
    res.status(500).json({ error: 'Failed to update audit question' });
  }
};

export const deleteAuditQuestion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.auditQuestion.delete({
      where: { id },
    });

    logger.info(`Audit question deleted: ${id} by ${req.user?.login}`);
    res.json({ message: 'Audit question deleted successfully' });
  } catch (error) {
    logger.error('Delete audit question error:', error);
    res.status(500).json({ error: 'Failed to delete audit question' });
  }
};

// ============ Audit Reports ============

export const getAuditReports = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { pointId, type, startDate, endDate } = req.query;

    const where: any = {};
    
    if (pointId) {
      where.pointId = pointId as string;
    }

    if (type) {
      where.type = type as AuditType;
    }

    if (startDate && endDate) {
      where.date = {
        gte: startDate as string,
        lte: endDate as string,
      };
    }

    const reports = await prisma.auditReport.findMany({
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
    logger.error('Get audit reports error:', error);
    res.status(500).json({ error: 'Failed to fetch audit reports' });
  }
};

export const getAuditReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const report = await prisma.auditReport.findUnique({
      where: { id },
      include: {
        point: true,
      },
    });

    if (!report) {
      res.status(404).json({ error: 'Audit report not found' });
      return;
    }

    res.json(report);
  } catch (error) {
    logger.error('Get audit report error:', error);
    res.status(500).json({ error: 'Failed to fetch audit report' });
  }
};

export const createAuditReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { pointId, date, type, answers } = req.body;

    if (!pointId || !date || !type || !answers) {
      res.status(400).json({ error: 'PointId, date, type, and answers are required' });
      return;
    }

    const report = await prisma.auditReport.upsert({
      where: {
        pointId_date_type: { pointId, date, type },
      },
      update: {
        answers,
      },
      create: {
        pointId,
        date,
        type,
        answers,
      },
      include: {
        point: true,
      },
    });

    logger.info(`Audit report created/updated (${type}) for ${pointId} on ${date} by ${req.user?.login}`);
    res.status(201).json(report);
  } catch (error) {
    logger.error('Create audit report error:', error);
    res.status(500).json({ error: 'Failed to create audit report' });
  }
};

export const updateAuditReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { answers } = req.body;

    const report = await prisma.auditReport.update({
      where: { id },
      data: {
        answers,
      },
      include: {
        point: true,
      },
    });

    logger.info(`Audit report updated: ${id} by ${req.user?.login}`);
    res.json(report);
  } catch (error) {
    logger.error('Update audit report error:', error);
    res.status(500).json({ error: 'Failed to update audit report' });
  }
};

export const deleteAuditReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.auditReport.delete({
      where: { id },
    });

    logger.info(`Audit report deleted: ${id} by ${req.user?.login}`);
    res.json({ message: 'Audit report deleted successfully' });
  } catch (error) {
    logger.error('Delete audit report error:', error);
    res.status(500).json({ error: 'Failed to delete audit report' });
  }
};

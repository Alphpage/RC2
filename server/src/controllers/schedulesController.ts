import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import logger from '../utils/logger';

// ============ Point Schedules ============

export const getPointSchedules = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const schedules = await prisma.pointSchedule.findMany({
      where,
      include: {
        point: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    res.json(schedules);
  } catch (error) {
    logger.error('Get point schedules error:', error);
    res.status(500).json({ error: 'Failed to fetch point schedules' });
  }
};

export const createPointSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { pointId, date, openTime, closeTime } = req.body;

    if (!pointId || !date || !openTime || !closeTime) {
      res.status(400).json({ error: 'PointId, date, openTime, and closeTime are required' });
      return;
    }

    const schedule = await prisma.pointSchedule.upsert({
      where: {
        pointId_date: { pointId, date },
      },
      update: {
        openTime,
        closeTime,
      },
      create: {
        pointId,
        date,
        openTime,
        closeTime,
      },
      include: {
        point: true,
      },
    });

    logger.info(`Point schedule created/updated for ${pointId} on ${date} by ${req.user?.login}`);
    res.status(201).json(schedule);
  } catch (error) {
    logger.error('Create point schedule error:', error);
    res.status(500).json({ error: 'Failed to create point schedule' });
  }
};

export const updatePointSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { openTime, closeTime } = req.body;

    const schedule = await prisma.pointSchedule.update({
      where: { id },
      data: {
        openTime,
        closeTime,
      },
      include: {
        point: true,
      },
    });

    logger.info(`Point schedule updated: ${id} by ${req.user?.login}`);
    res.json(schedule);
  } catch (error) {
    logger.error('Update point schedule error:', error);
    res.status(500).json({ error: 'Failed to update point schedule' });
  }
};

export const deletePointSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.pointSchedule.delete({
      where: { id },
    });

    logger.info(`Point schedule deleted: ${id} by ${req.user?.login}`);
    res.json({ message: 'Point schedule deleted successfully' });
  } catch (error) {
    logger.error('Delete point schedule error:', error);
    res.status(500).json({ error: 'Failed to delete point schedule' });
  }
};

// ============ Employee Schedules ============

export const getEmployeeSchedules = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { employeeId, pointId, startDate, endDate } = req.query;

    const where: any = {};
    
    if (employeeId) {
      where.employeeId = employeeId as string;
    }

    if (pointId) {
      where.pointId = pointId as string;
    }

    if (startDate && endDate) {
      where.date = {
        gte: startDate as string,
        lte: endDate as string,
      };
    }

    const schedules = await prisma.employeeSchedule.findMany({
      where,
      include: {
        employee: true,
        point: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    res.json(schedules);
  } catch (error) {
    logger.error('Get employee schedules error:', error);
    res.status(500).json({ error: 'Failed to fetch employee schedules' });
  }
};

export const createEmployeeSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { employeeId, pointId, date, startTime, endTime } = req.body;

    if (!employeeId || !pointId || !date || !startTime || !endTime) {
      res.status(400).json({ 
        error: 'EmployeeId, pointId, date, startTime, and endTime are required' 
      });
      return;
    }

    const schedule = await prisma.employeeSchedule.upsert({
      where: {
        employeeId_date: { employeeId, date },
      },
      update: {
        pointId,
        startTime,
        endTime,
      },
      create: {
        employeeId,
        pointId,
        date,
        startTime,
        endTime,
      },
      include: {
        employee: true,
        point: true,
      },
    });

    logger.info(`Employee schedule created/updated for ${employeeId} on ${date} by ${req.user?.login}`);
    res.status(201).json(schedule);
  } catch (error) {
    logger.error('Create employee schedule error:', error);
    res.status(500).json({ error: 'Failed to create employee schedule' });
  }
};

export const updateEmployeeSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { pointId, startTime, endTime } = req.body;

    const schedule = await prisma.employeeSchedule.update({
      where: { id },
      data: {
        pointId,
        startTime,
        endTime,
      },
      include: {
        employee: true,
        point: true,
      },
    });

    logger.info(`Employee schedule updated: ${id} by ${req.user?.login}`);
    res.json(schedule);
  } catch (error) {
    logger.error('Update employee schedule error:', error);
    res.status(500).json({ error: 'Failed to update employee schedule' });
  }
};

export const deleteEmployeeSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.employeeSchedule.delete({
      where: { id },
    });

    logger.info(`Employee schedule deleted: ${id} by ${req.user?.login}`);
    res.json({ message: 'Employee schedule deleted successfully' });
  } catch (error) {
    logger.error('Delete employee schedule error:', error);
    res.status(500).json({ error: 'Failed to delete employee schedule' });
  }
};

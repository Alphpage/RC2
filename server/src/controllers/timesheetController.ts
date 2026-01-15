import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import logger from '../utils/logger';

export const getTimesheetEntries = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { pointId, employeeId, startDate, endDate } = req.query;

    const where: any = {};
    
    if (pointId) {
      where.pointId = pointId as string;
    }

    if (employeeId) {
      where.employeeId = employeeId as string;
    }

    if (startDate && endDate) {
      where.date = {
        gte: startDate as string,
        lte: endDate as string,
      };
    }

    const entries = await prisma.timesheetEntry.findMany({
      where,
      include: {
        point: true,
        employee: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    res.json(entries);
  } catch (error) {
    logger.error('Get timesheet entries error:', error);
    res.status(500).json({ error: 'Failed to fetch timesheet entries' });
  }
};

export const getTimesheetEntry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const entry = await prisma.timesheetEntry.findUnique({
      where: { id },
      include: {
        point: true,
        employee: true,
      },
    });

    if (!entry) {
      res.status(404).json({ error: 'Timesheet entry not found' });
      return;
    }

    res.json(entry);
  } catch (error) {
    logger.error('Get timesheet entry error:', error);
    res.status(500).json({ error: 'Failed to fetch timesheet entry' });
  }
};

export const createTimesheetEntry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { pointId, employeeId, date, hours, startTime, endTime } = req.body;

    if (!pointId || !employeeId || !date || hours === undefined) {
      res.status(400).json({ error: 'PointId, employeeId, date, and hours are required' });
      return;
    }

    const entry = await prisma.timesheetEntry.create({
      data: {
        pointId,
        employeeId,
        date,
        hours,
        startTime,
        endTime,
      },
      include: {
        point: true,
        employee: true,
      },
    });

    logger.info(`Timesheet entry created for employee ${employeeId} on ${date} by ${req.user?.login}`);
    res.status(201).json(entry);
  } catch (error) {
    logger.error('Create timesheet entry error:', error);
    res.status(500).json({ error: 'Failed to create timesheet entry' });
  }
};

export const updateTimesheetEntry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { hours, startTime, endTime } = req.body;

    const entry = await prisma.timesheetEntry.update({
      where: { id },
      data: {
        hours,
        startTime,
        endTime,
      },
      include: {
        point: true,
        employee: true,
      },
    });

    logger.info(`Timesheet entry updated: ${id} by ${req.user?.login}`);
    res.json(entry);
  } catch (error) {
    logger.error('Update timesheet entry error:', error);
    res.status(500).json({ error: 'Failed to update timesheet entry' });
  }
};

export const deleteTimesheetEntry = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.timesheetEntry.delete({
      where: { id },
    });

    logger.info(`Timesheet entry deleted: ${id} by ${req.user?.login}`);
    res.json({ message: 'Timesheet entry deleted successfully' });
  } catch (error) {
    logger.error('Delete timesheet entry error:', error);
    res.status(500).json({ error: 'Failed to delete timesheet entry' });
  }
};

// ============ Timesheet Statistics & Salary Calculation ============

export const getSalaryCalculation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { startDate, endDate, pointId } = req.query;

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

    const timesheets = await prisma.timesheetEntry.findMany({
      where,
      include: {
        employee: {
          include: {
            point: true,
          },
        },
        point: true,
      },
    });

    // Group by employee and calculate salary
    const salaryByEmployee = timesheets.reduce((acc: any, entry) => {
      const empId = entry.employeeId;
      
      if (!acc[empId]) {
        acc[empId] = {
          employeeId: empId,
          employeeName: entry.employee.name,
          position: entry.employee.position,
          hourlyRate: entry.employee.hourlyRate,
          pointName: entry.point.name,
          salaryPercent: entry.point.salaryPercent || 0,
          totalHours: 0,
          baseSalary: 0,
          pointPercentBonus: 0,
          total: 0,
        };
      }
      
      acc[empId].totalHours += entry.hours;
      
      return acc;
    }, {});

    // Calculate salaries
    Object.values(salaryByEmployee).forEach((emp: any) => {
      emp.baseSalary = emp.totalHours * emp.hourlyRate;
      emp.pointPercentBonus = (emp.baseSalary * emp.salaryPercent) / 100;
      emp.total = emp.baseSalary + emp.pointPercentBonus;
    });

    const salaries = Object.values(salaryByEmployee);
    const totalSalary = salaries.reduce((sum: number, s: any) => sum + s.total, 0);

    res.json({
      salaries,
      summary: {
        totalEmployees: salaries.length,
        totalHours: salaries.reduce((sum: number, s: any) => sum + s.totalHours, 0),
        totalSalary,
      },
      period: { startDate, endDate },
    });
  } catch (error) {
    logger.error('Get salary calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate salaries' });
  }
};

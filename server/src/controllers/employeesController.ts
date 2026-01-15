import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import logger from '../utils/logger';

export const getAllEmployees = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { pointId } = req.query;

    const employees = await prisma.employee.findMany({
      where: pointId ? { pointId: pointId as string } : undefined,
      include: {
        point: true,
      },
    });

    res.json(employees);
  } catch (error) {
    logger.error('Get all employees error:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
};

export const getEmployee = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        point: true,
      },
    });

    if (!employee) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }

    res.json(employee);
  } catch (error) {
    logger.error('Get employee error:', error);
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
};

export const createEmployee = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, position, pointId, hourlyRate } = req.body;

    if (!name || !position || !pointId || hourlyRate === undefined) {
      res.status(400).json({ error: 'Name, position, pointId, and hourlyRate are required' });
      return;
    }

    const employee = await prisma.employee.create({
      data: {
        name,
        position,
        pointId,
        hourlyRate,
      },
      include: {
        point: true,
      },
    });

    logger.info(`Employee created: ${employee.name} by ${req.user?.login}`);
    res.status(201).json(employee);
  } catch (error) {
    logger.error('Create employee error:', error);
    res.status(500).json({ error: 'Failed to create employee' });
  }
};

export const updateEmployee = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, position, pointId, hourlyRate } = req.body;

    const employee = await prisma.employee.update({
      where: { id },
      data: {
        name,
        position,
        pointId,
        hourlyRate,
      },
      include: {
        point: true,
      },
    });

    logger.info(`Employee updated: ${employee.name} by ${req.user?.login}`);
    res.json(employee);
  } catch (error) {
    logger.error('Update employee error:', error);
    res.status(500).json({ error: 'Failed to update employee' });
  }
};

export const deleteEmployee = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.employee.delete({
      where: { id },
    });

    logger.info(`Employee deleted: ${id} by ${req.user?.login}`);
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    logger.error('Delete employee error:', error);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
};

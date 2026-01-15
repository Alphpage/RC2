import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import logger from '../utils/logger';

export const getAllRegisters = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { pointId } = req.query;

    const registers = await prisma.cashRegister.findMany({
      where: pointId ? { pointId: pointId as string } : undefined,
      include: {
        point: true,
      },
    });

    res.json(registers);
  } catch (error) {
    logger.error('Get all registers error:', error);
    res.status(500).json({ error: 'Failed to fetch registers' });
  }
};

export const getRegister = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const register = await prisma.cashRegister.findUnique({
      where: { id },
      include: {
        point: true,
      },
    });

    if (!register) {
      res.status(404).json({ error: 'Register not found' });
      return;
    }

    res.json(register);
  } catch (error) {
    logger.error('Get register error:', error);
    res.status(500).json({ error: 'Failed to fetch register' });
  }
};

export const createRegister = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { pointId, name } = req.body;

    if (!pointId || !name) {
      res.status(400).json({ error: 'PointId and name are required' });
      return;
    }

    const register = await prisma.cashRegister.create({
      data: {
        pointId,
        name,
      },
      include: {
        point: true,
      },
    });

    logger.info(`Register created: ${register.name} by ${req.user?.login}`);
    res.status(201).json(register);
  } catch (error) {
    logger.error('Create register error:', error);
    res.status(500).json({ error: 'Failed to create register' });
  }
};

export const updateRegister = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { pointId, name } = req.body;

    const register = await prisma.cashRegister.update({
      where: { id },
      data: {
        pointId,
        name,
      },
      include: {
        point: true,
      },
    });

    logger.info(`Register updated: ${register.name} by ${req.user?.login}`);
    res.json(register);
  } catch (error) {
    logger.error('Update register error:', error);
    res.status(500).json({ error: 'Failed to update register' });
  }
};

export const deleteRegister = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.cashRegister.delete({
      where: { id },
    });

    logger.info(`Register deleted: ${id} by ${req.user?.login}`);
    res.json({ message: 'Register deleted successfully' });
  } catch (error) {
    logger.error('Delete register error:', error);
    res.status(500).json({ error: 'Failed to delete register' });
  }
};

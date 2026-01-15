import { Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import logger from '../utils/logger';

export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        login: true,
        name: true,
        role: true,
        assignedPointIds: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(users);
  } catch (error) {
    logger.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const createUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { login, password, name, role, assignedPointIds } = req.body;

    if (!login || !password || !name || !role) {
      res.status(400).json({ error: 'Login, password, name, and role are required' });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { login },
    });

    if (existingUser) {
      res.status(400).json({ error: 'User with this login already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        login,
        password: hashedPassword,
        name,
        role,
        assignedPointIds: assignedPointIds || [],
      },
      select: {
        id: true,
        login: true,
        name: true,
        role: true,
        assignedPointIds: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    logger.info(`User created: ${user.login} by ${req.user?.login}`);
    res.status(201).json(user);
  } catch (error) {
    logger.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { login, password, name, role, assignedPointIds } = req.body;

    const updateData: any = {};

    if (login) updateData.login = login;
    if (name) updateData.name = name;
    if (role) updateData.role = role;
    if (assignedPointIds !== undefined) updateData.assignedPointIds = assignedPointIds;
    
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        login: true,
        name: true,
        role: true,
        assignedPointIds: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    logger.info(`User updated: ${user.login} by ${req.user?.login}`);
    res.json(user);
  } catch (error) {
    logger.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id },
    });

    logger.info(`User deleted: ${id} by ${req.user?.login}`);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    logger.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

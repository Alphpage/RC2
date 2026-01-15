import { Router, Request, Response } from 'express';
import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import logger from '../utils/logger';

const router = Router();
const prisma = new PrismaClient();

// Simple in-memory flag to prevent multiple seed runs
let seedExecuted = false;

/**
 * POST /api/admin/seed
 * One-time seed endpoint for initial data
 * Can be called without authentication (but only works once)
 */
router.post('/seed', async (req: Request, res: Response) => {
  try {
    // Check if already executed in this session
    if (seedExecuted) {
      return res.status(400).json({
        error: 'Seed already executed in this session',
        message: 'Restart the server to run seed again',
      });
    }

    // Check if database already has data
    const userCount = await prisma.user.count();
    const pointCount = await prisma.rentalPoint.count();

    if (userCount > 0 && pointCount > 0) {
      seedExecuted = true;
      return res.status(200).json({
        message: 'Database already has data',
        users: userCount,
        points: pointCount,
      });
    }

    logger.info('🌱 Starting database seed via API...');

    // Create users
    const users = [
      {
        login: 'admin',
        password: await bcrypt.hash('admin123', 10),
        name: 'Администратор',
        role: UserRole.ADMIN,
        assignedPointIds: [],
      },
      {
        login: 'manager',
        password: await bcrypt.hash('manager123', 10),
        name: 'Менеджер',
        role: UserRole.MANAGER,
        assignedPointIds: [],
      },
      {
        login: 'supervisor',
        password: await bcrypt.hash('supervisor123', 10),
        name: 'Управляющий',
        role: UserRole.SUPERVISOR,
        assignedPointIds: [],
      },
    ];

    const createdUsers = [];
    for (const userData of users) {
      const user = await prisma.user.upsert({
        where: { login: userData.login },
        update: {},
        create: userData,
      });
      createdUsers.push({ login: user.login, role: user.role });
      logger.info(`✅ Created user: ${user.login} (${user.role})`);
    }

    // Create rental points
    const points = [
      { name: 'Точка Центр', salaryPercent: 10 },
      { name: 'Парк Победы', salaryPercent: 5 },
      { name: 'Набережная', salaryPercent: 7 },
    ];

    const createdPoints = [];
    for (const pointData of points) {
      const point = await prisma.rentalPoint.create({
        data: pointData,
      });
      createdPoints.push({ id: point.id, name: point.name });
      logger.info(`✅ Created rental point: ${point.name}`);
    }

    // Update supervisor with assigned point
    if (createdPoints.length > 0) {
      await prisma.user.update({
        where: { login: 'supervisor' },
        data: { assignedPointIds: [createdPoints[0].id] },
      });
      logger.info(`✅ Assigned point "${createdPoints[0].name}" to supervisor`);
    }

    // Create cash registers
    const registers = [
      { pointId: createdPoints[0].id, name: 'Касса 1 (Центр)' },
      { pointId: createdPoints[0].id, name: 'Терминал 1 (Центр)' },
      { pointId: createdPoints[1].id, name: 'Основная (Парк)' },
      { pointId: createdPoints[2].id, name: 'Касса Набережная' },
    ];

    const createdRegisters = [];
    for (const registerData of registers) {
      const register = await prisma.cashRegister.create({
        data: registerData,
      });
      createdRegisters.push({ id: register.id, name: register.name });
      logger.info(`✅ Created cash register: ${register.name}`);
    }

    // Create employees
    const employees = [
      {
        name: 'Иванов Иван',
        position: 'Старший оператор',
        pointId: createdPoints[0].id,
        hourlyRate: 300,
      },
      {
        name: 'Петрова Анна',
        position: 'Оператор',
        pointId: createdPoints[0].id,
        hourlyRate: 250,
      },
      {
        name: 'Сидоров Олег',
        position: 'Оператор',
        pointId: createdPoints[1].id,
        hourlyRate: 280,
      },
      {
        name: 'Смирнова Елена',
        position: 'Стажер',
        pointId: createdPoints[2].id,
        hourlyRate: 200,
      },
    ];

    const createdEmployees = [];
    for (const employeeData of employees) {
      const employee = await prisma.employee.create({
        data: employeeData,
      });
      createdEmployees.push({ id: employee.id, name: employee.name });
      logger.info(`✅ Created employee: ${employee.name}`);
    }

    // Create audit questions
    const morningQuestions = [
      {
        text: 'Полы чистые?',
        type: 'MORNING' as const,
        requireOnAnswer: 'no',
        requirementType: ['photo'],
      },
      {
        text: 'Техника включена?',
        type: 'MORNING' as const,
        requireOnAnswer: 'no',
        requirementType: ['comment'],
      },
    ];

    const eveningQuestions = [
      {
        text: 'Мусор вынесен?',
        type: 'EVENING' as const,
        requireOnAnswer: 'no',
        requirementType: ['photo'],
      },
      {
        text: 'Техника на зарядке?',
        type: 'EVENING' as const,
        requireOnAnswer: 'no',
        requirementType: ['comment'],
      },
    ];

    const createdQuestions = [];
    for (const questionData of [...morningQuestions, ...eveningQuestions]) {
      const question = await prisma.auditQuestion.create({
        data: questionData,
      });
      createdQuestions.push({ id: question.id, text: question.text, type: question.type });
      logger.info(`✅ Created audit question (${question.type}): ${question.text}`);
    }

    seedExecuted = true;
    logger.info('🎉 Database seed completed successfully via API!');

    res.status(200).json({
      success: true,
      message: '🎉 Database seeded successfully!',
      data: {
        users: createdUsers,
        points: createdPoints,
        registers: createdRegisters,
        employees: createdEmployees,
        auditQuestions: createdQuestions,
      },
      credentials: {
        admin: { login: 'admin', password: 'admin123' },
        manager: { login: 'manager', password: 'manager123' },
        supervisor: { login: 'supervisor', password: 'supervisor123' },
      },
    });
  } catch (error: any) {
    logger.error('Error seeding database via API:', error);
    res.status(500).json({
      error: 'Seed failed',
      message: error.message,
    });
  }
});

/**
 * GET /api/admin/seed/status
 * Check seed status
 */
router.get('/seed/status', async (req: Request, res: Response) => {
  try {
    const userCount = await prisma.user.count();
    const pointCount = await prisma.rentalPoint.count();
    const employeeCount = await prisma.employee.count();
    const registerCount = await prisma.cashRegister.count();

    res.json({
      seeded: userCount > 0 && pointCount > 0,
      sessionSeedExecuted: seedExecuted,
      counts: {
        users: userCount,
        points: pointCount,
        employees: employeeCount,
        registers: registerCount,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

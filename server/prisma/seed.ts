import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default users
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

  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { login: userData.login },
      update: {},
      create: userData,
    });
    console.log(`✅ Created user: ${user.login} (${user.role})`);
  }

  // Create sample rental points
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
    createdPoints.push(point);
    console.log(`✅ Created rental point: ${point.name}`);
  }

  // Update supervisor with assigned point
  if (createdPoints.length > 0) {
    await prisma.user.update({
      where: { login: 'supervisor' },
      data: { assignedPointIds: [createdPoints[0].id] },
    });
    console.log(`✅ Assigned point "${createdPoints[0].name}" to supervisor`);
  }

  // Create cash registers
  const registers = [
    { pointId: createdPoints[0].id, name: 'Касса 1 (Центр)' },
    { pointId: createdPoints[0].id, name: 'Терминал 1 (Центр)' },
    { pointId: createdPoints[1].id, name: 'Основная (Парк)' },
    { pointId: createdPoints[2].id, name: 'Касса Набережная' },
  ];

  for (const registerData of registers) {
    const register = await prisma.cashRegister.create({
      data: registerData,
    });
    console.log(`✅ Created cash register: ${register.name}`);
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

  for (const employeeData of employees) {
    const employee = await prisma.employee.create({
      data: employeeData,
    });
    console.log(`✅ Created employee: ${employee.name}`);
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

  for (const questionData of [...morningQuestions, ...eveningQuestions]) {
    const question = await prisma.auditQuestion.create({
      data: questionData,
    });
    console.log(`✅ Created audit question (${question.type}): ${question.text}`);
  }

  console.log('');
  console.log('🎉 Seeding completed successfully!');
  console.log('');
  console.log('📝 Default users created:');
  console.log('   Admin:      login: admin      | password: admin123');
  console.log('   Manager:    login: manager    | password: manager123');
  console.log('   Supervisor: login: supervisor | password: supervisor123');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

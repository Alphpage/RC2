import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function forceSeed() {
  console.log('🚀 Force seeding database (ignoring existing data)...');
  console.log('');

  // Create default users (upsert will update if exists)
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
      update: { password: userData.password }, // Update password if user exists
      create: userData,
    });
    console.log(`✅ User: ${user.login} (${user.role})`);
  }

  console.log('');
  console.log('🎉 Force seed completed!');
  console.log('');
  console.log('📝 Users available:');
  console.log('   Admin:      login: admin      | password: admin123');
  console.log('   Manager:    login: manager    | password: manager123');
  console.log('   Supervisor: login: supervisor | password: supervisor123');
  console.log('');
}

forceSeed()
  .catch((e) => {
    console.error('❌ Error force seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

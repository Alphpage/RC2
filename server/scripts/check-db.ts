import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  console.log('🔍 Checking database connection...\n');

  try {
    // Check connection
    await prisma.$connect();
    console.log('✅ Database connection successful!\n');

    // Count users
    const userCount = await prisma.user.count();
    console.log(`👥 Users in database: ${userCount}`);

    if (userCount > 0) {
      const users = await prisma.user.findMany({
        select: {
          login: true,
          name: true,
          role: true,
        },
      });
      console.log('\n📝 Existing users:');
      users.forEach(user => {
        console.log(`   - ${user.login} (${user.role}) - ${user.name}`);
      });
    } else {
      console.log('⚠️  No users found! Run: npx prisma db seed');
    }

    // Count other entities
    const pointCount = await prisma.rentalPoint.count();
    const employeeCount = await prisma.employee.count();
    const registerCount = await prisma.cashRegister.count();

    console.log(`\n📊 Other data:`);
    console.log(`   - Rental Points: ${pointCount}`);
    console.log(`   - Employees: ${employeeCount}`);
    console.log(`   - Cash Registers: ${registerCount}`);

    if (pointCount === 0) {
      console.log('\n⚠️  No data found! Run: npx prisma db seed');
    }

  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error('Error:', error);
    console.log('\n💡 Check your DATABASE_URL in .env file');
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();

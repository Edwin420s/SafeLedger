const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const john = await prisma.user.upsert({
    where: { phone: '254700000001' },
    update: {},
    create: {
      phone: '254700000001',
      password: hashedPassword,
      name: 'John Doe',
      trustScore: 4.5,
    },
  });

  const jane = await prisma.user.upsert({
    where: { phone: '254700000002' },
    update: {},
    create: {
      phone: '254700000002',
      password: hashedPassword,
      name: 'Jane Smith',
      trustScore: 3.8,
    },
  });

  const alice = await prisma.user.upsert({
    where: { phone: '254700000003' },
    update: {},
    create: {
      phone: '254700000003',
      password: hashedPassword,
      name: 'Alice Wanjiku',
      trustScore: 5.0,
    },
  });

  console.log('Users created:', { john, jane, alice });

  // Create sample agreements
  const agreement1 = await prisma.agreement.create({
    data: {
      lenderId: john.id,
      borrowerId: jane.id,
      amount: 5000.00,
      interestRate: 5.0,
      penaltyRate: 2.0,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: 'ACTIVE',
      hash: 'abc123def456...',
    },
  });

  const agreement2 = await prisma.agreement.create({
    data: {
      lenderId: jane.id,
      borrowerId: alice.id,
      amount: 2000.00,
      interestRate: 5.0,
      penaltyRate: 2.0,
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      status: 'PENDING',
      hash: 'def789abc012...',
    },
  });

  console.log('Agreements created:', { agreement1, agreement2 });

  // Create sample payments
  await prisma.payment.create({
    data: {
      agreementId: agreement1.id,
      amount: 1000.00,
      notes: 'First installment',
    },
  });

  await prisma.payment.create({
    data: {
      agreementId: agreement1.id,
      amount: 1500.00,
      notes: 'Second installment',
    },
  });

  console.log('Payments created');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

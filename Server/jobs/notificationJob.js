const Queue = require('bull');
const prisma = require('../config/db');
const logger = require('../utils/logger');
const redisConfig = { redis: require('../config/redis') }; // or URL

const notificationQueue = new Queue('notifications', redisConfig);

// Process jobs
notificationQueue.process(async (job) => {
  const { agreementId } = job.data;
  const agreement = await prisma.agreement.findUnique({
    where: { id: agreementId },
    include: { borrower: true, lender: true },
  });
  if (!agreement) return;

  // Send notification logic (SMS, email, push)
  logger.info(`Sending due date reminder for agreement ${agreementId}`);
  // ...
});

// Schedule daily job to check for due agreements
const cron = require('node-cron');
cron.schedule('0 8 * * *', async () => {
  logger.info('Checking for due agreements');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(dayAfter.getDate() + 1);

  const agreementsDue = await prisma.agreement.findMany({
    where: {
      status: 'ACTIVE',
      dueDate: { gte: tomorrow, lt: dayAfter },
    },
    select: { id: true },
  });

  agreementsDue.forEach((ag) => {
    notificationQueue.add({ agreementId: ag.id }, { delay: 0 });
  });
});

module.exports = notificationQueue;
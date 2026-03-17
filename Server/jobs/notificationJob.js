const cron = require('node-cron');
const prisma = require('../config/db');
const logger = require('../utils/logger');

// Run every day at 8 AM
cron.schedule('0 8 * * *', async () => {
  logger.info('Running notification job for upcoming due dates');

  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

    const agreementsDue = await prisma.agreement.findMany({
      where: {
        status: 'ACTIVE',
        dueDate: {
          gte: tomorrow,
          lt: dayAfter,
        },
      },
      include: {
        borrower: true,
        lender: true,
      },
    });

    for (const agreement of agreementsDue) {
      // Send notification logic (SMS, email, push) would go here
      logger.info(`Reminder: Agreement ${agreement.id} due tomorrow`);
    }
  } catch (error) {
    logger.error('Error in notification job:', error);
  }
});

module.exports = cron; // export to start in server.js
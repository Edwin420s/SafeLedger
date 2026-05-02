const prisma = require('../config/db');

// Record a repayment
async function recordPayment(agreementId, amount, notes) {
  // Create payment
  const payment = await prisma.payment.create({
    data: {
      agreementId,
      amount,
      notes,
    },
  });

  // Update agreement status if fully paid? (simplified)
  // For now, just record payment.

  return payment;
}

// Get all payments for an agreement
async function getPaymentsByAgreement(agreementId) {
  return prisma.payment.findMany({
    where: { agreementId },
    orderBy: { date: 'desc' },
  });
}

module.exports = { recordPayment, getPaymentsByAgreement };
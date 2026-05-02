const { recordPayment, getPaymentsByAgreement } = require('../services/paymentService');
const { getAgreementById } = require('../services/agreementService');
const { paymentSchema } = require('../utils/validator');

async function createPayment(req, res, next) {
  try {
    const { error } = paymentSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { agreementId, amount, notes } = req.body;
    const agreement = await getAgreementById(agreementId);
    if (!agreement) return res.status(404).json({ error: 'Agreement not found' });

    // Only lender or borrower can record payment? Allow both.
    if (agreement.lenderId !== req.user.id && agreement.borrowerId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const payment = await recordPayment(agreementId, amount, notes);
    res.status(201).json(payment);
  } catch (err) {
    next(err);
  }
}

async function getPayments(req, res, next) {
  try {
    const { agreementId } = req.params;
    const agreement = await getAgreementById(agreementId);
    if (!agreement) return res.status(404).json({ error: 'Agreement not found' });
    if (agreement.lenderId !== req.user.id && agreement.borrowerId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    const payments = await getPaymentsByAgreement(agreementId);
    res.json(payments);
  } catch (err) {
    next(err);
  }
}

module.exports = { createPayment, getPayments };
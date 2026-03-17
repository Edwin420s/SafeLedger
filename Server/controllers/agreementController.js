const {
  createAgreement,
  getAgreementById,
  updateStatus,
  listUserAgreements,
} = require('../services/agreementService');
const { agreementSchema } = require('../utils/validator');

async function create(req, res, next) {
  try {
    const { error } = agreementSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const agreement = await createAgreement(req.body, req.user.id);
    res.status(201).json(agreement);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const { id } = req.params;
    const agreement = await getAgreementById(id);
    if (!agreement) return res.status(404).json({ error: 'Agreement not found' });
    // Ensure user is part of agreement
    if (agreement.lenderId !== req.user.id && agreement.borrowerId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    res.json(agreement);
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const agreements = await listUserAgreements(req.user.id);
    res.json(agreements);
  } catch (err) {
    next(err);
  }
}

async function sign(req, res, next) {
  try {
    const { id } = req.params;
    const agreement = await getAgreementById(id);
    if (!agreement) return res.status(404).json({ error: 'Agreement not found' });
    // Only borrower or lender can sign? For simplicity, mark as ACTIVE.
    if (agreement.lenderId !== req.user.id && agreement.borrowerId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    const updated = await updateStatus(id, 'ACTIVE');
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

module.exports = { create, getOne, list, sign };
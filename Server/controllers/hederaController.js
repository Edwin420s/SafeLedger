const { verifyHash } = require('../services/hederaService');
const { getAgreementById } = require('../services/agreementService');

async function verifyAgreement(req, res, next) {
  try {
    const { id } = req.params;
    const agreement = await getAgreementById(id);
    if (!agreement) return res.status(404).json({ error: 'Agreement not found' });

    // Ensure user is part of agreement
    if (agreement.lenderId !== req.user.id && agreement.borrowerId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!agreement.hash) {
      return res.status(400).json({ error: 'No hash stored for this agreement' });
    }

    const exists = await verifyHash(agreement.hash);
    res.json({ 
      valid: exists, 
      hash: agreement.hash,
      timestamp: exists ? new Date().toISOString() : null,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { verifyAgreement };
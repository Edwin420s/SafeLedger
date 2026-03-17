const { verifyHash } = require('../services/hederaService');
const { getAgreementById } = require('../services/agreementService');

async function verifyAgreement(req, res, next) {
  try {
    const { id } = req.params;
    const agreement = await getAgreementById(id);
    if (!agreement) return res.status(404).json({ error: 'Agreement not found' });

    if (!agreement.hash) {
      return res.status(400).json({ error: 'No hash stored for this agreement' });
    }

    const exists = await verifyHash(agreement.hash);
    res.json({ verified: exists, hash: agreement.hash });
  } catch (err) {
    next(err);
  }
}

module.exports = { verifyAgreement };
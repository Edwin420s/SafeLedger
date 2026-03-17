const crypto = require('crypto');

/**
 * Generate SHA-256 hash of an object (agreement data)
 * @param {Object} data - agreement data (lender, borrower, amount, dueDate, terms)
 * @returns {string} hex hash
 */
function hashAgreement(data) {
  const jsonString = JSON.stringify(data);
  return crypto.createHash('sha256').update(jsonString).digest('hex');
}

module.exports = { hashAgreement };
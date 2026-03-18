const prisma = require('../config/db');
const { hashAgreement } = require('./hashingService');
const { submitHash } = require('./hederaService');
const { encrypt, decrypt } = require('../utils/encryption');
const logger = require('../utils/logger');

// Create a new agreement
async function createAgreement(data, creatorId) {
  const { lenderId, borrowerId, amount, dueDate, terms } = data;

  // If borrowerId is a phone number, find the user
  let actualBorrowerId = borrowerId;
  if (borrowerId.match(/^[0-9+]{10,15}$/)) {
    const borrower = await prisma.user.findUnique({ where: { phone: borrowerId } });
    if (!borrower) {
      throw new Error('Borrower not found with this phone number');
    }
    actualBorrowerId = borrower.id;
  }

  // Ensure creator is either lender or borrower
  const actualLenderId = lenderId || creatorId;

  // Build plaintext object for hashing
  const agreementPlain = {
    lenderId: actualLenderId,
    borrowerId: actualBorrowerId,
    amount,
    dueDate,
    terms: terms || '',
    createdAt: new Date().toISOString(),
  };

  const hash = hashAgreement(agreementPlain);
  let hederaTxId = null;

  try {
    hederaTxId = await submitHash(hash);
  } catch (error) {
    logger.error('Failed to submit hash to Hedera, continuing without it', error);
  }

  // Encrypt terms if present
  const encryptedTerms = terms ? encrypt(terms) : null;

  const agreement = await prisma.agreement.create({
    data: {
      lenderId: actualLenderId,
      borrowerId: actualBorrowerId,
      amount,
      dueDate: new Date(dueDate),
      status: 'PENDING',
      encryptedDetails: encryptedTerms,
      hash,
      hederaTxId,
    },
    include: {
      lender: true,
      borrower: true,
    },
  });

  // Decrypt terms for response
  if (agreement.encryptedDetails) {
    agreement.terms = decrypt(agreement.encryptedDetails);
  }
  delete agreement.encryptedDetails;

  return agreement;
}

// Get agreement by ID (with decrypted terms)
async function getAgreementById(agreementId) {
  const agreement = await prisma.agreement.findUnique({
    where: { id: agreementId },
    include: { lender: true, borrower: true, payments: true },
  });
  if (!agreement) return null;

  if (agreement.encryptedDetails) {
    agreement.terms = decrypt(agreement.encryptedDetails);
  }
  delete agreement.encryptedDetails;
  return agreement;
}

// Update agreement status (e.g., after signing)
async function updateStatus(agreementId, status) {
  return prisma.agreement.update({
    where: { id: agreementId },
    data: { status },
  });
}

// List agreements for a user
async function listUserAgreements(userId) {
  const agreements = await prisma.agreement.findMany({
    where: {
      OR: [{ lenderId: userId }, { borrowerId: userId }],
    },
    include: {
      lender: true,
      borrower: true,
      payments: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  // Decrypt terms for each
  agreements.forEach(ag => {
    if (ag.encryptedDetails) {
      ag.terms = decrypt(ag.encryptedDetails);
    }
    delete ag.encryptedDetails;
  });

  return agreements;
}

module.exports = { createAgreement, getAgreementById, updateStatus, listUserAgreements };
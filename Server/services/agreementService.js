const prisma = require('../config/db');
const { hashAgreement } = require('./hashingService');
const { submitHash } = require('./hederaService');
const { encrypt, decrypt } = require('../utils/encryption');
const logger = require('../utils/logger');

// Create a new agreement
async function createAgreement(data, creatorId) {
  const { lenderId, borrowerId, amount, interestRate = 5.0, penaltyRate = 2.0, dueDate, terms } = data;

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
    interestRate,
    penaltyRate,
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

  // Try to create with new fields first, fallback to old schema if it fails
  let agreement;
  try {
    agreement = await prisma.agreement.create({
      data: {
        lenderId: actualLenderId,
        borrowerId: actualBorrowerId,
        amount,
        interestRate,
        penaltyRate,
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
  } catch (error) {
    // If new fields don't exist, fallback to old schema
    if (error.message.includes('interestRate') || error.message.includes('penaltyRate')) {
      logger.warn('New fields not available, using old schema');
      agreement = await prisma.agreement.create({
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
      // Add the fields to the response object manually
      agreement.interestRate = interestRate;
      agreement.penaltyRate = penaltyRate;
    } else {
      throw error;
    }
  }

  // Decrypt terms for response
  if (agreement.encryptedDetails) {
    agreement.terms = decrypt(agreement.encryptedDetails);
  }
  delete agreement.encryptedDetails;
  
  // Decrypt user names
  if (agreement.lender?.encryptedData) {
    agreement.lender.name = decrypt(agreement.lender.encryptedData);
  }
  delete agreement.lender?.encryptedData;
  
  if (agreement.borrower?.encryptedData) {
    agreement.borrower.name = decrypt(agreement.borrower.encryptedData);
  }
  delete agreement.borrower?.encryptedData;

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
  
  // Decrypt user names
  if (agreement.lender?.encryptedData) {
    agreement.lender.name = decrypt(agreement.lender.encryptedData);
  }
  delete agreement.lender?.encryptedData;
  
  if (agreement.borrower?.encryptedData) {
    agreement.borrower.name = decrypt(agreement.borrower.encryptedData);
  }
  delete agreement.borrower?.encryptedData;
  
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

  // Decrypt terms and user names for each
  agreements.forEach(ag => {
    if (ag.encryptedDetails) {
      ag.terms = decrypt(ag.encryptedDetails);
    }
    delete ag.encryptedDetails;
    
    // Decrypt user names
    if (ag.lender?.encryptedData) {
      ag.lender.name = decrypt(ag.lender.encryptedData);
    }
    delete ag.lender?.encryptedData;
    
    if (ag.borrower?.encryptedData) {
      ag.borrower.name = decrypt(ag.borrower.encryptedData);
    }
    delete ag.borrower?.encryptedData;
  });

  return agreements;
}

module.exports = { createAgreement, getAgreementById, updateStatus, listUserAgreements };
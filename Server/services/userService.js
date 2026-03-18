const prisma = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRE } = require('../config/env');
const { encrypt, decrypt } = require('../utils/encryption');
const logger = require('../utils/logger');

// Register new user
async function registerUser(phone, password, name) {
  // Check if user exists
  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  // Encrypt any personal data if needed (here just name)
  const encryptedName = name ? encrypt(name) : null;

  const user = await prisma.user.create({
    data: {
      phone,
      password: hashedPassword,
      encryptedData: encryptedName,
    },
  });

  return user;
}

// Login
async function loginUser(phone, password) {
  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Compare password (assuming we have password field)
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { userId: user.id, phone: user.phone },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );

  return { user, token };
}

// Get user profile
async function getUserProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      lentAgreements: true,
      borrowedAgreements: true,
    },
  });
  if (!user) throw new Error('User not found');

  // Decrypt name if present
  if (user.encryptedData) {
    user.name = decrypt(user.encryptedData);
  }
  delete user.encryptedData;
  return user;
}

module.exports = { registerUser, loginUser, getUserProfile };
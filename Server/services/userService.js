const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const { encrypt, decrypt } = require('../utils/encryption');
const { JWT_SECRET, JWT_EXPIRE } = require('../config/env');

async function registerUser(phone, password, name) {
  // Normalize phone number
  phone = phone.replace(/\s/g, '');
  if (phone.startsWith('0') && phone.length === 10) {
    phone = '+254' + phone.substring(1);
  }
  
  const existingUser = await prisma.user.findUnique({ where: { phone } });
  if (existingUser) {
    throw new Error('User with this phone number already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const encryptedName = encrypt(name);

  const user = await prisma.user.create({
    data: {
      phone,
      password: hashedPassword,
      encryptedData: encryptedName,
      trustScore: 70,
    },
  });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

  const userResponse = {
    id: user.id,
    phone: user.phone,
    name: name,
    trustScore: user.trustScore,
    createdAt: user.createdAt,
  };

  return { user: userResponse, token };
}

async function loginUser(phone, password) {
  // Normalize phone number
  phone = phone.replace(/\s/g, '');
  if (phone.startsWith('0') && phone.length === 10) {
    phone = '+254' + phone.substring(1);
  }
  
  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user) {
    throw new Error('Invalid phone number or password');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error('Invalid phone number or password');
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

  const userResponse = {
    id: user.id,
    phone: user.phone,
    name: user.encryptedData ? decrypt(user.encryptedData) : null,
    trustScore: user.trustScore,
    createdAt: user.createdAt,
  };

  return { user: userResponse, token };
}

async function getUserProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      phone: true,
      encryptedData: true,
      trustScore: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return {
    id: user.id,
    phone: user.phone,
    name: user.encryptedData ? decrypt(user.encryptedData) : null,
    trustScore: user.trustScore,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
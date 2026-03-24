const { registerUser, loginUser, getUserProfile } = require('../services/userService');
const { registerSchema, loginSchema } = require('../utils/validator');
const prisma = require('../config/db');
const { decrypt } = require('../utils/encryption');

async function register(req, res, next) {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { phone, password, name } = req.body;
    const result = await registerUser(phone, password, name);
    res.status(201).json({ message: 'User registered', user: result.user, token: result.token });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    // Clean phone number before validation
    const cleanedPhone = req.body.phone.replace(/\s/g, '');
    const cleanedReqBody = { ...req.body, phone: cleanedPhone };
    
    const { error } = loginSchema.validate(cleanedReqBody);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { phone, password } = cleanedReqBody;
    const { user, token } = await loginUser(phone, password);
    res.json({ user, token });
  } catch (err) {
    next(err);
  }
}

async function getProfile(req, res, next) {
  try {
    const user = await getUserProfile(req.user.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const { name, phone } = req.body;
    const userId = req.user.id;
    
    const user = await prisma.user.update({
      where: { id: userId },
      data: { 
        name: name ? name : undefined,
        phone: phone ? phone : undefined,
      },
    });
    
    // Decrypt name if present
    if (user.encryptedData) {
      user.name = decrypt(user.encryptedData);
    }
    delete user.encryptedData;
    delete user.password;
    
    res.json(user);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, getProfile, updateProfile };
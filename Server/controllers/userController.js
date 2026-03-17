const { registerUser, loginUser, getUserProfile } = require('../services/userService');
const { registerSchema, loginSchema } = require('../utils/validator');

async function register(req, res, next) {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { phone, password, name } = req.body;
    const user = await registerUser(phone, password, name);
    res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { phone, password } = req.body;
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

module.exports = { register, login, getProfile };
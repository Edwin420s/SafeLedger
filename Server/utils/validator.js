const Joi = require('joi');

// User registration
const registerSchema = Joi.object({
  phone: Joi.string().pattern(/^\+?[0-9]{10,15}$/).required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required(),
});

// Login
const loginSchema = Joi.object({
  phone: Joi.string().pattern(/^\+?[0-9\s]{10,15}$/).required(),
  password: Joi.string().required(),
});

// Create agreement
const agreementSchema = Joi.object({
  lenderId: Joi.string().required(),
  borrowerId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  interestRate: Joi.number().min(0).max(100).default(5.0),
  penaltyRate: Joi.number().min(0).max(50).default(2.0),
  dueDate: Joi.date().iso().greater('now').required(),
  terms: Joi.string().optional(),
});

// Payment
const paymentSchema = Joi.object({
  agreementId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  notes: Joi.string().optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  agreementSchema,
  paymentSchema,
};
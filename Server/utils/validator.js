const Joi = require('joi');

// User registration
const registerSchema = Joi.object({
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().optional(),
});

// Login
const loginSchema = Joi.object({
  phone: Joi.string().required(),
  password: Joi.string().required(),
});

// Create agreement
const agreementSchema = Joi.object({
  lenderId: Joi.string().required(),
  borrowerId: Joi.string().required(),
  amount: Joi.number().positive().required(),
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